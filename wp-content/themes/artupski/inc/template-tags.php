<?php
/**
 * Custom template tags and helper functions for Artupski theme.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'artupski_current_year' ) ) {
	/**
	 * Current year, for the footer colophon.
	 *
	 * @return string Escaped four-digit year.
	 */
	function artupski_current_year() {
		return esc_html( gmdate( 'Y' ) );
	}
}

if ( ! function_exists( 'artupski_the_skip_link' ) ) {
	/**
	 * Render the accessible skip-to-content link.
	 *
	 * @return void
	 */
	function artupski_the_skip_link() {
		printf(
			'<a class="skip-link screen-reader-text" href="#main">%s</a>',
			esc_html__( 'Skip to content', 'artupski' )
		);
	}
}

if ( ! function_exists( 'artupski_get_project_meta' ) ) {
	/**
	 * Retrieve normalized project metadata array.
	 *
	 * @param int $post_id Post ID.
	 * @return array Normalized meta values.
	 */
	function artupski_get_project_meta( $post_id = 0 ) {
		$post_id = $post_id ? $post_id : get_the_ID();
		if ( ! $post_id ) {
			return array();
		}

		$location         = get_post_meta( $post_id, '_artupski_project_location', true );
		$client           = get_post_meta( $post_id, '_artupski_project_client', true );
		$scope            = get_post_meta( $post_id, '_artupski_project_scope', true );
		$subtitle         = get_post_meta( $post_id, '_artupski_subtitle', true );
		$style            = get_post_meta( $post_id, '_artupski_architecture_style', true );
		$area             = get_post_meta( $post_id, '_artupski_area', true );
		$status           = get_post_meta( $post_id, '_artupski_status', true );
		$testimonial      = get_post_meta( $post_id, '_artupski_client_testimonial', true );
		$gallery_ids      = get_post_meta( $post_id, '_artupski_image_gallery', true );
		$structural_specs = get_post_meta( $post_id, '_artupski_structural_specs', true );

		$categories = get_the_terms( $post_id, 'artupski_project_category' );
		$category_names = array();
		if ( ! empty( $categories ) && ! is_wp_error( $categories ) ) {
			foreach ( $categories as $cat ) {
				$category_names[] = $cat->name;
			}
		}

		$years = get_the_terms( $post_id, 'artupski_project_year' );
		$year_names = array();
		if ( ! empty( $years ) && ! is_wp_error( $years ) ) {
			foreach ( $years as $yr ) {
				$year_names[] = $yr->name;
			}
		}

		return array(
			'location'         => ! empty( $location ) ? $location : '',
			'client'           => ! empty( $client ) ? $client : '',
			'scope'            => ! empty( $scope ) ? $scope : '',
			'subtitle'         => ! empty( $subtitle ) ? $subtitle : '',
			'style'            => ! empty( $style ) ? $style : '',
			'area'             => ! empty( $area ) ? $area : '',
			'status'           => ! empty( $status ) ? $status : '',
			'testimonial'      => ! empty( $testimonial ) ? $testimonial : '',
			'gallery_ids'      => is_array( $gallery_ids ) ? array_map( 'absint', $gallery_ids ) : array(),
			'structural_specs' => is_array( $structural_specs ) ? $structural_specs : array(),
			'categories'       => $category_names,
			'category_terms'   => ( ! empty( $categories ) && ! is_wp_error( $categories ) ) ? $categories : array(),
			'years'            => $year_names,
			'year_terms'       => ( ! empty( $years ) && ! is_wp_error( $years ) ) ? $years : array(),
		);
	}
}

if ( ! function_exists( 'artupski_the_project_category' ) ) {
	/**
	 * Display or return primary category string.
	 *
	 * @param int  $post_id Post ID.
	 * @param bool $echo    Whether to echo or return.
	 * @return string|void Category name.
	 */
	function artupski_the_project_category( $post_id = 0, $echo = true ) {
		$post_id = $post_id ? $post_id : get_the_ID();
		$terms   = get_the_terms( $post_id, 'artupski_project_category' );

		if ( empty( $terms ) || is_wp_error( $terms ) ) {
			return '';
		}

		$first_cat = esc_html( $terms[0]->name );
		if ( $echo ) {
			echo $first_cat; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}
		return $first_cat;
	}
}

