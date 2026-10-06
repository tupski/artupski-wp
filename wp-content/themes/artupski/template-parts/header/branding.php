<?php
/**
 * Template part for site branding in header.
 *
 * @package Artupski
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$site_name        = get_bloginfo( 'name' );
$wordmark_custom  = get_theme_mod( 'artupski_wordmark_text', '' );
$wordmark_accent  = get_theme_mod( 'artupski_wordmark_accent', '' );
$header_layout    = get_theme_mod( 'artupski_header_layout', 'standard' );

$wordmark_display = ! empty( $wordmark_custom ) ? $wordmark_custom : $site_name;

$branding_classes = array( 'site-branding' );
if ( ! empty( $header_layout ) ) {
	$branding_classes[] = 'site-branding--' . sanitize_html_class( $header_layout );
}
?>
<div class="<?php echo esc_attr( implode( ' ', $branding_classes ) ); ?>">
	<?php if ( has_custom_logo() ) : ?>
		<?php the_custom_logo(); ?>
	<?php else : ?>
		<a class="brand no-select" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" aria-label="<?php echo esc_attr( $wordmark_display ); ?>, home">
			<span class="wordmark">
				<?php
				if ( ! empty( $wordmark_accent ) && false !== mb_stripos( $wordmark_display, $wordmark_accent ) ) {
					$accent_pos = mb_stripos( $wordmark_display, $wordmark_accent );
					$before     = mb_substr( $wordmark_display, 0, $accent_pos );
					$match      = mb_substr( $wordmark_display, $accent_pos, mb_strlen( $wordmark_accent ) );
					$after      = mb_substr( $wordmark_display, $accent_pos + mb_strlen( $wordmark_accent ) );

					echo esc_html( $before );
					echo '<span>' . esc_html( $match ) . '</span>';
					echo esc_html( $after );
				} else {
					echo esc_html( $wordmark_display );
				}
				?>
			</span>
		</a>
	<?php endif; ?>
</div>
