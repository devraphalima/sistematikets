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

header('Content-Type: application/json; charset='.$hesklang['ENCODING']);
header('X-Content-Type-Options: nosniff');

if ( defined('HESK_DEMO') )
{
    http_response_code(400);
    print json_encode([
        'message' => $hesklang['ddemo']
    ]);
    exit();
}

// A security check
if ( ! hesk_token_check('POST', 0))
{
    http_response_code(403);
    print json_encode([
        'message' => $hesklang['eto']
    ]);
    exit();
}

//-- Grab search query params
$name = hesk_prepare_customer_name(hesk_input(hesk_POST('name')));
$email = hesk_input(hesk_POST('email'));
$password = hesk_input(hesk_POST('password'));
$import = hesk_POST('import') == 1;
$finish_import = hesk_POST('finish_import') == 1;
$strict_creation = $password !== '' || $import;
$elevated = hesk_SESSION('elevated') && hesk_SESSION('elevated') >= new DateTime();
$import_token = hesk_input(hesk_POST('import_token'));
$stored_import_token = hesk_SESSION('customer_import_token');
$import_token_expires = hesk_SESSION('customer_import_token_expires');
$import_token_matches = $import_token !== '' && is_string($stored_import_token) &&
    hash_equals($stored_import_token, $import_token);
$import_authorized = $import && $import_token_matches &&
    ((!empty($import_token_expires) && $import_token_expires >= time()) || (empty($import_token_expires) && $elevated));

if ($finish_import) {
    if ($import_token_matches) {
        unset($_SESSION['customer_import_token'], $_SESSION['customer_import_token_expires']);
    }
    print json_encode(['success' => 1]);
    exit();
}

if ($strict_creation && empty($hesk_settings['customer_accounts'])) {
    http_response_code(400);
    print json_encode([
        'code' => 'CUSTOMER_ACCOUNTS_DISABLED',
        'message' => $hesklang['customer_accounts_disabled']
    ]);
    exit();
}

if ($strict_creation && !hesk_checkPermission('can_man_customers', 0)) {
    http_response_code(403);
    print json_encode([
        'code' => 'PERMISSION_DENIED',
        'message' => $hesklang['no_permission']
    ]);
    exit();
}

if ($import && !$import_authorized) {
    http_response_code(403);
    print json_encode([
        'code' => 'IMPORT_AUTHORIZATION_EXPIRED',
        'message' => $hesklang['elevator_enter_password']
    ]);
    exit();
} elseif ($password !== '' && !$elevated) {
    http_response_code(403);
    print json_encode([
        'code' => 'ELEVATION_REQUIRED',
        'message' => $hesklang['no_permission']
    ]);
    exit();
}

$name = hesk_has_visible_customer_content($name) ? $name : '';
$email = hesk_has_visible_customer_content($email) ? $email : '';

if (($import && $name === '' && $email === '') || (!$import && $name === '')) {
    http_response_code(400);
    print json_encode([
        'message' => $import ? $hesklang['import_customer_name_or_email_required'] : $hesklang['enter_real_name']
    ]);
    exit();
}

if ($import) {
    if (empty($import_token_expires)) {
        $current_time = new DateTime();
        $maximum_expiration = clone $current_time;
        $maximum_expiration->add(new DateInterval('PT2H'));
        $interval_amount = $hesk_settings['elevator_duration'];
        if (in_array(substr($interval_amount, -1), array('M', 'H'))) {
            $interval_amount = 'T'.$interval_amount;
        }
        $import_expiration = $current_time->add(new DateInterval("P{$interval_amount}"));
        $_SESSION['customer_import_token_expires'] = min($import_expiration->getTimestamp(), $maximum_expiration->getTimestamp());
    }
}

if ($password !== '' && strlen($password) < 5) {
    http_response_code(400);
    print json_encode([
        'message' => $hesklang['password_not_valid']
    ]);
    exit();
}

if (($hesk_settings['require_email'] || $email !== '') && !hesk_isValidEmail($email)) {
    http_response_code(400);
    print json_encode([
        'message' => $hesklang['enter_valid_email']
    ]);
    exit();
}
$customer_creation = hesk_get_customer_creation_action($name, $email, $strict_creation);

if ($customer_creation['action'] === 'BLOCK') {
    http_response_code(400);
    print json_encode([
        'message' => empty($email) ? $hesklang['customer_name_with_no_email_exists'] : $hesklang['customer_name_email_exists']
    ]);
    exit();
}

if ($customer_creation['action'] === 'REUSE') {
    $customer_id = $customer_creation['customer']['id'];
    $name = $customer_creation['customer']['name'];
    $email = $customer_creation['customer']['email'];
    http_response_code(200);
} else {
    $hashed_password = 'NULL';
    $verified = 0;

    if ($password !== '') {
        $hashed_password = "'".hesk_dbEscape(hesk_password_hash($password))."'";
        $verified = 1;
    }

    hesk_dbQuery("INSERT INTO `".hesk_dbEscape($hesk_settings['db_pfix'])."customers` (`name`, `email`, `pass`, `verified`)
    VALUES ('".hesk_dbEscape($name)."', '".hesk_dbEscape($email)."', {$hashed_password}, ".intval($verified).")");
    $customer_id = hesk_dbInsertID();
    http_response_code(201);
}
$name = hesk_html_entity_decode(hesk_stripslashes($name));
print json_encode([
    'id' => intval($customer_id),
    'name' => $name,
    'email' => $email,
    'displayName' => $email ? "{$name} <{$email}>" : $name
], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
exit();
