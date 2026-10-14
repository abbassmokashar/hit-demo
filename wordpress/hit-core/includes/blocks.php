<?php
/** Visual, reorderable page sections for the HIT block editor. */

if ( ! defined( 'ABSPATH' ) ) exit;

function hit_core_register_page_section_block() {
	wp_register_script(
		'hit-page-sections-editor',
		HIT_CORE_URL . 'assets/blocks.js',
		array( 'wp-blocks', 'wp-block-editor', 'wp-components', 'wp-element', 'wp-i18n' ),
		HIT_CORE_VERSION,
		true
	);
	wp_register_style(
		'hit-page-sections-editor',
		HIT_CORE_URL . 'assets/editor.css',
		array( 'wp-edit-blocks' ),
		HIT_CORE_VERSION
	);
	register_block_type( 'hit/section', array(
		'api_version'     => 3,
		'editor_script'   => 'hit-page-sections-editor',
		'editor_style'    => 'hit-page-sections-editor',
		'render_callback' => 'hit_core_render_page_section',
		'attributes'      => array(
			'markup' => array( 'type' => 'string', 'default' => '' ),
			'label'  => array( 'type' => 'string', 'default' => 'Page section' ),
			'hidden' => array( 'type' => 'boolean', 'default' => false ),
		),
		'supports' => array( 'html' => false, 'customClassName' => false, 'anchor' => false ),
	) );
}
add_action( 'init', 'hit_core_register_page_section_block' );

function hit_core_render_page_section( $attributes ) {
	if ( ! empty( $attributes['hidden'] ) ) return '';
	return isset( $attributes['markup'] ) ? (string) $attributes['markup'] : '';
}

function hit_core_section_label( $markup, $position ) {
	$label = '';
	if ( preg_match( '/<p[^>]*class=["\'][^"\']*eyebrow[^"\']*["\'][^>]*>(.*?)<\/p>/is', $markup, $match ) ) {
		$label = wp_strip_all_tags( $match[1] );
	}
	if ( '' === trim( $label ) && preg_match( '/<h[1-6][^>]*>(.*?)<\/h[1-6]>/is', $markup, $match ) ) {
		$label = wp_strip_all_tags( $match[1] );
	}
	$label = trim( html_entity_decode( $label, ENT_QUOTES | ENT_HTML5, 'UTF-8' ) );
	return '' !== $label ? $label : sprintf( 'Page section %d', $position );
}

/** Split existing approved HTML at top-level sections without changing its output. */
function hit_core_html_to_section_blocks( $html ) {
	$html = trim( (string) $html );
	if ( '' === $html || has_blocks( $html ) ) return $html;
	$parts = preg_split( '/(<section\b[^>]*>.*?<\/section>)/is', $html, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY );
	if ( ! is_array( $parts ) || empty( $parts ) ) $parts = array( $html );
	$blocks = array();
	$position = 0;
	foreach ( $parts as $part ) {
		if ( '' === trim( $part ) ) continue;
		$position++;
		$blocks[] = serialize_block( array(
			'blockName'    => 'hit/section',
			'attrs'        => array(
				'markup' => $part,
				'label'  => hit_core_section_label( $part, $position ),
				'hidden' => false,
			),
			'innerBlocks'  => array(),
			'innerHTML'    => '',
			'innerContent' => array(),
		) );
	}
	return implode( "\n\n", $blocks );
}

/** Migrate once, preserving the complete original HTML for recovery. */
function hit_core_migrate_managed_pages_to_blocks() {
	if ( ! is_admin() || ! current_user_can( 'manage_options' ) ) return;
	$migration = '1.0.8';
	if ( version_compare( (string) get_option( 'hit_core_blocks_migrated', '0' ), $migration, '>=' ) ) return;
	$pages = get_posts( array(
		'post_type'      => 'page',
		'post_status'    => array( 'publish', 'draft', 'private' ),
		'posts_per_page' => -1,
		'meta_key'       => '_hit_managed_page',
		'meta_value'     => '1',
		'orderby'        => 'ID',
		'order'          => 'ASC',
	) );
	$converted = 0;
	foreach ( $pages as $page ) {
		if ( has_blocks( $page->post_content ) || '' === trim( (string) $page->post_content ) ) continue;
		if ( '' === (string) get_post_meta( $page->ID, '_hit_original_page_html', true ) ) {
			update_post_meta( $page->ID, '_hit_original_page_html', $page->post_content );
		}
		$content = hit_core_html_to_section_blocks( $page->post_content );
		if ( $content === $page->post_content ) continue;
		$result = wp_update_post( array( 'ID' => $page->ID, 'post_content' => wp_slash( $content ) ), true );
		if ( ! is_wp_error( $result ) ) $converted++;
	}
	update_option( 'hit_core_blocks_migrated', $migration, false );
	update_option( 'hit_core_blocks_migrated_count', $converted, false );
}
add_action( 'admin_init', 'hit_core_migrate_managed_pages_to_blocks', 50 );

function hit_core_section_block_categories( $categories ) {
	array_unshift( $categories, array( 'slug' => 'hit', 'title' => 'HIT sections', 'icon' => 'welcome-learn-more' ) );
	return $categories;
}
add_filter( 'block_categories_all', 'hit_core_section_block_categories' );

