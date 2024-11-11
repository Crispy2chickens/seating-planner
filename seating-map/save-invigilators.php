<?php
include '../db_connection.php';
include '../session.php'; // Ensure session variables are accessible
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$response = ['success' => true];
$errors = [];

if ($data) {
    // Fetch `idexamsession` from the session variable
    $examsessionid = isset($_SESSION['idexamsession']) ? $_SESSION['idexamsession'] : null;

    if (!$examsessionid) {
        $response['success'] = false;
        $errors[] = "Session ID for the exam session is not set.";
    } else {
        foreach ($data as $invigilator) {
            $userid = $invigilator['userid']; // Assuming the invigilator data has this key
            $venueid = 1;                     // Default value as specified
            $attendance = $invigilator['attendance'] ? 1 : 0;

            // Prepare the SQL statement
            $stmt = $conn->prepare("INSERT INTO invigilations (idusers, idexamsession, idvenue, attendance) VALUES (?, ?, ?, ?)");

            if ($stmt === false) {
                $errors[] = "Failed to prepare statement: " . $conn->error;
                $response['success'] = false;
                break;
            }

            // Bind the parameters
            $stmt->bind_param("iiii", $userid, $examsessionid, $venueid, $attendance);

            // Execute the statement
            if (!$stmt->execute()) {
                $errors[] = "Failed to execute statement: " . $stmt->error;
                $response['success'] = false;
                break;
            }

            $stmt->close(); // Close the statement after each insertion
        }
    }
} else {
    $response['success'] = false;
    $errors[] = "Invalid JSON data";
}

// Close the database connection
$conn->close();

$response['errors'] = $errors;
echo json_encode($response);
