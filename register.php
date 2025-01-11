<?php
header('Content-Type: application/json');
include('db.php'); // Подключение к базе данных

// Получаем данные из тела запроса
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["error" => "Неверный формат данных"]);
    exit();
}

$username = trim($data['username']); // убрать лишние пробелы
$password = trim($data['password']); 

// Проверка на пустые значения
if (empty($username) || empty($password)) {
    echo json_encode(["error" => "Логин и пароль не могут быть пустыми!"]);
    exit();
}

if (strlen($username) < 4 || strlen($password) < 4) {
    echo json_encode(["error" => "Логин и пароль должны содержать не менее 4 символов!"]);
    exit();
}

// Проверка, существует ли пользователь
$sql = "SELECT * FROM users WHERE username = '$username'";
$result = mysqli_query($mysql, $sql);

if (mysqli_num_rows($result) > 0) {
    echo json_encode(["error" => "Пользователь с таким логином уже существует!"]);
} else {
    // Сохраняем нового пользователя
    $sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";
    if (mysqli_query($mysql, $sql)) {
        echo json_encode(["message" => "Вы успешно зарегистрированы!"]);
    } else {
        echo json_encode(["error" => "Ошибка при регистрации: " . mysqli_error($mysql)]);
    }
}

mysqli_close($mysql);
?>