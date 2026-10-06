<?php
/**
 * Presentation Component: Project Row for Chronological Table Archive View
 *
 * @var array $args {
 *     @type int $post_id Post ID.
 * }
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$post_id  = ! empty( $args['post_id'] ) ? absint( $args['post_id'] ) : get_the_ID();
$meta     = artupski_get_project_meta( $post_id );
$title    = get_the_title( $post_id );
$link     = get_permalink( $post_id );
$location = ! empty( $meta['location'] ) ? $meta['location'] : '—';
$category = ! empty( $meta['categories'] ) ? implode( ', ', $meta['categories'] ) : '—';
$year     = ! empty( $meta['years'] ) ? implode( ', ', $meta['years'] ) : '';

if ( empty( $year ) ) {
	$year = get_the_date( 'Y', $post_id );
}
?>
<tr class="project-row" data-reveal>
	<td class="project-row__title">
		<a href="<?php echo esc_url( $link ); ?>"><?php echo esc_html( $title ); ?></a>
	</td>
	<td class="project-row__category"><?php echo esc_html( $category ); ?></td>
	<td class="project-row__location"><?php echo esc_html( $location ); ?></td>
	<td class="project-row__year"><?php echo esc_html( $year ); ?></td>
</tr>
