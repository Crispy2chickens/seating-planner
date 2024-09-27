<?php
session_start();
require '../db_connection.php';

// SQL query to fetch teacher data
$sql = "SELECT idusers, firstname, lastname, email, coordinator FROM users;";
$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;  // Append each row to the data array
    }
}

// Output the data as JSON
echo json_encode($data);

$conn->close();
