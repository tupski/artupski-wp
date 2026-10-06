<?php
/**
 * Template part for footer navigation and widgets.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<nav class="footer-navigation" aria-label="<?php esc_attr_e( 'Footer', 'artupski' ); ?>">
	<?php
	if ( has_nav_menu( 'footer' ) ) {
		wp_nav_menu(
			array(
				'theme_location' => 'footer',
				'container'      => false,
				'menu_class'     => 'footer-menu',
				'fallback_cb'    => false,
				'depth'          => 1,
			)
		);
	}
	?>
</nav>
