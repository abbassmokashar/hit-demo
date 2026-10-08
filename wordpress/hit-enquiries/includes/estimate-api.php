<?php
/** Secure enquiry collection, verified estimate calculation, PDF creation and email delivery. */
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'rest_api_init', static function() {
	register_rest_route( 'hit/v1', '/estimate', array(
		'methods'             => WP_REST_Server::CREATABLE,
		'callback'            => 'hit_enquiries_send_estimate',
		'permission_callback' => '__return_true',
		'args'                => array(
			'lead'     => array( 'required' => true, 'type' => 'object' ),
			'estimate' => array( 'required' => true, 'type' => 'object' ),
		),
	) );
} );

function hit_enquiries_programs() {
	return array(
		'bachelor-ai'            => array( 'title' => 'Bachelor in Artificial Intelligence', 'degree' => 'Bachelor', 'tuition_year' => 20550, 'years' => 3, 'duration' => '3 years' ),
		'bachelor-cybersecurity' => array( 'title' => 'Bachelor in Cybersecurity', 'degree' => 'Bachelor', 'tuition_year' => 20550, 'years' => 3, 'duration' => '3 years' ),
		'bachelor-blockchain'    => array( 'title' => 'Bachelor in Blockchain', 'degree' => 'Bachelor', 'tuition_year' => 20550, 'years' => 3, 'duration' => '3 years' ),
		'master-ai'              => array( 'title' => 'Master in Artificial Intelligence', 'degree' => 'Master', 'tuition_year' => 22050, 'years' => 2, 'duration' => '2 years' ),
		'master-cybersecurity'   => array( 'title' => 'Master in Cybersecurity', 'degree' => 'Master', 'tuition_year' => 22050, 'years' => 2, 'duration' => '2 years' ),
		'master-blockchain'      => array( 'title' => 'Master in Blockchain', 'degree' => 'Master', 'tuition_year' => 22050, 'years' => 2, 'duration' => '2 years' ),
	);
}

function hit_enquiries_request_ip() {
	return sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ?? 'unknown' ) );
}

function hit_enquiries_money( $value ) {
	return 'CHF ' . number_format( (float) $value, 0, '.', "'" );
}

function hit_enquiries_bounded_number( $value, $minimum, $maximum ) {
	$value = is_numeric( $value ) ? (int) round( (float) $value ) : -1;
	return $value >= $minimum && $value <= $maximum ? $value : null;
}

