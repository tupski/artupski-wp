<?php
/**
 * Search results template.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<div class="shell search-area section">
	<header class="page-header" data-reveal>
		<p class="eyebrow"><?php esc_html_e( 'Search Results', 'artupski' ); ?></p>
		<h1 class="page-title">
			<?php
			printf(
				/* translators: %s: search query term */
				esc_html__( 'Query: &ldquo;%s&rdquo;', 'artupski' ),
				'<span>' . esc_html( get_search_query() ) . '</span>'
			);
			?>
		</h1>
	</header>

	<?php if ( have_posts() ) : ?>
		<div class="search-grid">
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
