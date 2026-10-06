<?php
/**
 * Custom Taxonomies Registration for Artupski Core.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Artupski_Taxonomies {

	/**
	 * Singleton instance.
	 *
	 * @var Artupski_Taxonomies|null
	 */
	private static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Artupski_Taxonomies
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
		add_action( 'init', array( $this, 'register_taxonomies' ), 5 );
	}

	/**
	 * Register project taxonomies.
	 */
	public function register_taxonomies() {
		$this->register_project_category();
		$this->register_project_year();
	}

	/**
	 * Register artupski_project_category (primary category taxonomy).
	 */
	private function register_project_category() {
		$labels = array(
			'name'                       => _x( 'Project Categories', 'taxonomy general name', 'artupski-core' ),
			'singular_name'              => _x( 'Project Category', 'taxonomy singular name', 'artupski-core' ),
			'search_items'               => __( 'Search Categories', 'artupski-core' ),
			'popular_items'              => __( 'Popular Categories', 'artupski-core' ),
			'all_items'                  => __( 'All Categories', 'artupski-core' ),
			'parent_item'                => __( 'Parent Category', 'artupski-core' ),
			'parent_item_colon'          => __( 'Parent Category:', 'artupski-core' ),
			'edit_item'                  => __( 'Edit Category', 'artupski-core' ),
			'update_item'                => __( 'Update Category', 'artupski-core' ),
			'add_new_item'               => __( 'Add New Category', 'artupski-core' ),
			'new_item_name'              => __( 'New Category Name', 'artupski-core' ),
			'separate_items_with_commas' => __( 'Separate categories with commas', 'artupski-core' ),
			'add_or_remove_items'        => __( 'Add or remove categories', 'artupski-core' ),
			'choose_from_most_used'      => __( 'Choose from the most used categories', 'artupski-core' ),
			'not_found'                  => __( 'No categories found.', 'artupski-core' ),
			'menu_name'                  => __( 'Categories', 'artupski-core' ),
		);

		$args = array(
			'hierarchical'          => true,
			'labels'                => $labels,
			'show_ui'               => true,
			'show_admin_column'     => true,
			'show_in_nav_menus'     => true,
			'show_tagcloud'         => true,
			'show_in_rest'          => true,
			'rest_base'             => 'artupski_project_category',
			'query_var'             => true,
			'rewrite'               => array(
				'slug'         => 'project-category',
				'with_front'   => false,
				'hierarchical' => true,
			),
		);

		register_taxonomy( 'artupski_project_category', array( 'artupski_project' ), $args );
	}

	/**
	 * Register artupski_project_year (non-hierarchical year taxonomy for archive/permalink).
	 */
	private function register_project_year() {
		$labels = array(
			'name'                       => _x( 'Project Years', 'taxonomy general name', 'artupski-core' ),
			'singular_name'              => _x( 'Project Year', 'taxonomy singular name', 'artupski-core' ),
			'search_items'               => __( 'Search Years', 'artupski-core' ),
			'popular_items'              => __( 'Popular Years', 'artupski-core' ),
			'all_items'                  => __( 'All Years', 'artupski-core' ),
			'edit_item'                  => __( 'Edit Year', 'artupski-core' ),
			'update_item'                => __( 'Update Year', 'artupski-core' ),
			'add_new_item'               => __( 'Add New Year', 'artupski-core' ),
			'new_item_name'              => __( 'New Year Name', 'artupski-core' ),
			'separate_items_with_commas' => __( 'Separate years with commas', 'artupski-core' ),
			'add_or_remove_items'        => __( 'Add or remove years', 'artupski-core' ),
			'choose_from_most_used'      => __( 'Choose from the most used years', 'artupski-core' ),
			'not_found'                  => __( 'No years found.', 'artupski-core' ),
			'menu_name'                  => __( 'Project Years', 'artupski-core' ),
		);

		$args = array(
			'hierarchical'          => false,
			'labels'                => $labels,
			'show_ui'               => true,
			'show_admin_column'     => true,
			'show_in_nav_menus'     => true,
			'show_tagcloud'         => true,
			'show_in_rest'          => true,
			'rest_base'             => 'artupski_project_year',
			'query_var'             => true,
			'rewrite'               => array(
				'slug'       => 'project-year',
				'with_front' => false,
			),
		);

		register_taxonomy( 'artupski_project_year', array( 'artupski_project' ), $args );
	}
}
