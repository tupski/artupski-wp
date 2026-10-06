<?php
/**
 * Template part for footer copyright and colophon text.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<p class="colophon">
	<?php
	printf(
		/* translators: 1: site name, 2: current year. */
		esc_html__( '%1$s — %2$s', 'artupski' ),
		esc_html( get_bloginfo( 'name' ) ),
		artupski_current_year() // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in helper.
	);
	?>
</p>
