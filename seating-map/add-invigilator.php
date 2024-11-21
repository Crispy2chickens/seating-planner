<?php
include '../db_connection.php'; // Include your DB connection
header('Content-Type: application/json'); // Set JSON content type

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if data is provided (idusers, idexamsession, and idvenue)
if (isset($data['idusers']) && isset($data['idexamsession']) && isset($data['idvenue'])) {
    $idusers = $data['idusers'];
    $idexamsession = $data['idexamsession'];
    $idvenue = $data['idvenue'];

    // Prepare the SQL query to insert the invigilator into the invigilations table
    $stmt = $conn->prepare("INSERT INTO invigilations (idusers, idexamsession, idvenue, attendance) VALUES (?, ?, ?, 0)");

    // Bind the parameters (idusers, idexamsession, and idvenue)
    $stmt->bind_param("iii", $idusers, $idexamsession, $idvenue); // "iii" is for three integers

    // Execute the query and check if successful
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        // Return error message if insertion fails
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to add invigilator: ' . $stmt->error
        ]);
    }

    $stmt->close();
} else {
    // If data is missing, return an error message
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid data received'
    ]);
}

exit;
