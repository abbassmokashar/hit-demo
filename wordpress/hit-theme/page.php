<?php get_header(); ?>
<main id="main-content" class="<?php echo esc_attr( get_post_meta( get_queried_object_id(), '_hit_main_class', true ) ); ?>">
<?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
</main>
<?php get_footer(); ?>

