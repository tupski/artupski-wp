<?php
/**
 * Classic Editor compatibility, TinyMCE style formats, and selective shortcodes.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Artupski_Classic_Editor
 */
class Artupski_Classic_Editor {

	/**
	 * Constructor. Hooks TinyMCE styles, shortcodes, and formatting filters.
	 */
	public function __construct() {
		add_filter( 'mce_buttons_2', array( $this, 'add_tinymce_buttons' ) );
		add_filter( 'tiny_mce_before_init', array( $this, 'add_tinymce_styles' ) );

		add_shortcode( 'artupski_carousel', array( $this, 'render_carousel_shortcode' ) );
		add_shortcode( 'artupski_project_list', array( $this, 'render_project_list_shortcode' ) );
	}

	/**
	 * Ensure the Styles dropdown is available in TinyMCE toolbar row 2.
	 *
	 * @param array $buttons Array of TinyMCE button identifiers.
	 * @return array
	 */
	public function add_tinymce_buttons( $buttons ) {
		if ( ! in_array( 'styleselect', $buttons, true ) ) {
			array_unshift( $buttons, 'styleselect' );
		}
		return $buttons;
	}

	/**
	 * Register custom style formats for TinyMCE.
	 *
	 * @param array $settings TinyMCE init settings array.
	 * @return array
	 */
	public function add_tinymce_styles( $settings ) {
		$style_formats = array(
			array(
				'title'    => __( 'Dossier Eyebrow', 'artupski' ),
				'selector' => 'p',
				'classes'  => 'eyebrow',
			),
			array(
				'title'    => __( 'Editorial Lede', 'artupski' ),
				'selector' => 'p',
				'classes'  => 'lede',
			),
			array(
				'title'   => __( 'Monospace Metadata', 'artupski' ),
				'inline'  => 'span',
				'classes' => 'meta',
			),
			array(
				'title'    => __( 'Technical Arrow Link', 'artupski' ),
				'selector' => 'a',
				'classes'  => 'tlink',
			),
			array(
				'title'   => __( 'Ink Background Band', 'artupski' ),
				'block'   => 'div',
				'classes' => 'ink-band',
				'wrapper' => true,
			),
			array(
				'title'   => __( 'Boxed Rule Container', 'artupski' ),
				'block'   => 'div',
				'classes' => 'paper-boxed',
				'wrapper' => true,
			),
		);

		$settings['style_formats'] = wp_json_encode( $style_formats );
		return $settings;
	}

	/**
	 * Render [artupski_carousel] shortcode.
	 *
	 * Renders dynamic media-attachment data via template-parts/components/carousel.php.
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function render_carousel_shortcode( $atts ) {
		$parsed = shortcode_atts(
			array(
				'group'  => '',
				'ids'    => '',
				'title'  => '',
				'number' => '',
			),
			$atts,
			'artupski_carousel'
		);

		$ids_raw = array_filter( array_map( 'trim', explode( ',', (string) $parsed['ids'] ) ) );
		$items   = array();

		foreach ( $ids_raw as $id_str ) {
			$attachment_id = absint( $id_str );
			if ( ! $attachment_id ) {
				continue;
			}

			$title   = get_the_title( $attachment_id );
			$caption = wp_get_attachment_caption( $attachment_id );

			$items[] = array(
				'image_id' => $attachment_id,
				'title'    => $title ? $title : '',
				'subtitle' => $caption ? $caption : '',
				'link'     => '',
			);
		}

		if ( empty( $items ) ) {
			return '';
		}

		ob_start();
		get_template_part(
			'template-parts/components/carousel',
			null,
			array(
				'title'  => sanitize_text_field( $parsed['title'] ),
				'number' => sanitize_text_field( $parsed['number'] ),
				'items'  => $items,
			)
		);
		return (string) ob_get_clean();
	}

	/**
	 * Render [artupski_project_list] shortcode.
	 *
	 * Renders a dynamic query of artupski_project records via template-parts/components/project-row.php.
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function render_project_list_shortcode( $atts ) {
		$parsed = shortcode_atts(
			array(
				'category' => '',
				'year'     => '',
				'limit'    => 10,
			),
			$atts,
			'artupski_project_list'
		);

		$limit = absint( $parsed['limit'] );
		if ( $limit <= 0 ) {
			$limit = 10;
		}

		$query_args = array(
			'post_type'              => 'artupski_project',
			'post_status'            => 'publish',
			'posts_per_page'         => $limit,
			'no_found_rows'          => true,
			'update_post_meta_cache' => true,
			'update_post_term_cache' => true,
		);

		$tax_query = array();

		if ( ! empty( $parsed['category'] ) ) {
			$tax_query[] = array(
				'taxonomy' => 'artupski_project_category',
				'field'    => 'slug',
				'terms'    => sanitize_title( $parsed['category'] ),
			);
		}

		if ( ! empty( $parsed['year'] ) ) {
			$tax_query[] = array(
				'taxonomy' => 'artupski_project_year',
				'field'    => 'slug',
				'terms'    => sanitize_title( $parsed['year'] ),
			);
		}

		if ( count( $tax_query ) > 1 ) {
			$tax_query['relation'] = 'AND';
		}

		if ( ! empty( $tax_query ) ) {
			$query_args['tax_query'] = $tax_query;
		}

		$query = new WP_Query( $query_args );

		if ( ! $query->have_posts() ) {
			return '';
		}

		ob_start();
		?>
		<div class="project-table-wrap" data-reveal>
			<table class="project-table">
				<thead>
					<tr>
						<th scope="col"><?php esc_html_e( 'Project Name / Commission', 'artupski' ); ?></th>
						<th scope="col"><?php esc_html_e( 'Category', 'artupski' ); ?></th>
						<th scope="col"><?php esc_html_e( 'Location', 'artupski' ); ?></th>
						<th scope="col"><?php esc_html_e( 'Year', 'artupski' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php
					while ( $query->have_posts() ) {
						$query->the_post();
						get_template_part(
							'template-parts/components/project-row',
							null,
							array( 'post_id' => get_the_ID() )
						);
					}
					wp_reset_postdata();
					?>
				</tbody>
			</table>
		</div>
		<?php
		return (string) ob_get_clean();
	}

}
