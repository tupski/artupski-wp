<?php
/**
 * Presentation Component: Contact Details & Office Grid
 *
 * @var array $args {
 *     @type string $address Address text.
 *     @type string $phone   Phone string.
 *     @type string $email   Email string.
 *     @type string $hours   Operating hours.
 *     @type array  $offices Array of office locations.
 * }
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$address = ! empty( $args['address'] ) ? $args['address'] : '';
$phone   = ! empty( $args['phone'] ) ? $args['phone'] : '';
$email   = ! empty( $args['email'] ) ? $args['email'] : '';
$hours   = ! empty( $args['hours'] ) ? $args['hours'] : '';
$offices = ! empty( $args['offices'] ) && is_array( $args['offices'] ) ? $args['offices'] : array();
?>
<section class="contact-grid-section section" aria-labelledby="contact-grid-heading" data-reveal>
	<h2 id="contact-grid-heading" class="screen-reader-text"><?php esc_html_e( 'Contact Information', 'artupski' ); ?></h2>
	<div class="contact-grid">
		<?php if ( $address ) : ?>
			<div class="contact-card">
				<h3 class="contact-card__title"><?php esc_html_e( 'Office Address', 'artupski' ); ?></h3>
				<div class="contact-card__body dossier-prose">
					<?php echo wp_kses_post( wpautop( $address ) ); ?>
				</div>
			</div>
		<?php endif; ?>

		<?php if ( $phone || $email ) : ?>
			<div class="contact-card">
				<h3 class="contact-card__title"><?php esc_html_e( 'Direct Inquiries', 'artupski' ); ?></h3>
				<ul class="contact-card__list">
					<?php if ( $phone ) : ?>
						<li>
							<span class="label"><?php esc_html_e( 'Phone:', 'artupski' ); ?></span>
							<a href="<?php echo esc_url( 'tel:' . preg_replace( '/[^\d+]/', '', $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a>
						</li>
					<?php endif; ?>
					<?php if ( $email ) : ?>
						<li>
							<span class="label"><?php esc_html_e( 'Email:', 'artupski' ); ?></span>
							<a href="<?php echo esc_url( 'mailto:' . antispambot( $email ) ); ?>"><?php echo esc_html( antispambot( $email ) ); ?></a>
						</li>
					<?php endif; ?>
				</ul>
			</div>
		<?php endif; ?>

		<?php if ( $hours ) : ?>
			<div class="contact-card">
				<h3 class="contact-card__title"><?php esc_html_e( 'Operating Hours', 'artupski' ); ?></h3>
				<div class="contact-card__body dossier-prose">
					<?php echo wp_kses_post( wpautop( $hours ) ); ?>
				</div>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $offices ) ) : ?>
			<?php foreach ( $offices as $office ) : ?>
				<div class="contact-card">
					<h3 class="contact-card__title"><?php echo esc_html( $office['name'] ?? __( 'Branch Office', 'artupski' ) ); ?></h3>
					<div class="contact-card__body dossier-prose">
						<?php echo wp_kses_post( wpautop( $office['details'] ?? '' ) ); ?>
					</div>
				</div>
			<?php endforeach; ?>
		<?php endif; ?>
	</div>
</section>
