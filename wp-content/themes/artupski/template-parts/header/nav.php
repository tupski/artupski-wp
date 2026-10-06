<?php
/**
 * Template part for primary site navigation in header.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$menu_cta_show = get_theme_mod( 'artupski_menu_cta_show', false );
?>
<nav class="primary-nav" id="primary-navigation" aria-label="<?php esc_attr_e( 'Primary', 'artupski' ); ?>">
	<?php
	if ( has_nav_menu( 'primary' ) ) {
		wp_nav_menu(
			array(
				'theme_location' => 'primary',
				'container'      => false,
				'menu_class'     => 'nav-menu',
				'fallback_cb'    => false,
				'depth'          => 1,
				'walker'         => new Artupski_Nav_Walker(),
			)
		);
	} else {
		?>
		<ul>
			<li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" data-nav-link="index.html" aria-current="page"><?php esc_html_e( 'Home', 'artupski' ); ?></a></li>
			<li><a href="<?php echo esc_url( get_post_type_archive_link( 'artupski_project' ) ? get_post_type_archive_link( 'artupski_project' ) : home_url( '/projects/' ) ); ?>" data-nav-link="portfolio.html"><?php esc_html_e( 'Portfolio', 'artupski' ); ?></a></li>
		</ul>
		<?php
	}

	if ( $menu_cta_show ) {
		?>
		<a class="nav-cta tlink" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a Project', 'artupski' ); ?></a>
		<?php
	}
	?>
</nav>
