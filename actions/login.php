<?
require_once($_SERVER['DOCUMENT_ROOT'] . '/DB/DBCon.php');
$post = $_POST;

function login($post){
    // if ($post['method'] === 'login')
    {
        $db = new DBCon();
        $users = $db->getUsers();
        $db->close();
        if (is_array($users)){
            foreach ($users as $user) {
                if ($post['email'] === $user['email']){
                    $verify = password_verify($post['password'],$user['password']);
                    $_SESSION['auth'] = 'true';
                    die(json_encode(['error' => 0, 'success' => 1]));
                }
            }
        }
        die(json_encode(['error' => 1, 'success' => 0]));
    // }
}

function register($post){
    if ($post['method'] === 'register')
    {
        $db = new DBCon();
        $isHas = $db->findUser($post['email']);
        if ($isHas == 0) {
            $newUser = $db->saveUser($post['name'], $post['password'], $post['email']);
            $db->close();
            die(json_encode(['error' => 0, 'success' => 1]));
        } else {
            $db->close();
            die(json_encode(['error' => 1, 'success' => 0]));
        }
    }
}

function logout($post){
    if ($post['method'] === 'logout')
    {
    unset($_SESSION['auth']);
    die(json_encode(['error' => 0, 'success' =>1]));
    }
}