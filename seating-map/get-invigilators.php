<?php
include '../db_connection.php';
include '../session.php';
header('Content-Type: application/json');

try {
    if (isset($_SESSION['idexamsession'])) {
        $idexamsession = $_SESSION['idexamsession'];

        // Prepare the SQL query to fetch user and attendance details
        $stmt = $conn->prepare("
            SELECT users.idusers, users.firstname, users.lastname, invigilations.attendance
            FROM users
            JOIN invigilations ON users.idusers = invigilations.idusers
            WHERE invigilations.idexamsession = ?
        ");
        $stmt->bind_param("i", $idexamsession);
        $stmt->execute();

        // Fetch the results
        $result = $stmt->get_result();
        $users = $result->fetch_all(MYSQLI_ASSOC);

        // Output JSON
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
