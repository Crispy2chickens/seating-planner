<?php
session_start();
require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_password = $_POST['new-password'];
    $confirm_password = $_POST['confirm-password'];

    $user_email = $_SESSION['email'];

    // Check if new passwords match
    if ($new_password !== $confirm_password) {
        $_SESSION['error'] = "New passwords do not match.";
        header("Location: change-password-page.php");
        exit;
    }

    $sql = "SELECT idusers FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        $user_id = $user['idusers'];

        // Update password in the database (plaintext)
        $sql = "UPDATE users SET password = ? WHERE idusers = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('si', $new_password, $user_id);
        if ($stmt->execute()) {
            header("Location: index.php");
            exit();
        } else {
            $_SESSION['error'] = "Error changing password.";
            header("Location: change-password-page.php");
            exit();
        }

        $stmt->close();
    } else {
        echo "User not found.";
    }

    $conn->close();
}
