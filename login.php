<?php
header('Content-Type: application/json');
include('db.php');

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
$result = mysqli_query($mysql, $sql);

if (mysqli_num_rows($result) > 0) {
    echo json_encode(["message" => "Login successful"]);
} else {
    echo json_encode(["error" => "Invalid username or password"]);
}

mysqli_close($mysql);
?>