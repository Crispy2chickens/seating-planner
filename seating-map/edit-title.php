<?php
session_start();
include '../db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$title = $data['title'];
$idexamsession = $data['idexamsession'];

if (!empty($title) && !empty($idexamsession)) {
    $sql = "UPDATE examsession SET title = ? WHERE idexamsession = ?";

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("si", $title, $idexamsession);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update title.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing title or exam session ID.']);
}
