<?php
/**
 * Template part for rendering a project card/row item.
 *
 * @var array $args {
 *     @type int $post_id Post ID.
 * }
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$post_id = ! empty( $args['post_id'] ) ? absint( $args['post_id'] ) : get_the_ID();
$meta    = artupski_get_project_meta( $post_id );
$title   = get_the_title( $post_id );
$link    = get_permalink( $post_id );
?>
<div class="project-card" data-reveal>
	<div class="project-card__header">
		<h3 class="project-card__title">
			<a href="<?php echo esc_url( $link ); ?>"><?php echo esc_html( $title ); ?></a>
		</h3>
		<?php if ( ! empty( $meta['categories'] ) ) : ?>
			<span class="project-card__cat badge"><?php echo esc_html( implode( ', ', $meta['categories'] ) ); ?></span>
		<?php endif; ?>
	</div>
	<?php if ( has_post_thumbnail( $post_id ) ) : ?>
		<div class="project-card__media">
			<a href="<?php echo esc_url( $link ); ?>" aria-hidden="true" tabindex="-1">
				<?php echo get_the_post_thumbnail( $post_id, 'dossier-portrait', array( 'loading' => 'lazy', 'alt' => esc_attr( $title ) ) ); ?>
			</a>
		</div>
	<?php endif; ?>
	<div class="project-card__meta meta">
		<?php if ( ! empty( $meta['location'] ) ) : ?>
			<span class="project-card__location"><?php echo esc_html( $meta['location'] ); ?></span>
		<?php endif; ?>
		<?php if ( ! empty( $meta['years'] ) ) : ?>
			<span class="project-card__year"><?php echo esc_html( implode( ', ', $meta['years'] ) ); ?></span>
		<?php endif; ?>
	</div>
</div>
