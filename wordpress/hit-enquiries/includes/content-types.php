<?php
/** Private enquiry records and admissions workflow. */
if ( ! defined( 'ABSPATH' ) ) exit;

function hit_enquiries_register_content_type() {
	register_post_type( 'hit_enquiry', array(
		'labels' => array(
			'name'          => 'Enquiries',
			'singular_name' => 'Enquiry',
			'menu_name'     => 'Enquiries',
			'edit_item'     => 'View enquiry',
		),
		'public'              => false,
		'publicly_queryable'  => false,
		'exclude_from_search' => true,
		'show_ui'             => true,
		'show_in_rest'        => false,
		'menu_icon'           => 'dashicons-email-alt',
		'supports'            => array( 'title' ),
		'capabilities'        => array(
			'edit_post'              => 'manage_hit_enquiries',
			'read_post'              => 'manage_hit_enquiries',
			'delete_post'            => 'manage_hit_enquiries',
			'edit_posts'             => 'manage_hit_enquiries',
			'edit_others_posts'      => 'manage_hit_enquiries',
			'publish_posts'          => 'manage_hit_enquiries',
			'read_private_posts'     => 'manage_hit_enquiries',
			'delete_posts'           => 'manage_hit_enquiries',
			'delete_private_posts'   => 'manage_hit_enquiries',
			'delete_published_posts' => 'manage_hit_enquiries',
			'delete_others_posts'    => 'manage_hit_enquiries',
			'edit_private_posts'     => 'manage_hit_enquiries',
			'edit_published_posts'   => 'manage_hit_enquiries',
			'create_posts'           => 'do_not_allow',
		),
		'map_meta_cap'        => false,
	) );
}
add_action( 'init', 'hit_enquiries_register_content_type' );

function hit_enquiries_fields() {
	return array(
		'_hit_lead_firstname'      => 'First name',
		'_hit_lead_lastname'       => 'Last name',
		'_hit_lead_email'          => 'Email',
		'_hit_lead_phone'          => 'Phone',
		'_hit_lead_country'        => 'Country',
		'_hit_lead_degree'         => 'Degree of interest',
		'_hit_lead_program'        => 'Original program interest',
		'_hit_lead_intake'         => 'Original preferred intake',
		'_hit_lead_consent'        => 'Consent recorded',
		'_hit_estimate_program'    => 'Calculated program',
		'_hit_estimate_intake'     => 'Calculated intake',
		'_hit_estimate_total'      => 'Full program estimate',
		'_hit_estimate_tuition'    => 'Tuition',
		'_hit_estimate_living'     => 'Living costs',
		'_hit_estimate_onetime'    => 'One-time costs',
		'_hit_estimate_firstyear'  => 'First study year',
		'_hit_estimate_monthly'    => 'Average per month',
		'_hit_estimate_duration'   => 'Program length',
		'_hit_estimate_housing'    => 'Monthly accommodation',
		'_hit_estimate_insurance'  => 'Monthly health insurance',
		'_hit_estimate_food'       => 'Monthly food',
		'_hit_estimate_transport'  => 'Monthly transportation',
		'_hit_estimate_personal'   => 'Monthly personal expenses',
		'_hit_received_at'         => 'Received at',
		'_hit_email_sent'          => 'Applicant email delivery',
		'_hit_admissions_notified' => 'Admissions notification',
	);
}

function hit_enquiries_add_details_box() {
	add_meta_box( 'hit_enquiry_details', 'Applicant and estimate details', 'hit_enquiries_render_details_box', 'hit_enquiry', 'normal', 'high' );
}
add_action( 'add_meta_boxes_hit_enquiry', 'hit_enquiries_add_details_box' );

function hit_enquiries_delivery_label( $value ) {
	if ( '' === $value ) return '<span>Not recorded</span>';
	return '1' === $value ? '<span class="hit-delivery-yes">Sent successfully</span>' : '<span class="hit-delivery-no">Not sent</span>';
}

function hit_enquiries_render_details_box( $post ) {
	echo '<style>.hit-enquiry-table{width:100%;border-collapse:collapse}.hit-enquiry-table th,.hit-enquiry-table td{padding:10px 12px;border-bottom:1px solid #dcdcde;text-align:left;vertical-align:top}.hit-enquiry-table th{width:230px}.hit-delivery-yes{color:#087a3f;font-weight:700}.hit-delivery-no{color:#b32d2e;font-weight:700}</style>';
	echo '<table class="hit-enquiry-table"><tbody>';
	foreach ( hit_enquiries_fields() as $key => $label ) {
		$value = (string) get_post_meta( $post->ID, $key, true );
		if ( in_array( $key, array( '_hit_email_sent', '_hit_admissions_notified' ), true ) ) {
			$display = hit_enquiries_delivery_label( $value );
		} elseif ( '_hit_lead_consent' === $key ) {
			$display = '1' === $value ? 'Yes' : 'No';
		} elseif ( '_hit_lead_email' === $key && is_email( $value ) ) {
			$display = '<a href="mailto:' . esc_attr( $value ) . '">' . esc_html( $value ) . '</a>';
		} elseif ( '_hit_lead_phone' === $key && '' !== $value ) {
			$display = '<a href="tel:' . esc_attr( preg_replace( '/[^0-9+]/', '', $value ) ) . '">' . esc_html( $value ) . '</a>';
		} else {
			$display = '' !== $value ? esc_html( $value ) : '<span aria-hidden="true">—</span>';
		}
		echo '<tr><th>' . esc_html( $label ) . '</th><td>' . $display . '</td></tr>';
	}
	echo '</tbody></table>';
}

