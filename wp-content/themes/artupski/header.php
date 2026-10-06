<?php
/**
 * Global document head and site header.
 *
 * Artupski theme header template.
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

<?php
$artupski_header_layout = get_theme_mod( 'artupski_header_layout', 'standard' );
$artupski_header_sticky = get_theme_mod( 'artupski_header_sticky', false );

$artupski_header_classes = array( 'site-header' );
if ( ! empty( $artupski_header_layout ) ) {
	$artupski_header_classes[] = 'site-header--' . sanitize_html_class( $artupski_header_layout );
}
if ( $artupski_header_sticky ) {
	$artupski_header_classes[] = 'site-header--sticky';
}
?>
<header class="<?php echo esc_attr( implode( ' ', $artupski_header_classes ) ); ?>" role="banner">
	<div class="shell header-inner">
		<?php get_template_part( 'template-parts/header/branding' ); ?>

		<button
			class="menu-toggle"
			type="button"
			data-menu-toggle
			aria-expanded="false"
			aria-controls="primary-navigation"
			aria-label="<?php esc_attr_e( 'Open navigation menu', 'artupski' ); ?>"
		>
			<svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke-linecap="round"/></svg>
			<svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke-linecap="round"/></svg>
		</button>

		<?php get_template_part( 'template-parts/header/nav' ); ?>
	</div>
</header>

<main id="main" class="site-main">
