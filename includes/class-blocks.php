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
	 * @return void
	 */
	public static function register() {
		register_block_type( YTVL_PLUGIN_PATH . 'ytvl-block/build' );
	}
}
