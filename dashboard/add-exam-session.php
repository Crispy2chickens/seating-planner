<?php
header('Content-Type: application/json');

// Start the session and include the database connection
session_start();
require '../db_connection.php';

// Get the request body and decode the JSON
$data = json_decode(file_get_contents('php://input'), true);

// Extract the values from the received data
$title = $data['title'];
$date = $data['date'];
$starttime = $data['starttime'];

// Prepare and execute the SQL query to insert a new exam session
$stmt = $conn->prepare("INSERT INTO examsession (title, date, starttime) VALUES (?, ?, ?)");
if (!$stmt) {
    error_log('Prepare failed: ' . $conn->error);
    echo json_encode(['success' => false, 'error' => 'SQL prepare failed']);
    exit();
}

$stmt->bind_param("sss", $title, $date, $starttime);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    error_log('Execute failed: ' . $stmt->error);
    echo json_encode(['success' => false, 'error' => 'SQL execute failed']);
}

$stmt->close();
$conn->close();
