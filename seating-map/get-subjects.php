<?php
include '../db_connection.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->prepare("SELECT idsubjects, name FROM subjects ORDER BY name ASC");
    $stmt->execute();

    // Fetch the results
    $subjects = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // Check if there are any students
    if ($subjects) {
        echo json_encode([
            'success' => true,
            'subjects' => $subjects
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'subjects' => []
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
