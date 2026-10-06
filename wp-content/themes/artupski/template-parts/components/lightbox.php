<?php
/**
 * Presentation Component: Lightbox Markup (Modal Container)
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="lightbox" data-lightbox role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Image viewer', 'artupski' ); ?>" hidden>
	<div class="lightbox__backdrop" data-lightbox-close tabindex="-1"></div>
	<div class="lightbox__dialog">
		<button class="lightbox__close" type="button" data-lightbox-close aria-label="<?php esc_attr_e( 'Close full image view', 'artupski' ); ?>">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke-linecap="round"/></svg>
		</button>
		<figure class="lightbox__figure">
			<img data-lightbox-image src="" alt="" />
			<figcaption data-lightbox-caption></figcaption>
		</figure>
	</div>
</div>
