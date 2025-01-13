<?php
header('Content-Type: application/json');
include('db.php');

session_start();

if (!isset($_SESSION['username'])) {
    echo json_encode(["error" => "Пользователь не авторизован"]);
    exit();
}

$username = $_SESSION['username'];

// Получаем избранные участки пользователя
$sql = "SELECT g.* FROM grounds g
        JOIN favorites f ON g.ID = f.plot_id
        WHERE f.username = ?";
$stmt = $mysql->prepare($sql);
$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();

$favorites = [];
while ($row = $result->fetch_assoc()) {
    $favorites[] = $row;
}

echo json_encode($favorites);

mysqli_close($mysql);
?>