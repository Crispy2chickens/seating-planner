<?php
include '../db_connection.php'; // Include your DB connection

header('Content-Type: application/json'); // Set JSON content type

// Prepare the query to get the list of users (invigilators)
$sql = "SELECT idusers, firstname, lastname FROM users";
$result = $conn->query($sql);

// Check if the query was successful
if ($result) {
    $invigilators = [];

    // Fetch all results into an associative array
    while ($row = $result->fetch_assoc()) {
        $invigilators[] = $row;
    }

    // Return the invigilators list as JSON
    echo json_encode([
        'status' => 'success',
        'data' => $invigilators
    ]);
} else {
    // If the query fails, send an error response
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch invigilators'
    ]);
}

exit;