function hit_enquiries_send_estimate( WP_REST_Request $request ) {
	$rate_key = 'hit_estimate_' . hash_hmac( 'sha256', hit_enquiries_request_ip(), wp_salt( 'nonce' ) );
	$count = (int) get_transient( $rate_key );
	if ( $count >= 8 ) return new WP_Error( 'rate_limited', 'Please wait before requesting another estimate.', array( 'status' => 429 ) );
	set_transient( $rate_key, $count + 1, HOUR_IN_SECONDS );

	$lead_in = (array) $request->get_param( 'lead' );
	$estimate_in = (array) $request->get_param( 'estimate' );
	$lead = array(
		'firstName' => sanitize_text_field( $lead_in['firstName'] ?? '' ),
		'lastName'  => sanitize_text_field( $lead_in['lastName'] ?? '' ),
		'email'     => sanitize_email( $lead_in['email'] ?? '' ),
		'phone'     => sanitize_text_field( $lead_in['phone'] ?? '' ),
		'country'   => sanitize_text_field( $lead_in['country'] ?? '' ),
		'degree'    => sanitize_text_field( $lead_in['degree'] ?? '' ),
		'program'   => sanitize_key( $lead_in['program'] ?? '' ),
		'intake'    => sanitize_text_field( $lead_in['intake'] ?? '' ),
		'consent'   => filter_var( $lead_in['consent'] ?? false, FILTER_VALIDATE_BOOLEAN ),
	);
	foreach ( array( 'firstName', 'lastName', 'email', 'phone', 'country', 'degree', 'program', 'intake' ) as $field ) {
		if ( '' === $lead[ $field ] ) return new WP_Error( 'missing_field', 'Please complete every required field.', array( 'status' => 400 ) );
	}
	if ( ! is_email( $lead['email'] ) ) return new WP_Error( 'invalid_email', 'Please enter a valid email address.', array( 'status' => 400 ) );
	if ( ! $lead['consent'] ) return new WP_Error( 'consent_required', 'Please confirm the enquiry consent before continuing.', array( 'status' => 400 ) );

	$programs = hit_enquiries_programs();
	$program_id = sanitize_key( $estimate_in['programId'] ?? $lead['program'] );
	if ( ! isset( $programs[ $program_id ] ) ) return new WP_Error( 'invalid_program', 'Please choose a valid Helvetic Tech program.', array( 'status' => 400 ) );
	$program = $programs[ $program_id ];
	if ( $lead['program'] !== $program_id || $lead['degree'] !== $program['degree'] ) return new WP_Error( 'program_mismatch', 'The selected program and degree level do not match.', array( 'status' => 400 ) );
	$intakes = array( 'September', 'January', 'April', 'Not sure yet' );
	$intake = sanitize_text_field( $estimate_in['intake'] ?? $lead['intake'] );
	if ( ! in_array( $lead['intake'], $intakes, true ) || ! in_array( $intake, $intakes, true ) ) return new WP_Error( 'invalid_intake', 'Please choose a valid intake.', array( 'status' => 400 ) );

	$limits = array(
		'housing'   => array( 750, 2500 ),
		'insurance' => array( 150, 500 ),
		'food'      => array( 200, 750 ),
		'transport' => array( 80, 400 ),
		'personal'  => array( 0, 1500 ),
	);
	$monthly = array();
	foreach ( $limits as $key => $range ) {
		$monthly[ $key ] = hit_enquiries_bounded_number( $estimate_in[ $key ] ?? null, $range[0], $range[1] );
		if ( null === $monthly[ $key ] ) return new WP_Error( 'invalid_cost', 'One or more living-cost values are outside the available planning range.', array( 'status' => 400 ) );
	}

	$living_monthly = array_sum( $monthly );
	$tuition = $program['tuition_year'] * $program['years'];
	$living = $living_monthly * 12 * $program['years'];
	$one_time = 1250;
	$total = $tuition + $living + $one_time;
	$first_year = $program['tuition_year'] + ( $living_monthly * 12 ) + $one_time;
	$average_month = (int) round( $total / ( $program['years'] * 12 ) );
	$estimate = array(
		'programId' => $program_id,
		'program'   => $program['title'],
		'intake'    => $intake,
		'total'     => hit_enquiries_money( $total ),
		'tuition'   => hit_enquiries_money( $tuition ),
		'living'    => hit_enquiries_money( $living ),
		'oneTime'   => hit_enquiries_money( $one_time ),
		'firstYear' => hit_enquiries_money( $first_year ),
		'monthly'   => hit_enquiries_money( $average_month ),
		'duration'  => $program['duration'],
	) + $monthly;

	$enquiry_id = wp_insert_post( array(
		'post_type'   => 'hit_enquiry',
		'post_status' => 'private',
		'post_title'  => sprintf( '%s %s — %s', $lead['firstName'], $lead['lastName'], $program['title'] ),
	), true );
	if ( is_wp_error( $enquiry_id ) ) return new WP_Error( 'enquiry_write', 'We could not save the enquiry right now. Please try again.', array( 'status' => 500 ) );
	if ( ! is_wp_error( $enquiry_id ) ) {
		$lead_meta = array( 'firstname' => $lead['firstName'], 'lastname' => $lead['lastName'], 'email' => $lead['email'], 'phone' => $lead['phone'], 'country' => $lead['country'], 'degree' => $lead['degree'], 'program' => $lead['program'], 'intake' => $lead['intake'], 'consent' => '1' );
		foreach ( $lead_meta as $key => $value ) update_post_meta( $enquiry_id, '_hit_lead_' . $key, $value );
		$estimate_meta = array( 'program' => $estimate['program'], 'intake' => $estimate['intake'], 'total' => $estimate['total'], 'tuition' => $estimate['tuition'], 'living' => $estimate['living'], 'onetime' => $estimate['oneTime'], 'firstyear' => $estimate['firstYear'], 'monthly' => $estimate['monthly'], 'duration' => $estimate['duration'], 'housing' => hit_enquiries_money( $monthly['housing'] ), 'insurance' => hit_enquiries_money( $monthly['insurance'] ), 'food' => hit_enquiries_money( $monthly['food'] ), 'transport' => hit_enquiries_money( $monthly['transport'] ), 'personal' => hit_enquiries_money( $monthly['personal'] ) );
		foreach ( $estimate_meta as $key => $value ) update_post_meta( $enquiry_id, '_hit_estimate_' . $key, $value );
		update_post_meta( $enquiry_id, '_hit_received_at', current_time( 'mysql' ) );
	}

	$pdf = hit_enquiries_create_estimate_pdf( $lead, $estimate );
	if ( is_wp_error( $pdf ) ) return $pdf;
	$headers = array( 'Content-Type: text/html; charset=UTF-8' );
	$subject = sanitize_text_field( get_option( 'hit_estimate_subject', 'Your Helvetic Tech study cost estimate' ) );
	$message = '<p>Dear ' . esc_html( $lead['firstName'] ) . ',</p><p>Thank you for exploring your study plans with Helvetic Tech. Your personalised study cost estimate is attached.</p><p>This estimate is indicative. Our Admissions team can confirm current tuition, fees and payment arrangements.</p><p>Kind regards,<br>Helvetic Tech</p>';
	$sent = wp_mail( $lead['email'], $subject, $message, $headers, array( $pdf ) );
	if ( ! is_wp_error( $enquiry_id ) ) update_post_meta( $enquiry_id, '_hit_email_sent', $sent ? '1' : '0' );

	$recipient = sanitize_email( get_option( 'hit_enquiries_recipient', get_option( 'admin_email' ) ) );
	$notified = false;
	if ( $recipient ) {
		$notice = '<p>A new Helvetic Tech study cost enquiry was submitted.</p><ul>';
		foreach ( array( 'firstName' => 'First name', 'lastName' => 'Last name', 'email' => 'Email', 'phone' => 'Phone', 'country' => 'Country', 'degree' => 'Degree interest' ) as $key => $label ) $notice .= '<li><strong>' . esc_html( $label ) . ':</strong> ' . esc_html( $lead[ $key ] ) . '</li>';
		$notice .= '<li><strong>Program:</strong> ' . esc_html( $estimate['program'] ) . '</li><li><strong>Intake:</strong> ' . esc_html( $estimate['intake'] ) . '</li><li><strong>Estimate:</strong> ' . esc_html( $estimate['total'] ) . '</li></ul>';
		$notified = wp_mail( $recipient, 'New Helvetic Tech cost enquiry', $notice, $headers );
	}
	if ( ! is_wp_error( $enquiry_id ) ) update_post_meta( $enquiry_id, '_hit_admissions_notified', $notified ? '1' : '0' );
	wp_delete_file( $pdf );
	if ( ! $sent ) return new WP_Error( 'mail_failed', 'We could not send the estimate right now. Please try again.', array( 'status' => 500 ) );
	return rest_ensure_response( array( 'success' => true, 'message' => 'Estimate sent.' ) );
}

