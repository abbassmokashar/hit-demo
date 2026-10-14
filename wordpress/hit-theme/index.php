<?php get_header(); ?>
<main id="main-content" class="shell" style="padding:10rem 0 5rem">
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?><article><h1><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1><?php the_excerpt(); ?></article><?php endwhile; else : ?><h1>Nothing found</h1><?php endif; ?>
</main>
<?php get_footer(); ?>

