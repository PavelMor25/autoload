<?
Class Chat
{
    public function index() {
        return '<div class="container px-4 py-5">'.$this->chats().'</div>';
    }

    public function private($name) {
            return '
            <div class="connect"></div>
            <form id="chat">
            <div class="messages form-control" ></div>
            <input type="text" name="message" class="message form-control form-control-lg" placeholder="введите сообщение">
            <div class="mike">&#127908;</div>
            <button id="send-message" class="btn btn-lg btn-outline-primary">отправить</button>
            </form>';
    }

    private function chats() {
        $res = '';
        $bd = new DB('users');
        $users = $bd->getRows();
        foreach ($users as $user):
            if ($user['id'] !== $_SESSION['auth']['id']):
                $res .= '<div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
                            <div class="feature col">
                                <div class="feature-icon bg-primary bg-gradient">
                                    <a class="dropdown-item" href="/chat/private/?user='.$user['id'].'">'.$user['name'].'</a>
                                </div>
                            </div>
                        </div>';
            endif;
        endforeach;
        return $res;
    }
}
?>
