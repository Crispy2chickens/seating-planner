<?php
include '../session.php'; // Adjust the path to where session.php is located

$isCoordinator = $_SESSION['coordinator'];
$_SESSION['idvenue'] = '2';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="seating-map.css">
    <title>Dashboard</title>
</head>

<body>
    <div class="menu-bar">
        <div class="left-menu-bar">
            <a href="../dashboard/u0.php" class="arrow-container">
                <span class="arrow">&#x25C0;</span>
                <span class="arrow second">&#x25C0;</span>
            </a>
        </div>

        <div class="middle-menu-bar">
            <div class="middle-menu-bar">
                <a href="seating-map-1.php" class="nav-link" onclick="setActive(this)">Venue 1</a>
                <a href="seating-map-2.php" class="nav-link active" onclick="setActive(this)">Venue 2</a>
                <a href="seating-map-3.php" class="nav-link" onclick="setActive(this)">Venue 3</a>
            </div>

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
        <div class="seating-map">
            <?php
            if (isset($_SESSION['title'])) {
                $title = htmlspecialchars($_SESSION['title']);
            } else {
                $title = "No title available";
            }

            if (isset($_SESSION['date'])) {
                $date = htmlspecialchars($_SESSION['date']);
            } else {
                $date = "No date available";
            }

            if (isset($_SESSION['starttime'])) {
                $starttime = htmlspecialchars($_SESSION['starttime']);
            } else {
                $starttime = "No start time available";
            }

            if (isset($_SESSION['idexamsession'])) {
                $idexamsession = htmlspecialchars($_SESSION['idexamsession']);
            } else {
                $idexamsession = "No session ID available";
            }
            ?>

            <div class="exam-details">

                <div class="entity-container">
                    <h1 class="exam-title"><?php echo $title; ?></h1>
                    <?php if ($isCoordinator == 1): ?>
                        <a class="edit-icon">
                            <img src="../img/edit-icon-2.png" alt="Edit">
                        </a>
                    <?php endif; ?>
                </div>

                <div class="edit-section">
                    <div class="edit-section-content">
                        <span class="close">&times;</span>
                        <h2 class="modal-h2">Edit Title</h2>
                        <form id="edit-title-form">
                            <input type="hidden" id="idexamsession" value="<?php echo $_SESSION['idexamsession']; ?>">
                            <input type="text" id="edit-title" value="<?php echo $title; ?>">
                            <button type="submit" class="submit-changes">Save Changes</button>
                        </form>
                    </div>
                </div>

                <div class="exam-timing">
                    <div class="entity-container">
                        <p class="date-container">Date: <?php echo $date; ?></p>
                        <?php if ($isCoordinator == 1): ?>
                            <a class="edit-icon">
                                <img src="../img/edit-icon-2.png" alt="Edit">
                            </a>
                        <?php endif; ?>
                    </div>

                    <div class="edit-section">
                        <div class="edit-section-content">
                            <span class="close">&times;</span>
                            <h2 class="modal-h2">Edit Date</h2>
                            <form id="edit-date-form">
                                <input type="hidden" id="idexamsession" value="<?php echo $_SESSION['idexamsession']; ?>">
                                <input type="date" id="edit-date" value="<?php echo $date; ?>">
                                <button type="submit" class="submit-changes">Save Changes</button>
                            </form>
                        </div>
                    </div>

                    <div class="entity-container">
                        <p class="start-time">Start Time: <?php echo $starttime; ?></p>
                        <?php if ($isCoordinator == 1): ?>
                            <a class="edit-icon">
                                <img src="../img/edit-icon-2.png" alt="Edit">
                            </a>
                        <?php endif; ?>
                    </div>

                    <div class="edit-section">
                        <div class="edit-section-content">
                            <span class="close">&times;</span>
                            <h2 class="modal-h2">Edit Time</h2>
                            <form id="edit-time-form">
                                <input type="hidden" id="idexamsession" value="<?php echo $_SESSION['idexamsession']; ?>">
                                <input type="time" id="edit-time">
                                <button type="submit" class="submit-changes">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div class="map-2"
                id="map"
                data-is-coordinator="<?php echo htmlspecialchars(json_encode($_SESSION['coordinator'])); ?>">
                <!-- Seats Here -->
            </div>

            <div class="addstudent-modal">
                <div class="addstudent-modal-content">
                    <button id="add-student" class="add-student">Add By Student</button>
                    <button id="add-subject" class="add-subject">Add By Subjects</button>
                </div>
            </div>

        </div>

        <div class="right-page">
            <div class="invigilators-reg">
                <h2 class="invigilators-h2">Invigilators</h2>
                <div class="invigilators-container">
                    <div id="user-list"></div>

                    <?php if ($isCoordinator == 1): ?>
                        <button id="add-invigilators">Add Invigilators</button>
                    <?php endif; ?>

                    <div id="add-invigilators-modal" class="modal">
                        <div class="modal-content">
                            <span class="close">&times;</span>
                            <h2 class="modal-h2">Add Invigilators</h2>

                            <form id="add-invigilators-form">
                                <label for="idusers">Invigilator:</label>
                                <select id="idusers">
                                    <!-- Options for invigilators will be dynamically populated -->
                                </select>
                                <br>
                                <input type="hidden" id="idexamsession" value="<?php echo $_SESSION['idexamsession']; ?>"> <!-- Set exam session ID dynamically -->
                                <input type="hidden" id="idvenue" value="<?php echo $_SESSION['idvenue']; ?>">
                                <button type="submit" class="submit-changes">Add Invigilator</button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>

            <div class="messaging-box"></div>
        </div>
    </div>

    <script src="../dashboard/menu.js"></script>
    <script src="../dashboard/popup.js"></script>
    <script src="edit.js"></script>
    <script src="get-invigilators.js"></script>
    <?php if ($isCoordinator == 1): ?>
        <script src="add-invigilators.js"></script>
    <?php endif; ?>
    <script src="grid.js"></script>
</body>

</html>