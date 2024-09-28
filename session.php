<?php
session_start(); // Start the session

// Handle any error messages
if (isset($_SESSION['error'])) {
    echo "<p class='error-message'>" . htmlspecialchars($_SESSION['error']) . "</p>";
    unset($_SESSION['error']);
}
