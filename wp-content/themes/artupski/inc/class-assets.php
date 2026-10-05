<?php
/**
 * Asset pipeline: styles, scripts and the locally bundled Turbo Drive.
 *
 * Build/source separation:
 *   source   -> wp-content/themes/artupski/assets/{css,js}/site.{css,js}
 *   built    -> wp-content/themes/artupski/assets/{css,js}/site.min.{css,js}
 * The unminified source is served while WP_DEBUG is enabled; otherwise the
 * minified build is served (falling back to source if a build is absent).
 *
 * Turbo is committed locally (`assets/js/vendor/turbo.esm.js`, pinned) and
 * imported by `site.js`. There is no runtime CDN request. Turbo is enabled by
 * default and is strictly progressive enhancement: if it is disabled or fails,
 * normal WordPress navigation keeps working.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Artupski_Assets
 */
class Artupski_Assets {

	/**
	 * Pinned Turbo version, vendored locally by `site.js`.
	 *
	 * @var string
	 */
	const TURBO_VERSION = '8.0.12';

	/**
	 * Constructor. Registers enqueue hooks.
	 */
	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
		add_filter( 'script_loader_tag', array( $this, 'add_module_type_attribute' ), 10, 3 );
	}

	/**
	 * Enqueue front-end styles and scripts.
	 *
	 * @return void
	 */
	public function enqueue_frontend_assets() {
		// 1. Google Fonts (Newsreader, Manrope, IBM Plex Mono).
		wp_enqueue_style(
			'artupski-fonts',
			'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap',
			array(),
			null
		);

		// 2. Production stylesheet (source while debugging, build otherwise).
		$css_file = $this->resolve_asset( 'assets/css/site.css', 'assets/css/site.min.css' );
		wp_enqueue_style(
			'artupski-site',
			ARTUPSKI_URI . '/' . $css_file,
			array(),
			ARTUPSKI_VERSION
		);

		// 3. JavaScript engine (ES module; imports the local Turbo bundle).
		$js_file = $this->resolve_asset( 'assets/js/site.js', 'assets/js/site.min.js' );
		wp_enqueue_script(
			'artupski-site',
			ARTUPSKI_URI . '/' . $js_file,
			array(),
			ARTUPSKI_VERSION,
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);

		// 4. Runtime settings consumed by site.js (Turbo enabled by default).
		$settings = array(
			'turboEnabled' => $this->is_turbo_enabled(),
			'turboVersion' => self::TURBO_VERSION,
		);
		wp_add_inline_script(
			'artupski-site',
			'window.artupskiSettings = ' . wp_json_encode( $settings ) . ';',
			'before'
		);

		/**
		 * Fires when front-end assets are enqueued.
		 *
		 * Child themes may use this to dequeue Turbo or add assets.
		 *
		 * @since 0.1.0
		 */
		do_action( 'artupski_enqueue_scripts' );
	}

	/**
	 * Whether Turbo Drive is enabled.
	 *
	 * Enabled by default. A Customizer control to toggle it is added in a later
	 * phase; the filter lets child themes disable it in the meantime.
	 *
	 * @return bool
	 */
	public function is_turbo_enabled() {
		$enabled = true;

		/**
		 * Filters whether the locally bundled Turbo Drive is enabled.
		 *
		 * @since 0.1.0
		 *
		 * @param bool $enabled Whether Turbo is enabled.
		 */
		return (bool) apply_filters( 'artupski_turbo_enabled', $enabled );
	}

	/**
	 * Resolve an asset path, preferring the built file outside of debug mode.
	 *
	 * @param string $source Relative source path.
	 * @param string $build  Relative built path.
	 * @return string Relative path to serve.
	 */
	private function resolve_asset( $source, $build ) {
		$use_source = ( defined( 'WP_DEBUG' ) && WP_DEBUG ) || ! file_exists( ARTUPSKI_DIR . '/' . $build );
		return $use_source ? $source : $build;
	}

	/**
	 * Load `site.js` as an ES module.
	 *
	 * @param string $tag    The script tag markup.
	 * @param string $handle The script handle.
	 * @param string $src    The script source URL.
	 * @return string
	 */
	public function add_module_type_attribute( $tag, $handle, $src ) {
		if ( 'artupski-site' === $handle ) {
			return '<script type="module" src="' . esc_url( $src ) . '" id="artupski-site-js"></script>';
		}
		return $tag;
	}
}
