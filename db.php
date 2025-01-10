<?php
define('DB_HOST', 'localhost'); //Адрес
define('DB_USER', 'root'); //Имя пользователя
define('DB_PASSWORD', ''); //Пароль
define('DB_NAME', 'coursework'); //Имя БД



$mysql = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
if ($mysql == false) {
    print ("Ошибка: Невозможно подключиться к MySQL " . mysqli_connect_error());
}
?>