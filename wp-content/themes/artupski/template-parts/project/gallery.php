<?php
/**
 * Template part for rendering project image gallery.
 *
 * @var array $args {
 *     @type array $gallery_ids Array of attachment IDs.
 * }
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$gallery_ids = ! empty( $args['gallery_ids'] ) ? (array) $args['gallery_ids'] : array();

if ( empty( $gallery_ids ) ) {
	$meta = artupski_get_project_meta( get_the_ID() );
	$gallery_ids = ! empty( $meta['gallery_ids'] ) ? $meta['gallery_ids'] : array();
}

if ( empty( $gallery_ids ) ) {
	return;
}
?>
<section class="project-gallery section" aria-labelledby="gallery-heading" data-reveal>
	<div class="section-title-row">
		<div class="section-head">
			<span class="sec-num"><?php esc_html_e( 'Gallery', 'artupski' ); ?></span>
			<h2 id="gallery-heading"><?php esc_html_e( 'Project Documentation & Imagery', 'artupski' ); ?></h2>
		</div>
		<p class="meta"><?php printf( esc_html__( '%d Photos', 'artupski' ), count( $gallery_ids ) ); ?></p>
	</div>

	<div class="gallery-grid" style="margin-top:clamp(1.5rem,3vw,2.5rem)">
		<?php foreach ( $gallery_ids as $attachment_id ) : ?>
			<?php
			$attachment_id = absint( $attachment_id );
			$full_url      = wp_get_attachment_image_url( $attachment_id, 'full' );
			$caption       = wp_get_attachment_caption( $attachment_id );
			$alt           = get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );
			if ( ! $alt ) {
				$alt = get_the_title( $attachment_id );
			}
			?>
			<div class="gallery-item">
				<button
					type="button"
					class="gallery-trigger"
					data-lightbox-trigger
					data-full-src="<?php echo esc_url( $full_url ); ?>"
					data-caption="<?php echo esc_attr( $caption ? $caption : $alt ); ?>"
					aria-label="<?php echo esc_attr( sprintf( __( 'View full size: %s', 'artupski' ), $alt ) ); ?>"
				>
					<?php echo wp_get_attachment_image( $attachment_id, 'dossier-gallery', false, array( 'loading' => 'lazy', 'alt' => esc_attr( $alt ) ) ); ?>
				</button>
			</div>
		<?php endforeach; ?>
	</div>
</section>
