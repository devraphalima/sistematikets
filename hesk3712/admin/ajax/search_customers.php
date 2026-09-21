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
hesk_load_database_functions();

hesk_session_start();
hesk_dbConnect();
$hesk_settings['db_failure_response'] = 'json';
hesk_isLoggedIn();

header('Content-Type: application/json; charset='.$hesklang['ENCODING']);
header('X-Content-Type-Options: nosniff');

//-- Grab search query params
$query = hesk_dbEscape(hesk_dbLike(hesk_GET('query', '')));
$customers_table = "`".hesk_dbEscape($hesk_settings['db_pfix'])."customers`";

if (! empty($hesk_settings['customer_accounts'])) {
    // If exactly one account owns an email, show it. Hide ambiguous owner
    // emails; otherwise keep the newest identical ticket-only customer.
    $customer_filter = "
        AND (
            `primary`.`email` = ''
            OR (`primary`.`id` = (
                SELECT `owner`.`id`
                FROM {$customers_table} `owner`
                WHERE `owner`.`email` = `primary`.`email`
                    AND (`owner`.`verified` IN (1, 2)
                        OR (`owner`.`verified` = 0 AND `owner`.`verification_token` IS NOT NULL))
                ORDER BY CASE
                    WHEN `owner`.`verified` = 1 THEN 0
                    WHEN `owner`.`verified` = 2 THEN 1
                    ELSE 2
                END, `owner`.`id` DESC
                LIMIT 1
            )
            AND NOT EXISTS (
                SELECT 1
                FROM {$customers_table} `other_owner`
                WHERE `other_owner`.`email` = `primary`.`email`
                    AND `other_owner`.`id` <> `primary`.`id`
                    AND (`other_owner`.`verified` IN (1, 2)
                        OR (`other_owner`.`verified` = 0 AND `other_owner`.`verification_token` IS NOT NULL))
            ))
            OR (
                NOT EXISTS (
                    SELECT 1
                    FROM {$customers_table} `owner`
                    WHERE `owner`.`email` = `primary`.`email`
                        AND (`owner`.`verified` IN (1, 2)
                            OR (`owner`.`verified` = 0 AND `owner`.`verification_token` IS NOT NULL))
                )
                AND NOT EXISTS (
                    SELECT 1
                    FROM {$customers_table} `secondary`
                    WHERE `primary`.`email` <> ''
                        AND `primary`.`email` = `secondary`.`email`
                        AND `primary`.`name` = `secondary`.`name`
                        AND `secondary`.`id` > `primary`.`id`
                )
            )
        )";
} else {
    $customer_filter = "
        AND NOT EXISTS (
            SELECT 1
            FROM {$customers_table} `secondary`
            WHERE `primary`.`email` <> ''
                AND `primary`.`email` = `secondary`.`email`
                AND `primary`.`name` = `secondary`.`name`
                AND `secondary`.`id` > `primary`.`id`
        )";
}

$customers_rs = hesk_dbQuery("SELECT `id`, `name`, `email` FROM {$customers_table} `primary`
WHERE (`name` LIKE '%".$query."%' OR `email` LIKE '%".$query."%')
    AND `verified` <> 2
    {$customer_filter}
LIMIT 25");

$response_rows = [];
while ($row = hesk_dbFetchAssoc($customers_rs)) {
    $row['name'] = hesk_html_entity_decode($row['name']);
    $response_rows[] = [
        'id' => intval($row['id']),
        'name' => $row['name'],
        'email' => $row['email'],
        'displayName' => formatDisplayName($row)
    ];
}

if (defined('HESK_DEMO')) {
    array_walk($response_rows, function(&$k) {
        $k['email'] = 'hidden@demo.com';
        $k['displayName'] = formatDisplayName($k);
    });
}

http_response_code(200);
print json_encode($response_rows, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
exit();

function formatDisplayName($row) {
    if ($row['name']) {
        return $row['email'] ? "{$row['name']} <{$row['email']}>" : $row['name'];
    }

    return $row['email'];
}
