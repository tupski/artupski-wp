<?php
/**
 * Blog Posts Home Template (when static front page is set).
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<div class="shell section blog-posts-area">
	<header class="page-header" data-reveal>
		<p class="eyebrow"><?php esc_html_e( 'Journal', 'artupski' ); ?></p>
		<h1 class="page-title"><?php single_post_title(); ?></h1>
	</header>

	<?php if ( have_posts() ) : ?>
		<div class="posts-grid" style="margin-top:clamp(2rem,4vw,3rem)">
			<?php
			while ( have_posts() ) :
				the_post();
				get_template_part( 'template-parts/content/content' );
			endwhile;
			?>
		</div>
		<?php get_template_part( 'template-parts/content/pagination' ); ?>
	<?php else : ?>
		<?php get_template_part( 'template-parts/content/content-none' ); ?>
	<?php endif; ?>
</div>

<?php
get_footer();
