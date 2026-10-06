<?php
/**
 * Title: Hero: Monograph Drafting
 * Slug: artupski/hero-drafting
 * Categories: artupski-dossier
 * Description: Monograph drafting hero with hand-drawn blueprint media, scrim overlay, and two-column grid.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:group {"tagName":"section","className":"hero","layout":{"type":"default"}} -->
<section class="wp-block-group hero">
	<div class="hero__media">
		<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"hero__img"} -->
		<figure class="wp-block-image hero__img"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/hero-drafting.jpg' ); ?>" alt="<?php esc_attr_e( 'Technical drafting by hand', 'artupski' ); ?>"/></figure>
		<!-- /wp:image -->
	</div>
	<div class="hero__scrim" aria-hidden="true"></div>
	<div class="shell hero__inner">
		<div class="hero__grid">
			<div data-reveal>
				<p class="eyebrow">EST. 1992 &middot; Jakarta &middot; Indonesia</p>
				<h1>PT. CONTRACTOR</h1>
				<p class="hero__tagline">Forward, Distinct, Reliable.</p>
			</div>
			<div class="hero__aside" data-reveal style="--reveal-delay:120ms">
				<p>An Indonesian construction, engineering and interior firm building for government, state electricity, plantation, industrial and property clients since 1992.</p>
				<a class="tlink" href="/about-us/">Read our story</a>
			</div>
		</div>
	</div>
</section>
<!-- /wp:group -->
