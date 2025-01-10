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
if ($area) $sql .= " AND FieldArea >= $area";
if ($permittedUse) $sql .= " AND PermittedUse = '$permittedUse'";
if ($ownerType) $sql .= " AND OwnerType = '$ownerType'";
if ($rentalStatus) $sql .= " AND RentalStatus = '$rentalStatus'";

// Выполняем запрос
$result = mysqli_query($mysql, $sql);

$plots = [];
while ($row = mysqli_fetch_assoc($result)) {
    $plots[] = $row;
}

echo json_encode($plots);

mysqli_close($mysql);
?>