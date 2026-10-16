<?php
/** Theme bootstrap and WordPress integration. */
if ( ! defined( 'ABSPATH' ) ) exit;

define( 'HIT_THEME_VERSION', '1.0.4' );
require_once get_template_directory() . '/inc/class-hit-overlay-menu-walker.php';

function hit_theme_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	register_nav_menus( array(
		'primary' => __( 'Header navigation', 'hit' ),
		'overlay' => __( 'Full-screen navigation', 'hit' ),
		'footer'  => __( 'Footer navigation', 'hit' ),
	) );
}
add_action( 'after_setup_theme', 'hit_theme_setup' );

function hit_theme_assets() {
	$uri = get_template_directory_uri();
	wp_enqueue_style( 'hit-main', $uri . '/assets/styles.css', array(), HIT_THEME_VERSION );
	wp_enqueue_script( 'hit-main', $uri . '/assets/main.js', array(), HIT_THEME_VERSION, true );

	$programs = function_exists( 'hit_core_programs_for_tools' ) ? hit_core_programs_for_tools() : array();
	$search   = function_exists( 'hit_core_search_index' ) ? hit_core_search_index() : array();
	$config = 'window.HIT_BASE=' . wp_json_encode( trailingslashit( home_url( '/' ) ) ) . ';';
	$config .= 'window.HIT_ASSET_BASE=' . wp_json_encode( trailingslashit( $uri ) ) . ';';
	$config .= 'window.HIT_PROGRAMS=' . wp_json_encode( $programs ) . ';';
	$config .= 'window.HIT_SEARCH_INDEX=' . wp_json_encode( $search ) . ';';
	$config .= 'window.HIT_ESTIMATE_ENDPOINT=' . wp_json_encode( rest_url( 'hit/v1/estimate' ) ) . ';';
	$config .= 'window.HIT_ESTIMATE_NONCE=' . wp_json_encode( wp_create_nonce( 'wp_rest' ) ) . ';';
	wp_add_inline_script( 'hit-main', $config, 'before' );
}
add_action( 'wp_enqueue_scripts', 'hit_theme_assets' );

add_action( 'wp_head', static function() {
	if ( ! is_singular( 'page' ) ) return;
	$description = get_post_meta( get_queried_object_id(), '_hit_meta_description', true );
	if ( $description ) echo '<meta name="description" content="' . esc_attr( $description ) . '">' . "\n";
	if ( is_front_page() ) {
		$schema = array( '@context' => 'https://schema.org', '@type' => 'EducationalOrganization', 'name' => 'Helvetic Institute of Technology', 'alternateName' => 'Helvetic Tech', 'url' => home_url( '/' ), 'telephone' => '+41 21 944 95 01', 'address' => array( '@type' => 'PostalAddress', 'streetAddress' => 'Chemin du Levant 5', 'postalCode' => '1814', 'addressLocality' => 'La Tour-de-Peilz', 'addressCountry' => 'CH' ) );
		echo '<script type="application/ld+json">' . wp_json_encode( $schema ) . '</script>' . "\n";
	}
}, 2 );

function hit_theme_content_tokens( $content ) {
	$content = str_replace(
		array( '{{home_url}}', '{{theme_url}}' ),
		array( untrailingslashit( home_url( '/' ) ), untrailingslashit( get_template_directory_uri() ) ),
		$content
	);
	if ( function_exists( 'hit_core_programs_for_tools' ) ) {
		$content = preg_replace_callback(
			'#<script([^>]*data-hit-programs[^>]*)>[\s\S]*?</script>#i',
			static function( $match ) { return '<script' . $match[1] . '>' . wp_json_encode( hit_core_programs_for_tools() ) . '</script>'; },
			$content
		);
	}

	// Keep previously imported managed pages fast without requiring a destructive re-import.
	$responsive_images = array(
		'official-community' => array( 'width' => 2200, 'height' => 1238, 'variants' => array( 640, 960, 1280, 1600 ), 'sizes' => '100vw' ),
		'discipline-ai' => array( 'width' => 1024, 'height' => 684, 'variants' => array( 480, 768 ), 'sizes' => '(max-width: 719px) calc(100vw - 36px), (max-width: 1100px) 62vw, 28vw' ),
		'discipline-cyber' => array( 'width' => 1024, 'height' => 684, 'variants' => array( 480, 768 ), 'sizes' => '(max-width: 719px) calc(100vw - 36px), (max-width: 1100px) 62vw, 28vw' ),
		'discipline-blockchain' => array( 'width' => 1024, 'height' => 768, 'variants' => array( 480, 768 ), 'sizes' => '(max-width: 719px) calc(100vw - 36px), (max-width: 1100px) 62vw, 28vw' ),
	);
	$content = preg_replace_callback(
		'#<img\b[^>]*\bsrc=(["\'])([^"\']*/assets/images/([^/"\']+)\.webp)\1[^>]*>#i',
		static function( $match ) use ( $responsive_images ) {
			$name = $match[3];
			if ( ! isset( $responsive_images[ $name ] ) || false !== stripos( $match[0], ' srcset=' ) ) return $match[0];
			$image = $responsive_images[ $name ];
			$base = untrailingslashit( get_template_directory_uri() ) . '/assets/images/';
			$sources = array();
			foreach ( $image['variants'] as $variant ) $sources[] = $base . $name . '-' . $variant . '.webp ' . $variant . 'w';
			$sources[] = $base . $name . '.webp ' . $image['width'] . 'w';
			$attributes = ' width="' . $image['width'] . '" height="' . $image['height'] . '" srcset="' . esc_attr( implode( ', ', $sources ) ) . '" sizes="' . esc_attr( $image['sizes'] ) . '"';
			return preg_replace( '/\s*\/>$|>$/', $attributes . '>', $match[0] );
		},
		$content
	);

	// Lighthouse rejects tabpanel roles on article elements. Normalise legacy imports at render time.
	$content = preg_replace_callback(
		'#<article(\s+role="tabpanel"\s+data-panel="(?:housing|lake|lifestyle)"[^>]*)>([\s\S]*?)</article>#i',
		static function( $match ) { return '<div class="location-panel"' . $match[1] . '>' . $match[2] . '</div>'; },
		$content
	);
	return $content;
}
add_filter( 'the_content', 'hit_theme_content_tokens', 4 );

