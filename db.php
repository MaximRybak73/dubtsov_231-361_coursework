<?php
define('DB_HOST', 'localhost'); //Адрес
define('DB_USER', 'maximdgd_grounds'); //Имя пользователя
define('DB_PASSWORD', 'AlmaZ22072005!'); //Пароль
define('DB_NAME', 'maximdgd_grounds'); //Имя БД



$mysql = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
if ($mysql == false) {
    print ("Ошибка: Невозможно подключиться к MySQL " . mysqli_connect_error());
}
?>