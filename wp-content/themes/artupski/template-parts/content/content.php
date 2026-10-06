<?php
/**
 * Generic post or archive content presentation.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'article-entry' ); ?>>
	<header class="entry-header">
		<?php if ( is_singular() ) : ?>
			<h1 class="entry-title" data-reveal><?php the_title(); ?></h1>
		<?php else : ?>
			<h2 class="entry-title" data-reveal>
				<a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a>
			</h2>
		<?php endif; ?>

		<div class="entry-meta meta" data-reveal>
			<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
			<?php if ( get_the_author() ) : ?>
				<span class="meta-sep">&middot;</span>
				<span class="author-name"><?php echo esc_html( get_the_author() ); ?></span>
			<?php endif; ?>
		</div>
	</header>

	<?php if ( has_post_thumbnail() && ! is_singular() ) : ?>
		<div class="entry-thumbnail" data-reveal>
			<a href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
				<?php the_post_thumbnail( 'dossier-gallery', array( 'loading' => 'lazy' ) ); ?>
			</a>
		</div>
	<?php endif; ?>

	<div class="entry-content dossier-prose" data-reveal>
		<?php
		if ( is_singular() ) {
			the_content();

			wp_link_pages(
				array(
					'before' => '<nav class="page-links" aria-label="' . esc_attr__( 'Page', 'artupski' ) . '">',
					'after'  => '</nav>',
				)
			);
		} else {
			the_excerpt();
			?>
			<p>
				<a class="tlink" href="<?php the_permalink(); ?>">
					<?php esc_html_e( 'Continue reading', 'artupski' ); ?>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</a>
			</p>
			<?php
		}
		?>
	</div>
</article>
