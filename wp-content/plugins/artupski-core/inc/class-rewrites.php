<?php
/**
 * Custom Permalinks and Rewrites for Artupski Core.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Artupski_Rewrites {

	/**
	 * Singleton instance.
	 *
	 * @var Artupski_Rewrites|null
	 */
	private static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Artupski_Rewrites
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
		add_action( 'init', array( $this, 'register_rewrite_tags_and_rules' ), 1 );
		add_filter( 'post_type_link', array( $this, 'filter_project_permalink' ), 10, 2 );
	}

	/**
	 * Register rewrite tag and custom regex rules for projects.
	 */
	public function register_rewrite_tags_and_rules() {
		add_rewrite_tag( '%artupski_project_year%', '([^/]+)' );
		add_rewrite_rule( '^projects/([^/]+)/([^/]+)/?$', 'index.php?artupski_project=$matches[2]', 'top' );
	}

	/**
	 * Filter project permalink to replace %artupski_project_year% tag with term slug or fallback.
	 *
	 * @param string  $post_link The post's permalink.
	 * @param WP_Post $post      The post in question.
	 * @return string Filtered permalink.
	 */
	public function filter_project_permalink( $post_link, $post ) {
		if ( 'artupski_project' !== $post->post_type ) {
			return $post_link;
		}

		if ( false !== strpos( $post_link, '%artupski_project_year%' ) ) {
			$terms = get_the_terms( $post->ID, 'artupski_project_year' );
			$year_slug = 'unassigned';

			if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
				$year_slug = $terms[0]->slug;
			}

			$post_link = str_replace( '%artupski_project_year%', $year_slug, $post_link );
		}

		return $post_link;
	}
}
