<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="main.css">
    <title>Change Password</title>
</head>

<body>
    <div class="center-container">
        <img src="logo.png" alt="Logo" class="logo">
        <h1>Change Password</h1>

        <form action="change-password.php" method="post">
            <label for="new-password">New Password:</label>
            <input type="password" id="new-password" name="new-password" required>
            <label for="confirm-password">Confirm New Password:</label>
            <input type="password" id="confirm-password" name="confirm-password" required>

            <?php
            session_start();
            if (isset($_SESSION['error'])) {
                echo "<p class='error-message'>" . $_SESSION['error'] . "</p>";
                unset($_SESSION['error']);
            }
            ?>

            <button type="submit" class="change-password-button">Change Password</button>
        </form>
    </div>
</body>

</html>