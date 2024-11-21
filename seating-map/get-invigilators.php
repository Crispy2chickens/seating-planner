<?php
include '../db_connection.php';
include '../session.php';
header('Content-Type: application/json');

// Check if 'idvenue' is provided and validate it
if (isset($_GET['idvenue']) && in_array($_GET['idvenue'], [1, 2, 3])) {
    $idvenue = $_GET['idvenue'];
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid or missing idvenue parameter.'
    ]);
    exit;
}

try {
    if (isset($_SESSION['idexamsession'])) {
        $idexamsession = $_SESSION['idexamsession'];

        // Prepare the query with dynamic idvenue
        $stmt = $conn->prepare("
            SELECT users.idusers, users.firstname, users.lastname, invigilations.attendance, invigilations.staffinvigilationid
            FROM users
            JOIN invigilations ON users.idusers = invigilations.idusers
            WHERE invigilations.idexamsession = ? AND invigilations.idvenue = ?
        ");
        $stmt->bind_param("ii", $idexamsession, $idvenue);
        $stmt->execute();

        $result = $stmt->get_result();
        $users = $result->fetch_all(MYSQLI_ASSOC);

        echo json_encode([
            'status' => 'success',
            'data' => $users
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'idexamsession is not set in the session.'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => "Error: " . $e->getMessage()
    ]);
}
