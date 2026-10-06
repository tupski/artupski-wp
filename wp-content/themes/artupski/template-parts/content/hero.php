<?php
/**
 * Generic page hero template part.
 *
 * @var array $args {
 *     @type string $eyebrow Eyebrow text.
 *     @type string $title   Page title.
 *     @type string $intro   Leed/intro text.
 *     @type int    $image_id Image attachment ID.
 *     @type string $image_url Optional image URL fallback.
 * }
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$eyebrow   = ! empty( $args['eyebrow'] ) ? $args['eyebrow'] : '';
$title     = ! empty( $args['title'] ) ? $args['title'] : get_the_title();
$intro     = ! empty( $args['intro'] ) ? $args['intro'] : '';
$image_id  = ! empty( $args['image_id'] ) ? absint( $args['image_id'] ) : get_post_thumbnail_id();
$image_url = ! empty( $args['image_url'] ) ? $args['image_url'] : '';
?>
<section class="page-hero" aria-labelledby="page-title">
	<div class="shell page-hero__grid">
		<div data-reveal>
			<?php if ( $eyebrow ) : ?>
				<p class="eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
			<?php endif; ?>
			<h1 id="page-title"><?php echo esc_html( $title ); ?></h1>
			<?php if ( $intro ) : ?>
				<p class="lede page-hero__intro"><?php echo esc_html( $intro ); ?></p>
			<?php endif; ?>
		</div>
		<?php if ( $image_id || $image_url ) : ?>
			<div class="page-hero__media" data-reveal style="--reveal-delay:120ms">
				<?php if ( $image_id ) : ?>
					<?php echo wp_get_attachment_image( $image_id, 'dossier-portrait', false, array( 'fetchpriority' => 'high', 'decoding' => 'async' ) ); ?>
				<?php else : ?>
					<img src="<?php echo esc_url( $image_url ); ?>" alt="" width="1400" height="1050" fetchpriority="high" decoding="async" />
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
</section>
