<?php
/**
 * Generic single post template.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<div class="shell single-post-area section">
	<?php
	while ( have_posts() ) :
		the_post();
		get_template_part( 'template-parts/content/content' );

		if ( comments_open() || get_comments_number() ) :
			comments_template();
		endif;
	endwhile;
	?>
</div>

<?php
get_footer();
