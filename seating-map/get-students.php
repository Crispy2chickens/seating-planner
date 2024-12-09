<?php
include '../db_connection.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->prepare("SELECT idstudents, firstname, lastname FROM students ORDER BY lastname ASC");
    $stmt->execute();

    // Fetch the results
    $students = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // Check if there are any students
    if ($students) {
        echo json_encode([
            'success' => true,
            'students' => $students
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'students' => []
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
