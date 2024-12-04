<?php
include '../db_connection.php';
include '../session.php';

$idvenue = isset($_SESSION['idvenue']) ? $_SESSION['idvenue'] : null;
$idexamsession = isset($_SESSION['idexamsession']) ? $_SESSION['idexamsession'] : null;
$seatNumber = isset($_GET['seatNumber']) ? (int) $_GET['seatNumber'] : 0;

$query = "
SELECT students.firstname, students.lastname
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
} else {
    $response['firstname'] = 'Unavailable';
    $response['lastname'] = '';
}

header('Content-Type: application/json');

echo json_encode($response);

$stmt->close();
$conn->close();
