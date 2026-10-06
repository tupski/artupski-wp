<?php
/**
 * Presentation Component: Fact Counter Metric
 *
 * @var array $args {
 *     @type string $number Numeric metric (e.g. "45").
 *     @type string $label  Baseline label (e.g. "Listed projects").
 *     @type string $note   Footnote explanation.
 * }
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$number = ! empty( $args['number'] ) ? $args['number'] : '';
$label  = ! empty( $args['label'] ) ? $args['label'] : '';
$note   = ! empty( $args['note'] ) ? $args['note'] : '';
?>
<div class="fact">
	<span class="fact__num" data-reveal><?php echo esc_html( $number ); ?></span>
	<span class="fact__label"><?php echo esc_html( $label ); ?></span>
	<?php if ( $note ) : ?>
		<p class="fact__note"><?php echo esc_html( $note ); ?></p>
	<?php endif; ?>
</div>
