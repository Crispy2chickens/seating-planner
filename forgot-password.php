<?php
session_start();
require 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];

    $stmt = $conn->prepare("SELECT iduser FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows == 1) {
        $token = bin2hex(random_bytes(16)); // Generate a token
        $expires = date("U") + 3600; // Token expires in 1 hour

        // Insert token into the database
        $stmt = $conn->prepare("INSERT INTO password_resets (email, token, expires) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $email, $token, $expires);
        $stmt->execute();

        // Send email with reset link
        $reset_link = "http://yourdomain.com/reset_password.php?token=" . $token;
        $subject = "Password Reset Request";
        $message = "Please click the link to reset your password: " . $reset_link;
        $headers = "From: no-reply@yourdomain.com";

        mail($email, $subject, $message, $headers);

        echo "A password reset link has been sent to your email.";
    } else {
        echo "No account found with that email address.";
    }

    $stmt->close();
    $conn->close();
}
