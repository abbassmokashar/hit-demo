<?php
/** Private enquiry records and admissions workflow. */
if ( ! defined( 'ABSPATH' ) ) exit;

function hit_core_register_content_types() {
	$types = array(
		'hit_program' => array( 'Programs', 'Program', 'dashicons-welcome-learn-more', true ),
		'hit_faculty' => array( 'Faculty', 'Faculty member', 'dashicons-groups', true ),
		'hit_faq'     => array( 'FAQs', 'FAQ', 'dashicons-editor-help', true ),
		'hit_intake'  => array( 'Intakes', 'Intake', 'dashicons-calendar-alt', false ),
	);
	foreach ( $types as $post_type => $details ) {
		register_post_type( $post_type, array(
			'labels' => array( 'name' => $details[0], 'singular_name' => $details[1], 'add_new_item' => 'Add ' . $details[1], 'edit_item' => 'Edit ' . $details[1] ),
			'public' => (bool) $details[3], 'show_ui' => true, 'show_in_rest' => true,
			'has_archive' => false, 'rewrite' => false, 'menu_icon' => $details[2],
			'supports' => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
		) );
	}
	register_taxonomy( 'hit_program_level', 'hit_program', array(
		'labels' => array( 'name' => 'Program levels', 'singular_name' => 'Program level' ),
		'public' => true, 'show_ui' => true, 'show_in_rest' => true, 'hierarchical' => true, 'rewrite' => false,
	) );
	$program_meta = array( 'id', 'field', 'discipline', 'award', 'duration', 'years', 'credits', 'terms', 'tuition_term', 'tuition_year', 'intakes', 'mode', 'location', 'signal', 'route' );
	foreach ( $program_meta as $key ) register_post_meta( 'hit_program', '_hit_' . $key, array( 'type' => in_array( $key, array( 'years', 'tuition_term', 'tuition_year' ), true ) ? 'integer' : 'string', 'single' => true, 'show_in_rest' => true, 'sanitize_callback' => in_array( $key, array( 'years', 'tuition_term', 'tuition_year' ), true ) ? 'absint' : 'sanitize_text_field', 'auth_callback' => static function() { return current_user_can( 'edit_posts' ); } ) );
}
add_action( 'init', 'hit_core_register_content_types' );

function hit_core_program_fields() {
	return array(
		'id' => array( 'Program key', 'text', 'Stable key used by the interactive tools.' ),
		'field' => array( 'Field', 'text', 'Public field name, for example Artificial Intelligence.' ),
		'discipline' => array( 'Discipline key', 'text', 'ai, cyber or blockchain.' ),
		'award' => array( 'Award', 'text', '' ), 'duration' => array( 'Duration', 'text', '' ),
		'years' => array( 'Years', 'number', '' ), 'credits' => array( 'Credits', 'text', '' ),
		'terms' => array( 'Academic terms', 'text', '' ), 'tuition_term' => array( 'Tuition per term (CHF)', 'number', '' ),
		'tuition_year' => array( 'Tuition per year (CHF)', 'number', '' ), 'intakes' => array( 'Intakes', 'text', '' ),
		'mode' => array( 'Study mode', 'text', '' ), 'location' => array( 'Location', 'text', '' ),
		'signal' => array( 'Program Signal summary', 'textarea', '' ), 'route' => array( 'Website route', 'text', 'Relative route without the domain.' ),
	);
}

add_action( 'add_meta_boxes_hit_program', static function() {
	add_meta_box( 'hit_program_facts', 'Program facts and tool data', 'hit_core_program_meta_box', 'hit_program', 'normal', 'high' );
} );

function hit_core_program_meta_box( $post ) {
	wp_nonce_field( 'hit_program_facts', 'hit_program_facts_nonce' );
	echo '<table class="form-table"><tbody>';
	foreach ( hit_core_program_fields() as $key => $field ) {
		$value = (string) get_post_meta( $post->ID, '_hit_' . $key, true );
		echo '<tr><th><label for="hit_' . esc_attr( $key ) . '">' . esc_html( $field[0] ) . '</label></th><td>';
		if ( 'textarea' === $field[1] ) echo '<textarea class="large-text" rows="3" id="hit_' . esc_attr( $key ) . '" name="hit_program[' . esc_attr( $key ) . ']">' . esc_textarea( $value ) . '</textarea>';
		else echo '<input class="regular-text" type="' . esc_attr( $field[1] ) . '" id="hit_' . esc_attr( $key ) . '" name="hit_program[' . esc_attr( $key ) . ']" value="' . esc_attr( $value ) . '"' . ( 'number' === $field[1] ? ' min="0" step="1"' : '' ) . '>';
		if ( $field[2] ) echo '<p class="description">' . esc_html( $field[2] ) . '</p>';
		echo '</td></tr>';
	}
	echo '</tbody></table>';
}

