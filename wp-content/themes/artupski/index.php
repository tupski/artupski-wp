<?php
/**
 * Fallback index template.
 *
 * Minimal Phase 1 skeleton: a valid loop so the theme is activatable and renders
 * standard WordPress content. The Dossier-specific templates and presentation
 * components are implemented in a later phase.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<div class="shell content-area">
	<?php if ( have_posts() ) : ?>
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
				<header class="entry-header">
					<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
				</header>
				<div class="entry-content">
					<?php the_content(); ?>
				</div>
			</article>
			<?php
		endwhile;

		the_posts_pagination(
			array(
				'mid_size'  => 1,
				'prev_text' => esc_html__( 'Previous', 'artupski' ),
				'next_text' => esc_html__( 'Next', 'artupski' ),
			)
		);
		?>
	<?php else : ?>
		<article class="no-results">
			<h1 class="entry-title"><?php esc_html_e( 'Nothing found', 'artupski' ); ?></h1>
			<p><?php esc_html_e( 'No content is available yet.', 'artupski' ); ?></p>
		</article>
	<?php endif; ?>
</div>

<?php
get_footer();
