<?php
include '../db_connection.php';
include '../session.php';

// Get the seat number from the request
$seatNumber = isset($_GET['seatNumber']) ? (int) $_GET['seatNumber'] : 0;

// Query to fetch student details by seat number
$query = "
    SELECT students.firstname, students.lastname 
    FROM studentexams 
    INNER JOIN students ON studentexams.idstudents = students.idstudents 
    WHERE studentexams.seatno = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $seatNumber); // "i" means integer
$stmt->execute();
$result = $stmt->get_result();

// Check if a result was found
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $response = [
        'firstname' => $row['firstname'],
        'lastname' => $row['lastname']
    ];
} else {
    // If no student is found, return a default message
    $response = [
        'firstname' => 'Unavailable',
        'lastname' => ''
    ];
}

// Close connection
$stmt->close();
$conn->close();

// Return the response as JSON
header('Content-Type: application/json');
echo json_encode($response);
