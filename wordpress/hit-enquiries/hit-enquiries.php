<?php
/**
 * Plugin Name: HIT Enquiries
 * Description: Secure study-cost enquiries, branded estimate delivery and admissions follow-up for Helvetic Tech.
 * Version: 1.0.0
 * Requires at least: 6.6
 * Requires PHP: 8.1
 * Author: Helvetic Institute of Technology
 * Text Domain: hit-enquiries
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'HIT_ENQUIRIES_VERSION', '1.0.0' );
define( 'HIT_ENQUIRIES_DIR', plugin_dir_path( __FILE__ ) );

require_once HIT_ENQUIRIES_DIR . 'includes/content-types.php';
require_once HIT_ENQUIRIES_DIR . 'includes/estimate-api.php';
require_once HIT_ENQUIRIES_DIR . 'includes/admin.php';

register_activation_hook( __FILE__, 'hit_enquiries_activate' );
function hit_enquiries_activate() {
	hit_enquiries_register_content_type();
	$administrator = get_role( 'administrator' );
	if ( $administrator ) $administrator->add_cap( 'manage_hit_enquiries' );
	if ( false === get_option( 'hit_enquiries_recipient', false ) ) {
		add_option( 'hit_enquiries_recipient', get_option( 'admin_email' ) );
	}
	if ( false === get_option( 'hit_estimate_subject', false ) ) {
		add_option( 'hit_estimate_subject', 'Your Helvetic Tech study cost estimate' );
	}
	flush_rewrite_rules();
}

register_deactivation_hook( __FILE__, 'hit_enquiries_deactivate' );
function hit_enquiries_deactivate() {
	wp_clear_scheduled_hook( 'hit_enquiries_daily_retention' );
	flush_rewrite_rules();
}

/** Make the public endpoint available to the prototype/theme without hard-coding URLs. */
function hit_enquiries_frontend_config() {
	return array(
		'endpoint' => rest_url( 'hit/v1/estimate' ),
		'nonce'    => wp_create_nonce( 'wp_rest' ),
	);
}

add_action( 'wp_footer', static function() {
	$config = hit_enquiries_frontend_config();
	printf(
		'<script>window.HIT_ESTIMATE_ENDPOINT=%1$s;window.HIT_ESTIMATE_NONCE=%2$s;</script>',
		wp_json_encode( $config['endpoint'] ),
		wp_json_encode( $config['nonce'] )
	);
}, 1 );

