<?php
/** Enquiry delivery settings, privacy support and retention controls. */
if ( ! defined( 'ABSPATH' ) ) exit;

function hit_enquiries_admin_menu() {
	add_submenu_page( 'edit.php?post_type=hit_enquiry', 'Enquiry settings', 'Settings', 'manage_options', 'hit-enquiry-settings', 'hit_enquiries_settings_page' );
}
add_action( 'admin_menu', 'hit_enquiries_admin_menu' );

function hit_enquiries_admin_init() {
	register_setting( 'hit_enquiries', 'hit_enquiries_recipient', array( 'sanitize_callback' => 'sanitize_email', 'default' => get_option( 'admin_email' ) ) );
	register_setting( 'hit_enquiries', 'hit_estimate_subject', array( 'sanitize_callback' => 'sanitize_text_field', 'default' => 'Your Helvetic Tech study cost estimate' ) );
	register_setting( 'hit_enquiries', 'hit_enquiries_retention_days', array( 'sanitize_callback' => 'absint', 'default' => 365 ) );
	if ( isset( $_POST['hit_test_email'] ) && check_admin_referer( 'hit_test_email' ) && current_user_can( 'manage_options' ) ) {
		$recipient = sanitize_email( get_option( 'hit_enquiries_recipient', get_option( 'admin_email' ) ) );
		$sent = $recipient && wp_mail( $recipient, 'Helvetic Tech enquiry email test', '<p>The HIT Enquiries plugin can send email from this WordPress installation.</p>', array( 'Content-Type: text/html; charset=UTF-8' ) );
		if ( $sent ) add_settings_error( 'hit_enquiries', 'test_sent', 'Test email sent to ' . $recipient . '.', 'success' );
		else add_settings_error( 'hit_enquiries', 'test_failed', 'WordPress could not send the test email. Configure authenticated SMTP or a transactional email service, then try again.', 'error' );
	}
}
add_action( 'admin_init', 'hit_enquiries_admin_init' );

function hit_enquiries_settings_page() {
	?><div class="wrap"><h1>Helvetic Tech enquiry settings</h1><?php settings_errors( 'hit_enquiries' ); ?><p>The Study Cost Model stores each submitted enquiry here, creates the estimate PDF, emails it to the applicant, and alerts Admissions.</p><form method="post" action="options.php"><?php settings_fields( 'hit_enquiries' ); ?><table class="form-table"><tr><th><label for="hit_enquiries_recipient">Admissions email</label></th><td><input class="regular-text" type="email" id="hit_enquiries_recipient" name="hit_enquiries_recipient" value="<?php echo esc_attr( get_option( 'hit_enquiries_recipient', get_option( 'admin_email' ) ) ); ?>"><p class="description">New enquiry notifications are sent here.</p></td></tr><tr><th><label for="hit_estimate_subject">Applicant email subject</label></th><td><input class="regular-text" id="hit_estimate_subject" name="hit_estimate_subject" value="<?php echo esc_attr( get_option( 'hit_estimate_subject', 'Your Helvetic Tech study cost estimate' ) ); ?>"></td></tr><tr><th><label for="hit_enquiries_retention_days">Retention period</label></th><td><input class="small-text" type="number" min="0" id="hit_enquiries_retention_days" name="hit_enquiries_retention_days" value="<?php echo esc_attr( get_option( 'hit_enquiries_retention_days', 365 ) ); ?>"> days<p class="description">Private enquiry records older than this are moved to Trash daily. Enter 0 to keep records until they are removed manually.</p></td></tr></table><?php submit_button( 'Save settings' ); ?></form><hr><h2>Email delivery check</h2><p>Connect WordPress to authenticated SMTP or the hosting provider’s transactional email service before accepting enquiries.</p><form method="post"><?php wp_nonce_field( 'hit_test_email' ); ?><input type="hidden" name="hit_test_email" value="1"><?php submit_button( 'Send test email', 'secondary' ); ?></form><hr><h2>Admissions workflow</h2><ol><li>Open <strong>Enquiries</strong> to review applicant details and the verified estimate.</li><li>Use the applicant email or phone link to follow up.</li><li>Use <strong>Export enquiries to Excel</strong> for a protected CSV export.</li><li>Review your privacy notice and retention period with the institution’s legal adviser before launch.</li></ol></div><?php
}

