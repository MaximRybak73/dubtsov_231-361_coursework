<?php
header('Content-Type: application/json');
include('db.php');

// Получаем параметры запроса
$areaMin = $_GET['areaMin'] ?? null;
$areaMax = $_GET['areaMax'] ?? null;
$permittedUse = $_GET['permitted_use'] ?? null;
$ownerType = $_GET['owner_type'] ?? null;
$rentalStatus = $_GET['rental_status'] ?? null;

$stmt = $mysql->prepare("CALL SearchPlots(?, ?, ?, ?, ?)");
$stmt->bind_param('ddsss', $areaMin, $areaMax, $permittedUse, $ownerType, $rentalStatus);
$stmt->execute();
$result = $stmt->get_result();

$plots = [];
while ($row = $result->fetch_assoc()) {
    $plots[] = $row;
}

echo json_encode($plots);
?>