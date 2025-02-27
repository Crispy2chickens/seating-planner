<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="main.css">
    <title>Login</title>
</head>

<body>
    <div class="center-container">
        <img src="img/logo.png" alt="Logo" class="logo">
        <h1>Login</h1>

        <form action="login.php" method="post">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>

            <?php
            include 'session.php'; // Update this path to your session.php file
            ?>

            <button type="submit" class="login-button">Log in</button>
        </form>
    </div>
</body>

</html>