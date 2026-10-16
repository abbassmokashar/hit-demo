<?php
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'wp_enqueue_scripts', static function() {
	$custom_css = get_stylesheet_directory() . '/assets/custom.css';
	if ( file_exists( $custom_css ) ) wp_enqueue_style( 'hit-child', get_stylesheet_directory_uri() . '/assets/custom.css', array( 'hit-main' ), filemtime( $custom_css ) );
	$custom = get_stylesheet_directory() . '/assets/custom.js';
	if ( file_exists( $custom ) ) wp_enqueue_script( 'hit-child', get_stylesheet_directory_uri() . '/assets/custom.js', array( 'hit-main' ), filemtime( $custom ), true );
}, 20 );

add_action( 'after_switch_theme', static function() {
	$parent = get_option( 'theme_mods_hit-theme', array() );
	$current = get_theme_mod( 'nav_menu_locations', array() );
	if ( empty( $current ) && ! empty( $parent['nav_menu_locations'] ) ) set_theme_mod( 'nav_menu_locations', $parent['nav_menu_locations'] );
} );

