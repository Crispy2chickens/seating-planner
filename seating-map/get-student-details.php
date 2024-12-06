<?php
include '../db_connection.php';
include '../session.php';

$idvenue = isset($_SESSION['idvenue']) ? $_SESSION['idvenue'] : null;
$idexamsession = isset($_SESSION['idexamsession']) ? $_SESSION['idexamsession'] : null;
$seatNumber = isset($_GET['seatNumber']) ? (int) $_GET['seatNumber'] : 0;

$query = "
SELECT students.firstname, students.lastname, students.candidateno, students.wordprocessor, students.extratime, students.restbreak
FROM studentexams
INNER JOIN students ON studentexams.idstudents = students.idstudents
WHERE studentexams.seatno = ?
AND studentexams.idexamsession = ?
AND studentexams.idvenue = ?
";

$stmt = $conn->prepare($query);
$stmt->bind_param("iii", $seatNumber, $idexamsession, $idvenue);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $response['firstname'] = $row['firstname'];
    $response['lastname'] = $row['lastname'];
    $response['candidateno'] = $row['candidateno'];
    $response['wordprocessor'] = $row['wordprocessor'];
    $response['extratime'] = $row['extratime'];
    $response['restbreak'] = $row['restbreak'];
}

header('Content-Type: application/json');

echo json_encode($response);

$stmt->close();
$conn->close();
