<?php
session_start();
include '../db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$time = $data['starttime'];
$idexamsession = $data['idexamsession'];

if (strpos($time, ':00') === false) {
    $time .= ':00';
}

if (!empty($time) && !empty($idexamsession)) {
    $sql = "UPDATE examsession SET starttime = ? WHERE idexamsession = ?";

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("si", $time, $idexamsession);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update time.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing title or exam session ID.']);
}