if ( ! function_exists( 'artupski_the_project_year' ) ) {
	/**
	 * Display or return project year string.
	 *
	 * @param int  $post_id Post ID.
	 * @param bool $echo    Whether to echo or return.
	 * @return string|void Year string.
	 */
	function artupski_the_project_year( $post_id = 0, $echo = true ) {
		$post_id = $post_id ? $post_id : get_the_ID();
		$terms   = get_the_terms( $post_id, 'artupski_project_year' );

		if ( empty( $terms ) || is_wp_error( $terms ) ) {
			return '';
		}

		$first_year = esc_html( $terms[0]->name );
		if ( $echo ) {
			echo $first_year; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}
		return $first_year;
	}
}

if ( ! class_exists( 'Artupski_Nav_Walker' ) ) {
	/**
	 * Custom Nav Walker to output editorial clean markup with data-nav-link attribute.
	 */
	class Artupski_Nav_Walker extends Walker_Nav_Menu {
		/**
		 * Starts the element output.
		 *
		 * @param string   $output Used to append additional content (passed by reference).
		 * @param WP_Post  $data_object Menu item data object.
		 * @param int      $depth Depth of menu item. Used for padding.
		 * @param stdClass $args An object of wp_nav_menu() arguments.
		 * @param int      $current_object_id Optional. ID of the current menu item.
		 */
		public function start_el( &$output, $data_object, $depth = 0, $args = null, $current_object_id = 0 ) {
			$item = $data_object;
			$classes = empty( $item->classes ) ? array() : (array) $item->classes;
			$is_current = in_array( 'current-menu-item', $classes, true ) || in_array( 'current_page_item', $classes, true );

			$url = ! empty( $item->url ) ? $item->url : '';
			$slug = sanitize_title( $item->title );
			if ( ! empty( $url ) ) {
				$path = wp_parse_url( $url, PHP_URL_PATH );
				if ( ! empty( $path ) ) {
					$slug = trim( $path, '/' );
					if ( empty( $slug ) ) {
						$slug = 'index.html';
					}
				}
			}

			$atts = array();
			$atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
			$atts['target'] = ! empty( $item->target ) ? $item->target : '';
			$atts['rel']    = ! empty( $item->xfn ) ? $item->xfn : '';
			$atts['href']   = ! empty( $item->url ) ? $item->url : '';
			$atts['data-nav-link'] = $slug;

			if ( $is_current ) {
				$atts['aria-current'] = 'page';
			}

			$attributes = '';
			foreach ( $atts as $attr => $value ) {
				if ( is_scalar( $value ) && '' !== $value && false !== $value ) {
					$value = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
					$attributes .= ' ' . $attr . '="' . $value . '"';
				}
			}

			$title = apply_filters( 'the_title', $item->title, $item->ID );
			$item_output = ( $args && isset( $args->before ) ) ? $args->before : '';
			$item_output .= '<a' . $attributes . '>';
			$item_output .= ( $args && isset( $args->link_before ) ) ? $args->link_before : '';
			$item_output .= esc_html( $title );
			$item_output .= ( $args && isset( $args->link_after ) ) ? $args->link_after : '';
			$item_output .= '</a>';
			$item_output .= ( $args && isset( $args->after ) ) ? $args->after : '';

			$output .= '<li>' . $item_output;
		}

		/**
		 * Ends the element output.
		 *
		 * @param string   $output Used to append additional content (passed by reference).
		 * @param WP_Post  $data_object Page data object. Not used.
		 * @param int      $depth Depth of page. Not Used.
		 * @param stdClass $args An object of wp_nav_menu() arguments.
		 */
		public function end_el( &$output, $data_object, $depth = 0, $args = null ) {
			$output .= "</li>\n";
		}
	}
}
