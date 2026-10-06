<?php
/**
 * Meta Boxes and Metadata Registration for Artupski Core.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Artupski_Meta_Boxes {

	/**
	 * Singleton instance.
	 *
	 * @var Artupski_Meta_Boxes|null
	 */
	private static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Artupski_Meta_Boxes
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
		add_action( 'init', array( $this, 'register_meta_fields' ), 20 );
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
		add_action( 'save_post', array( $this, 'save_meta_boxes' ), 10, 2 );
	}

	/**
	 * Register post meta with schemas and callbacks.
	 */
	public function register_meta_fields() {
		$auth_callback = function( $allowed, $meta_key, $post_id ) {
			return current_user_can( 'edit_post', $post_id );
		};

		// 1. Projects metadata
		register_post_meta(
			'artupski_project',
			'_artupski_project_location',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		register_post_meta(
			'artupski_project',
			'_artupski_project_client',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		register_post_meta(
			'artupski_project',
			'_artupski_project_scope',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		register_post_meta(
			'artupski_project',
			'_artupski_subtitle',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		register_post_meta(
			'artupski_project',
			'_artupski_architecture_style',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		register_post_meta(
			'artupski_project',
			'_artupski_area',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		register_post_meta(
			'artupski_project',
			'_artupski_status',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		register_post_meta(
			'artupski_project',
			'_artupski_client_testimonial',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'wp_kses_post',
			)
		);

		// Gallery Schema: Array of attachment IDs (integers)
		register_post_meta(
			'artupski_project',
			'_artupski_image_gallery',
			array(
				'show_in_rest'      => array(
					'schema' => array(
						'type'  => 'array',
						'items' => array(
							'type' => 'integer',
						),
					),
				),
				'single'            => true,
				'type'              => 'array',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => array( $this, 'sanitize_image_gallery' ),
			)
		);

		// Structural Specs Schema: Object / Array with explicit structure
		register_post_meta(
			'artupski_project',
			'_artupski_structural_specs',
			array(
				'show_in_rest'      => array(
					'schema' => array(
						'type'                 => 'object',
						'properties'           => array(
							'grid'          => array( 'type' => 'string' ),
							'height'        => array( 'type' => 'string' ),
							'materials'     => array( 'type' => 'string' ),
							'engineer'      => array( 'type' => 'string' ),
							'contractor'    => array( 'type' => 'string' ),
							'certification' => array( 'type' => 'string' ),
							'raw_notes'     => array( 'type' => 'string' ),
						),
						'additionalProperties' => false,
					),
				),
				'single'            => true,
				'type'              => 'object',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => array( $this, 'sanitize_structural_specs' ),
			)
		);

		// 2. Team metadata
		register_post_meta(
			'artupski_team',
			'_artupski_team_role',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		register_post_meta(
			'artupski_team',
			'_artupski_team_credentials',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		register_post_meta(
			'artupski_team',
			'_artupski_team_year_joined',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		register_post_meta(
			'artupski_team',
			'_artupski_bio',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'wp_kses_post',
			)
		);

		register_post_meta(
			'artupski_team',
			'_artupski_social_links',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_textarea_field',
			)
		);

		// 3. Service metadata
		register_post_meta(
			'artupski_service',
			'_artupski_service_index',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		register_post_meta(
			'artupski_service',
			'_artupski_service_icon',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		register_post_meta(
			'artupski_service',
			'_artupski_lead',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		register_post_meta(
			'artupski_service',
			'_artupski_deliverables',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => $auth_callback,
				'sanitize_callback' => 'wp_kses_post',
			)
		);
	}

	/**
	 * Sanitize image gallery meta value into array of attachment IDs.
	 *
	 * @param mixed $value Value to sanitize.
	 * @return array Array of attachment IDs.
	 */
	public function sanitize_image_gallery( $value ) {
		if ( is_string( $value ) ) {
			$value = array_filter( array_map( 'trim', explode( ',', $value ) ) );
		}

		if ( ! is_array( $value ) ) {
			return array();
		}

		$ids = array();
		foreach ( $value as $id ) {
			$clean = absint( $id );
			if ( $clean > 0 ) {
				$ids[] = $clean;
			}
		}

		return array_values( array_unique( $ids ) );
	}

	/**
	 * Sanitize structural specs meta value into structured object/array.
	 *
	 * @param mixed $value Value to sanitize.
	 * @return array Sanitized structural specs array.
	 */
	public function sanitize_structural_specs( $value ) {
		if ( is_string( $value ) ) {
			$decoded = json_decode( $value, true );
			if ( is_array( $decoded ) ) {
				$value = $decoded;
			} else {
				return array(
					'raw_notes' => wp_kses_post( $value ),
				);
			}
		}

		if ( ! is_array( $value ) ) {
			return array();
		}

		$allowed_keys = array( 'grid', 'height', 'materials', 'engineer', 'contractor', 'certification', 'raw_notes' );
		$clean        = array();

		foreach ( $value as $key => $val ) {
			$clean_key = sanitize_key( $key );
			if ( in_array( $clean_key, $allowed_keys, true ) && is_scalar( $val ) ) {
				$clean[ $clean_key ] = wp_kses_post( (string) $val );
			}
		}

		return $clean;
	}

	/**
	 * Register meta boxes for admin editing screens.
	 */
	public function add_meta_boxes() {
		add_meta_box(
			'artupski_project_specs',
			__( 'Project Dossier Specifications', 'artupski-core' ),
			array( $this, 'render_project_specs_meta_box' ),
			'artupski_project',
			'normal',
			'high'
		);

		add_meta_box(
			'artupski_team_specs',
			__( 'Leadership & Member Details', 'artupski-core' ),
			array( $this, 'render_team_specs_meta_box' ),
			'artupski_team',
			'normal',
			'high'
		);

		add_meta_box(
			'artupski_service_specs',
			__( 'Specialization Deliverables & Index', 'artupski-core' ),
			array( $this, 'render_service_specs_meta_box' ),
			'artupski_service',
			'normal',
			'high'
		);
	}

	/**
	 * Render Project Dossier Meta Box.
	 *
	 * @param WP_Post $post Current post object.
	 */
	public function render_project_specs_meta_box( $post ) {
		wp_nonce_field( 'artupski_save_project_data', 'artupski_project_nonce' );

		$subtitle           = get_post_meta( $post->ID, '_artupski_subtitle', true );
		$client             = get_post_meta( $post->ID, '_artupski_project_client', true );
		$location           = get_post_meta( $post->ID, '_artupski_project_location', true );
		$architecture_style = get_post_meta( $post->ID, '_artupski_architecture_style', true );
		$area               = get_post_meta( $post->ID, '_artupski_area', true );
		$status             = get_post_meta( $post->ID, '_artupski_status', true );
		$client_testimonial = get_post_meta( $post->ID, '_artupski_client_testimonial', true );

		$gallery_raw        = get_post_meta( $post->ID, '_artupski_image_gallery', true );
		$image_gallery      = is_array( $gallery_raw ) ? implode( ', ', $gallery_raw ) : (string) $gallery_raw;

		$specs_raw          = get_post_meta( $post->ID, '_artupski_structural_specs', true );
		$structural_specs   = is_array( $specs_raw ) ? wp_json_encode( $specs_raw, JSON_PRETTY_PRINT ) : (string) $specs_raw;
		?>
		<style>
			.artupski-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
			.artupski-field-full { margin-bottom: 16px; }
			.artupski-field label { display: block; font-weight: 600; margin-bottom: 4px; font-size: 13px; color: #16181c; }
			.artupski-field input[type="text"], .artupski-field textarea { width: 100%; box-sizing: border-box; }
			.artupski-field .description { font-size: 12px; color: #666; margin-top: 4px; }
		</style>
		<div class="artupski-meta-box">
			<div class="artupski-field-grid">
				<div class="artupski-field">
					<label for="artupski_subtitle"><?php esc_html_e( 'Subtitle / Secondary Descriptor', 'artupski-core' ); ?></label>
					<input type="text" id="artupski_subtitle" name="artupski_subtitle" value="<?php echo esc_attr( $subtitle ); ?>" placeholder="<?php esc_attr_e( 'e.g. Civil Engineering & Monolith Infrastructure', 'artupski-core' ); ?>" />
				</div>
				<div class="artupski-field">
					<label for="artupski_project_client"><?php esc_html_e( 'Client / Commissioning Authority', 'artupski-core' ); ?></label>
					<input type="text" id="artupski_project_client" name="artupski_project_client" value="<?php echo esc_attr( $client ); ?>" placeholder="<?php esc_attr_e( 'e.g. PT PLN (Persero)', 'artupski-core' ); ?>" />
				</div>
			</div>

			<div class="artupski-field-grid">
				<div class="artupski-field">
					<label for="artupski_project_location"><?php esc_html_e( 'Project Location', 'artupski-core' ); ?></label>
					<input type="text" id="artupski_project_location" name="artupski_project_location" value="<?php echo esc_attr( $location ); ?>" placeholder="<?php esc_attr_e( 'e.g. Jakarta Selatan', 'artupski-core' ); ?>" />
				</div>
				<div class="artupski-field">
					<label for="artupski_architecture_style"><?php esc_html_e( 'Architecture / Engineering Discipline', 'artupski-core' ); ?></label>
					<input type="text" id="artupski_architecture_style" name="artupski_architecture_style" value="<?php echo esc_attr( $architecture_style ); ?>" placeholder="<?php esc_attr_e( 'e.g. Brutalist Structuralism', 'artupski-core' ); ?>" />
				</div>
			</div>

			<div class="artupski-field-grid">
				<div class="artupski-field">
					<label for="artupski_area"><?php esc_html_e( 'Gross Floor / Site Area', 'artupski-core' ); ?></label>
					<input type="text" id="artupski_area" name="artupski_area" value="<?php echo esc_attr( $area ); ?>" placeholder="<?php esc_attr_e( 'e.g. 14,500 m²', 'artupski-core' ); ?>" />
				</div>
				<div class="artupski-field">
					<label for="artupski_status"><?php esc_html_e( 'Execution Status', 'artupski-core' ); ?></label>
					<input type="text" id="artupski_status" name="artupski_status" value="<?php echo esc_attr( $status ); ?>" placeholder="<?php esc_attr_e( 'e.g. Completed & Commissioned', 'artupski-core' ); ?>" />
				</div>
			</div>

			<div class="artupski-field-full artupski-field">
				<label for="artupski_image_gallery"><?php esc_html_e( 'Image Gallery IDs (comma-separated)', 'artupski-core' ); ?></label>
				<input type="text" id="artupski_image_gallery" name="artupski_image_gallery" value="<?php echo esc_attr( $image_gallery ); ?>" placeholder="<?php esc_attr_e( 'e.g. 101, 102, 103', 'artupski-core' ); ?>" />
				<p class="description"><?php esc_html_e( 'Comma-separated media attachment IDs used for project carousels.', 'artupski-core' ); ?></p>
			</div>

			<div class="artupski-field-full artupski-field">
				<label for="artupski_structural_specs"><?php esc_html_e( 'Structural Specifications / Blueprint Annotations (JSON or text)', 'artupski-core' ); ?></label>
				<textarea id="artupski_structural_specs" name="artupski_structural_specs" rows="4"><?php echo esc_textarea( $structural_specs ); ?></textarea>
				<p class="description"><?php esc_html_e( 'Technical blueprint details rendered in IBM Plex Mono annotation style.', 'artupski-core' ); ?></p>
			</div>

			<div class="artupski-field-full artupski-field">
				<label for="artupski_client_testimonial"><?php esc_html_e( 'Client Testimonial / Verification Statement', 'artupski-core' ); ?></label>
				<textarea id="artupski_client_testimonial" name="artupski_client_testimonial" rows="3"><?php echo esc_textarea( $client_testimonial ); ?></textarea>
			</div>
		</div>
		<?php
	}

	/**
	 * Render Leadership Team Member Meta Box.
	 *
	 * @param WP_Post $post Current post object.
	 */
	public function render_team_specs_meta_box( $post ) {
		wp_nonce_field( 'artupski_save_team_data', 'artupski_team_nonce' );

		$role         = get_post_meta( $post->ID, '_artupski_team_role', true );
		$credentials  = get_post_meta( $post->ID, '_artupski_team_credentials', true );
		$year_joined  = get_post_meta( $post->ID, '_artupski_team_year_joined', true );
		$bio          = get_post_meta( $post->ID, '_artupski_bio', true );
		$social_links = get_post_meta( $post->ID, '_artupski_social_links', true );
		?>
		<div class="artupski-meta-box">
			<div class="artupski-field-grid">
				<div class="artupski-field">
					<label for="artupski_team_role"><?php esc_html_e( 'Position / Role', 'artupski-core' ); ?></label>
					<input type="text" id="artupski_team_role" name="artupski_team_role" value="<?php echo esc_attr( $role ); ?>" placeholder="<?php esc_attr_e( 'e.g. President Director & Founder', 'artupski-core' ); ?>" />
				</div>
				<div class="artupski-field">
					<label for="artupski_team_credentials"><?php esc_html_e( 'Professional Credentials', 'artupski-core' ); ?></label>
					<input type="text" id="artupski_team_credentials" name="artupski_team_credentials" value="<?php echo esc_attr( $credentials ); ?>" placeholder="<?php esc_attr_e( 'e.g. Ir., S.T., M.T.', 'artupski-core' ); ?>" />
				</div>
			</div>

			<div class="artupski-field-grid">
				<div class="artupski-field">
					<label for="artupski_team_year_joined"><?php esc_html_e( 'Tenure / Year Founded', 'artupski-core' ); ?></label>
					<input type="text" id="artupski_team_year_joined" name="artupski_team_year_joined" value="<?php echo esc_attr( $year_joined ); ?>" placeholder="<?php esc_attr_e( 'e.g. Founded firm in 1992', 'artupski-core' ); ?>" />
				</div>
				<div class="artupski-field">
					<label for="artupski_social_links"><?php esc_html_e( 'Contact / Social Profile URL', 'artupski-core' ); ?></label>
					<input type="text" id="artupski_social_links" name="artupski_social_links" value="<?php echo esc_attr( $social_links ); ?>" placeholder="<?php esc_attr_e( 'https://linkedin.com/in/...', 'artupski-core' ); ?>" />
				</div>
			</div>

			<div class="artupski-field-full artupski-field">
				<label for="artupski_bio"><?php esc_html_e( 'Brief Monograph Biography', 'artupski-core' ); ?></label>
				<textarea id="artupski_bio" name="artupski_bio" rows="4"><?php echo esc_textarea( $bio ); ?></textarea>
			</div>
		</div>
		<?php
	}

	/**
	 * Render Specialization Service Meta Box.
	 *
	 * @param WP_Post $post Current post object.
	 */
	public function render_service_specs_meta_box( $post ) {
		wp_nonce_field( 'artupski_save_service_data', 'artupski_service_nonce' );

		$lead          = get_post_meta( $post->ID, '_artupski_lead', true );
		$service_index = get_post_meta( $post->ID, '_artupski_service_index', true );
		$service_icon  = get_post_meta( $post->ID, '_artupski_service_icon', true );
		$deliverables  = get_post_meta( $post->ID, '_artupski_deliverables', true );
		?>
		<div class="artupski-meta-box">
			<div class="artupski-field-grid">
				<div class="artupski-field">
					<label for="artupski_service_index"><?php esc_html_e( 'Section Index (e.g. 01, 02, 03)', 'artupski-core' ); ?></label>
					<input type="text" id="artupski_service_index" name="artupski_service_index" value="<?php echo esc_attr( $service_index ); ?>" placeholder="01" />
				</div>
				<div class="artupski-field">
					<label for="artupski_service_icon"><?php esc_html_e( 'Icon Identifier / Reference', 'artupski-core' ); ?></label>
					<input type="text" id="artupski_service_icon" name="artupski_service_icon" value="<?php echo esc_attr( $service_icon ); ?>" placeholder="drafting" />
				</div>
			</div>

			<div class="artupski-field-full artupski-field">
				<label for="artupski_lead"><?php esc_html_e( 'Discipline Lead / Overview Statement', 'artupski-core' ); ?></label>
				<input type="text" id="artupski_lead" name="artupski_lead" value="<?php echo esc_attr( $lead ); ?>" placeholder="<?php esc_attr_e( 'Core structural engineering capabilities.', 'artupski-core' ); ?>" />
			</div>

			<div class="artupski-field-full artupski-field">
				<label for="artupski_deliverables"><?php esc_html_e( 'Key Deliverables & Specifications', 'artupski-core' ); ?></label>
				<textarea id="artupski_deliverables" name="artupski_deliverables" rows="4"><?php echo esc_textarea( $deliverables ); ?></textarea>
			</div>
		</div>
		<?php
	}

	/**
	 * Save meta box data securely.
	 *
	 * @param int     $post_id Post ID.
	 * @param WP_Post $post    Post object.
	 */
	public function save_meta_boxes( $post_id, $post ) {
		// Prevent autosave overwrites.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		// Prevent revision saves.
		if ( wp_is_post_revision( $post_id ) ) {
			return;
		}

		// Check user permissions.
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		// 1. Project post type save.
		if ( 'artupski_project' === $post->post_type ) {
			if ( ! isset( $_POST['artupski_project_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['artupski_project_nonce'] ), 'artupski_save_project_data' ) ) {
				return;
			}

			$project_text_mappings = array(
				'artupski_subtitle'           => '_artupski_subtitle',
				'artupski_project_client'     => '_artupski_project_client',
				'artupski_project_location'   => '_artupski_project_location',
				'artupski_project_scope'      => '_artupski_project_scope',
				'artupski_architecture_style' => '_artupski_architecture_style',
				'artupski_area'               => '_artupski_area',
				'artupski_status'             => '_artupski_status',
			);

			foreach ( $project_text_mappings as $field => $meta_key ) {
				if ( isset( $_POST[ $field ] ) ) {
					update_post_meta( $post_id, $meta_key, sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) );
				}
			}

			if ( isset( $_POST['artupski_image_gallery'] ) ) {
				$val = $this->sanitize_image_gallery( wp_unslash( $_POST['artupski_image_gallery'] ) );
				update_post_meta( $post_id, '_artupski_image_gallery', $val );
			}

			if ( isset( $_POST['artupski_structural_specs'] ) ) {
				$val = $this->sanitize_structural_specs( wp_unslash( $_POST['artupski_structural_specs'] ) );
				update_post_meta( $post_id, '_artupski_structural_specs', $val );
			}

			if ( isset( $_POST['artupski_client_testimonial'] ) ) {
				update_post_meta( $post_id, '_artupski_client_testimonial', wp_kses_post( wp_unslash( $_POST['artupski_client_testimonial'] ) ) );
			}
		}

		// 2. Team post type save.
		if ( 'artupski_team' === $post->post_type ) {
			if ( ! isset( $_POST['artupski_team_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['artupski_team_nonce'] ), 'artupski_save_team_data' ) ) {
				return;
			}

			if ( isset( $_POST['artupski_team_role'] ) ) {
				update_post_meta( $post_id, '_artupski_team_role', sanitize_text_field( wp_unslash( $_POST['artupski_team_role'] ) ) );
			}

			if ( isset( $_POST['artupski_team_credentials'] ) ) {
				update_post_meta( $post_id, '_artupski_team_credentials', sanitize_text_field( wp_unslash( $_POST['artupski_team_credentials'] ) ) );
			}

			if ( isset( $_POST['artupski_team_year_joined'] ) ) {
				update_post_meta( $post_id, '_artupski_team_year_joined', sanitize_text_field( wp_unslash( $_POST['artupski_team_year_joined'] ) ) );
			}

			if ( isset( $_POST['artupski_social_links'] ) ) {
				update_post_meta( $post_id, '_artupski_social_links', sanitize_textarea_field( wp_unslash( $_POST['artupski_social_links'] ) ) );
			}

			if ( isset( $_POST['artupski_bio'] ) ) {
				update_post_meta( $post_id, '_artupski_bio', wp_kses_post( wp_unslash( $_POST['artupski_bio'] ) ) );
			}
		}

		// 3. Service post type save.
		if ( 'artupski_service' === $post->post_type ) {
			if ( ! isset( $_POST['artupski_service_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['artupski_service_nonce'] ), 'artupski_save_service_data' ) ) {
				return;
			}

			if ( isset( $_POST['artupski_lead'] ) ) {
				update_post_meta( $post_id, '_artupski_lead', sanitize_text_field( wp_unslash( $_POST['artupski_lead'] ) ) );
			}

			if ( isset( $_POST['artupski_service_index'] ) ) {
				update_post_meta( $post_id, '_artupski_service_index', sanitize_text_field( wp_unslash( $_POST['artupski_service_index'] ) ) );
			}

			if ( isset( $_POST['artupski_service_icon'] ) ) {
				update_post_meta( $post_id, '_artupski_service_icon', sanitize_text_field( wp_unslash( $_POST['artupski_service_icon'] ) ) );
			}

			if ( isset( $_POST['artupski_deliverables'] ) ) {
				update_post_meta( $post_id, '_artupski_deliverables', wp_kses_post( wp_unslash( $_POST['artupski_deliverables'] ) ) );
			}
		}
	}
}
