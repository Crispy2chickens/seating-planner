<?php
session_start();

// Get the data from the POST request
$data = json_decode(file_get_contents('php://input'), true);

// Set the session variables for title, date, and start time
if (isset($data['title'], $data['date'], $data['starttime'], $data['idexamsession'])) {
    $_SESSION['title'] = $data['title'];
    $_SESSION['date'] = $data['date'];
    $_SESSION['starttime'] = $data['starttime'];
    $_SESSION['idexamsession'] = $data['idexamsession'];
    echo json_encode(['success' => true]);
} else {
    // Check which variable was not provided for more informative error messages
    $missingFields = [];
    if (!isset($data['title'])) {
        $missingFields[] = 'title';
    }
    if (!isset($data['date'])) {
        $missingFields[] = 'date';
    }
    if (!isset($data['starttime'])) {
        $missingFields[] = 'starttime';
    }
    if (!isset($data['idexamsession'])) {
        $missingFields[] = 'idexamsession';
    }

    echo json_encode([
        'success' => false,
        'message' => 'Missing fields: ' . implode(', ', $missingFields)
    ]);
}
