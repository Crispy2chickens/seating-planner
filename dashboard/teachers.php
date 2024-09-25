<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['email'])) {
    header("Location: index.html");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="dashboard.css">
    <title>Dashboard</title>
</head>

<body>
    <div class="menu-bar">
        <div class="left-menu-bar">
            <img src="../img/logo.png" alt="Logo" class="logo-dashboard">
            <a href="u0.php" class="nav-link" onclick="setActive(this)">Upcoming Seating Plans</a>
            <a href="archived.php" class="nav-link" onclick="setActive(this)">Archived</a>
            <a href="teachers.php" class="nav-link active" onclick="setActive(this)">Teachers</a>
        </div>

        <div class="user-name" onclick="myFunction()"><?php echo $_SESSION['firstname'] . ' ' . $_SESSION['lastname']; ?>
            <span class="popuptext" id="myPopup">
                <a href="change-password.php">Change Password</a>
                <a href="../logout.php">Log out</a>
            </span>
            <!-- https://www.w3schools.com/howto/howto_js_popup.asp -->
        </div>
    </div>
    <div class="main-container">
        <div class="top-teachers">
            <h1>Teachers</h1>
            <button class="add">Add new</button>
        </div>

        <input class="search-bar" type="text" placeholder="Search Teachers">

        <div class="table-container">
            <table id="data-table">
                <colgroup>
                    <col class="name">
                    <col class="email">
                    <col class="operation">
                </colgroup>
                <thead>
                    <tr class="table-height-exception">
                        <th>Name</th>
                        <th>Email</th>
                        <th>Operation</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    </div>

    <div class="teacher-modal">
        <div class="teacher-modal-content">
            <span class="close">&times;</span>
            <h2 class="modal-h2">Add New Teacher</h2>
            <form id="new-teacher-form">
                <div class="add-new-containers">
                    <label for="new-teacher-email">Email Address:</label>
                    <input type="email" id="new-teacher-email" name="email" placeholder="Enter email address">
                </div>

                <div class="add-new-containers">
                    <label for="new-teacher-firstname">First Name:</label>
                    <input type="text" id="new-teacher-firstname" name="firstname" placeholder="Enter first name">

                    <label for="new-teacher-lastname">Last Name:</label>
                    <input type="text" id="new-teacher-lastname" name="lastname" placeholder="Enter last name">
                </div>

                <div class="add-new-containers">
                    <label for="new-teacher-password">Password:</label>
                    <input type="password" id="new-teacher-password" name="password" placeholder="Enter password">
                </div>

                <div class="add-new-containers">
                    <label for="new-teacher-coordinator">Coordinator:</label>
                    <input type="checkbox" id="new-teacher-coordinator" name="coordinator">
                </div>

                <button type="submit" class="submit-new-teacher">Submit</button>
            </form>
        </div>
    </div>

    <script src="menu.js"></script>
    <script src="popup.js"></script>
    <script src="get-teachers.js"></script>
    <script src="add-teacher.js"></script>
    <script src="delete.js"></script>
</body>

</html>