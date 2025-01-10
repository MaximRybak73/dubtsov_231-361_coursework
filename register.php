<?php
header('Content-Type: application/json');
include('db.php');

$username = $_POST['username'];
$password = $_POST['password'];

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
        echo json_encode(["error" => "Registration failed"]);
    }
}

mysqli_close($mysql);
?>