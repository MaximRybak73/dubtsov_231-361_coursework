<?php
header('Content-Type: application/json');
include('db.php');

// Получение данных из тела запроса
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['username']) || !isset($data['password'])) {
    echo json_encode(["error" => "Неверный формат данных"]);
    exit();
}

$username = trim($data['username']);
$password = trim($data['password']);

if (empty($username) || empty($password)) {
    echo json_encode(["error" => "Логин и пароль не могут быть пустыми!"]);
    exit();
}

if (strlen($username) < 4 || strlen($password) < 4) {
    echo json_encode(["error" => "Логин и пароль должны содержать не менее 4 символов!"]);
    exit();
}

try {
    $stmt = $mysql->prepare("CALL RegisterUser(?, ?, @result)");
    if (!$stmt) {
        throw new Exception("Ошибка подготовки запроса: " . $mysql->error);
    }
    $stmt->bind_param('ss', $username, $password);
    $stmt->execute();

    $result = $mysql->query("SELECT @result AS result");
    $row = $result->fetch_assoc();
    $message = $row['result'];

    echo json_encode(["message" => $message]);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

mysqli_close($mysql);
?>