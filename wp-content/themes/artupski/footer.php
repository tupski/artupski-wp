<?php
/**
 * Global site footer and document close.
 *
 * Minimal Phase 1 skeleton: colophon, footer navigation location and the
 * `wp_footer()` pipeline. The lightbox DOM is added in a later phase.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
</main><!-- #main -->

<?php
/**
 * Fires at the bottom of the page, after the site footer.
 *
 * @since 0.1.0
 */
do_action( 'artupski_after_footer' );
?>

<footer class="site-footer" role="contentinfo">
	<div class="shell footer-inner">
		<nav class="footer-navigation" aria-label="<?php esc_attr_e( 'Footer', 'artupski' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'footer',
					'container'      => false,
					'menu_class'     => 'footer-menu',
					'fallback_cb'    => false,
					'depth'          => 1,
				)
			);
			?>
		</nav>

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
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