add_action( 'save_post_hit_program', static function( $post_id ) {
	if ( ! isset( $_POST['hit_program_facts_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['hit_program_facts_nonce'] ) ), 'hit_program_facts' ) ) return;
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
	if ( ! current_user_can( 'edit_post', $post_id ) ) return;
	$values = isset( $_POST['hit_program'] ) && is_array( $_POST['hit_program'] ) ? wp_unslash( $_POST['hit_program'] ) : array();
	foreach ( hit_core_program_fields() as $key => $field ) {
		$value = $values[ $key ] ?? '';
		$value = 'number' === $field[1] ? absint( $value ) : ( 'textarea' === $field[1] ? sanitize_textarea_field( $value ) : sanitize_text_field( $value ) );
		update_post_meta( $post_id, '_hit_' . $key, $value );
	}
} );

function hit_core_enquiries_register_content_type() {
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
add_action( 'init', 'hit_core_enquiries_register_content_type' );

function hit_core_enquiries_fields() {
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

function hit_core_enquiries_add_details_box() {
	add_meta_box( 'hit_enquiry_details', 'Applicant and estimate details', 'hit_core_enquiries_render_details_box', 'hit_enquiry', 'normal', 'high' );
}
add_action( 'add_meta_boxes_hit_enquiry', 'hit_core_enquiries_add_details_box' );

function hit_core_enquiries_delivery_label( $value ) {
	if ( '' === $value ) return '<span>Not recorded</span>';
	return '1' === $value ? '<span class="hit-delivery-yes">Sent successfully</span>' : '<span class="hit-delivery-no">Not sent</span>';
}

function hit_core_enquiries_render_details_box( $post ) {
	echo '<style>.hit-enquiry-table{width:100%;border-collapse:collapse}.hit-enquiry-table th,.hit-enquiry-table td{padding:10px 12px;border-bottom:1px solid #dcdcde;text-align:left;vertical-align:top}.hit-enquiry-table th{width:230px}.hit-delivery-yes{color:#087a3f;font-weight:700}.hit-delivery-no{color:#b32d2e;font-weight:700}</style>';
	echo '<table class="hit-enquiry-table"><tbody>';
	foreach ( hit_core_enquiries_fields() as $key => $label ) {
		$value = (string) get_post_meta( $post->ID, $key, true );
		if ( in_array( $key, array( '_hit_email_sent', '_hit_admissions_notified' ), true ) ) {
			$display = hit_core_enquiries_delivery_label( $value );
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

function hit_core_enquiries_columns( $columns ) {
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
add_filter( 'manage_hit_enquiry_posts_columns', 'hit_core_enquiries_columns' );

function hit_core_enquiries_column_content( $column, $post_id ) {
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
		echo hit_core_enquiries_delivery_label( (string) get_post_meta( $post_id, '_hit_email_sent', true ) );
	}
}
add_action( 'manage_hit_enquiry_posts_custom_column', 'hit_core_enquiries_column_content', 10, 2 );

function hit_core_enquiries_export_button( $which ) {
	$screen = get_current_screen();
	if ( 'top' !== $which || ! $screen || 'hit_enquiry' !== $screen->post_type || ! current_user_can( 'manage_hit_enquiries' ) ) return;
	$url = wp_nonce_url( admin_url( 'admin-post.php?action=hit_export_enquiries' ), 'hit_export_enquiries' );
	echo '<a class="button" href="' . esc_url( $url ) . '"><span class="dashicons dashicons-download" style="margin:4px 5px 0 0"></span>Export enquiries to Excel</a>';
}
add_action( 'manage_posts_extra_tablenav', 'hit_core_enquiries_export_button' );

function hit_core_enquiries_safe_spreadsheet_value( $value ) {
	$value = (string) $value;
	return preg_match( '/^[=+\-@\t\r]/', $value ) ? "'" . $value : $value;
}

function hit_core_enquiries_export() {
	if ( ! current_user_can( 'manage_hit_enquiries' ) ) wp_die( 'You are not allowed to export enquiries.' );
	check_admin_referer( 'hit_export_enquiries' );
	nocache_headers();
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename="hit-enquiries-' . wp_date( 'Y-m-d' ) . '.csv"' );
	header( 'X-Content-Type-Options: nosniff' );
	$output = fopen( 'php://output', 'w' );
	if ( false === $output ) wp_die( 'The enquiries export could not be created.' );
	fwrite( $output, "\xEF\xBB\xBF" );
	fputcsv( $output, array_merge( array( 'Enquiry ID' ), array_values( hit_core_enquiries_fields() ), array( 'WordPress created date' ) ) );
	$enquiries = get_posts( array( 'post_type' => 'hit_enquiry', 'post_status' => array( 'private', 'publish', 'draft', 'pending' ), 'posts_per_page' => -1, 'orderby' => 'date', 'order' => 'DESC' ) );
	foreach ( $enquiries as $enquiry ) {
		$row = array( $enquiry->ID );
		foreach ( hit_core_enquiries_fields() as $key => $label ) {
			$value = (string) get_post_meta( $enquiry->ID, $key, true );
			if ( in_array( $key, array( '_hit_email_sent', '_hit_admissions_notified' ), true ) ) $value = '' === $value ? 'Not recorded' : ( '1' === $value ? 'Sent successfully' : 'Not sent' );
			if ( '_hit_lead_consent' === $key ) $value = '1' === $value ? 'Yes' : 'No';
			$row[] = hit_core_enquiries_safe_spreadsheet_value( $value );
		}
		$row[] = get_the_date( 'Y-m-d H:i:s', $enquiry );
		fputcsv( $output, $row );
	}
	fclose( $output );
	exit;
}
add_action( 'admin_post_hit_export_enquiries', 'hit_core_enquiries_export' );

