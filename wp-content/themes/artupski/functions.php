<?php
/**
 * Artupski theme bootstrap.
 *
 * Registers the theme service objects (theme setup + asset pipeline) and
 * exposes the theme singleton via the `artupski()` helper.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'ARTUPSKI_VERSION' ) ) {
	define( 'ARTUPSKI_VERSION', '0.1.0' );
}

if ( ! defined( 'ARTUPSKI_DIR' ) ) {
	define( 'ARTUPSKI_DIR', get_template_directory() );
}

if ( ! defined( 'ARTUPSKI_URI' ) ) {
	define( 'ARTUPSKI_URI', get_template_directory_uri() );
}

require_once ARTUPSKI_DIR . '/inc/class-theme.php';
require_once ARTUPSKI_DIR . '/inc/class-assets.php';
require_once ARTUPSKI_DIR . '/inc/template-tags.php';
require_once ARTUPSKI_DIR . '/inc/class-gutenberg.php';
require_once ARTUPSKI_DIR . '/inc/class-classic-editor.php';
require_once ARTUPSKI_DIR . '/inc/class-customizer.php';

/**
 * Return the Artupski theme singleton.
 *
 * @return Artupski_Theme
 */
function artupski() {
	return Artupski_Theme::instance();
}

artupski();
