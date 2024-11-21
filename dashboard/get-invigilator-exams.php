<?php
session_start();
require '../db_connection.php';

// Ensure the user is logged in
if (!isset($_SESSION['idusers'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
    exit();
}

$iduser = $_SESSION['idusers'];  // Get the logged-in user ID from the session

// SQL query to get the exam sessions where the user is assigned as an invigilator
$sql = "
    SELECT es.idexamsession, es.title, es.date, es.starttime
    FROM examsession es
    INNER JOIN invigilations iv ON es.idexamsession = iv.idexamsession
    WHERE iv.idusers = ? AND es.archived = 0;
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $iduser);  // Bind the user ID parameter to the query
$stmt->execute();
$result = $stmt->get_result();

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);

$stmt->close();
$conn->close();
