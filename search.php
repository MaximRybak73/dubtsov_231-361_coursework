<?php
header('Content-Type: application/json');
include('db.php');

// Получаем параметры запроса
$area = $_GET['area'];
$permittedUse = $_GET['permitted_use'];
$ownerType = $_GET['owner_type'];
$rentalStatus = $_GET['rental_status'];

// Формируем SQL-запрос
$sql = "SELECT * FROM grounds WHERE 1=1";
$params = [];

if ($area) {
    $sql .= " AND FieldArea >= ? AND FieldArea <= ?";
    $params[] = $area;       // Нижняя граница
    $params[] = $area + 100; // Верхняя граница
}
if ($permittedUse) {
    $sql .= " AND PermittedUse = ?";
    $params[] = $permittedUse;
}
if ($ownerType) {
    $sql .= " AND OwnerType = ?";
    $params[] = $ownerType;
}
if ($rentalStatus) {
    $sql .= " AND RentalStatus = ?";
    $params[] = $rentalStatus;
}

// Подготавливаем и выполняем запрос
$stmt = $mysql->prepare($sql);
if ($stmt) {
    if (!empty($params)) {
        $types = str_repeat('s', count($params)); // Все параметры передаются как строки
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    $plots = [];
    while ($row = $result->fetch_assoc()) {
        $plots[] = $row;
    }

    echo json_encode($plots);
} else {
    echo json_encode(["error" => "Ошибка при подготовке запроса"]);
}

mysqli_close($mysql);
?>