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
	wp_safe_redirect( add_query_arg( array( 'page' => 'hit-website', 'refreshed' => 1, 'created' => $result['created'], 'updated' => $result['updated'] ), admin_url( 'admin.php' ) ) );
	exit;
} );

function hit_core_admin_page() {
	$pages = (int) wp_count_posts( 'page' )->publish;
	$programs = (int) wp_count_posts( 'hit_program' )->publish;
	?>
	<div class="wrap"><h1>HIT website</h1>
	<?php if ( isset( $_GET['refreshed'] ) ) : ?><div class="notice notice-success is-dismissible"><p>Starter content refreshed. <?php echo absint( $_GET['created'] ?? 0 ); ?> pages created and <?php echo absint( $_GET['updated'] ?? 0 ); ?> pages updated.</p></div><?php endif; ?>
	<p>This plugin owns the editable website content, program data, interactive tools and admissions enquiries. The parent theme owns the presentation; the child theme is reserved for deployment-specific customisations.</p>
	<table class="widefat striped" style="max-width:800px"><tbody><tr><th>Published pages</th><td><?php echo esc_html( $pages ); ?></td></tr><tr><th>Structured programs</th><td><?php echo esc_html( $programs ); ?></td></tr><tr><th>Content package</th><td><?php echo esc_html( get_option( 'hit_core_content_version', 'Not imported' ) ); ?></td></tr></tbody></table>
	<h2>Refresh managed content</h2><p>This updates only pages and structured records created by HIT Core. Unrelated WordPress content is not changed. Existing managed-page edits are replaced, so use this only when deploying an approved content update.</p>
	<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>"><?php wp_nonce_field( 'hit_refresh_content' ); ?><input type="hidden" name="action" value="hit_refresh_content"><?php submit_button( 'Refresh HIT starter content', 'secondary' ); ?></form>
	<p><a href="<?php echo esc_url( admin_url( 'edit.php?post_type=hit_enquiry&page=hit-enquiry-settings' ) ); ?>">Open admissions enquiry settings</a></p></div>
	<?php
}

