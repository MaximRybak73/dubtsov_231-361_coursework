<?php
header('Content-Type: application/json');
include('db.php');

$id = $_GET['id'];

$sql = "SELECT * FROM grounds WHERE ID = $id";
$result = mysqli_query($mysql, $sql);

if ($result && mysqli_num_rows($result) > 0) {
    $plot = mysqli_fetch_assoc($result);
    echo json_encode($plot);
} else {
    echo json_encode(["error" => "Подходящий участок не найден"]);
}

mysqli_close($mysql);
?>