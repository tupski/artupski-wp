<?php
/**
 * 404 Error page template.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<div class="shell section page-404">
	<div class="error-404 not-found" data-reveal>
		<p class="eyebrow"><?php esc_html_e( 'Error 404', 'artupski' ); ?></p>
		<h1 class="page-title"><?php esc_html_e( 'Page Not Found', 'artupski' ); ?></h1>
		<div class="page-content dossier-prose">
			<p><?php esc_html_e( 'The requested page or document could not be located in the dossier database.', 'artupski' ); ?></p>
			<p>
				<a class="tlink" href="<?php echo esc_url( home_url( '/' ) ); ?>">
					<?php esc_html_e( 'Return to Home', 'artupski' ); ?>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</a>
			</p>
		</div>
	</div>
</div>

<?php
get_footer();
