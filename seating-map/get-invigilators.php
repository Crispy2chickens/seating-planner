<?php
include '../db_connection.php';
header('Content-Type: application/json');

$sql = "SELECT idusers, firstname, lastname FROM users";
$result = $conn->query($sql);

$invigilators = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $invigilators[] = $row;
    }
}

$conn->close();
echo json_encode($invigilators);
