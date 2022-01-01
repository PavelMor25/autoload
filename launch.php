<?
    spl_autoload_register(function ($class) {
        $pages = $_SERVER['DOCUMENT_ROOT'] . '/pages/'. $class . '.php';
        $script = $_SERVER['DOCUMENT_ROOT'] . '/js/'. $class . '.js';
        $css = $_SERVER['DOCUMENT_ROOT'] . '/css/'. $class . '.css';

        if (file_exists($script)) {
            $GLOBALS['script'] = '/js/' . $class . '.js';
        }
        if (file_exists($css)) {
            $GLOBALS['css'] = '/css/' . $class . '.css';
        }

        if (!file_exists(ucfirst($pages))) {
            throw new Exception('Error');
        }
        require($pages);
    });