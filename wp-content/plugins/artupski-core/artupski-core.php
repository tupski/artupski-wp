<?php
/**
 * Plugin Name:       Artupski Core
 * Plugin URI:        https://rajatua.com/artupski
 * Description:       Core content models, custom post types, taxonomies, metadata, and rewrite infrastructure for the Artupski theme.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Artupski Engineering Team
 * Author URI:        https://rajatua.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       artupski-core
 * Domain Path:       /languages
 */

// Prevent direct script execution.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin version and path constants.
define( 'ARTUPSKI_CORE_VERSION', '1.0.0' );
define( 'ARTUPSKI_CORE_FILE', __FILE__ );
define( 'ARTUPSKI_CORE_PATH', plugin_dir_path( __FILE__ ) );
define( 'ARTUPSKI_CORE_URL', plugin_dir_url( __FILE__ ) );

// Require main plugin class.
require_once ARTUPSKI_CORE_PATH . 'inc/class-artupski-core.php';

/**
 * Plugin activation hook callback.
 * Flags rewrite rules to flush safely on next init without unconditional flushing on every request.
 */
function artupski_core_activate() {
	update_option( 'artupski_core_flush_rewrite_rules', 1 );
}
register_activation_hook( __FILE__, 'artupski_core_activate' );

/**
 * Plugin deactivation hook callback.
 * Retains user data; flushes rewrite rules cleanly once.
 */
function artupski_core_deactivate() {
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'artupski_core_deactivate' );

/**
 * Bootstrap the core plugin instance.
 */
function artupski_core() {
	return Artupski_Core::get_instance();
}

artupski_core();
