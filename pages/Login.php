<?

class Login
{
    public function register() {
        if (empty($_SESSION['auth'])) {
            $GLOBALS['content'] = '
            <form id="register">
                <label for="name">Введите логин:</label>
                    <input type="text" name="name"><br>
                <label for="password">Введите пароль:</label>
                    <input type="password" name="password"><br>
                <label for="email">Введите почту:</label>
                    <input type="email" name="email"><br>
                <button id="reg">Зарегитрироваться</button>
                <button id="login">Войти</button>
            </form>
            ';
        } else {
            $GLOBALS['content'] = '<button type="button" id="logout" >Выйти</button>';
        }
    }
}