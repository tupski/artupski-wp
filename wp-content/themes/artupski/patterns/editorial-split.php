<?php
/**
 * Title: Editorial Split
 * Slug: artupski/editorial-split
 * Categories: artupski-dossier
 * Description: Asymmetric two-column split with left sticky metadata label and right editorial reading flow.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:group {"className":"editorial"} -->
<div class="wp-block-group editorial">
	<div class="editorial__label" data-reveal>
		<span class="sec-num">01 / Company</span>
		<h2 class="visually-hidden"><?php esc_html_e( 'Company overview', 'artupski' ); ?></h2>
		<p class="meta">Who we are</p>
	</div>
	<div class="editorial__body flow" data-reveal>
		<p class="lede">Our firm delivers general procurement construction alongside engineering and interior services.</p>
		<p>Our company is supported by reliable, professional human resources, so we handle every engagement carefully and always prioritize client satisfaction.</p>
	</div>
</div>
<!-- /wp:group -->
