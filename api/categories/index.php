<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
require '../db_conn.php';
$_POST = json_decode(file_get_contents("php://input"), true);
$mount = $_GET['f'];
unset($_GET['f']);
$mount($con);

// ------------------------------- Add your functions below here ↓↓-----------------------------



//CRUD FOR Categories
function getAllCategories($con)
{
    integrity_check($con);

    $query = "select * from categories where is_deleted='0' ORDER BY id DESC";
    $result  = mysqli_query($con, $query);
    if (mysqli_affected_rows($con) != 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $resp['info'][] = $row;
        }
        $resp['status'] = 200;
        $resp['statusText'] = 'OK';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    } else {
        $resp['status'] = 404;
        $resp['statusText'] = 'Data not found';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    }
}

function addCategory($con)
{
    integrity_check($con);
    unset($_POST['api_key']);
    $post = sanitize($con, $_POST);
    $query = sprintf(
        'INSERT INTO categories (%s) VALUES ("%s")',
        implode(',', array_keys($post)),
        implode('","', array_values($post))
    );
    $result  = mysqli_query($con, $query);
    if ($result) {
        $resp['status'] = 200;
        $resp['statusText'] = 'OK';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    } else {
        $resp['status'] = 500;
        $resp['statusText'] = 'Internal server error';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    }
}

function deleteCategory($con)
{
    integrity_check($con);
    unset($_POST['api_key']);
    // $query = 'DELETE FROM categories WHERE id="'.$_POST['id'].'"';
    $query = 'UPDATE items SET is_deleted=1 WHERE category_id="' . $_POST['id'] . '"';
    $result  = mysqli_query($con, $query);
    if (mysqli_affected_rows($con)) {
        $query = 'UPDATE categories SET is_deleted=1 WHERE id="' . $_POST['id'] . '"';
        $result  = mysqli_query($con, $query);
        if (mysqli_affected_rows($con)) {
            $resp['status'] = 200;
            $resp['statusText'] = 'OK';
            $resp = json_encode($resp);
            echo $resp;
            exit;
        }else{
            $resp['status'] = 500;
            $resp['statusText'] = 'Internal server error';
            $resp = json_encode($resp);
            echo $resp;
            exit;
        }
        
    } else {
        $resp['status'] = 500;
        $resp['statusText'] = 'Internal server error';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    }
}

function toggleCategory($con)
{
    integrity_check($con);
    unset($_POST['api_key']);
    $query = 'UPDATE items SET in_stock="' . $_POST['toggle_to'] . '" WHERE id="' . $_POST['id'] . '"';
    $result  = mysqli_query($con, $query);
    if (mysqli_affected_rows($con)) {
        $resp['status'] = 200;
        $resp['statusText'] = 'OK';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    } else {
        $resp['status'] = 500;
        $resp['statusText'] = 'Internal server error';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    }
}

function getCategoryById($con)
{
    integrity_check($con);
    if (isset($_POST['id'])) {
        $query = "select id, category_name from categories where is_deleted='0' AND id='" . $_POST['id'] . "'";
        $result  = mysqli_query($con, $query);
        if (mysqli_affected_rows($con) != 0) {
            $resp['info'] = mysqli_fetch_assoc($result);
            $resp['status'] = 200;
            $resp['statusText'] = 'OK';
            $resp = json_encode($resp);
            echo $resp;
            exit;
        } else {
            $resp['status'] = 404;
            $resp['statusText'] = 'Data not found';
            $resp = json_encode($resp);
            echo $resp;
            exit;
        }
    } else {
        $resp['status'] = 404;
        $resp['statusText'] = 'Data not found';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    }
}

function updateCategory($con)
{
    integrity_check($con);
    unset($_POST['api_key']);
    $post = sanitize($con, $_POST);
    $uid = (int) $post['id'];
    unset($post['id']);
    $conds = [];
    foreach ($post as $column => $value) {
        $conds[] = "`{$column}` = '{$value}'";
    }
    $conds = implode(',', $conds);

    $query = "UPDATE categories SET " . $conds . " WHERE id=" . $uid;
    $result  = mysqli_query($con, $query);
    if ($result) {
        $resp['status'] = 200;
        $resp['statusText'] = 'OK';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    } else {
        $resp['status'] = 500;
        $resp['statusText'] = 'Internal server error';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    }
}


// ------------------------------- Add your functions above ↑↑----------------------------- //




// --------------------- Utility functions ------------------

function integrity_check($con)
{
    if ((isset($_POST['api_key']) && $_POST['api_key']) || (isset($_REQUEST['api_key']) && $_REQUEST['api_key'])) {
        if ((isset($_POST['api_key']))) {
            $key = mysqli_real_escape_string($con, $_POST['api_key']);
        } else {
            $key = mysqli_real_escape_string($con, $_REQUEST['api_key']);
        }
        $sql = "SELECT * FROM users WHERE api_key='$key'";
        $result = mysqli_query($con, $sql);
        $count = mysqli_num_rows($result);
        if (!$count) {
            $resp['status'] = 401;
            $resp['statusText'] = 'Unauthorized';
            $resp = json_encode($resp);
            echo $resp;
            exit;
        }
    } else {
        // http_response_code(400);
        $resp['status'] = 400;
        $resp['statusText'] = 'Bad request';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    }
}

function sanitize($con, $postData)
{
    $res = array();
    foreach ($postData as $key => $val) {
        $res[$key] = mysqli_real_escape_string($con, $val);
    }
    return $res;
}
