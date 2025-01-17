<?
session_start();
require_once($_SERVER['DOCUMENT_ROOT'] . '/config.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/launch.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/DB/DB.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/routing/router.php');

try {
    new Router(
        $_SERVER['REQUEST_URI']
    );
} catch (Exception $e) {
    $content = $e->getMessage();
}

$url = ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
if (empty($_SESSION['auth']) && $url !== 'https://'.$_SERVER['HTTP_HOST'].'/login/register') {
    header('Location: https://'.$_SERVER['HTTP_HOST'].'/login/register');
}
require($_SERVER['DOCUMENT_ROOT'] . '/content/main.php');
?>