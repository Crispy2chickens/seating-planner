<?php
include '../db_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['idsubjects'])) {
        echo json_encode(['success' => false, 'message' => 'Subject ID is required.']);
        exit;
    }

    $idsubjects = $input['idsubjects'];

    try {
        // Prepare the SQL query
        $stmt = $conn->prepare("SELECT s.idstudents, s.firstname, s.lastname, s.candidateno, 
                                s.wordprocessor, s.extratime, s.restbreak
                                FROM studentsubjects ss
                                INNER JOIN students s ON ss.idstudents = s.idstudents
                                WHERE ss.idsubjects = ?
                                ORDER BY s.candidateno ASC;
                            ");

        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Failed to prepare statement.']);
            exit;
        }

        // Bind parameters and execute
        $stmt->bind_param("i", $idsubjects);
        $stmt->execute();
        $result = $stmt->get_result();

        // Fetch the results
        $students = $result->fetch_all(MYSQLI_ASSOC);

        if ($students) {
            echo json_encode(['success' => true, 'students' => $students]);
        } else {
            echo json_encode(['success' => false, 'students' => []]);
        }

        // Close the statement
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

// Close the database connection
$conn->close();
