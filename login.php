<?php
header('Content-Type: application/json');
session_start();
include('db.php'); 

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['username']) || !isset($data['password'])) {
    echo json_encode(["error" => "Неверный формат данных"]);
    exit();
}

$username = $data['username'];
$password = $data['password'];

try {
    $stmt = $mysql->prepare("CALL CheckUserLogin(?, ?, @result)");
    if (!$stmt) {
        throw new Exception("Ошибка подготовки запроса: " . $mysql->error);
    }
    $stmt->bind_param('ss', $username, $password);
    $stmt->execute();

    // Получение результата из result
    $result = $mysql->query("SELECT @result AS result");
    $row = $result->fetch_assoc();
    $userExists = (int)$row['result'];

    if ($userExists > 0) {
        $_SESSION['username'] = $username; // Сохранить имя пользователя в сессии
        echo json_encode(["message" => "Вы успешно вошли в систему!"]);
    } else {
        echo json_encode(["error" => "Неправильный логин или пароль!"]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

mysqli_close($mysql);
?>