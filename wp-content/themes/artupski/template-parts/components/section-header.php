<?php
/**
 * Presentation Component: Section Header
 *
 * @var array $args {
 *     @type string $number Numbered index label (e.g. "01 / Overview").
 *     @type string $title  Section heading text.
 *     @type string $meta   Right-aligned metadata annotation (e.g. "2003 to 2024").
 * }
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$number = ! empty( $args['number'] ) ? $args['number'] : '';
$title  = ! empty( $args['title'] ) ? $args['title'] : '';
$meta   = ! empty( $args['meta'] ) ? $args['meta'] : '';
?>
<div class="section-title-row" data-reveal>
	<div class="section-head">
		<?php if ( $number ) : ?>
			<span class="sec-num"><?php echo esc_html( $number ); ?></span>
		<?php endif; ?>
		<?php if ( $title ) : ?>
			<h2><?php echo esc_html( $title ); ?></h2>
		<?php endif; ?>
	</div>
	<?php if ( $meta ) : ?>
		<p class="meta"><?php echo esc_html( $meta ); ?></p>
	<?php endif; ?>
</div>
