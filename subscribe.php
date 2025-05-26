<?php
// Set headers to allow AJAX requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Get the email from the POST request
$email = isset($_POST['email']) ? trim($_POST['email']) : '';

// Validate email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Format data to be saved
$data = date('Y-m-d H:i:s') . ' - ' . $email . PHP_EOL;

// Save to subscribers.txt file
$file = 'subscribers.txt';
if (file_put_contents($file, $data, FILE_APPEND | LOCK_EX)) {
    echo json_encode(['success' => true, 'message' => 'Subscription successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save subscription']);
}
?> 