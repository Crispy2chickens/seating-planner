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
            <a href="archived.php" class="nav-link active" onclick="setActive(this)">Archived</a>
            <a href="teachers.php" class="nav-link" onclick="setActive(this)">Teachers</a>
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
        <div class="top">
            <h1>Archived</h1>
            <button class="add-exam">Add new</button>
        </div>

        <div class="search">
            <input class="search-bar" type="text" placeholder="Search Archived">
            <button class="filter">Filter</button>
        </div>

        <div class="table-container">
            <table id="data-table">
                <colgroup>
                    <col class="title">
                    <col class="date">
                    <col class="starttime">
                    <col>
                </colgroup>
                <thead>
                    <tr class="table-height-exception">
                        <th>Title</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>Operation</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    </div>

    <script src="menu.js"></script>
    <script src="popup.js"></script>
    <script src="get-archived-exams.js"></script>
</body>

</html>