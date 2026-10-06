<?php
/**
 * Title: Fact Metric Bar
 * Slug: artupski/facts-bar
 * Categories: artupski-dossier
 * Description: Three-column metric stat row with oversized numbers, tracking labels, and descriptive notes.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:group {"className":"facts","layout":{"type":"grid","columnCount":3}} -->
<div class="wp-block-group facts" data-reveal>
	<div class="fact">
		<span class="fact__num" data-reveal>45</span>
		<span class="fact__label">Listed projects</span>
		<p class="fact__note">Unique projects recorded in the history below, after removing repeated entries.</p>
	</div>
	<div class="fact">
		<span class="fact__num" data-reveal>21</span>
		<span class="fact__label">Years on record</span>
		<p class="fact__note">Continuous contracting history spanning two decades of Indonesian infrastructure.</p>
	</div>
	<div class="fact">
		<span class="fact__num" data-reveal>30+</span>
		<span class="fact__label">Years in business</span>
		<p class="fact__note">Established in Jakarta in 1992 and still family-led today.</p>
	</div>
</div>
<!-- /wp:group -->
