<?php
/** Idempotent starter-content importer. */
if ( ! defined( 'ABSPATH' ) ) exit;

function hit_core_starter_data( $name ) {
	$name = (string) $name;
	if ( ! in_array( $name, array( 'pages', 'programs', 'intakes' ), true ) ) return array();
	$php_file = HIT_CORE_DIR . 'starter-data/' . $name . '.php';
	if ( file_exists( $php_file ) ) {
		$data = require $php_file;
		if ( is_array( $data ) && ! empty( $data ) ) return $data;
	}
	if ( function_exists( 'hit_core_bundled_starter_data' ) ) {
		$data = hit_core_bundled_starter_data( $name );
		if ( is_array( $data ) && ! empty( $data ) ) return $data;
	}
	$json_file = HIT_CORE_DIR . 'starter-data/' . $name . '.json';
	if ( ! file_exists( $json_file ) ) return array();
	$contents = file_get_contents( $json_file );
	if ( false === $contents ) return array();
	$data = json_decode( $contents, true );
	return is_array( $data ) ? $data : array();
}

function hit_core_route_key( $route ) {
	return '' === (string) $route ? '__home__' : (string) $route;
}

function hit_core_find_managed_page( $route ) {
	$path = trim( (string) $route, '/' );
	$page = get_page_by_path( $path ?: 'home', OBJECT, 'page' );
	if ( $page && get_post_meta( $page->ID, '_hit_managed_page', true ) ) return (int) $page->ID;
	$ids = get_posts( array( 'post_type' => 'page', 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids', 'meta_key' => '_hit_route_key', 'meta_value' => hit_core_route_key( $route ) ) );
	if ( $ids ) return (int) $ids[0];
	if ( '' === (string) $route ) return 0;
	$ids = get_posts( array( 'post_type' => 'page', 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids', 'meta_key' => '_hit_route', 'meta_value' => (string) $route ) );
	return $ids ? (int) $ids[0] : 0;
}

/** Keep one empty managed URL parent per route and trash importer-created duplicates. */
function hit_core_cleanup_managed_containers( $routes ) {
	$containers = get_posts( array( 'post_type' => 'page', 'post_status' => 'any', 'posts_per_page' => -1, 'orderby' => 'ID', 'order' => 'ASC', 'meta_key' => '_hit_managed_container', 'meta_value' => '1' ) );
	$cleaned = 0;
	foreach ( $routes as $route ) {
		$slug = basename( untrailingslashit( $route ) );
		$title = ucwords( str_replace( '-', ' ', $slug ) );
		$candidates = array_values( array_filter( $containers, static function( $page ) use ( $route, $slug, $title ) {
			if ( '' !== trim( (string) $page->post_content ) ) return false;
			$stored_route = (string) get_post_meta( $page->ID, '_hit_route', true );
			return $stored_route === $route || $page->post_name === $slug || 0 === strpos( $page->post_name, $slug . '-' ) || $page->post_title === $title;
		} ) );
		if ( ! $candidates ) continue;
		$canonical = $candidates[0];
		foreach ( $candidates as $candidate ) {
			if ( $candidate->post_name === $slug ) { $canonical = $candidate; break; }
		}
		update_post_meta( $canonical->ID, '_hit_managed_page', '1' );
		update_post_meta( $canonical->ID, '_hit_managed_container', '1' );
		update_post_meta( $canonical->ID, '_hit_route', $route );
		update_post_meta( $canonical->ID, '_hit_route_key', hit_core_route_key( $route ) );
		foreach ( $candidates as $candidate ) {
			if ( (int) $candidate->ID === (int) $canonical->ID ) continue;
			if ( wp_trash_post( $candidate->ID ) ) $cleaned++;
		}
	}
	return $cleaned;
}

function hit_core_managed_page_count() {
	$ids = get_posts( array( 'post_type' => 'page', 'post_status' => 'publish', 'posts_per_page' => -1, 'fields' => 'ids', 'meta_key' => '_hit_managed_page', 'meta_value' => '1', 'no_found_rows' => true ) );
	return count( $ids );
}

function hit_core_program_count() {
	$counts = wp_count_posts( 'hit_program' );
	return $counts && isset( $counts->publish ) ? (int) $counts->publish : 0;
}

function hit_core_import_starter_content( $refresh = false ) {
	$pages = hit_core_starter_data( 'pages' );
	$route_ids = array();
	$created = $updated = 0;
	$errors = array();
	if ( ! $pages ) return array( 'created' => 0, 'updated' => 0, 'pages' => 0, 'managed' => hit_core_managed_page_count(), 'programs' => hit_core_program_count(), 'errors' => array( 'HIT Core ' . HIT_CORE_VERSION . ' loaded, but WordPress returned zero records from the native pages collection.' ) );
	$public_routes = array_fill_keys( array_map( static function( $page ) { return (string) ( $page['route'] ?? '' ); }, $pages ), true );
	$container_routes = array_values( array_unique( array_filter( array_map( static function( $page ) use ( $public_routes ) {
		$parent = (string) ( $page['parentRoute'] ?? '' );
		return $parent && ! isset( $public_routes[ $parent ] ) ? $parent : '';
	}, $pages ) ) ) );
	$cleaned = hit_core_cleanup_managed_containers( $container_routes );
	foreach ( $pages as $page ) {
		$parent_route = (string) ( $page['parentRoute'] ?? '' );
		if ( ! $parent_route || isset( $public_routes[ $parent_route ] ) || isset( $route_ids[ $parent_route ] ) ) continue;
		$slug = basename( untrailingslashit( $parent_route ) );
		$container_id = hit_core_find_managed_page( $parent_route );
		if ( ! $container_id ) $container_id = wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'private', 'post_title' => ucwords( str_replace( '-', ' ', $slug ) ), 'post_name' => $slug, 'post_content' => '' ), true );
		if ( is_wp_error( $container_id ) ) $errors[] = $parent_route . ': ' . $container_id->get_error_message();
		if ( ! is_wp_error( $container_id ) ) {
			$route_ids[ $parent_route ] = (int) $container_id;
			update_post_meta( $container_id, '_hit_managed_page', '1' );
			update_post_meta( $container_id, '_hit_managed_container', '1' );
			update_post_meta( $container_id, '_hit_route', $parent_route );
			update_post_meta( $container_id, '_hit_route_key', hit_core_route_key( $parent_route ) );
		}
	}
	foreach ( $pages as $page ) {
		$route = (string) ( $page['route'] ?? '' );
		$post_id = hit_core_find_managed_page( $route );
		$content = hit_core_html_to_section_blocks( (string) ( $page['content'] ?? '' ) );
		$post_title = ! empty( $page['frontPage'] ) ? 'Home' : sanitize_text_field( $page['title'] ?? 'Untitled' );
		$post = array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => $post_title, 'post_name' => sanitize_title( $page['slug'] ?? '' ), 'post_content' => wp_slash( $content ) );
		if ( $post_id && $refresh ) {
			$post['ID'] = $post_id;
			$result = wp_update_post( $post, true );
			if ( ! is_wp_error( $result ) ) $updated++;
		} elseif ( ! $post_id ) {
			$post_id = wp_insert_post( $post, true );
			if ( ! is_wp_error( $post_id ) ) $created++;
		}
		if ( is_wp_error( $post_id ) ) { $errors[] = ( $route ?: '/' ) . ': ' . $post_id->get_error_message(); continue; }
		if ( ! $post_id ) { $errors[] = ( $route ?: '/' ) . ': WordPress returned no page ID.'; continue; }
		$route_ids[ $route ] = (int) $post_id;
		update_post_meta( $post_id, '_hit_managed_page', '1' );
		update_post_meta( $post_id, '_hit_route', $route );
		update_post_meta( $post_id, '_hit_route_key', hit_core_route_key( $route ) );
		update_post_meta( $post_id, '_hit_page_kind', sanitize_key( $page['kind'] ?? 'page' ) );
		update_post_meta( $post_id, '_hit_main_class', sanitize_text_field( $page['mainClass'] ?? '' ) );
		update_post_meta( $post_id, '_hit_source_url', esc_url_raw( $page['source'] ?? '' ) );
		update_post_meta( $post_id, '_hit_original_page_html', (string) ( $page['content'] ?? '' ) );
		if ( ! empty( $page['description'] ) ) update_post_meta( $post_id, '_hit_meta_description', sanitize_text_field( $page['description'] ) );
	}
	foreach ( $pages as $page ) {
		$route = (string) ( $page['route'] ?? '' );
		$parent_route = (string) ( $page['parentRoute'] ?? '' );
		if ( ! isset( $route_ids[ $route ] ) ) continue;
		$parent = $parent_route && isset( $route_ids[ $parent_route ] ) ? $route_ids[ $parent_route ] : 0;
		wp_update_post( array( 'ID' => $route_ids[ $route ], 'post_parent' => $parent ) );
		if ( ! empty( $page['frontPage'] ) ) {
			update_option( 'show_on_front', 'page' );
			update_option( 'page_on_front', $route_ids[ $route ] );
		}
	}
	hit_core_import_programs();
	hit_core_import_intakes();
	$managed = hit_core_managed_page_count();
	$program_count = hit_core_program_count();
	if ( $managed >= count( $pages ) && $program_count >= 6 ) update_option( 'hit_core_content_version', HIT_CORE_VERSION, false );
	return array( 'created' => $created, 'updated' => $updated, 'cleaned' => $cleaned, 'pages' => count( $pages ), 'managed' => $managed, 'programs' => $program_count, 'errors' => $errors );
}

function hit_core_upsert_by_key( $post_type, $key, $value, $post ) {
	$ids = get_posts( array( 'post_type' => $post_type, 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids', 'meta_key' => $key, 'meta_value' => $value ) );
	if ( $ids ) { $post['ID'] = (int) $ids[0]; return wp_update_post( $post, true ); }
	return wp_insert_post( $post, true );
}

function hit_core_import_programs() {
	foreach ( hit_core_starter_data( 'programs' ) as $program ) {
		$id = sanitize_key( $program['id'] ?? '' );
		if ( ! $id ) continue;
		$post_id = hit_core_upsert_by_key( 'hit_program', '_hit_id', $id, array( 'post_type' => 'hit_program', 'post_status' => 'publish', 'post_title' => sanitize_text_field( $program['title'] ?? $id ), 'post_excerpt' => sanitize_textarea_field( $program['signal'] ?? '' ), 'menu_order' => absint( $program['number'] ?? 0 ) ) );
		if ( is_wp_error( $post_id ) ) continue;
		foreach ( array( 'id','field','discipline','award','duration','years','credits','terms','tuitionTerm','tuitionYear','intakes','mode','location','signal','route' ) as $key ) {
			$meta_key = '_hit_' . strtolower( preg_replace( '/([a-z])([A-Z])/', '$1_$2', $key ) );
			update_post_meta( $post_id, $meta_key, is_numeric( $program[ $key ] ?? null ) ? (int) $program[ $key ] : sanitize_text_field( $program[ $key ] ?? '' ) );
		}
		if ( ! empty( $program['level'] ) ) wp_set_object_terms( $post_id, sanitize_text_field( $program['level'] ), 'hit_program_level' );
	}
}

function hit_core_import_intakes() {
	foreach ( hit_core_starter_data( 'intakes' ) as $intake ) {
		$title = sanitize_text_field( $intake['title'] ?? '' );
		if ( ! $title ) continue;
		$post_id = hit_core_upsert_by_key( 'hit_intake', '_hit_intake_key', sanitize_key( $title ), array( 'post_type' => 'hit_intake', 'post_status' => 'publish', 'post_title' => $title, 'menu_order' => absint( $intake['order'] ?? 0 ) ) );
		if ( ! is_wp_error( $post_id ) ) update_post_meta( $post_id, '_hit_intake_key', sanitize_key( $title ) );
	}
}

