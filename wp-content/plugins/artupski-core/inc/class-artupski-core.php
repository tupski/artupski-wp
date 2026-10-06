<?php
/**
 * Main plugin bootstrap loader.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Artupski_Core {

	/**
	 * Singleton instance.
	 *
	 * @var Artupski_Core|null
	 */
	private static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Artupski_Core
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		$this->includes();
		$this->init_hooks();
	}

	/**
	 * Load required module classes.
	 */
	private function includes() {
		require_once ARTUPSKI_CORE_PATH . 'inc/class-taxonomies.php';
		require_once ARTUPSKI_CORE_PATH . 'inc/class-post-types.php';
		require_once ARTUPSKI_CORE_PATH . 'inc/class-meta-boxes.php';
		require_once ARTUPSKI_CORE_PATH . 'inc/class-rewrites.php';
	}

	/**
	 * Register core hooks.
	 */
	private function init_hooks() {
		add_action( 'init', array( $this, 'init_modules' ), 0 );
		add_action( 'init', array( $this, 'maybe_flush_rewrites' ), 99 );
	}

	/**
	 * Initialize plugin sub-modules.
	 */
	public function init_modules() {
		Artupski_Taxonomies::get_instance();
		Artupski_Post_Types::get_instance();
		Artupski_Meta_Boxes::get_instance();
		Artupski_Rewrites::get_instance();
	}

	/**
	 * Flush rewrite rules safely if flag is set on activation.
	 */
	public function maybe_flush_rewrites() {
		if ( get_option( 'artupski_core_flush_rewrite_rules' ) ) {
			flush_rewrite_rules();
			delete_option( 'artupski_core_flush_rewrite_rules' );
		}
	}
}
