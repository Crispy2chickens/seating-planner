<?php
include '../db_connection.php';

header('Content-Type: application/json'); // Set JSON content type

$data = json_decode(file_get_contents('php://input'), true);

if (is_null($data)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to decode JSON data'
    ]);
    exit;
}

if (isset($data['staffinvigilationid']) && isset($data['attendance'])) {
    $staffinvigilationid = $data['staffinvigilationid'];
    $attendance = $data['attendance'];

    // Using MySQLi for database interactions
    try {
        // Prepare the SQL query
        $stmt = $conn->prepare("
            UPDATE invigilations
            SET attendance = ?
            WHERE staffinvigilationid = ?
        ");

        // Bind the parameters (use "ii" to indicate two integers)
        $stmt->bind_param("ii", $attendance, $staffinvigilationid);

        // Execute the statement
        $stmt->execute();

        // Check if the update was successful
        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No rows updated.']);
        }

        // Close the statement
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => "Database error: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid data received'
    ]);
}

// Close the database connection
$conn->close();
exit;
