<?php
include '../../session.php'; // Adjust the path to where session.php is located

$isCoordinator = $_SESSION['coordinator'];
$_SESSION['idvenue'] = '3';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../seating-map.css">
    <title>Dashboard</title>
</head>

<body>
    <div class="menu-bar">
        <div class="left-menu-bar">x
            <a href="../../dashboard/u0.php" class="arrow-container">
                <span class="arrow">&#x25C0;</span>
                <span class="arrow second">&#x25C0;</span>
            </a>
        </div>

        <div class="middle-menu-bar">
            <div class="middle-menu-bar">
                <a href="seating-map-1-print.php" class="nav-link" onclick="setActive(this)">Venue 1</a>
                <a href="seating-map-2-print.php" class="nav-link" onclick="setActive(this)">Venue 2</a>
                <a href="seating-map-3-print.php" class="nav-link active" onclick="setActive(this)">Venue 3</a>
            </div>

        </div>

        <div class="user-name" onclick="myFunction()"><?php echo $_SESSION['firstname'] . ' ' . $_SESSION['lastname']; ?>
            <span class="popuptext" id="myPopup">
                <a href="../../change-password.php">Change Password</a>
                <a href="../../logout.php">Log out</a>
            </span>
            <!-- https://www.w3schools.com/howto/howto_js_popup.asp -->
        </div>
    </div>

    <div class="main-container-print">
        <div class="seating-map-print">
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
                </div>

                <div class="exam-timing">
                    <div class="entity-container">
                        <p class="date-container">Date: <?php echo $date; ?></p>
                    </div>

                    <div class="entity-container">
                        <p class="start-time">Start Time: <?php echo $starttime; ?></p>
                    </div>

                </div>
            </div>

            <div class="map-3" style="height: calc(100vh - 220px);" id="map" data-is-coordinator="<?php echo htmlspecialchars(json_encode($_SESSION['coordinator'])); ?>">
                <!-- Seats Here -->
            </div>
        </div>
    </div>

    <script src="../../dashboard/popup.js"></script>
    <script src="grid-print.js"></script>
</body>

</html>