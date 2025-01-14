<?php
header('Content-Type: application/json');
include('db.php'); 

// Получение ID участка из запроса
$id = $_GET['id'];

if (!$id) {
    echo json_encode(["error" => "ID участка не указан"]);
    exit();
}

try {
    // Вызов хранимой процедуры
    $stmt = $mysql->prepare("CALL GetPlotById(?)");
    if (!$stmt) {
        throw new Exception("Ошибка подготовки запроса: " . $mysql->error);
    }
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $plot = $result->fetch_assoc();
        echo json_encode($plot);
    } else {
        echo json_encode(["error" => "Участок не найден"]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

mysqli_close($mysql);
?>