<?php
include '../db_connection.php';

header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data and decode it into an associative array
    $input = json_decode(file_get_contents('php://input'), true);

    // Ensure necessary parameter is provided
    if (isset($input['staffinvigilationid'])) {
        $staffinvigilationid = (int)$input['staffinvigilationid'];  // Ensure it's an integer

        // Prepare the DELETE SQL statement
        $stmt = $conn->prepare('DELETE FROM invigilations WHERE staffinvigilationid = ?');

        // Check for errors with the prepared statement
        if ($stmt === false) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to prepare the SQL statement', 'error' => $conn->error]);
            exit();
        }

        // Bind parameters to the SQL statement
        $stmt->bind_param('i', $staffinvigilationid);

        // Execute the statement
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['status' => 'success']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'No records found to delete']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to execute DELETE statement', 'error' => $stmt->error]);
        }

        // Close the statement and connection
        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
