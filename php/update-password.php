<?php
include("database.php");

// Set timezone
date_default_timezone_set('Asia/Dhaka');

// Check request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $token = trim($_POST["token"] ?? '');
    $new_password = $_POST["new_password"] ?? '';
    $confirm_password = $_POST["confirm_password"] ?? '';

    if (empty($token) || empty($new_password)) {
        $message = ["error" => "Missing token or password."];
    } elseif ($new_password !== $confirm_password) {
        $message = ["error" => "Passwords do not match."];
    } else {
        // Query DB for token
        $stmt = $conn->prepare("SELECT * FROM users WHERE reset_token = ? AND token_expiry > NOW()");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            $message = ["error" => "Invalid or expired token."];
        } else {
            $user = $result->fetch_assoc();
            $email = $user['user_email'];

            // Update password (no hashing, as requested)
            $update = $conn->prepare("UPDATE users SET Pass = ?, reset_token = NULL, token_expiry = NULL WHERE user_email = ?");
            $update->bind_param("ss", $new_password, $email);

            if ($update->execute()) {
                $message = ["success" => "✅ Password updated successfully. You can now login."];
            } else {
                $message = ["error" => "❌ Failed to update password."];
            }
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Password Reset Result</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f7f7f7;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .message-box {
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            padding: 30px 40px;
            text-align: center;
        }

        .message-box h2 {
            color: #333;
        }

        .message-box .success {
            color: #1c9c52;
            font-weight: bold;
            margin-top: 20px;
        }

        .message-box .error {
            color: #c0392b;
            font-weight: bold;
            margin-top: 20px;
        }

        .back-btn {
            display: inline-block;
            margin-top: 20px;
            background: #3498db;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 6px;
        }

        .back-btn:hover {
            background: #2980b9;
        }
    </style>
</head>
<body>
    <div class="message-box">
        <h2>Password Reset Status</h2>
        <?php if (isset($message['success'])): ?>
            <div class="success"><?= $message['success'] ?></div>
        <?php elseif (isset($message['error'])): ?>
            <div class="error"><?= $message['error'] ?></div>
        <?php endif; ?>
        <a href="login.php" class="back-btn">Return to Login</a>
    </div>
</body>
</html>