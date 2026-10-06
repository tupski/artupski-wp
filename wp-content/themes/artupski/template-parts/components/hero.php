<?php
/**
 * Presentation Component: Hero Section
 *
 * @var array $args {
 *     @type string $eyebrow   Eyebrow annotation text.
 *     @type string $title     Main hero heading.
 *     @type string $tagline   Hero tagline text.
 *     @type string $aside     Aside narrative paragraph.
 *     @type string $cta_text  CTA link text.
 *     @type string $cta_url   CTA target URL.
 *     @type int    $image_id  Hero image attachment ID.
 *     @type string $image_url Fallback hero image URL.
 * }
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$eyebrow   = ! empty( $args['eyebrow'] ) ? $args['eyebrow'] : '';
$title     = ! empty( $args['title'] ) ? $args['title'] : get_bloginfo( 'name' );
$tagline   = ! empty( $args['tagline'] ) ? $args['tagline'] : get_bloginfo( 'description' );
$aside     = ! empty( $args['aside'] ) ? $args['aside'] : '';
$cta_text  = ! empty( $args['cta_text'] ) ? $args['cta_text'] : '';
$cta_url   = ! empty( $args['cta_url'] ) ? $args['cta_url'] : '';
$image_id  = ! empty( $args['image_id'] ) ? absint( $args['image_id'] ) : 0;
$image_url = ! empty( $args['image_url'] ) ? $args['image_url'] : '';
?>
<section class="hero" aria-labelledby="hero-title">
	<div class="hero__media">
		<?php if ( $image_id ) : ?>
			<?php echo wp_get_attachment_image( $image_id, 'dossier-hero', false, array( 'fetchpriority' => 'high', 'decoding' => 'async' ) ); ?>
		<?php elseif ( $image_url ) : ?>
			<img src="<?php echo esc_url( $image_url ); ?>" alt="" width="1920" height="1280" fetchpriority="high" decoding="async" />
		<?php endif; ?>
	</div>
	<div class="hero__scrim" aria-hidden="true"></div>
	<div class="shell hero__inner">
		<div class="hero__grid">
			<div data-reveal>
				<?php if ( $eyebrow ) : ?>
					<p class="eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
				<?php endif; ?>
				<h1 id="hero-title"><?php echo esc_html( $title ); ?></h1>
				<?php if ( $tagline ) : ?>
					<p class="hero__tagline"><?php echo esc_html( $tagline ); ?></p>
				<?php endif; ?>
			</div>
			<?php if ( $aside || $cta_text ) : ?>
				<div class="hero__aside" data-reveal style="--reveal-delay:120ms">
					<?php if ( $aside ) : ?>
						<p><?php echo esc_html( $aside ); ?></p>
					<?php endif; ?>
					<?php if ( $cta_text && $cta_url ) : ?>
						<a class="tlink" href="<?php echo esc_url( $cta_url ); ?>">
							<?php echo esc_html( $cta_text ); ?>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
						</a>
					<?php endif; ?>
					<span class="hero__scroll" aria-hidden="true">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4v16M6 14l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
						<?php esc_html_e( 'Scroll', 'artupski' ); ?>
					</span>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
