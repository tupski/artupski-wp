<?php
/**
 * Core theme singleton and lifecycle hooks.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Artupski_Theme
 *
 * Owns the theme setup lifecycle and wires the presentation services together.
 * The theme owns presentation only; content models and functionality live in the
 * companion plugin (`artupski-core`, added in a later phase).
 */
class Artupski_Theme {

	/**
	 * Singleton instance.
	 *
	 * @var Artupski_Theme|null
	 */
	private static $instance = null;

	/**
	 * Asset pipeline service.
	 *
	 * @var Artupski_Assets
	 */
	public $assets;

	/**
	 * Retrieve the singleton instance.
	 *
	 * @return Artupski_Theme
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor. Wires services and lifecycle hooks.
	 */
	private function __construct() {
		$this->assets = new Artupski_Assets();

		add_action( 'after_setup_theme', array( $this, 'setup' ) );
	}

	/**
	 * Register theme features and editor support.
	 *
	 * @return void
	 */
	public function setup() {
		// HTML5 semantic markup.
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'style',
				'script',
			)
		);

		// Document title management.
		add_theme_support( 'title-tag' );

		// Post thumbnails and architectural aspect-ratio crops.
		add_theme_support( 'post-thumbnails' );
		add_image_size( 'dossier-hero', 1920, 1280, true );     // 3:2 hero ratio.
		add_image_size( 'dossier-portrait', 1400, 1750, true ); // 4:5 facade/portrait ratio.
		add_image_size( 'dossier-gallery', 1200, 900, true );   // 4:3 gallery ratio.
		add_image_size( 'dossier-thumb', 400, 300, true );      // Carousel thumbnail.

		// Navigation menu locations.
		register_nav_menus(
			array(
				'primary' => __( 'Primary Nav (Header)', 'artupski' ),
				'footer'  => __( 'Footer Navigation', 'artupski' ),
			)
		);

		// Block editor styling and Gutenberg features (Gutenberg-primary authoring).
		// The self-hosted fonts are loaded into the editor canvas as part of the
		// asset pipeline so authoring matches the front end (no Google Fonts).
		add_theme_support( 'editor-styles' );
		add_editor_style( array( 'assets/css/fonts.css', 'assets/css/editor-style.css' ) );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'wp-block-styles' );
		add_theme_support( 'align-wide' );

		/**
		 * Fires after Artupski theme features are registered.
		 *
		 * @since 0.1.0
		 */
		do_action( 'artupski_after_setup_theme' );
	}
}
