<?php
/** Overlay navigation walker. */
if ( ! defined( 'ABSPATH' ) ) exit;

class HIT_Overlay_Menu_Walker extends Walker_Nav_Menu {
	private $group = 0;

	public function start_lvl( &$output, $depth = 0, $args = null ) {
		$output .= '<div class="menu-group__panel" aria-hidden="true"><div>';
	}

	public function end_lvl( &$output, $depth = 0, $args = null ) {
		$output .= '</div></div>';
	}

	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$title = apply_filters( 'the_title', $item->title, $item->ID );
		if ( 0 === $depth ) {
			$this->group++;
			$output .= '<section class="menu-group" data-menu-group>';
			$output .= '<button class="menu-group__toggle" type="button" aria-expanded="false"><span>' . esc_html( sprintf( '%02d', $this->group ) ) . '</span><strong>' . esc_html( $title ) . '</strong><i aria-hidden="true"></i></button>';
			return;
		}
		$output .= '<a href="' . esc_url( $item->url ) . '">' . esc_html( $title ) . '</a>';
	}

	public function end_el( &$output, $item, $depth = 0, $args = null ) {
		if ( 0 === $depth ) $output .= '</section>';
	}
}

