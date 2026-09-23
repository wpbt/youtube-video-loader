<?php
/**
 * Plugin bootstrap.
 *
 * @package YoutubeVideoLoader
 */

namespace YoutubeVideoLoader;

defined( 'ABSPATH' ) || exit;

/**
 * Orchestrates plugin startup.
 */
class Plugin {

	/**
	 * Wire up everything the plugin needs. Called once from the main
	 * plugin file.
	 *
	 * @return void
	 */
	public static function boot() {
		add_action( 'init', array( Blocks::class, 'register' ) );
	}
}
