<?php
/**
 * Front Page template for Artupski.
 *
 * Renders static page content or generic dossier homepage layout.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

if ( have_posts() ) :
	while ( have_posts() ) :
		the_post();

		$page_content = trim( get_the_content() );

		if ( ! empty( $page_content ) ) {
			?>
			<div class="shell front-page-content section">
				<div class="dossier-prose" data-reveal>
					<?php the_content(); ?>
				</div>
			</div>
			<?php
		} else {
			// Fallback editorial dossier hero and intro when page content is empty
			get_template_part(
				'template-parts/components/hero',
				null,
				array(
					'eyebrow'  => get_bloginfo( 'name' ),
					'title'    => get_bloginfo( 'name' ),
					'tagline'  => get_bloginfo( 'description' ),
					'aside'    => __( 'An architectural, engineering and construction firm delivering rigorous technical projects.', 'artupski' ),
					'cta_text' => __( 'View Portfolio', 'artupski' ),
					'cta_url'  => get_post_type_archive_link( 'artupski_project' ) ? get_post_type_archive_link( 'artupski_project' ) : home_url( '/projects/' ),
				)
			);
			?>

			<section class="section" aria-labelledby="featured-projects-heading">
				<div class="shell">
					<?php
					get_template_part(
						'template-parts/components/section-header',
						null,
						array(
							'number' => __( '01 / Featured', 'artupski' ),
							'title'  => __( 'Selected Projects & Dossiers', 'artupski' ),
							'meta'   => __( 'Recent records', 'artupski' ),
						)
					);

					$recent_projects = new WP_Query(
						array(
							'post_type'      => 'artupski_project',
							'posts_per_page' => 6,
							'post_status'    => 'publish',
						)
					);

					if ( $recent_projects->have_posts() ) :
						?>
						<div class="grid grid--3col" style="margin-top:clamp(2rem,4vw,3rem)">
							<?php
							while ( $recent_projects->have_posts() ) :
								$recent_projects->the_post();
								get_template_part( 'template-parts/project/card' );
							endwhile;
							wp_reset_postdata();
							?>
						</div>
					<?php endif; ?>
				</div>
			</section>
			<?php
		}
	endwhile;
endif;

get_footer();
