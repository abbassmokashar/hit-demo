<?php
/** Structured data supplied to the interactive program tools. */
if ( ! defined( 'ABSPATH' ) ) exit;

function hit_core_programs_for_tools() {
	$posts = get_posts( array( 'post_type' => 'hit_program', 'post_status' => 'publish', 'posts_per_page' => -1, 'orderby' => 'menu_order', 'order' => 'ASC' ) );
	$programs = array();
	foreach ( $posts as $post ) {
		$terms = wp_get_post_terms( $post->ID, 'hit_program_level', array( 'fields' => 'names' ) );
		$route = (string) get_post_meta( $post->ID, '_hit_route', true );
		$programs[] = array(
			'id' => (string) get_post_meta( $post->ID, '_hit_id', true), 'level' => $terms ? $terms[0] : '',
			'discipline' => (string) get_post_meta( $post->ID, '_hit_discipline', true), 'field' => (string) get_post_meta( $post->ID, '_hit_field', true),
			'number' => sprintf( '%02d', (int) $post->menu_order ), 'title' => get_the_title( $post ), 'award' => (string) get_post_meta( $post->ID, '_hit_award', true),
			'href' => trim( $route, '/' ), 'duration' => (string) get_post_meta( $post->ID, '_hit_duration', true),
			'years' => (int) get_post_meta( $post->ID, '_hit_years', true), 'credits' => (string) get_post_meta( $post->ID, '_hit_credits', true),
			'terms' => (string) get_post_meta( $post->ID, '_hit_terms', true), 'tuitionTerm' => (int) get_post_meta( $post->ID, '_hit_tuition_term', true),
			'tuitionYear' => (int) get_post_meta( $post->ID, '_hit_tuition_year', true), 'intakes' => (string) get_post_meta( $post->ID, '_hit_intakes', true),
			'mode' => (string) get_post_meta( $post->ID, '_hit_mode', true), 'location' => (string) get_post_meta( $post->ID, '_hit_location', true),
			'signal' => (string) get_post_meta( $post->ID, '_hit_signal', true),
		);
	}
	return $programs;
}

function hit_core_search_index() {
	$pages = get_posts( array( 'post_type' => 'page', 'post_status' => 'publish', 'posts_per_page' => -1, 'meta_key' => '_hit_managed_page', 'meta_value' => '1' ) );
	return array_map( static function( $page ) {
		return array( 'title' => get_the_title( $page ), 'url' => get_permalink( $page ), 'text' => wp_trim_words( wp_strip_all_tags( do_blocks( $page->post_content ) ), 45, '' ) );
	}, $pages );
}

