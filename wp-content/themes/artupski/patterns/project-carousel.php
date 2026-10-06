<?php
/**
 * Title: Categorized Project Carousel
 * Slug: artupski/project-carousel
 * Categories: artupski-dossier
 * Description: Accessible carousel container with section title row, navigation buttons, and responsive project slides.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:group {"tagName":"section","className":"carousel-section section","layout":{"type":"default"}} -->
<section class="wp-block-group carousel-section section" aria-label="<?php esc_attr_e( 'Project Carousel', 'artupski' ); ?>" data-reveal>
	<div class="section-title-row">
		<div class="section-head">
			<span class="sec-num">02 / Portfolio</span>
			<h2>Featured Projects</h2>
		</div>
		<div class="carousel-controls" aria-label="<?php esc_attr_e( 'Carousel navigation', 'artupski' ); ?>">
			<button type="button" class="carousel-btn prev" data-carousel-prev aria-label="<?php esc_attr_e( 'Previous slide', 'artupski' ); ?>">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
			</button>
			<button type="button" class="carousel-btn next" data-carousel-next aria-label="<?php esc_attr_e( 'Next slide', 'artupski' ); ?>">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
			</button>
		</div>
	</div>
	<div class="carousel-track" data-carousel-track tabindex="0" role="region" aria-label="<?php esc_attr_e( 'Slides', 'artupski' ); ?>">
		<div class="carousel-slide">
			<figure class="carousel-slide__figure">
				<!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
				<figure class="wp-block-image"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/tower-constitution.jpg' ); ?>" alt="Constitution Club Tower" width="1200" height="900" loading="lazy" /></figure>
				<!-- /wp:image -->
				<figcaption class="carousel-slide__caption">
					<strong class="title">Constitution Club Tower</strong>
					<span class="meta">Commercial &middot; Jakarta</span>
				</figcaption>
			</figure>
		</div>
		<div class="carousel-slide">
			<figure class="carousel-slide__figure">
				<!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
				<figure class="wp-block-image"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/warehouse-distribution.jpg' ); ?>" alt="Logistics Center" width="1200" height="900" loading="lazy" /></figure>
				<!-- /wp:image -->
				<figcaption class="carousel-slide__caption">
					<strong class="title">Logistics Center</strong>
					<span class="meta">Industrial &middot; Cikarang</span>
				</figcaption>
			</figure>
		</div>
	</div>
</section>
<!-- /wp:group -->
