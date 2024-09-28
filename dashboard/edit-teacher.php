<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['id'], $input['firstname'], $input['lastname'], $input['password'])) {
        $id = $input['id'];  // ID of the teacher to update
        $firstname = $input['firstname'];
        $lastname = $input['lastname'];
        $password = $input['password'];
        $coordinator = isset($input['coordinator']) ? 0 : 1; // Convert boolean to int

        require '../db_connection.php';

        // Prepare the UPDATE statement
        $stmt = $conn->prepare("UPDATE users SET firstname = ?, lastname = ?, password = ?, coordinator = ? WHERE idusers = ?");
        $stmt->bind_param("sssii", $firstname, $lastname, $password, $coordinator, $id);

        // Execute the update and return the result
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Teacher updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update teacher']);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
