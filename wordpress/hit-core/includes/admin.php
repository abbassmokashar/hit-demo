<?php
/** Setup and content management screen. */
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'admin_menu', static function() {
	add_menu_page( 'HIT website', 'HIT website', 'manage_options', 'hit-website', 'hit_core_admin_page', 'dashicons-admin-site-alt3', 3 );
} );

add_action( 'admin_post_hit_refresh_content', static function() {
	if ( ! current_user_can( 'manage_options' ) ) wp_die( 'You are not allowed to refresh website content.' );
	check_admin_referer( 'hit_refresh_content' );
	$result = hit_core_import_starter_content( true );
	update_option( 'hit_core_last_import', $result, false );
	wp_safe_redirect( add_query_arg( array( 'page' => 'hit-website', 'refreshed' => 1, 'created' => $result['created'], 'updated' => $result['updated'], 'cleaned' => $result['cleaned'] ?? 0 ), admin_url( 'admin.php' ) ) );
	exit;
} );

add_action( 'admin_post_hit_import_content', static function() {
	if ( ! current_user_can( 'manage_options' ) ) wp_die( 'You are not allowed to import website content.' );
	check_admin_referer( 'hit_import_content' );
	$result = hit_core_import_starter_content( false );
	update_option( 'hit_core_last_import', $result, false );
	wp_safe_redirect( add_query_arg( array( 'page' => 'hit-website', 'imported' => 1, 'created' => $result['created'], 'cleaned' => $result['cleaned'] ?? 0 ), admin_url( 'admin.php' ) ) );
	exit;
} );

add_action( 'admin_notices', static function() {
	if ( ! current_user_can( 'manage_options' ) || hit_core_managed_page_count() >= 27 ) return;
	$url = admin_url( 'admin.php?page=hit-website' );
	echo '<div class="notice notice-warning"><p><strong>HIT Core:</strong> The website content import is incomplete. <a href="' . esc_url( $url ) . '">Open HIT website setup</a> to import the missing pages.</p></div>';
} );

function hit_core_admin_page() {
	$pages = hit_core_managed_page_count();
	$programs = hit_core_program_count();
	$native_pages = count( hit_core_starter_data( 'pages' ) );
	$last = get_option( 'hit_core_last_import', array() );
	?>
	<div class="wrap"><h1>HIT website</h1>
	<?php if ( isset( $_GET['imported'] ) ) : ?><div class="notice notice-success is-dismissible"><p>Missing HIT content was imported. <?php echo absint( $_GET['created'] ?? 0 ); ?> pages were created and <?php echo absint( $_GET['cleaned'] ?? 0 ); ?> duplicate URL placeholders were moved to Trash.</p></div><?php endif; ?>
	<?php if ( isset( $_GET['refreshed'] ) ) : ?><div class="notice notice-success is-dismissible"><p>Starter content refreshed. <?php echo absint( $_GET['created'] ?? 0 ); ?> pages created, <?php echo absint( $_GET['updated'] ?? 0 ); ?> pages updated, and <?php echo absint( $_GET['cleaned'] ?? 0 ); ?> duplicate URL placeholders moved to Trash.</p></div><?php endif; ?>
	<p>This plugin owns the editable website content, program data, interactive tools and admissions enquiries. The parent theme owns the presentation; the child theme is reserved for deployment-specific customisations.</p>
	<table class="widefat striped" style="max-width:800px"><tbody><tr><th>Native starter pages available</th><td><?php echo esc_html( $native_pages ); ?> / 27</td></tr><tr><th>Managed pages</th><td><?php echo esc_html( $pages ); ?> / 27</td></tr><tr><th>Structured programs</th><td><?php echo esc_html( $programs ); ?> / 6</td></tr><tr><th>Installed HIT Core</th><td><?php echo esc_html( HIT_CORE_VERSION ); ?></td></tr><tr><th>Imported content package</th><td><?php echo esc_html( get_option( 'hit_core_content_version', 'Not imported' ) ); ?></td></tr></tbody></table>
	<?php if ( ! empty( $last['errors'] ) ) : ?><div class="notice notice-error inline"><p><strong>Last import messages:</strong></p><ul><?php foreach ( $last['errors'] as $error ) echo '<li>' . esc_html( $error ) . '</li>'; ?></ul></div><?php endif; ?>
	<?php if ( $pages < 27 || $programs < 6 ) : ?><h2>Import missing content</h2><p>This safe import creates only missing HIT pages and records. Existing managed-page edits are preserved.</p><form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>"><?php wp_nonce_field( 'hit_import_content' ); ?><input type="hidden" name="action" value="hit_import_content"><?php submit_button( 'Import missing HIT content', 'primary' ); ?></form><?php endif; ?>
	<h2>Refresh managed content</h2><p>This updates only pages and structured records created by HIT Core. Unrelated WordPress content is not changed. Existing managed-page edits are replaced, so use this only when deploying an approved content update.</p>
	<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>"><?php wp_nonce_field( 'hit_refresh_content' ); ?><input type="hidden" name="action" value="hit_refresh_content"><?php submit_button( 'Refresh HIT starter content', 'secondary' ); ?></form>
	<p><a href="<?php echo esc_url( admin_url( 'edit.php?post_type=hit_enquiry&page=hit-enquiry-settings' ) ); ?>">Open admissions enquiry settings</a></p></div>
	<?php
}

