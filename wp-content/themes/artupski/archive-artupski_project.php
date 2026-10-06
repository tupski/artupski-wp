<?php
/**
 * Artupski Project CPT Archive Template.
 *
 * Chronological register of completed works matching portfolio.html baseline.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

$total_projects = wp_count_posts( 'artupski_project' )->publish;
?>

<section class="page-hero" aria-labelledby="page-title">
	<div class="shell page-hero__grid">
		<div data-reveal>
			<p class="eyebrow"><?php esc_html_e( 'Portfolio', 'artupski' ); ?></p>
			<h1 id="page-title"><?php esc_html_e( 'Our Projects', 'artupski' ); ?></h1>
			<p class="lede page-hero__intro">
				<?php
				$archive_desc = get_the_archive_description();
				if ( $archive_desc ) {
					echo wp_kses_post( $archive_desc );
				} else {
					esc_html_e( 'A chronological record of project experience and completed works.', 'artupski' );
				}
				?>
			</p>
		</div>
		<div class="page-hero__media" data-reveal style="--reveal-delay:120ms">
			<?php
			$hero_img = get_theme_mod( 'artupski_portfolio_hero_image' );
			if ( $hero_img ) :
				?>
				<img src="<?php echo esc_url( $hero_img ); ?>" alt="<?php esc_attr_e( 'Projects hero view', 'artupski' ); ?>" width="1400" height="1050" fetchpriority="high" decoding="async" />
			<?php endif; ?>
		</div>
	</div>
</section>

<section class="section section--tight" aria-labelledby="overview-title">
	<div class="shell">
		<div class="section-title-row" data-reveal>
			<div class="section-head">
				<span class="sec-num"><?php esc_html_e( '01 / Overview', 'artupski' ); ?></span>
				<h2 id="overview-title"><?php esc_html_e( 'Project experience at a glance.', 'artupski' ); ?></h2>
			</div>
			<p class="meta"><?php esc_html_e( 'Archive Record', 'artupski' ); ?></p>
		</div>

		<div class="facts" style="margin-top:clamp(2rem,4vw,3rem)" data-reveal>
			<div class="fact">
				<span class="fact__num" data-reveal><?php echo esc_html( (string) $total_projects ); ?></span>
				<span class="fact__label"><?php esc_html_e( 'Listed projects', 'artupski' ); ?></span>
				<p class="fact__note"><?php esc_html_e( 'Unique projects recorded in the dossier database.', 'artupski' ); ?></p>
			</div>
		</div>
	</div>
</section>

<section class="section" aria-labelledby="register-title">
	<div class="shell">
		<div class="section-title-row" data-reveal>
			<div class="section-head">
				<span class="sec-num"><?php esc_html_e( '02 / Project Register', 'artupski' ); ?></span>
				<h2 id="register-title"><?php esc_html_e( 'Chronological project list.', 'artupski' ); ?></h2>
			</div>
			<p class="meta"><?php esc_html_e( 'All records', 'artupski' ); ?></p>
		</div>

		<?php if ( have_posts() ) : ?>
			<div class="project-table-wrap" data-reveal style="margin-top:clamp(1.5rem,3vw,2.5rem)">
				<table class="project-table" aria-label="<?php esc_attr_e( 'Projects Directory', 'artupski' ); ?>">
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
