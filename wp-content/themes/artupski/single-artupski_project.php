<?php
/**
 * Single Artupski Project CPT Template.
 *
 * Visual fidelity match to architectural case studies.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

while ( have_posts() ) :
	the_post();
	$meta = artupski_get_project_meta( get_the_ID() );
	?>

	<article id="post-<?php the_ID(); ?>" <?php post_class( 'project-single' ); ?>>
		<section class="page-hero" aria-labelledby="page-title">
			<div class="shell page-hero__grid">
				<div data-reveal>
					<p class="eyebrow">
						<?php
						if ( ! empty( $meta['categories'] ) ) {
							echo esc_html( implode( ' &middot; ', $meta['categories'] ) );
						} else {
							esc_html_e( 'Project Dossier', 'artupski' );
						}
						?>
					</p>
					<h1 id="page-title"><?php the_title(); ?></h1>
					<?php if ( ! empty( $meta['subtitle'] ) ) : ?>
						<p class="lede page-hero__intro"><?php echo esc_html( $meta['subtitle'] ); ?></p>
					<?php endif; ?>
				</div>
				<?php if ( has_post_thumbnail() ) : ?>
					<div class="page-hero__media" data-reveal style="--reveal-delay:120ms">
						<?php the_post_thumbnail( 'dossier-portrait', array( 'fetchpriority' => 'high', 'decoding' => 'async' ) ); ?>
					</div>
				<?php endif; ?>
			</div>
		</section>

		<div class="shell project-content-shell">
			<?php get_template_part( 'template-parts/project/meta' ); ?>

			<div class="project-narrative section section--tight">
				<div class="section-title-row" data-reveal>
					<div class="section-head">
						<span class="sec-num"><?php esc_html_e( 'Overview', 'artupski' ); ?></span>
						<h2><?php esc_html_e( 'Project Description & Narrative', 'artupski' ); ?></h2>
					</div>
				</div>
				<div class="entry-content dossier-prose" data-reveal style="margin-top:clamp(1.5rem,3vw,2.5rem)">
					<?php the_content(); ?>
				</div>
			</div>

			<?php if ( ! empty( $meta['testimonial'] ) ) : ?>
				<section class="project-testimonial section section--tight" data-reveal>
					<blockquote class="dossier-quote">
						<div class="quote-body"><?php echo wp_kses_post( wpautop( $meta['testimonial'] ) ); ?></div>
						<?php if ( ! empty( $meta['client'] ) ) : ?>
							<cite class="quote-cite">&mdash; <?php echo esc_html( $meta['client'] ); ?></cite>
						<?php endif; ?>
					</blockquote>
				</section>
			<?php endif; ?>

			<?php get_template_part( 'template-parts/project/gallery' ); ?>
		</div>
	</article>

	<?php
endwhile;

get_footer();
