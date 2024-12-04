<?php
include '../db_connection.php';

header('Content-Type: application/json');

$sql = "SELECT idusers, firstname, lastname FROM users";
$result = $conn->query($sql);

if ($result) {
    $invigilators = [];

    while ($row = $result->fetch_assoc()) {
        $invigilators[] = $row;
    }

    echo json_encode([
        'status' => 'success',
        'data' => $invigilators
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch invigilators'
    ]);
}

exit;
