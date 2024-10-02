<?php
session_start();
include '../db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$date = $data['date'];
$idexamsession = $data['idexamsession'];

if (!empty($date) && !empty($idexamsession)) {
    $sql = "UPDATE examsession SET date = ? WHERE idexamsession = ?";

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("si", $date, $idexamsession);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update date.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing title or exam session ID.']);
}
