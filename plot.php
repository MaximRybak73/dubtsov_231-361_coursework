<?php
header('Content-Type: application/json');
include('db.php');

// Получаем ID участка из запроса
$id = $_GET['id'];

if (!$id) {
    echo json_encode(["error" => "ID участка не указан"]);
    exit();
}

$sql = "SELECT * FROM grounds WHERE ID = ?";
$stmt = $mysql->prepare($sql);
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $plot = $result->fetch_assoc();
    echo json_encode($plot);
} else {
    echo json_encode(["error" => "Участок не найден"]);
}

mysqli_close($mysql);
?>