<?php
/**
 * Generic pagination template part.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$pagination_links = paginate_links(
	array(
		'type'      => 'list',
		'prev_text' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg> ' . esc_html__( 'Previous', 'artupski' ),
		'next_text' => esc_html__( 'Next', 'artupski' ) . ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
	)
);

if ( $pagination_links ) :
	?>
	<nav class="pagination-wrapper" aria-label="<?php esc_attr_e( 'Posts navigation', 'artupski' ); ?>" data-reveal>
		<?php echo wp_kses_post( $pagination_links ); ?>
	</nav>
	<?php
endif;
