<?php
/**
 * Plugin Name: HIT Core
 * Description: Content model, page sections, starter import, program tools and admissions enquiries for Helvetic Tech.
 * Version: 1.0.6
 * Requires at least: 6.6
 * Requires PHP: 8.1
 * Author: Helvetic Institute of Technology
 * Text Domain: hit-core
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'HIT_CORE_VERSION', '1.0.6' );
define( 'HIT_CORE_DIR', plugin_dir_path( __FILE__ ) );
define( 'HIT_CORE_URL', plugin_dir_url( __FILE__ ) );

require_once HIT_CORE_DIR . 'includes/content-types.php';
require_once HIT_CORE_DIR . 'includes/blocks.php';
require_once HIT_CORE_DIR . 'includes/starter-data.php';
require_once HIT_CORE_DIR . 'includes/importer.php';
require_once HIT_CORE_DIR . 'includes/tools.php';
require_once HIT_CORE_DIR . 'includes/estimate-api.php';
require_once HIT_CORE_DIR . 'includes/enquiries-admin.php';
require_once HIT_CORE_DIR . 'includes/admin.php';

register_activation_hook( __FILE__, 'hit_core_activate' );
function hit_core_activate() {
	hit_core_register_content_types();
	hit_core_enquiries_register_content_type();
	$administrator = get_role( 'administrator' );
	if ( $administrator ) $administrator->add_cap( 'manage_hit_enquiries' );
	if ( false === get_option( 'hit_core_enquiries_recipient', false ) ) add_option( 'hit_core_enquiries_recipient', get_option( 'hit_enquiries_recipient', get_option( 'admin_email' ) ) );
	if ( false === get_option( 'hit_estimate_subject', false ) ) add_option( 'hit_estimate_subject', 'Your Helvetic Tech study cost estimate' );
	$result = hit_core_import_starter_content( false );
	update_option( 'hit_core_last_import', $result, false );
	if ( empty( $result['pages'] ) || ! empty( $result['errors'] ) ) update_option( 'hit_core_pending_import', 1, false );
	else delete_option( 'hit_core_pending_import' );
	flush_rewrite_rules();
}

register_deactivation_hook( __FILE__, static function() {
	wp_clear_scheduled_hook( 'hit_core_enquiries_daily_retention' );
	flush_rewrite_rules();
} );

/** Repair a skipped or partial activation import on the next administrator request. */
add_action( 'admin_init', static function() {
	if ( ! current_user_can( 'manage_options' ) || wp_doing_ajax() ) return;
	if ( ! get_option( 'hit_core_pending_import' ) && hit_core_managed_page_count() >= 27 && hit_core_program_count() >= 6 ) return;
	if ( get_transient( 'hit_core_import_lock' ) ) return;
	set_transient( 'hit_core_import_lock', 1, 2 * MINUTE_IN_SECONDS );
	$result = hit_core_import_starter_content( false );
	update_option( 'hit_core_last_import', $result, false );
	if ( ! empty( $result['pages'] ) && empty( $result['errors'] ) ) delete_option( 'hit_core_pending_import' );
	else update_option( 'hit_core_pending_import', 1, false );
	delete_transient( 'hit_core_import_lock' );
}, 40 );

