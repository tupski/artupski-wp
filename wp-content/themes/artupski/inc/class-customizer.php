<?php
/**
 * Theme Customizer registration and dynamic options management.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Artupski_Customizer
 *
 * Owns Customizer panel, section, control registration, and dynamic CSS output.
 */
class Artupski_Customizer {

	/**
	 * Allowed header layout choices.
	 *
	 * @var array
	 */
	const ALLOWED_HEADER_LAYOUTS = array( 'standard', 'centered', 'minimal' );

	/**
	 * Constructor. Hooks Customizer registration.
	 */
	public function __construct() {
		add_action( 'customize_register', array( $this, 'register' ) );
	}

	/**
	 * Register Customizer panel, section, and controls.
	 *
	 * @param WP_Customize_Manager $wp_customize Customizer manager instance.
	 * @return void
	 */
	public function register( $wp_customize ) {
		// 1. Panel: Artupski Theme Options.
		$wp_customize->add_panel(
			'artupski_theme_options',
			array(
				'title'       => __( 'Artupski Theme Options', 'artupski' ),
				'description' => __( 'Configure theme-level layout and header presentation options.', 'artupski' ),
				'priority'    => 30,
			)
		);

		// 2. Section: Header & Navigation.
		$wp_customize->add_section(
			'artupski_header',
			array(
				'title'    => __( 'Header & Navigation', 'artupski' ),
				'panel'    => 'artupski_theme_options',
				'priority' => 10,
			)
		);

		// 3. Exactly 5 Controls under artupski_header:

		// Control 1: Header Layout.
		$wp_customize->add_setting(
			'artupski_header_layout',
			array(
				'default'           => 'standard',
				'sanitize_callback' => array( $this, 'sanitize_header_layout' ),
				'transport'         => 'refresh',
			)
		);
		$wp_customize->add_control(
			'artupski_header_layout',
			array(
				'label'    => __( 'Header Layout Style', 'artupski' ),
				'section'  => 'artupski_header',
				'type'     => 'select',
				'choices'  => array(
					'standard' => __( 'Standard (Horizontal)', 'artupski' ),
					'centered' => __( 'Centered Stack', 'artupski' ),
					'minimal'  => __( 'Minimal', 'artupski' ),
				),
				'priority' => 10,
			)
		);

		// Control 2: Sticky Header.
		$wp_customize->add_setting(
			'artupski_header_sticky',
			array(
				'default'           => false,
				'sanitize_callback' => 'rest_sanitize_boolean',
				'transport'         => 'refresh',
			)
		);
		$wp_customize->add_control(
			'artupski_header_sticky',
			array(
				'label'    => __( 'Enable Sticky Header', 'artupski' ),
				'section'  => 'artupski_header',
				'type'     => 'checkbox',
				'priority' => 20,
			)
		);

		// Control 3: Wordmark Text.
		$wp_customize->add_setting(
			'artupski_wordmark_text',
			array(
				'default'           => '',
				'sanitize_callback' => 'sanitize_text_field',
				'transport'         => 'refresh',
			)
		);
		$wp_customize->add_control(
			'artupski_wordmark_text',
			array(
				'label'       => __( 'Custom Wordmark Text', 'artupski' ),
				'description' => __( 'Text wordmark when no custom logo is uploaded. Defaults to Site Title.', 'artupski' ),
				'section'     => 'artupski_header',
				'type'        => 'text',
				'priority'    => 30,
			)
		);

		// Control 4: Wordmark Accent.
		$wp_customize->add_setting(
			'artupski_wordmark_accent',
			array(
				'default'           => '',
				'sanitize_callback' => 'sanitize_text_field',
				'transport'         => 'refresh',
			)
		);
		$wp_customize->add_control(
			'artupski_wordmark_accent',
			array(
				'label'       => __( 'Wordmark Accent Text', 'artupski' ),
				'description' => __( 'Sub-string inside wordmark to highlight in accent crimson color.', 'artupski' ),
				'section'     => 'artupski_header',
				'type'        => 'text',
				'priority'    => 40,
			)
		);

		// Control 5: Navigation CTA Toggle.
		$wp_customize->add_setting(
			'artupski_menu_cta_show',
			array(
				'default'           => false,
				'sanitize_callback' => 'rest_sanitize_boolean',
				'transport'         => 'refresh',
			)
		);
		$wp_customize->add_control(
			'artupski_menu_cta_show',
			array(
				'label'    => __( 'Show Navigation Contact CTA', 'artupski' ),
				'section'  => 'artupski_header',
				'type'     => 'checkbox',
				'priority' => 50,
			)
		);
	}

	/**
	 * Whitelist sanitization callback for header layout choice.
	 *
	 * @param string $input Submitted layout value.
	 * @return string Validated layout string.
	 */
	public function sanitize_header_layout( $input ) {
		return in_array( $input, self::ALLOWED_HEADER_LAYOUTS, true ) ? $input : 'standard';
	}
}
