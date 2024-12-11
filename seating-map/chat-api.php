<?php
include '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle message submission
    $idusers = $_POST['idusers'];
    $message = $_POST['message'];
    $idexamsession = $_POST['idexamsession'];
    $idvenue = $_POST['idvenue'];

    // Prepare the insert statement
    $stmt = $conn->prepare("INSERT INTO messages (idusers, message, idexamsession, idvenue) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isis", $idusers, $message, $idexamsession, $idvenue);

    // Execute the query
    $stmt->execute();
    $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $idexamsession = $_GET['idexamsession'];
    $idvenue = $_GET['idvenue'];

    $query = "
        SELECT m.message, u.firstname, u.lastname 
        FROM messages m 
        INNER JOIN users u ON m.idusers = u.idusers 
        WHERE m.idexamsession = ? AND m.idvenue = ?
        ORDER BY m.timestamp ASC";

    // Prepare and execute the query
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $idexamsession, $idvenue);  // Bind the idexamsession and idvenue as integers
    $stmt->execute();

    // Fetch the results
    $result = $stmt->get_result();
    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }

    // Return the result as JSON
    echo json_encode($messages);

    // Close the statement
    $stmt->close();
}

$conn->close();