function hit_theme_preserve_managed_markup() {
	if ( is_singular( 'page' ) && get_post_meta( get_queried_object_id(), '_hit_managed_page', true ) ) {
		remove_filter( 'the_content', 'wpautop' );
		remove_filter( 'the_content', 'wptexturize' );
	}
}
add_action( 'wp', 'hit_theme_preserve_managed_markup' );

function hit_theme_page_kind() {
	if ( is_front_page() ) return 'home';
	$kind = get_post_meta( get_queried_object_id(), '_hit_page_kind', true );
	return $kind ? sanitize_html_class( $kind ) : 'page';
}

function hit_theme_seed_menu( $name, $location, $items ) {
	$locations = get_theme_mod( 'nav_menu_locations', array() );
	if ( ! empty( $locations[ $location ] ) ) return;
	$menu = wp_get_nav_menu_object( $name );
	$menu_id = $menu ? $menu->term_id : wp_create_nav_menu( $name );
	if ( is_wp_error( $menu_id ) ) return;
	foreach ( $items as $item ) {
		$parent = 0;
		if ( ! empty( $item['parent'] ) ) {
			$parents = wp_get_nav_menu_items( $menu_id );
			foreach ( (array) $parents as $candidate ) if ( $candidate->title === $item['parent'] ) $parent = $candidate->ID;
		}
		wp_update_nav_menu_item( $menu_id, 0, array(
			'menu-item-title'     => $item['title'],
			'menu-item-url'       => isset( $item['path'] ) ? home_url( '/' . ltrim( $item['path'], '/' ) ) : '#',
			'menu-item-parent-id' => $parent,
			'menu-item-status'    => 'publish',
			'menu-item-type'      => 'custom',
		) );
	}
	$locations[ $location ] = (int) $menu_id;
	set_theme_mod( 'nav_menu_locations', $locations );
}

function hit_theme_seed_menus() {
	hit_theme_seed_menu( 'HIT Header', 'primary', array(
		array( 'title' => 'Programs', 'path' => 'programs/' ),
		array( 'title' => 'Program tools', 'path' => 'tools/program-signal/' ),
		array( 'title' => 'Admissions', 'path' => 'admissions/' ),
		array( 'title' => 'Student support', 'path' => 'student-services/' ),
		array( 'title' => 'Fees', 'path' => 'financing/fees-expenses/' ),
	) );
	$groups = array(
		'Institute' => array( 'About' => 'institute/', 'Faculty' => 'faculty/', 'Governance' => 'governance/', 'FAQ' => 'faq/', 'Policies' => 'policies/' ),
		'Programs' => array( 'View all programs' => 'programs/', 'Bachelor in Artificial Intelligence' => 'programs/bachelor-in-artificial-intelligence/', 'Bachelor in Cybersecurity' => 'programs/bachelor-in-cybersecurity/', 'Bachelor in Blockchain' => 'programs/bachelor-in-blockchain/', 'Master in Artificial Intelligence' => 'programs/master-in-artificial-intelligence/', 'Master in Cybersecurity' => 'programs/master-in-cybersecurity/', 'Master in Blockchain' => 'programs/master-in-blockchain/' ),
		'Decision tools' => array( 'Program Signal — find your direction' => 'tools/program-signal/', 'Program Matrix — compare degrees' => 'tools/program-matrix/', 'Study Cost Model — plan in CHF' => 'tools/study-cost-model/' ),
		'Students' => array( 'Student support' => 'student-services/', 'Student community' => 'students/', 'Campus life' => 'campus-life/' ),
		'Career impact' => array( 'Career outcomes' => 'career-impact/', 'Institutional development' => 'institutional-development/', 'Alumni' => 'alumni/' ),
		'Admissions & Financing' => array( 'Admissions' => 'admissions/', 'International student support' => 'student-services/', 'Fees & expenses' => 'financing/fees-expenses/', 'Scholarships' => 'financing/scholarships/', 'Contact us' => 'contact/' ),
	);
	$items = array();
	foreach ( $groups as $group => $children ) {
		$items[] = array( 'title' => $group );
		foreach ( $children as $title => $path ) $items[] = array( 'title' => $title, 'path' => $path, 'parent' => $group );
	}
	hit_theme_seed_menu( 'HIT Full Screen', 'overlay', $items );
}
add_action( 'after_switch_theme', 'hit_theme_seed_menus' );
add_action( 'admin_init', 'hit_theme_seed_menus' );

add_action( 'admin_notices', static function() {
	if ( ! current_user_can( 'activate_plugins' ) || defined( 'HIT_CORE_VERSION' ) ) return;
	echo '<div class="notice notice-warning"><p><strong>HIT theme:</strong> Install and activate HIT Core to import the website pages, programs and enquiry workflow.</p></div>';
} );

