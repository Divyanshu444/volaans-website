<?php
// Get form data
$firstName = $_POST['firstName'] ?? '';
$lastName = $_POST['lastName'] ?? '';
$phone = $_POST['phone'] ?? '';
$email = $_POST['email'] ?? '';
$serviceType = $_POST['serviceType'] ?? '';
$message = $_POST['message'] ?? '';

// Email details
$to = "roshansharma171020@gmail.com"; // Replace with your email
$subject = "New Contact Form Submission from $firstName $lastName";

// Email content
$emailContent = "
<html>
<head>
    <title>New Contact Form Submission</title>
</head>
<body>
    <h2>Contact Form Details</h2>
    <p><strong>Name:</strong> $firstName $lastName</p>
    <p><strong>Phone:</strong> $phone</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Service Type:</strong> $serviceType</p>
    <p><strong>Message:</strong> $message</p>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: $email" . "\r\n";

// Send email
$mailSent = mail($to, $subject, $emailContent, $headers);

// Return JSON response
header('Content-Type: application/json');
if($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Thank you! Your message has been sent successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Sorry, there was an error sending your message.']);
}
?> 