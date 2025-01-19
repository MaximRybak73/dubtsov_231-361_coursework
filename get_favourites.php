<?php
header('Content-Type: application/json');
include('db.php');

session_start();

if (!isset($_SESSION['username'])) {
    echo json_encode(["error" => "Пользователь не авторизован"]);
    exit();
}

$username = $_SESSION['username'];

try {
    $stmt = $mysql->prepare("CALL GetFavorites(?)");
    if (!$stmt) {
        throw new Exception("Ошибка подготовки запроса: " . $mysql->error);
    }
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();

    $favorites = [];
    while ($row = $result->fetch_assoc()) {
        $favorites[] = $row;
    }

    echo json_encode($favorites);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

mysqli_close($mysql);
?>