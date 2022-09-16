<?php
require '../db_conn.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$_POST = json_decode(file_get_contents("php://input"), true);
$mount = $_GET['f'];
unset($_GET['f']);
$mount($con);

// ------------------------------- Add your functions below here ↓↓-----------------------------



function login($con)
{
    $post = sanitize($con, $_POST);
    $sql = "SELECT * FROM users WHERE uname='$post[uname]' and passkey='$post[pwd]'";
    $result = mysqli_query($con, $sql);
    $count = mysqli_num_rows($result);
    if ($count > 0) {
        $info = mysqli_fetch_assoc($result);
        if ($info['is_active'] == 1) {
            unset($info['created_at']);
            unset($info['updated_at']);
            unset($info['is_active']);
            unset($info['passkey']);
            $resp['status'] = 200;
            $resp['statusText'] = 'OK';
            $resp['info'] = $info;
            $resp = json_encode($resp);
            echo $resp;
            exit;
        } else {
            $info = mysqli_fetch_assoc($result);
            $resp['status'] = 403;
            $resp['statusText'] = 'Forbidden';
            $resp = json_encode($resp);
            echo $resp;
            exit;
        }
    } else {
        $resp['status'] = 401;
        $resp['statusText'] = 'Unauthorized';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    }
}

// FOR SALE/BILLING
function getPOSItems($con)
{
    integrity_check($con);

    // $query = "select id, name, category_id, selling_price AS price, img_src AS image from items where is_deleted='0' AND in_stock='1' ORDER BY id DESC";
    $query = "SELECT i.id, i.name, i.category_id, i.selling_price AS price, i.img_src AS image, c.category_name  
                FROM items i LEFT JOIN categories c  
                ON i.category_id=c.id 
                WHERE i.is_deleted='0' AND i.in_stock='1' 
                ORDER BY i.id DESC";
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

function addSale($con)
{
    integrity_check($con);
    $items = $_POST['items'];
    unset($_POST['items']);
    $post = sanitize($con, $_POST);
    unset($post['api_key']);
    // print_r($items);exit;
    if ($post['newCust']) {
        $newID = '';

        $query = "select * from customers where is_deleted='0' AND contact='" . $post['newCustContact'] . "'";
        $result  = mysqli_query($con, $query);
        if (mysqli_affected_rows($con) != 0) {
            $cid = mysqli_fetch_assoc($result);
            $newID = $cid['id'];
        } else {
            $query = sprintf('INSERT INTO customers (name, contact) VALUES ("%s","%s")', $post['newCustName'], $post['newCustContact']);
            $result  = mysqli_query($con, $query);
            if (!mysqli_insert_id($con)) {
                $resp['status'] = 500;
                $resp['statusText'] = 'Internal server error in adding customer';
                $resp = json_encode($resp);
                echo $resp;
                exit;
            }
            $newID = mysqli_insert_id($con);
        }

        $post['customer_id'] = $newID;
        unset($post['newCustContact']);
        unset($post['newCustName']);
        unset($post['newCust']);
    } else {
        unset($post['newCust']);
    }
    $query = sprintf(
        'INSERT INTO sales (%s) VALUES ("%s")',
        implode(',', array_keys($post)),
        implode('","', array_values($post))
    );
    $result  = mysqli_query($con, $query);
    if ($result) {
        $sale_id = mysqli_insert_id($con);
        foreach ($items as $x) {
            $query = 'INSERT INTO sales_items (sale_id, item_id, selling_price, qty) VALUES ("' . $sale_id . '", "' . $x['id'] . '", "' . $x['price'] . '", "' . $x['qty'] . '")';
            $result  = mysqli_query($con, $query);
        }

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


//CRUD FOR PRODUCTS/ITEMS 
function getAllItems($con)
{
    integrity_check($con);

    $query = "SELECT c.category_name, i.id, i.name, i.cost_price AS cp, i.selling_price AS sp, i.img_src AS image, i.in_stock, i.created_at 
    FROM items i LEFT JOIN categories c 
    ON i.category_id=c.id 
    WHERE i.is_deleted='0' 
    ORDER BY i.id DESC";
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

function addItem($con)
{
    // Uses $_REQUEST instead of $_POST
    integrity_check($con);
    unset($_REQUEST['api_key']);
    unset($_REQUEST['img']);
    unset($_REQUEST['f']);
    $post = sanitize($con, $_REQUEST);
    if ($_FILES['img']) {
        $upload_dir = '../../public/images/';
        $file_name = $_FILES["img"]["name"];
        $file_tmp_name = $_FILES["img"]["tmp_name"];
        $error = $_FILES["img"]["error"];
        if ($error > 0) {
            $resp['status'] = 500;
            $resp['statusText'] = 'Image error';
            $resp = json_encode($resp);
            echo $resp;
            exit;
        } else {
            $random_name = rand(1000, 1000000) . "-" . $file_name;
            $upload_name = $upload_dir . strtolower($random_name);
            $upload_name = preg_replace('/\s+/', '-', $upload_name);
            $db_img_name = strtolower($random_name);
            $db_img_name = preg_replace('/\s+/', '-', $db_img_name);

            if (move_uploaded_file($file_tmp_name, $upload_name)) {
                $post['img_src'] = $db_img_name;
            } else {
                $resp['status'] = 500;
                $resp['statusText'] = 'Image error';
                $resp = json_encode($resp);
                echo $resp;
                exit;
            }
        }
    }
    $query = sprintf(
        'INSERT INTO items (%s) VALUES ("%s")',
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

function deleteItem($con)
{
    integrity_check($con);
    unset($_POST['api_key']);
    // $query = 'DELETE FROM items WHERE id="'.$_POST['id'].'"';
    $query = 'UPDATE items SET is_deleted=1 WHERE id="' . $_POST['id'] . '"';
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

function toggleItemInStock($con)
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

function getItemById($con)
{
    integrity_check($con);
    if (isset($_POST['id'])) {
        $query = "select id, name, cost_price AS cp, selling_price AS sp, img_src AS image, category_id from items where is_deleted='0' AND id='" . $_POST['id'] . "'";
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

function updateItem($con)
{
    // Uses $_REQUEST instead of $_POST
    integrity_check($con);
    unset($_REQUEST['api_key']);
    unset($_REQUEST['img']);
    unset($_REQUEST['f']);
    $post = sanitize($con, $_REQUEST);
    $uid = (int) $post['id'];
    unset($post['id']);
    $conds = [];
    if ($_FILES['img']) {
        $upload_dir = '../../public/images/';
        $file_name = $_FILES["img"]["name"];
        $file_tmp_name = $_FILES["img"]["tmp_name"];
        $error = $_FILES["img"]["error"];
        if ($error > 0) {
            $resp['status'] = 500;
            $resp['statusText'] = 'Image error';
            $resp = json_encode($resp);
            echo $resp;
            exit;
        } else {
            $random_name = rand(1000, 1000000) . "-" . $file_name;
            $upload_name = $upload_dir . strtolower($random_name);
            $upload_name = preg_replace('/\s+/', '-', $upload_name);
            $db_img_name = strtolower($random_name);
            $db_img_name = preg_replace('/\s+/', '-', $db_img_name);

            if (move_uploaded_file($file_tmp_name, $upload_name)) {
                $post['img_src'] = $db_img_name;
            } else {
                $resp['status'] = 500;
                $resp['statusText'] = 'Image error';
                $resp = json_encode($resp);
                echo $resp;
                exit;
            }
        }
    }

    foreach ($post as $column => $value) {
        $conds[] = "`{$column}` = '{$value}'";
    }
    $conds = implode(',', $conds);

    // echo '<pre>';
    // print_r($conds);
    // exit;
    $query = "UPDATE items SET " . $conds . " WHERE id=" . $uid;
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


//CRUD FOR CUSTOMERS 
function getCustomers($con)
{
    integrity_check($con);

    $query = "select * from customers where is_deleted='0' ORDER BY id DESC";
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

function addCustomer($con)
{
    integrity_check($con);
    unset($_POST['api_key']);
    $post = sanitize($con, $_POST);

    $query = "select * from customers where is_deleted='0' AND contact='" . $post['contact'] . "'";
    $result  = mysqli_query($con, $query);
    if (mysqli_affected_rows($con) != 0) {
        $resp['status'] = 409;
        $resp['statusText'] = 'Already exists';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    } else {
        $query = sprintf(
            'INSERT INTO customers (%s) VALUES ("%s")',
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
}

function deleteCustomer($con)
{
    integrity_check($con);
    unset($_POST['api_key']);
    // $query = 'DELETE FROM items WHERE id="'.$_POST['id'].'"';
    $query = 'UPDATE customers SET is_deleted=1 WHERE id="' . $_POST['id'] . '"';
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

function getCustomerById($con)
{
    integrity_check($con);
    if (isset($_POST['id'])) {
        $query = "select address, contact, name, created_at from customers where is_deleted='0' AND id='" . $_POST['id'] . "'";
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

function updateCustomer($con)
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

    // echo '<pre>';
    // print_r($conds);
    // exit;
    $query = "select * from customers where is_deleted='0' AND contact='" . $post['contact'] . "'";
    $result  = mysqli_query($con, $query);
    if (mysqli_affected_rows($con) != 0) {
        $resp['status'] = 409;
        $resp['statusText'] = 'Already exists';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    } else {
        $query = "UPDATE customers SET " . $conds . " WHERE id=" . $uid;
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
}


//CRUD FOR SALES 
function getAllSales($con)
{
    integrity_check($con);

    $query = 'SELECT c.name, c.contact, s.*
    FROM sales s, customers c
    WHERE s.customer_id = c.id AND s.is_deleted="0"
    ORDER BY id DESC';
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

function deleteSale($con)
{
    integrity_check($con);
    unset($_POST['api_key']);
    // $query = 'DELETE FROM items WHERE id="'.$_POST['id'].'"';
    $query = 'UPDATE sales SET is_deleted=1 WHERE id="' . $_POST['id'] . '"';
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

function getSaleDetails($con)
{
    integrity_check($con);

    $query = 'SELECT c.name, c.contact, s.*
    FROM sales s, customers c
    WHERE s.customer_id = c.id AND s.is_deleted="0" AND s.id="' . $_POST['id'] . '"';
    $result  = mysqli_query($con, $query);
    if (mysqli_affected_rows($con) != 0) {
        $resp['info']['sale'] =  mysqli_fetch_assoc($result);
        $resp['info']['saleItems'] = [];

        $query = 'SELECT c.category_name, si.*, i.name
        FROM sales_items si, categories c, items i
        WHERE si.sale_id = ' . $resp['info']['sale']['id'] . ' AND i.category_id=c.id AND si.item_id=i.id';
        $result  = mysqli_query($con, $query);
        if (mysqli_affected_rows($con) != 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $resp['info']['saleItems'][] =  $row;
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
    } else {
        $resp['status'] = 404;
        $resp['statusText'] = 'Data not found';
        $resp = json_encode($resp);
        echo $resp;
        exit;
    }
}


//CRUD FOR ON HOLD SALES 
function addOnHoldSale($con)
{
    integrity_check($con);
    $items = $_POST['items'];
    unset($_POST['items']);
    $post = sanitize($con, $_POST);
    unset($post['api_key']);
    // print_r($post);exit;
    $query = sprintf(
        'INSERT INTO on_hold_sales (%s) VALUES ("%s")',
        implode(',', array_keys($post)),
        implode('","', array_values($post))
    );
    $result  = mysqli_query($con, $query);
    if ($result) {
        $sale_id = mysqli_insert_id($con);
        foreach ($items as $x) {
            $query = 'INSERT INTO on_hold_sales_items (on_hold_sale_id, item_id, price, qty) VALUES ("' . $sale_id . '", "' . $x['id'] . '", "' . $x['price'] . '", "' . $x['qty'] . '")';
            $result  = mysqli_query($con, $query);
        }

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

function getAllOnHoldSales($con)
{
    integrity_check($con);

    $query = 'SELECT *
    FROM on_hold_sales
    WHERE is_deleted="0"
    ORDER BY id DESC';
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

function deleteOnHoldSale($con)
{
    integrity_check($con);
    unset($_POST['api_key']);
    // $query = 'UPDATE customers SET is_deleted=1 WHERE id="' . $_POST['id'] . '"';
    $query = 'DELETE FROM on_hold_sales WHERE id="' . $_POST['id'] . '"';
    $result  = mysqli_query($con, $query);
    if (mysqli_affected_rows($con)) {
        $query = 'DELETE FROM on_hold_sales_items WHERE on_hold_sale_id="' . $_POST['id'] . '"';
        $result  = mysqli_query($con, $query);
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

function deleteAllOnHoldSale($con)
{
    integrity_check($con);
    unset($_POST['api_key']);
    // $query = 'UPDATE customers SET is_deleted=1 WHERE id="' . $_POST['id'] . '"';
    $query = 'DELETE FROM on_hold_sales';
    $result  = mysqli_query($con, $query);
    if (mysqli_affected_rows($con)) {
        $query = 'DELETE FROM on_hold_sales_items';
        $result  = mysqli_query($con, $query);
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

function getOnHoldSaleDetails($con)
{
    integrity_check($con);

    $query = 'SELECT *
    FROM on_hold_sales 
    WHERE is_deleted="0" AND id="' . $_POST['id'] . '"';
    $result  = mysqli_query($con, $query);
    if (mysqli_affected_rows($con) != 0) {
        $resp['info']['sale'] =  mysqli_fetch_assoc($result);
        $resp['info']['sale']['date'] = date('Y-m-d', strtotime($resp['info']['sale']['date']));
        $resp['info']['saleItems'] = [];

        $query = 'SELECT c.category_name, si.*, i.name
        FROM on_hold_sales_items si, categories c, items i
        WHERE si.on_hold_sale_id = ' . $resp['info']['sale']['id'] . ' AND i.category_id=c.id AND si.item_id=i.id';
        $result  = mysqli_query($con, $query);
        if (mysqli_affected_rows($con) != 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $resp['info']['saleItems'][] =  $row;
            }

            $query = 'DELETE FROM on_hold_sales WHERE id="' . $_POST['id'] . '"';
            $result  = mysqli_query($con, $query);

            $query = 'DELETE FROM on_hold_sales_items WHERE on_hold_sale_id="' . $_POST['id'] . '"';
            $result  = mysqli_query($con, $query);

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
