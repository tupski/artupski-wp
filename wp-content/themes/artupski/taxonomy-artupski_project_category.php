<?php
/**
 * Taxonomy Archive for artupski_project_category.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

$current_term = get_queried_object();
$term_name    = $current_term ? $current_term->name : '';
$term_count   = $current_term ? $current_term->count : 0;
?>

<section class="page-hero" aria-labelledby="page-title">
	<div class="shell page-hero__grid">
		<div data-reveal>
			<p class="eyebrow"><?php esc_html_e( 'Category Archive', 'artupski' ); ?></p>
			<h1 id="page-title"><?php echo esc_html( $term_name ); ?></h1>
			<p class="lede page-hero__intro">
				<?php
				$term_desc = get_the_archive_description();
				if ( $term_desc ) {
					echo wp_kses_post( $term_desc );
				} else {
					printf(
						/* translators: %s: category name */
						esc_html__( 'Filtered project dossier records for discipline: %s.', 'artupski' ),
						esc_html( $term_name )
					);
				}
				?>
			</p>
		</div>
	</div>
</section>

<section class="section" aria-labelledby="category-projects-heading">
	<div class="shell">
		<div class="section-title-row" data-reveal>
			<div class="section-head">
				<span class="sec-num"><?php esc_html_e( 'Filtered Directory', 'artupski' ); ?></span>
				<h2 id="category-projects-heading"><?php echo esc_html( sprintf( __( 'Projects under %s', 'artupski' ), $term_name ) ); ?></h2>
			</div>
			<p class="meta"><?php printf( esc_html__( '%d Projects', 'artupski' ), $term_count ); ?></p>
		</div>

		<?php if ( have_posts() ) : ?>
			<div class="project-table-wrap" data-reveal style="margin-top:clamp(1.5rem,3vw,2.5rem)">
				<table class="project-table" aria-label="<?php esc_attr_e( 'Category Filtered Directory', 'artupski' ); ?>">
					<thead>
						<tr>
							<th scope="col"><?php esc_html_e( 'Project / Description', 'artupski' ); ?></th>
							<th scope="col"><?php esc_html_e( 'Discipline', 'artupski' ); ?></th>
							<th scope="col"><?php esc_html_e( 'Location', 'artupski' ); ?></th>
							<th scope="col"><?php esc_html_e( 'Year', 'artupski' ); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php
						while ( have_posts() ) :
							the_post();
							get_template_part( 'template-parts/components/project-row' );
						endwhile;
						?>
					</tbody>
				</table>
			</div>
			<?php get_template_part( 'template-parts/content/pagination' ); ?>
		<?php else : ?>
			<?php get_template_part( 'template-parts/content/content-none' ); ?>
		<?php endif; ?>
	</div>
</section>

<?php
get_footer();
