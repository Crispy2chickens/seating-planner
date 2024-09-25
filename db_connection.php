<?php
$servername = "localhost:3306";
$username = "root";  // Replace with your database username
$serverpassword = "Apple123!";  // Replace with your database password
$dbname = "seatingplanner";  // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $serverpassword, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
