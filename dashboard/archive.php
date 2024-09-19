<?php
header('Content-Type: application/json');

// Get the request body and decode the JSON
$data = json_decode(file_get_contents('php://input'), true); // debug
$idexamsession = $data['idexamsession'];

// Start the session and include the database connection
session_start();
require '../db_connection.php';

// Prepare and execute the SQL query to update the `archived` field
$stmt = $conn->prepare("UPDATE examsession SET archived = 1 WHERE idexamsession = ?");
if (!$stmt) {
    error_log('Prepare failed: ' . $conn->error);
    echo json_encode(['success' => false, 'error' => 'SQL prepare failed']);
    exit();
}

$stmt->bind_param("i", $idexamsession);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        // No rows affected
        error_log('No rows updated for idexamsession: ' . $idexamsession);
        echo json_encode(['success' => false, 'error' => 'No rows updated']);
    }
} else {
    error_log('Execute failed: ' . $stmt->error);
    echo json_encode(['success' => false, 'error' => 'SQL execute failed']);
}
$stmt->close();
$conn->close();
