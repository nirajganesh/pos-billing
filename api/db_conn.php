<?php
date_default_timezone_set('Asia/Calcutta');
error_reporting(0);
$host     = "localhost";
$username = "root";
$password = "";
$db_name  = "react_pos";

$con      = mysqli_connect($host, $username, $password, $db_name);
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    $resp['status'] = 503;
    $resp['statusText'] = 'Gateway Timeout';
    $resp = json_encode($resp);
    echo $resp;
    exit;
}
