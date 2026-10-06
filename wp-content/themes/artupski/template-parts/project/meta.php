<?php
/**
 * Template part for rendering project metadata and specifications.
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
$specs   = ! empty( $meta['structural_specs'] ) ? $meta['structural_specs'] : array();
?>
<section class="project-specs section section--tight" aria-labelledby="specs-heading" data-reveal>
	<h2 id="specs-heading" class="screen-reader-text"><?php esc_html_e( 'Project Specifications', 'artupski' ); ?></h2>
	<div class="specs-grid">
		<?php if ( ! empty( $meta['client'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'Client / Owner', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( $meta['client'] ); ?></span>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $meta['location'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'Location', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( $meta['location'] ); ?></span>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $meta['scope'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'Scope of Work', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( $meta['scope'] ); ?></span>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $meta['categories'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'Discipline / Category', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( implode( ', ', $meta['categories'] ) ); ?></span>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $meta['years'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'Year', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( implode( ', ', $meta['years'] ) ); ?></span>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $meta['area'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'Gross Area', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( $meta['area'] ); ?></span>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $meta['status'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'Project Status', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( $meta['status'] ); ?></span>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $meta['style'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'Architectural Style', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( $meta['style'] ); ?></span>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $specs['grid'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'Structural Grid', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( $specs['grid'] ); ?></span>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $specs['height'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'Height / Elevation', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( $specs['height'] ); ?></span>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $specs['materials'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'Primary Materials', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( $specs['materials'] ); ?></span>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $specs['engineer'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'Lead Engineer', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( $specs['engineer'] ); ?></span>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $specs['contractor'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'General Contractor', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( $specs['contractor'] ); ?></span>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $specs['certification'] ) ) : ?>
			<div class="spec-item">
				<span class="spec-label"><?php esc_html_e( 'Certification', 'artupski' ); ?></span>
				<span class="spec-value"><?php echo esc_html( $specs['certification'] ); ?></span>
			</div>
		<?php endif; ?>
	</div>
</section>
