<!doctype html>
<html <?php language_attributes(); ?> class="no-js">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#0b2641">
	<script>document.documentElement.classList.replace('no-js','js');try{if(sessionStorage.getItem('hit-visited')==='1')document.documentElement.classList.add('is-returning')}catch(e){}</script>
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?> data-page="<?php echo esc_attr( hit_theme_page_kind() ); ?>">
<?php wp_body_open(); ?>
<div class="site-loader" data-site-loader role="status" aria-live="polite" aria-label="Loading Helvetic Institute of Technology">
	<div class="loader-brand"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/hit-logo.svg' ); ?>" width="188" height="75" alt="Helvetic Institute of Technology"><span aria-hidden="true"></span><small>La Tour-de-Peilz · Switzerland</small></div>
</div>
<div class="page-transition" data-page-transition aria-hidden="true"><div class="transition-brand"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/hit-logo.svg' ); ?>" width="188" height="75" alt=""><span></span></div></div>
<a class="skip-link" href="#main-content">Skip to main content</a>
<header class="site-header" data-header>
	<div class="site-header__progress" aria-hidden="true"><span></span></div>
	<div class="site-header__inner">
		<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Helvetic Institute of Technology home"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/hit-logo.svg' ); ?>" width="150" height="60" alt="Helvetic Institute of Technology"></a>
		<?php wp_nav_menu( array( 'theme_location' => 'primary', 'container' => 'nav', 'container_class' => 'desktop-nav', 'container_aria_label' => 'Primary navigation', 'items_wrap' => '<ul>%3$s</ul>', 'fallback_cb' => false, 'depth' => 1 ) ); ?>
		<div class="header-actions"><a class="header-brochure" href="https://t8d78.share.hsforms.com/2VJF0JmhFQgusDgsBs8zfNw">Request brochure</a><a class="header-cta" href="https://share.hsforms.com/1OGo_OEgxTdC1v8Kyd8_WtAt8d78" data-magnetic data-cursor="Apply">Apply <span aria-hidden="true">↗</span></a><button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-menu-open><span>Menu</span><b aria-hidden="true"><i></i><i></i></b></button></div>
	</div>
</header>
<aside class="menu" role="dialog" aria-modal="true" aria-label="Website navigation" aria-hidden="true" data-menu>
	<div class="menu__head"><a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Helvetic Institute of Technology home"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/hit-logo.svg' ); ?>" width="150" height="60" alt="Helvetic Institute of Technology"></a><button type="button" aria-label="Close menu" data-menu-close><span>Close</span><i aria-hidden="true">×</i></button></div>
	<?php wp_nav_menu( array( 'theme_location' => 'overlay', 'container' => 'nav', 'container_class' => 'menu-accordion', 'container_aria_label' => 'Full website navigation', 'items_wrap' => '%3$s', 'fallback_cb' => false, 'depth' => 2, 'walker' => new HIT_Overlay_Menu_Walker() ) ); ?>
</aside>
<div class="menu-scrim" data-menu-scrim></div>

