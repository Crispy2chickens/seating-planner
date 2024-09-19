<?php
session_start();
require 'db_connection.php';

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Query to check if the email exists
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && $password === $user['password']) {
        // Password is correct, start a session
        $_SESSION['email'] = $user['email'];
        $_SESSION['firstname'] = $user['firstname'];
        $_SESSION['lastname'] = $user['lastname'];
        $_SESSION['coordinator'] = $user['coordinator'];

        if ($user['coordinator'] == 1) {
            header("Location: dashboard/u0.php");
        } else {
            header("Location: dashboard/u1.php");
        }
        exit();
    } else {
        $_SESSION['error'] = "Invalid email or password.";
        header("Location: index.php");
        exit();
    }
}
