<?php
include '../db_connection.php'; // Include your DB connection
header('Content-Type: application/json'); // Set JSON content type

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if data is provided (idusers and idexamsession)
if (isset($data['idusers']) && isset($data['idexamsession'])) {
    $idusers = $data['idusers'];
    $idexamsession = $data['idexamsession'];

    // Prepare the SQL query to insert the invigilator into the invigilations table
    $stmt = $conn->prepare("INSERT INTO invigilations (idusers, idexamsession, attendance) VALUES (?, ?, 0)");
    $stmt->bind_param("ii", $idusers, $idexamsession); // Bind the parameters (idusers and idexamsession)

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
