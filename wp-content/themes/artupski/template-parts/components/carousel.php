<?php
/**
 * Presentation Component: Carousel Slider
 *
 * @var array $args {
 *     @type string $title     Section heading.
 *     @type string $number    Section numbered prefix.
 *     @type array  $items     Array of items: [ 'image_id' => int, 'image_url' => string, 'title' => string, 'subtitle' => string, 'link' => string ].
 * }
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$title  = ! empty( $args['title'] ) ? $args['title'] : '';
$number = ! empty( $args['number'] ) ? $args['number'] : '';
$items  = ! empty( $args['items'] ) && is_array( $args['items'] ) ? $args['items'] : array();

if ( empty( $items ) ) {
	return;
}
?>
<section class="carousel-section section" aria-label="<?php echo esc_attr( $title ? $title : __( 'Featured Gallery', 'artupski' ) ); ?>" data-reveal>
	<?php if ( $title || $number ) : ?>
		<div class="section-title-row">
			<div class="section-head">
				<?php if ( $number ) : ?>
					<span class="sec-num"><?php echo esc_html( $number ); ?></span>
				<?php endif; ?>
				<?php if ( $title ) : ?>
					<h2><?php echo esc_html( $title ); ?></h2>
				<?php endif; ?>
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
	<?php endif; ?>

	<div class="carousel-track" data-carousel-track tabindex="0" role="region" aria-label="<?php esc_attr_e( 'Slides', 'artupski' ); ?>">
		<?php foreach ( $items as $item ) : ?>
			<?php
			$item_title    = ! empty( $item['title'] ) ? $item['title'] : '';
			$item_subtitle = ! empty( $item['subtitle'] ) ? $item['subtitle'] : '';
			$item_link     = ! empty( $item['link'] ) ? $item['link'] : '';
			$item_img_id   = ! empty( $item['image_id'] ) ? absint( $item['image_id'] ) : 0;
			$item_img_url  = ! empty( $item['image_url'] ) ? $item['image_url'] : '';
			?>
			<div class="carousel-slide">
				<figure class="carousel-slide__figure">
					<?php if ( $item_link ) : ?>
						<a href="<?php echo esc_url( $item_link ); ?>">
					<?php endif; ?>
					<?php if ( $item_img_id ) : ?>
						<?php echo wp_get_attachment_image( $item_img_id, 'dossier-gallery', false, array( 'loading' => 'lazy', 'alt' => esc_attr( $item_title ) ) ); ?>
					<?php elseif ( $item_img_url ) : ?>
						<img src="<?php echo esc_url( $item_img_url ); ?>" alt="<?php echo esc_attr( $item_title ); ?>" width="1200" height="900" loading="lazy" />
					<?php endif; ?>
					<?php if ( $item_link ) : ?>
						</a>
					<?php endif; ?>
					<?php if ( $item_title || $item_subtitle ) : ?>
						<figcaption class="carousel-slide__caption">
							<?php if ( $item_title ) : ?>
								<strong class="title"><?php echo esc_html( $item_title ); ?></strong>
							<?php endif; ?>
							<?php if ( $item_subtitle ) : ?>
								<span class="meta"><?php echo esc_html( $item_subtitle ); ?></span>
							<?php endif; ?>
						</figcaption>
					<?php endif; ?>
				</figure>
			</div>
		<?php endforeach; ?>
	</div>
</section>
