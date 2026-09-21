<?php
/**
 *
 * This file is part of HESK - PHP Help Desk Software.
 *
 * (c) Copyright Klemen Stirn. All rights reserved.
 * https://www.hesk.com
 *
 * For the full copyright and license agreement information visit
 * https://www.hesk.com/eula.php
 *
 */

define('IN_SCRIPT',1);
define('HESK_PATH','../../');

/* Get all the required files and functions */
require(HESK_PATH . 'hesk_settings.inc.php');
require(HESK_PATH . 'inc/common.inc.php');
require(HESK_PATH . 'inc/admin_functions.inc.php');
require_once(HESK_PATH . 'inc/customer_accounts.inc.php');
hesk_load_database_functions();

hesk_session_start();
hesk_dbConnect();
$hesk_settings['db_failure_response'] = 'json';
hesk_isLoggedIn();

$status = 'AVAILABLE';

//-- Grab search query params
$name = hesk_input(hesk_GET('name'));
$email = hesk_input(hesk_GET('email'));

$customer_creation = hesk_get_customer_creation_action($name, $email);

if ($customer_creation['action'] === 'BLOCK') {
    $is_customer_account = intval($customer_creation['customer']['verified']) > 0 ||
        (intval($customer_creation['customer']['verified']) === 0 && $customer_creation['customer']['verification_token'] !== null);
    $status = $is_customer_account ? 'NOT_AVAILABLE_REGISTERED' : 'NOT_AVAILABLE_IDENTICAL';
}

http_response_code(200);
print json_encode([
    'customerAvailable' => $status,
    'emailValid' => (empty($hesk_settings['require_email']) && $email === '' ? true : hesk_isValidEmail($email))
]);
exit();
