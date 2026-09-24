<?php
/**
 * Plugin Name:         YouTube Video Loader
 * Plugin URI:          #
 * Description:         Insert YouTube Videos Efficiently in your site.
 * Version:             1.0.0
 * Requires at least:   6.9
 * Requires PHP:        8.0
 * Author:              Bharat Thapa
 * Author URI:          https://bharatt.com.np
 * License:             GPL V3
 * License URI:         https://www.gnu.org/licenses/gpl-3.0.html
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License version 3, as published by the Free Software Foundation. You may NOT assume
 * that you can use any other version of the GPL.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package YoutubeVideoLoader
 */

defined( 'ABSPATH' ) || exit;

define( 'YTVL_PLUGIN_FILE', __FILE__ );
define( 'YTVL_VERSION', '1.0.0' );
define( 'YTVL_PLUGIN_BASENAME', plugin_basename( YTVL_PLUGIN_FILE ) );
define( 'YTVL_PLUGIN_PATH', dirname( YTVL_PLUGIN_FILE ) . '/' );
define( 'YTVL_PLUGIN_URL', plugins_url( '/', YTVL_PLUGIN_FILE ) );

require_once YTVL_PLUGIN_PATH . 'includes/class-plugin.php';
require_once YTVL_PLUGIN_PATH . 'includes/class-blocks.php';

add_action( 'plugins_loaded', array( '\YoutubeVideoLoader\Plugin', 'boot' ) );
