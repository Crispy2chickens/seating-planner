<?php
session_start();
require '../db_connection.php';

$sql = "SELECT idusers, firstname, lastname, email FROM users WHERE coordinator = 0;";
$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);

$conn->close();
