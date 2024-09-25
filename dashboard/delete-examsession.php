<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['idexamsession'])) {
        $idexamsession = $input['idexamsession'];

        require '../db_connection.php';

        $stmt = $conn->prepare("DELETE FROM examsession WHERE idexamsession = ?");
        $stmt->bind_param("i", $idexamsession);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete the session.']);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
