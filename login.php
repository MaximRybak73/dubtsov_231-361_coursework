<?php
header('Content-Type: application/json');
include('db.php'); // Подключение к базе данных

// Получаем данные из тела запроса
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["error" => "Неверный формат данных"]);
    exit();
}

$username = $data['username'];
$password = $data['password'];

// Проверка, существует ли пользователь
$sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
$result = mysqli_query($mysql, $sql);

if (mysqli_num_rows($result) > 0) {
    echo json_encode(["message" => "Вы успешно вошли в систему!"]);
} else {
    echo json_encode(["error" => "Неправильный логин или пароль!"]);
}

mysqli_close($mysql);
?>