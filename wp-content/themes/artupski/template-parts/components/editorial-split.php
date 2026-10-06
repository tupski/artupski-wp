<?php
/**
 * Presentation Component: Editorial Split Layout
 *
 * @var array $args {
 *     @type string $kicker   Small eyebrow annotation.
 *     @type string $heading  Section heading text.
 *     @type string $body     Main paragraph text / HTML content.
 *     @type int    $image_id Image attachment ID.
 *     @type string $image_url Image fallback URL.
 *     @type string $caption  Image caption / meta text.
 *     @type bool   $reverse  If true, image is on left.
 * }
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$kicker    = ! empty( $args['kicker'] ) ? $args['kicker'] : '';
$heading   = ! empty( $args['heading'] ) ? $args['heading'] : '';
$body      = ! empty( $args['body'] ) ? $args['body'] : '';
$image_id  = ! empty( $args['image_id'] ) ? absint( $args['image_id'] ) : 0;
$image_url = ! empty( $args['image_url'] ) ? $args['image_url'] : '';
$caption   = ! empty( $args['caption'] ) ? $args['caption'] : '';
$reverse   = ! empty( $args['reverse'] ) ? (bool) $args['reverse'] : false;

$grid_class = 'editorial-split' . ( $reverse ? ' editorial-split--reverse' : '' );
?>
<div class="<?php echo esc_attr( $grid_class ); ?>">
	<div class="editorial-split__text" data-reveal>
		<?php if ( $kicker ) : ?>
			<span class="kicker"><?php echo esc_html( $kicker ); ?></span>
		<?php endif; ?>
		<?php if ( $heading ) : ?>
			<h3><?php echo esc_html( $heading ); ?></h3>
		<?php endif; ?>
		<?php if ( $body ) : ?>
			<div class="dossier-prose">
				<?php echo wp_kses_post( wpautop( $body ) ); ?>
			</div>
		<?php endif; ?>
	</div>
	<?php if ( $image_id || $image_url ) : ?>
		<figure class="editorial-split__media" data-reveal style="--reveal-delay:120ms">
			<?php if ( $image_id ) : ?>
				<?php echo wp_get_attachment_image( $image_id, 'dossier-portrait', false, array( 'loading' => 'lazy' ) ); ?>
			<?php else : ?>
				<img src="<?php echo esc_url( $image_url ); ?>" alt="" width="1400" height="1750" loading="lazy" />
			<?php endif; ?>
			<?php if ( $caption ) : ?>
				<figcaption class="meta"><?php echo esc_html( $caption ); ?></figcaption>
			<?php endif; ?>
		</figure>
	<?php endif; ?>
</div>
