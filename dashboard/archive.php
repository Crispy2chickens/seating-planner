<?php
session_start();
require '../db_connection.php';

error_log("archive.php accessed");

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $itemId = $data['id'];
    error_log("Attempting to archive item with ID: " . $itemId);

    $sql = "UPDATE examsession SET archived = 1 WHERE idexamsession = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => 'SQL Prepare Error: ' . $conn->error]);
        exit();
    }

    $stmt->bind_param("i", $itemId);
    $response = [];

    if ($stmt->execute()) {
        $response['success'] = true;
    } else {
        $response['success'] = false;
        $response['error'] = $stmt->error;
        error_log("Failed to execute SQL: " . $sql . " with ID: " . $itemId);
    }

    $stmt->close();
    $conn->close();

    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
}
