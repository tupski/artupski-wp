<?php
/**
 * Global document head and site header.
 *
 * Minimal Phase 1 skeleton: semantic landmarks, skip link and the `wp_head()`
 * pipeline. Navigation markup and mobile drawer are built in a later phase.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php artupski_the_skip_link(); ?>

<?php
/**
 * Fires at the very top of the page, before the site header.
 *
 * @since 0.1.0
 */
do_action( 'artupski_before_header' );
?>

<header class="site-header" role="banner">
	<div class="shell header-inner">
		<div class="site-branding">
			<?php if ( has_custom_logo() ) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
					<span class="wordmark"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></span>
				</a>
			<?php endif; ?>
		</div>

		<nav id="primary-navigation" class="site-navigation" aria-label="<?php esc_attr_e( 'Primary', 'artupski' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'nav-menu',
					'fallback_cb'    => false,
					'depth'          => 1,
				)
			);
			?>
		</nav>
	</div>
</header>

<main id="main" class="site-main">
