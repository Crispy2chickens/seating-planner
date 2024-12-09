<?php
include '../db_connection.php';
include '../session.php';

header('Content-Type: application/json');

try {
    // Get the POST data
    $input = json_decode(file_get_contents('php://input'), true);

    // Extract values
    $idexamsession = $input['idexamsession'];
    $idvenue = $input['idvenue'];
    $seatno = $input['seatno'];

    if (!$idexamsession || !$idvenue || !$seatno) {
        throw new Exception("Missing required parameters.");
    }

    // Prepare the DELETE statement
    $stmt = $conn->prepare('DELETE FROM studentexams WHERE idexamsession = ? AND idvenue = ? AND seatno = ?');
    if ($stmt === false) {
        throw new Exception("Failed to prepare the statement: " . $conn->error);
    }

    // Bind parameters
    $stmt->bind_param('iis', $idexamsession, $idvenue, $seatno);

    // Execute the statement
    $stmt->execute();

    // Check if any row was affected
    if ($stmt->affected_rows > 0) {
        // Send success response
        echo json_encode(['success' => true]);
    } else {
        // If no rows were affected, something went wrong
        echo json_encode(['success' => false, 'error' => 'No rows affected']);
    }

    // Close the statement and the connection
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    // Send error response
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
