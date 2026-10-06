<?php
/**
 * Generic page template.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<div class="shell page-content-area section">
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class( 'article-entry' ); ?>>
			<header class="page-header" data-reveal>
				<h1 class="page-title"><?php the_title(); ?></h1>
			</header>

			<?php if ( has_post_thumbnail() ) : ?>
				<div class="page-featured-media" data-reveal>
					<?php the_post_thumbnail( 'dossier-hero', array( 'loading' => 'eager' ) ); ?>
				</div>
			<?php endif; ?>

			<div class="page-content dossier-prose" data-reveal>
				<?php
				the_content();

				wp_link_pages(
					array(
						'before' => '<nav class="page-links" aria-label="' . esc_attr__( 'Page', 'artupski' ) . '">',
						'after'  => '</nav>',
					)
				);
				?>
			</div>
		</article>
		<?php
	endwhile;
	?>
</div>

<?php
get_footer();
