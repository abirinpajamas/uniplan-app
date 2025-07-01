<?php
include("database.php");
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Invalid request method"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || empty($data->email)) {
    echo json_encode(["success" => false, "error" => "Email is required"]);
    exit;
}

$email = $data->email;

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "error" => "Invalid email address"]);
    exit;
}

if (!$conn) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

// ✅ Check if email exists
$stmt = $conn->prepare("SELECT * FROM users WHERE user_email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $logM= "email:\n" . print_r($result, true) . "\n--------------------\n";
    file_put_contents('debug4.log', $logM, FILE_APPEND);

    echo json_encode(["success" => false, "error" => "Email not found"]);
    exit;
}
$logM= "email:\n" . print_r($result, true) . "\n--------------------\n";
file_put_contents('debug4.log', $logM, FILE_APPEND);

// ✅ Generate reset token
date_default_timezone_set('Asia/Dhaka'); 

$token = bin2hex(random_bytes(32));
$expiry = date("Y-m-d H:i:s", strtotime("+1 hour"));

// ✅ Save token & expiry
$update = $conn->prepare("UPDATE users SET reset_token = ?, token_expiry = ? WHERE user_email = ?");
$update->bind_param("sss", $token, $expiry, $email);

if (!$update->execute()) {
    $logM= "save:\n" . print_r($result, true) . "\n--------------------\n";
    file_put_contents('debug4.log', $logM, FILE_APPEND);
    echo json_encode(["success" => false, "error" => "Failed to save reset token"]);
    exit;
    
}

// Optional: for debugging (don't keep this in production)
// echo json_encode(["debug_token" => $token]);

// ✅ Send the email using PHPMailer
try {
    $logM= "fm:\n" . print_r($result, true) . "\n--------------------\n";
    file_put_contents('debug4.log', $logM, FILE_APPEND);
    $mail = new PHPMailer(true);
    
    $mail->isSMTP();
    $mail->Host = 'smtp-relay.brevo.com';
    $mail->SMTPAuth = true;
    $mail->Username = '8989ae001@smtp-brevo.com';
    $mail->Password = 'xyHT1PaQzK4FdIYc';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    
    $mail->setFrom('sadman.sakib16@northsouth.edu', 'UniPlan');
    $mail->addAddress($email);
    
    $mail->isHTML(true);
    $mail->Subject = 'Password Reset Link';
    $resetLink = "http://localhost/website/php/reset-password.php?token=$token";
    $mail->Body = "Click <a href='$resetLink'>here</a> to reset your password. This link will expire in 1 hour.";
    
    $mail->send();
    $logM= "new:\n" . print_r($result, true) . "\n--------------------\n";
    file_put_contents('debug4.log', $logM, FILE_APPEND);
    echo json_encode(["success" => true, "message" => "A reset link has been sent to your email."]);
} catch (Exception $e) {
    $logM= "error:\n" . print_r($result, true) . "\n--------------------\n";
    file_put_contents('debug4.log', $logM, FILE_APPEND);
    echo json_encode(["success" => false, "error" => "Mailer Error: " . $mail->ErrorInfo]);
}