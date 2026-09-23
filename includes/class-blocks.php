<?php
/**
 * Block registration.
 *
 * @package YoutubeVideoLoader
 */

namespace YoutubeVideoLoader;

defined( 'ABSPATH' ) || exit;

/**
 * Registers the plugin's block(s).
 */
class Blocks {

	/**
	 * Register every block that ships with this plugin.
	 *
	 * Bails out (with an admin notice) instead of fataling if the block
	 * hasn't been built yet — `register_block_type()` would otherwise
	 * throw on every page load, not just on activation.
	 *
	 * @return void
	 */
	public static function register() {
		$block_path = YTVL_PLUGIN_PATH . 'ytvl-block/build';

		if ( ! file_exists( $block_path . '/block.json' ) ) {
			add_action( 'admin_notices', array( __CLASS__, 'render_missing_build_notice' ) );
			return;
		}

		register_block_type( $block_path );
	}

	/**
	 * Tell the admin the block assets haven't been built.
	 *
	 * @return void
	 */
	public static function render_missing_build_notice() {
		printf(
			'<div class="notice notice-error"><p>%s</p></div>',
			esc_html__( 'YouTube Video Loader: block assets are missing. Run `npm run build` inside ytvl-block/ and reload.', 'youtube-video-loader' )
		);
	}
}
