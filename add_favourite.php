<?php
header('Content-Type: application/json');
session_start(); 
include('db.php'); 

// Чтение данных из тела запроса
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['plot_id'])) {
    echo json_encode(["error" => "ID участка не указан"]);
    exit();
}

$plot_id = $data['plot_id'];

if (!isset($_SESSION['username'])) {
    echo json_encode(["error" => "Пользователь не авторизован"]);
    exit();
}

$username = $_SESSION['username'];

// Проверяем, не добавлен ли участок уже в избранное
$sql = "SELECT * FROM favorites WHERE username = ? AND plot_id = ?";
$stmt = $mysql->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "Ошибка подготовки запроса: " . $mysql->error]);
    exit();
}
$stmt->bind_param('si', $username, $plot_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["error" => "Участок уже в избранном"]);
    exit();
}

// Добавляем участок в избранное
$sql = "INSERT INTO favorites (username, plot_id) VALUES (?, ?)";
$stmt = $mysql->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "Ошибка подготовки запроса: " . $mysql->error]);
    exit();
}
$stmt->bind_param('si', $username, $plot_id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Участок добавлен в избранное"]);
} else {
    echo json_encode(["error" => "Ошибка при добавлении в избранное: " . $stmt->error]);
}

mysqli_close($mysql);
?>