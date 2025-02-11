<?php
header('Content-Type: application/json');
session_start(); 
include('db.php');

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

try {
    $stmt = $mysql->prepare("CALL RemoveFromFavorites(?, ?)");
    if (!$stmt) {
        throw new Exception("Ошибка подготовки запроса: " . $mysql->error);
    }
    $stmt->bind_param('si', $username, $plot_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Участок удален из избранного"]);
    } else {
        throw new Exception("Ошибка при удалении из избранного: " . $stmt->error);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

mysqli_close($mysql);
?>