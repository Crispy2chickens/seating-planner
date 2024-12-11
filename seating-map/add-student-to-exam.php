<?php
include '../db_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);

    if (isset($inputData['idstudents'], $inputData['idexamsession'], $inputData['idvenue'], $inputData['seatno'])) {
        $idstudents = $inputData['idstudents'];
        $idexamsession = $inputData['idexamsession'];
        $idvenue = $inputData['idvenue'];
        $seatno = $inputData['seatno'];

        $sql = "INSERT INTO studentexams (idstudents, idexamsession, idvenue, seatno) 
                VALUES (?, ?, ?, ?)";

        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("iiis", $idstudents, $idexamsession, $idvenue, $seatno);

            if ($stmt->execute()) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false, "error" => "Failed to insert data into the database."]);
            }

            $stmt->close();
        } else {
            echo json_encode(["success" => false, "error" => "Failed to prepare the SQL statement."]);
        }

        $conn->close();
    } else {
        echo json_encode(["success" => false, "error" => "Missing required data."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request method."]);
}
