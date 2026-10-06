<?php
/**
 * Gutenberg Block Editor integration and Block Patterns registration.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Artupski_Gutenberg
 */
class Artupski_Gutenberg {

	/**
	 * Constructor. Wires Gutenberg hooks.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_pattern_categories' ) );
		add_action( 'init', array( $this, 'register_block_styles' ) );
	}

	/**
	 * Register Gutenberg block pattern categories.
	 *
	 * @return void
	 */
	public function register_pattern_categories() {
		if ( ! function_exists( 'register_block_pattern_category' ) ) {
			return;
		}

		$categories = array(
			'artupski-dossier' => array(
				'label'       => __( 'Dossier Monograph Patterns', 'artupski' ),
				'description' => __( 'Pre-designed monograph section layouts for the Artupski Dossier system.', 'artupski' ),
			),
		);

		/**
		 * Filter the block pattern categories registered by Artupski.
		 *
		 * @since 0.1.0
		 *
		 * @param array $categories Associative array of pattern category definitions.
		 */
		$categories = apply_filters( 'artupski_block_pattern_categories', $categories );

		foreach ( $categories as $slug => $properties ) {
			register_block_pattern_category( $slug, $properties );
		}
	}

	/**
	 * Register custom block styles for Core blocks.
	 *
	 * @return void
	 */
	public function register_block_styles() {
		if ( ! function_exists( 'register_block_style' ) ) {
			return;
		}

		// 1. Core Group: Ink Band (Dark theme contrast section).
		register_block_style(
			'core/group',
			array(
				'name'  => 'ink-band',
				'label' => __( 'Ink Band', 'artupski' ),
			)
		);

		// 2. Core Group: Dossier Box (Bordered paper box container).
		register_block_style(
			'core/group',
			array(
				'name'  => 'paper-boxed',
				'label' => __( 'Dossier Box', 'artupski' ),
			)
		);

		// 3. Core Heading: Numbered Label (IBM Plex Mono badge).
		register_block_style(
			'core/heading',
			array(
				'name'  => 'sec-num',
				'label' => __( 'Numbered Label', 'artupski' ),
			)
		);

		// 4. Core Paragraph: Editorial Lede (Enlarged Newsreader serif intro).
		register_block_style(
			'core/paragraph',
			array(
				'name'  => 'lede',
				'label' => __( 'Editorial Lede', 'artupski' ),
			)
		);

		// 5. Core Paragraph: Monospace Meta (IBM Plex Mono technical annotation).
		register_block_style(
			'core/paragraph',
			array(
				'name'  => 'mono-meta',
				'label' => __( 'Monospace Meta', 'artupski' ),
			)
		);

		// 6. Core Button: Technical Arrow Link.
		register_block_style(
			'core/button',
			array(
				'name'  => 'tlink',
				'label' => __( 'Dossier Link', 'artupski' ),
			)
		);
	}
}
