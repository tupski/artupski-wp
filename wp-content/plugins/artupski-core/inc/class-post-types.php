<?php
/**
 * Custom Post Types Registration for Artupski Core.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Artupski_Post_Types {

	/**
	 * Singleton instance.
	 *
	 * @var Artupski_Post_Types|null
	 */
	private static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Artupski_Post_Types
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
		add_action( 'init', array( $this, 'register_post_types' ), 10 );
	}

	/**
	 * Register all custom post types.
	 */
	public function register_post_types() {
		$this->register_project_cpt();
		$this->register_team_cpt();
		$this->register_service_cpt();
	}

	/**
	 * Register artupski_project post type.
	 */
	private function register_project_cpt() {
		$labels = array(
			'name'                  => _x( 'Projects & Portfolio', 'Post type general name', 'artupski-core' ),
			'singular_name'         => _x( 'Project Dossier', 'Post type singular name', 'artupski-core' ),
			'menu_name'             => _x( 'Projects', 'Admin Menu text', 'artupski-core' ),
			'name_admin_bar'        => _x( 'Project', 'Add New on Toolbar', 'artupski-core' ),
			'add_new'               => __( 'Add New', 'artupski-core' ),
			'add_new_item'          => __( 'Add New Project Dossier', 'artupski-core' ),
			'new_item'              => __( 'New Project', 'artupski-core' ),
			'edit_item'             => __( 'Edit Project Dossier', 'artupski-core' ),
			'view_item'             => __( 'View Project', 'artupski-core' ),
			'all_items'             => __( 'All Projects', 'artupski-core' ),
			'search_items'          => __( 'Search Projects', 'artupski-core' ),
			'parent_item_colon'     => __( 'Parent Projects:', 'artupski-core' ),
			'not_found'             => __( 'No projects found.', 'artupski-core' ),
			'not_found_in_trash'    => __( 'No projects found in Trash.', 'artupski-core' ),
			'featured_image'        => _x( 'Project Cover Image', 'Overrides the "Featured Image" phrase', 'artupski-core' ),
			'set_featured_image'    => _x( 'Set project cover image', 'Overrides the "Set featured image" phrase', 'artupski-core' ),
			'remove_featured_image' => _x( 'Remove project cover image', 'Overrides the "Remove featured image" phrase', 'artupski-core' ),
			'use_featured_image'    => _x( 'Use as project cover image', 'Overrides the "Use as featured image" phrase', 'artupski-core' ),
			'archives'              => _x( 'Project Archives', 'The post type archive label', 'artupski-core' ),
			'attributes'            => _x( 'Project Attributes', 'The post type attributes label', 'artupski-core' ),
			'insert_into_item'      => _x( 'Insert into project', 'Overrides the "Insert into post" phrase', 'artupski-core' ),
			'uploaded_to_this_item' => _x( 'Uploaded to this project', 'Overrides the "Uploaded to this post" phrase', 'artupski-core' ),
			'filter_items_list'     => _x( 'Filter projects list', 'Screen reader text for filter list', 'artupski-core' ),
			'items_list_navigation' => _x( 'Projects list navigation', 'Screen reader text for pagination', 'artupski-core' ),
			'items_list'            => _x( 'Projects list', 'Screen reader text for items list', 'artupski-core' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => true,
			'rewrite'            => array(
				'slug'       => 'projects/%artupski_project_year%',
				'with_front' => false,
			),
			'capability_type'    => 'post',
			'has_archive'        => 'projects',
			'hierarchical'       => false,
			'menu_position'      => 20,
			'menu_icon'          => 'dashicons-portfolio',
			'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'author', 'custom-fields' ),
			'taxonomies'         => array( 'artupski_project_category', 'artupski_project_year' ),
			'show_in_rest'       => true,
			'rest_base'          => 'artupski_project',
		);

		register_post_type( 'artupski_project', $args );
	}

	/**
	 * Register artupski_team post type.
	 */
	private function register_team_cpt() {
		$labels = array(
			'name'                  => _x( 'Leadership & Team', 'Post type general name', 'artupski-core' ),
			'singular_name'         => _x( 'Team Member', 'Post type singular name', 'artupski-core' ),
			'menu_name'             => _x( 'Team', 'Admin Menu text', 'artupski-core' ),
			'name_admin_bar'        => _x( 'Team Member', 'Add New on Toolbar', 'artupski-core' ),
			'add_new'               => __( 'Add New', 'artupski-core' ),
			'add_new_item'          => __( 'Add New Team Member', 'artupski-core' ),
			'new_item'              => __( 'New Team Member', 'artupski-core' ),
			'edit_item'             => __( 'Edit Team Member', 'artupski-core' ),
			'view_item'             => __( 'View Team Member', 'artupski-core' ),
			'all_items'             => __( 'All Team Members', 'artupski-core' ),
			'search_items'          => __( 'Search Team Members', 'artupski-core' ),
			'parent_item_colon'     => __( 'Parent Team Members:', 'artupski-core' ),
			'not_found'             => __( 'No team members found.', 'artupski-core' ),
			'not_found_in_trash'    => __( 'No team members found in Trash.', 'artupski-core' ),
			'featured_image'        => _x( 'Member Portrait', 'Overrides the "Featured Image" phrase', 'artupski-core' ),
			'set_featured_image'    => _x( 'Set member portrait', 'Overrides the "Set featured image" phrase', 'artupski-core' ),
			'remove_featured_image' => _x( 'Remove member portrait', 'Overrides the "Remove featured image" phrase', 'artupski-core' ),
			'use_featured_image'    => _x( 'Use as member portrait', 'Overrides the "Use as featured image" phrase', 'artupski-core' ),
			'attributes'            => _x( 'Team Member Attributes', 'The post type attributes label', 'artupski-core' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => false,
			'rewrite'            => false,
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'menu_position'      => 21,
			'menu_icon'          => 'dashicons-groups',
			'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'page-attributes', 'custom-fields' ),
			'show_in_rest'       => true,
			'rest_base'          => 'artupski_team',
		);

		register_post_type( 'artupski_team', $args );
	}

	/**
	 * Register artupski_service post type.
	 */
	private function register_service_cpt() {
		$labels = array(
			'name'                  => _x( 'Services & Specializations', 'Post type general name', 'artupski-core' ),
			'singular_name'         => _x( 'Specialization', 'Post type singular name', 'artupski-core' ),
			'menu_name'             => _x( 'Services', 'Admin Menu text', 'artupski-core' ),
			'name_admin_bar'        => _x( 'Service', 'Add New on Toolbar', 'artupski-core' ),
			'add_new'               => __( 'Add New', 'artupski-core' ),
			'add_new_item'          => __( 'Add New Specialization', 'artupski-core' ),
			'new_item'              => __( 'New Specialization', 'artupski-core' ),
			'edit_item'             => __( 'Edit Specialization', 'artupski-core' ),
			'view_item'             => __( 'View Specialization', 'artupski-core' ),
			'all_items'             => __( 'All Services', 'artupski-core' ),
			'search_items'          => __( 'Search Services', 'artupski-core' ),
			'parent_item_colon'     => __( 'Parent Services:', 'artupski-core' ),
			'not_found'             => __( 'No services found.', 'artupski-core' ),
			'not_found_in_trash'    => __( 'No services found in Trash.', 'artupski-core' ),
			'featured_image'        => _x( 'Service Image', 'Overrides the "Featured Image" phrase', 'artupski-core' ),
			'set_featured_image'    => _x( 'Set service image', 'Overrides the "Set featured image" phrase', 'artupski-core' ),
			'remove_featured_image' => _x( 'Remove service image', 'Overrides the "Remove featured image" phrase', 'artupski-core' ),
			'use_featured_image'    => _x( 'Use as service image', 'Overrides the "Use as featured image" phrase', 'artupski-core' ),
			'attributes'            => _x( 'Service Attributes', 'The post type attributes label', 'artupski-core' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => false,
			'rewrite'            => false,
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'menu_position'      => 22,
			'menu_icon'          => 'dashicons-hammer',
			'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'page-attributes', 'custom-fields' ),
			'show_in_rest'       => true,
			'rest_base'          => 'artupski_service',
		);

		register_post_type( 'artupski_service', $args );
	}
}
