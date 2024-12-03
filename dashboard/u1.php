<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['email'])) {
    header("Location: index.html");
    exit();
}

$isCoordinator = $_SESSION['coordinator'];
$idUser = $_SESSION['idusers'];
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
        <img src="../img/logo.png" alt="Logo" class="logo-dashboard">
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
            <h1>Upcoming Invigilations</h1>
        </div>

        <input class="search-bar" type="text" placeholder="Search Upcoming Invigilations">

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

    <script src="popup.js"></script>
    <script src="set-session.js"></script>
    <script>
        var isCoordinator = <?php echo json_encode($isCoordinator); ?>;
        var idUser = <?php echo json_encode($idUser); ?>;
    </script>
    <script src="get-exams.js"></script>
</body>

</html>