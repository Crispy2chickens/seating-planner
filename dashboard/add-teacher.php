<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['firstname'], $input['lastname'], $input['email'], $input['password'])) {
        $firstname = $input['firstname'];
        $lastname = $input['lastname'];
        $email = $input['email'];
        $password = $input['password'];
        $coordinator = isset($input['coordinator']) ? 0 : 1; // Convert boolean to int

        require '../db_connection.php';

        // Prepare the INSERT statement
        $stmt = $conn->prepare("INSERT INTO users (firstname, lastname, email, password, coordinator) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $firstname, $lastname, $email, $password, $coordinator);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add teacher.']);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
