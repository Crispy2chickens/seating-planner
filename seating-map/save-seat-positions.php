<?php
include '../db_connection.php';
include '../session.php';

// Retrieve the JSON data from the request body
$data = json_decode(file_get_contents('php://input'), true);

$idvenue = isset($_SESSION['idvenue']) ? $_SESSION['idvenue'] : null;
$idexamsession = isset($_SESSION['idexamsession']) ? $_SESSION['idexamsession'] : null;

$seat1 = $data['seat1'];
$seat2 = $data['seat2'];

try {
    // Begin transaction to ensure atomic updates
    $conn->begin_transaction();

    // Swap seat positions in the database using a temporary placeholder

    // First update: Temporarily set seatno of the first seat to -1
    $stmt1 = $conn->prepare("UPDATE studentexams SET seatno = -1 WHERE seatno = ? AND idvenue = ? AND idexamsession = ?");
    $stmt1->bind_param("iii", $seat1, $idvenue, $idexamsession);
    $stmt1->execute();

    // Second update: Set seatno of the second seat to the first seat number
    $stmt2 = $conn->prepare("UPDATE studentexams SET seatno = ? WHERE seatno = ? AND idvenue = ? AND idexamsession = ?");
    $stmt2->bind_param("iiii", $seat1, $seat2, $idvenue, $idexamsession);
    $stmt2->execute();

    // Third update: Set seatno of the first seat to the second seat number
    $stmt3 = $conn->prepare("UPDATE studentexams SET seatno = ? WHERE seatno = -1 AND idvenue = ? AND idexamsession = ?");
    $stmt3->bind_param("iii", $seat2, $idvenue, $idexamsession);
    $stmt3->execute();

    // Commit transaction
    $conn->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $conn->rollback(); // Rollback on error
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

// Close the database connection
$conn->close();
