<?php
include '../session.php';

// Check if the user is logged in
if (!isset($_SESSION['email'])) {
    header("Location: index.html");
    exit();
}

$isCoordinator = $_SESSION['coordinator'];

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
            <a href="u0.php" class="nav-link active" onclick="setActive(this)">Upcoming Seating Plans</a>
            <a href="archived.php" class="nav-link" onclick="setActive(this)">Archived</a>
            <a href="teachers.php" class="nav-link" onclick="setActive(this)">Teachers</a>
        </div>

        <div class="user-name" onclick="myFunction()"><?php echo $_SESSION['firstname'] . ' ' . $_SESSION['lastname']; ?>
            <span class="popuptext" id="myPopup">
                <a href="../change-password.php">Change Password</a>
                <a href="../logout.php">Log out</a>
            </span>
            <!-- https://www.w3schools.com/howto/howto_js_popup.asp -->
        </div>
    </div>
    <div class="main-container">
        <div class="top">
            <h1>Upcoming Exam Sessions</h1>
            <button class="add">Add new</button>
        </div>

        <input class="search-bar" type="text" placeholder="Search Upcoming Exam Sessions">

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

    <div class="exam-modal">
        <div class="exam-modal-content">
            <span class="close">&times;</span>
            <h2 class="modal-h2">Add New Exam Session</h2>
            <form id="new-exam-form">
                <div class="add-new-containers">
                    <label for="new-exam-title">Title:</label>
                    <input type="text" id="new-exam-title" name="title" placeholder="Enter exam title" required>
                </div>

                <div class="add-new-containers">
                    <label for="new-exam-date">Date:</label>
                    <input type="date" id="new-exam-date" name="date" required>
                </div>

                <div class="add-new-containers">
                    <label for="new-exam-startingtime">Starting Time:</label>
                    <input type="time" id="new-exam-startingtime" name="startingtime" required>
                </div>

                <button type="submit" class="submit-new-exam">Submit</button>
            </form>
        </div>
    </div>

    <script src="menu.js"></script>
    <script src="popup.js"></script>
    <script src="set-session.js"></script>
    <script>
        var isCoordinator = <?php echo json_encode($isCoordinator); ?>;
        console.log(isCoordinator); // Verify this value in the browser console
    </script>
    <script src="get-exams.js"></script>
    <script src="archive.js"></script>
    <script src="add-exam.js"></script>
    <script src="delete.js"></script>
</body>

</html>