<?php
include '../db_connection.php';
header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

$response = [];

try {
    // Check if idexamsession is set in the session
    if (isset($_SESSION['idexamsession'])) {
        $idexamsession = $_SESSION['idexamsession'];

        // Prepare and execute the SQL query
        $stmt = $pdo->prepare("SELECT users.idusers, users.firstname, users.lastname, invigilations.attendance
                               FROM users
                               JOIN invigilations ON users.idusers = invigilations.idusers
                               WHERE invigilations.idexamsession = :idexamsession");
        $stmt->bindParam(':idexamsession', $idexamsession, PDO::PARAM_INT);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Send the result as JSON
        $response = [
            'status' => 'success',
            'data' => $users
        ];
    } else {
        // If idexamsession is not set in the session, return an error response
        $response = [
            'status' => 'error',
            'message' => 'idexamsession is not set in the session.'
        ];
    }
} catch (PDOException $e) {
    // Send the error message as JSON
    $response = [
        'status' => 'error',
        'message' => "Database error: " . $e->getMessage()
    ];
}

// Ensure only JSON is output and exit the script
echo json_encode($response);
exit;