add_action( 'admin_init', static function() {
	if ( function_exists( 'wp_add_privacy_policy_content' ) ) {
		wp_add_privacy_policy_content( 'HIT Enquiries', wp_kses_post( '<p>When a visitor requests a study cost estimate, the website stores the details they submit, their selected programme and intake, their cost-planning inputs, and email-delivery status. This information is used to prepare and deliver the estimate and to respond to the admissions enquiry.</p>' ) );
	}
} );

add_action( 'init', static function() {
	if ( ! wp_next_scheduled( 'hit_enquiries_daily_retention' ) ) wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', 'hit_enquiries_daily_retention' );
} );

add_action( 'hit_enquiries_daily_retention', static function() {
	$days = absint( get_option( 'hit_enquiries_retention_days', 365 ) );
	if ( 0 === $days ) return;
	$expired = get_posts( array(
		'post_type'      => 'hit_enquiry',
		'post_status'    => 'private',
		'posts_per_page' => 100,
		'fields'         => 'ids',
		'date_query'     => array( array( 'before' => $days . ' days ago', 'inclusive' => true ) ),
	) );
	foreach ( $expired as $post_id ) wp_trash_post( $post_id );
} );

function hit_enquiries_privacy_exporter( $email_address, $page = 1 ) {
	$posts = get_posts( array( 'post_type' => 'hit_enquiry', 'post_status' => array( 'private', 'publish', 'draft', 'pending' ), 'posts_per_page' => 100, 'paged' => max( 1, (int) $page ), 'meta_key' => '_hit_lead_email', 'meta_value' => sanitize_email( $email_address ) ) );
	$data = array();
	foreach ( $posts as $post ) {
		$item = array();
		foreach ( hit_enquiries_fields() as $key => $label ) $item[] = array( 'name' => $label, 'value' => (string) get_post_meta( $post->ID, $key, true ) );
		$data[] = array( 'group_id' => 'hit-enquiries', 'group_label' => 'Helvetic Tech enquiries', 'item_id' => 'hit-enquiry-' . $post->ID, 'data' => $item );
	}
	return array( 'data' => $data, 'done' => count( $posts ) < 100 );
}

add_filter( 'wp_privacy_personal_data_exporters', static function( $exporters ) {
	$exporters['hit-enquiries'] = array( 'exporter_friendly_name' => 'Helvetic Tech enquiries', 'callback' => 'hit_enquiries_privacy_exporter' );
	return $exporters;
} );

function hit_enquiries_privacy_eraser( $email_address, $page = 1 ) {
	$posts = get_posts( array( 'post_type' => 'hit_enquiry', 'post_status' => array( 'private', 'publish', 'draft', 'pending', 'trash' ), 'posts_per_page' => 100, 'paged' => max( 1, (int) $page ), 'meta_key' => '_hit_lead_email', 'meta_value' => sanitize_email( $email_address ) ) );
	$removed = false;
	foreach ( $posts as $post ) { wp_delete_post( $post->ID, true ); $removed = true; }
	return array( 'items_removed' => $removed, 'items_retained' => false, 'messages' => array(), 'done' => count( $posts ) < 100 );
}

add_filter( 'wp_privacy_personal_data_erasers', static function( $erasers ) {
	$erasers['hit-enquiries'] = array( 'eraser_friendly_name' => 'Helvetic Tech enquiries', 'callback' => 'hit_enquiries_privacy_eraser' );
	return $erasers;
} );

