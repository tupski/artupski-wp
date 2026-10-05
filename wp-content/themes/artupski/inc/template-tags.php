<?php
/**
 * Reusable template helper functions.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'artupski_current_year' ) ) {
	/**
	 * Current year, for the footer colophon.
	 *
	 * @return string Escaped four-digit year.
	 */
	function artupski_current_year() {
		return esc_html( gmdate( 'Y' ) );
	}
}

if ( ! function_exists( 'artupski_the_skip_link' ) ) {
	/**
	 * Render the accessible skip-to-content link.
	 *
	 * @return void
	 */
	function artupski_the_skip_link() {
		printf(
			'<a class="skip-link screen-reader-text" href="#main">%s</a>',
			esc_html__( 'Skip to content', 'artupski' )
		);
	}
}