function hit_enquiries_columns( $columns ) {
	return array(
		'cb'           => $columns['cb'] ?? '<input type="checkbox">',
		'title'        => 'Applicant',
		'hit_email'    => 'Email',
		'hit_phone'    => 'Phone',
		'hit_country'  => 'Country',
		'hit_degree'   => 'Degree',
		'hit_program'  => 'Program',
		'hit_intake'   => 'Intake',
		'hit_total'    => 'Estimate',
		'hit_delivery' => 'Email status',
		'date'         => 'Received',
	);
}
add_filter( 'manage_hit_enquiry_posts_columns', 'hit_enquiries_columns' );

function hit_enquiries_column_content( $column, $post_id ) {
	$map = array(
		'hit_email'   => '_hit_lead_email',
		'hit_phone'   => '_hit_lead_phone',
		'hit_country' => '_hit_lead_country',
		'hit_degree'  => '_hit_lead_degree',
		'hit_program' => '_hit_estimate_program',
		'hit_intake'  => '_hit_estimate_intake',
		'hit_total'   => '_hit_estimate_total',
	);
	if ( isset( $map[ $column ] ) ) {
		$value = (string) get_post_meta( $post_id, $map[ $column ], true );
		if ( 'hit_email' === $column && is_email( $value ) ) echo '<a href="mailto:' . esc_attr( $value ) . '">' . esc_html( $value ) . '</a>';
		elseif ( 'hit_phone' === $column && '' !== $value ) echo '<a href="tel:' . esc_attr( preg_replace( '/[^0-9+]/', '', $value ) ) . '">' . esc_html( $value ) . '</a>';
		else echo '' !== $value ? esc_html( $value ) : '<span aria-hidden="true">—</span>';
		return;
	}
	if ( 'hit_delivery' === $column ) {
		echo hit_enquiries_delivery_label( (string) get_post_meta( $post_id, '_hit_email_sent', true ) );
	}
}
add_action( 'manage_hit_enquiry_posts_custom_column', 'hit_enquiries_column_content', 10, 2 );

function hit_enquiries_export_button( $which ) {
	$screen = get_current_screen();
	if ( 'top' !== $which || ! $screen || 'hit_enquiry' !== $screen->post_type || ! current_user_can( 'manage_hit_enquiries' ) ) return;
	$url = wp_nonce_url( admin_url( 'admin-post.php?action=hit_export_enquiries' ), 'hit_export_enquiries' );
	echo '<a class="button" href="' . esc_url( $url ) . '"><span class="dashicons dashicons-download" style="margin:4px 5px 0 0"></span>Export enquiries to Excel</a>';
}
add_action( 'manage_posts_extra_tablenav', 'hit_enquiries_export_button' );

function hit_enquiries_safe_spreadsheet_value( $value ) {
	$value = (string) $value;
	return preg_match( '/^[=+\-@\t\r]/', $value ) ? "'" . $value : $value;
}

function hit_enquiries_export() {
	if ( ! current_user_can( 'manage_hit_enquiries' ) ) wp_die( 'You are not allowed to export enquiries.' );
	check_admin_referer( 'hit_export_enquiries' );
	nocache_headers();
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename="hit-enquiries-' . wp_date( 'Y-m-d' ) . '.csv"' );
	header( 'X-Content-Type-Options: nosniff' );
	$output = fopen( 'php://output', 'w' );
	if ( false === $output ) wp_die( 'The enquiries export could not be created.' );
	fwrite( $output, "\xEF\xBB\xBF" );
	fputcsv( $output, array_merge( array( 'Enquiry ID' ), array_values( hit_enquiries_fields() ), array( 'WordPress created date' ) ) );
	$enquiries = get_posts( array( 'post_type' => 'hit_enquiry', 'post_status' => array( 'private', 'publish', 'draft', 'pending' ), 'posts_per_page' => -1, 'orderby' => 'date', 'order' => 'DESC' ) );
	foreach ( $enquiries as $enquiry ) {
		$row = array( $enquiry->ID );
		foreach ( hit_enquiries_fields() as $key => $label ) {
			$value = (string) get_post_meta( $enquiry->ID, $key, true );
			if ( in_array( $key, array( '_hit_email_sent', '_hit_admissions_notified' ), true ) ) $value = '' === $value ? 'Not recorded' : ( '1' === $value ? 'Sent successfully' : 'Not sent' );
			if ( '_hit_lead_consent' === $key ) $value = '1' === $value ? 'Yes' : 'No';
			$row[] = hit_enquiries_safe_spreadsheet_value( $value );
		}
		$row[] = get_the_date( 'Y-m-d H:i:s', $enquiry );
		fputcsv( $output, $row );
	}
	fclose( $output );
	exit;
}
add_action( 'admin_post_hit_export_enquiries', 'hit_enquiries_export' );