function hit_enquiries_pdf_ascii( $text ) {
	$text = html_entity_decode( (string) $text, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
	$value = function_exists( 'iconv' ) ? iconv( 'UTF-8', 'ASCII//TRANSLIT//IGNORE', $text ) : $text;
	return $value ?: $text;
}

function hit_enquiries_pdf_escape( $text ) {
	$text = preg_replace( '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', hit_enquiries_pdf_ascii( $text ) );
	return str_replace( array( '\\', '(', ')' ), array( '\\\\', '\\(', '\\)' ), $text );
}

function hit_enquiries_pdf_text( $text, $x, $top, $size, $bold = false, $color = '0.063 0.169 0.263' ) {
	return sprintf( "BT /%s %.2F Tf %s rg 1 0 0 1 %.2F %.2F Tm (%s) Tj ET\n", $bold ? 'F2' : 'F1', $size, $color, $x, 842 - $top, hit_enquiries_pdf_escape( $text ) );
}

function hit_enquiries_pdf_line( $x1, $top1, $x2, $top2, $width = .5, $color = '.82 .86 .89' ) {
	return sprintf( "q %s RG %.2F w %.2F %.2F m %.2F %.2F l S Q\n", $color, $width, $x1, 842 - $top1, $x2, 842 - $top2 );
}

function hit_enquiries_pdf_wrap( $text, $max_chars = 42 ) {
	return explode( "\n", wordwrap( hit_enquiries_pdf_ascii( $text ), $max_chars, "\n", true ) );
}

function hit_enquiries_pdf_wrapped( $text, $x, $top, $size, $max_chars, $line_height, $bold = false, $color = '0.063 0.169 0.263' ) {
	$out = '';
	foreach ( hit_enquiries_pdf_wrap( $text, $max_chars ) as $line ) { $out .= hit_enquiries_pdf_text( $line, $x, $top, $size, $bold, $color ); $top += $line_height; }
	return $out;
}

function hit_enquiries_create_estimate_pdf( $lead, $estimate ) {
	$temp_dir = get_temp_dir();
	$pdf = trailingslashit( $temp_dir ) . wp_unique_filename( $temp_dir, 'HIT-study-cost-estimate-' . sanitize_title( $estimate['program'] ) . '.pdf' );
	$ink = '0.063 0.169 0.263'; $blue = '0.114 0.294 0.451'; $red = '0.902 0.224 0.275'; $muted = '0.322 0.404 0.478'; $rule = '.82 .86 .89';
	$c = '';
	$c .= hit_enquiries_pdf_text( 'HELVETIC TECH', 50, 67, 13, true, $ink );
	$c .= hit_enquiries_pdf_text( 'Study cost estimate', 50, 98, 23, true, $ink );
	$c .= hit_enquiries_pdf_text( 'Prepared for your study planning - ' . wp_date( 'j F Y' ), 50, 118, 9.5, false, $muted );
	$c .= hit_enquiries_pdf_line( 50, 138, 545, 138, 2.2, $red );
	$c .= hit_enquiries_pdf_text( 'APPLICANT', 50, 174, 8, true, $blue );
	$c .= hit_enquiries_pdf_text( $lead['firstName'] . ' ' . $lead['lastName'], 50, 195, 11, true, $ink );
	$c .= hit_enquiries_pdf_text( $lead['email'], 50, 214, 9.5, false, $muted );
	$c .= hit_enquiries_pdf_text( $lead['phone'] . ' - ' . $lead['country'], 50, 232, 9.5, false, $muted );
	$c .= hit_enquiries_pdf_text( 'STUDY PLAN', 315, 174, 8, true, $blue );
	$c .= hit_enquiries_pdf_wrapped( $estimate['program'], 315, 195, 10.5, 37, 14, true, $ink );
	$c .= hit_enquiries_pdf_text( $lead['degree'] . ' - ' . $estimate['intake'], 315, 232, 9.5, false, $muted );
	$c .= hit_enquiries_pdf_line( 50, 264, 545, 264, .7, $rule );
	$c .= hit_enquiries_pdf_text( 'ESTIMATED FULL-PROGRAM COST', 50, 301, 8, true, $red );
	$c .= hit_enquiries_pdf_text( $estimate['total'], 50, 344, 28, true, $ink );
	$c .= hit_enquiries_pdf_text( 'Tuition, selected living scenario and published one-time fees.', 50, 369, 9.5, false, $muted );
	$c .= hit_enquiries_pdf_line( 50, 394, 545, 394, .7, $rule );
	$c .= hit_enquiries_pdf_text( 'Cost breakdown', 50, 427, 14, true, $ink );
	$rows = array( 'Tuition' => $estimate['tuition'], 'Living costs' => $estimate['living'], 'One-time costs' => $estimate['oneTime'] );
	$top = 463;
	foreach ( $rows as $label => $value ) {
		$c .= hit_enquiries_pdf_text( $label, 50, $top, 10, false, $muted );
		$c .= hit_enquiries_pdf_text( $value, 420, $top, 10.5, true, $ink );
		$c .= hit_enquiries_pdf_line( 50, $top + 15, 545, $top + 15, .35, $rule );
		$top += 40;
	}
	$c .= hit_enquiries_pdf_text( 'MONTHLY LIVING ASSUMPTIONS', 50, 604, 8, true, $blue );
	$assumptions = array( 'Accommodation' => $estimate['housing'], 'Health insurance' => $estimate['insurance'], 'Food' => $estimate['food'], 'Transportation' => $estimate['transport'], 'Personal' => $estimate['personal'] );
	$x = 50; $y = 631; $index = 0;
	foreach ( $assumptions as $label => $value ) {
		$c .= hit_enquiries_pdf_text( strtoupper( $label ), $x, $y, 6.8, true, $muted );
		$c .= hit_enquiries_pdf_text( hit_enquiries_money( $value ), $x, $y + 18, 9.5, true, $ink );
		$x += 168; $index++;
		if ( 3 === $index ) { $x = 50; $y += 54; }
	}
	$c .= hit_enquiries_pdf_line( 50, 729, 545, 729, .7, $rule );
	$summary = array( 'FIRST STUDY YEAR' => $estimate['firstYear'], 'AVERAGE PER MONTH' => $estimate['monthly'], 'PROGRAM LENGTH' => $estimate['duration'] );
	$x = 50;
	foreach ( $summary as $label => $value ) { $c .= hit_enquiries_pdf_text( $label, $x, 756, 7.2, true, $muted ); $c .= hit_enquiries_pdf_text( $value, $x, 778, 11.2, true, $ink ); $x += 177; }
	$c .= hit_enquiries_pdf_line( 50, 801, 545, 801, .5, $rule );
	$c .= hit_enquiries_pdf_text( 'Indicative estimate only. Admissions will confirm current charges and payment arrangements.', 50, 821, 7.4, false, $muted );

	$objects = array(
		1 => '<< /Type /Catalog /Pages 2 0 R >>',
		2 => '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
		3 => '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
		4 => '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
		5 => '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
		6 => '<< /Length ' . strlen( $c ) . ">>\nstream\n" . $c . "endstream",
	);
	$output = "%PDF-1.4\n"; $offsets = array( 0 );
	foreach ( $objects as $id => $object ) { $offsets[ $id ] = strlen( $output ); $output .= "$id 0 obj\n$object\nendobj\n"; }
	$xref = strlen( $output ); $output .= "xref\n0 7\n0000000000 65535 f \n";
	for ( $id = 1; $id <= 6; $id++ ) $output .= sprintf( "%010d 00000 n \n", $offsets[ $id ] );
	$output .= "trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n$xref\n%%EOF";
	if ( false === file_put_contents( $pdf, $output ) ) return new WP_Error( 'pdf_write', 'Could not create the estimate PDF.', array( 'status' => 500 ) );
	return $pdf;
}

