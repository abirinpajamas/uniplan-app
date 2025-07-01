<?php
// Get the token from the URL
$token = isset($_GET['token']) ? $_GET['token'] : '';
if (empty($token)) {
    echo "Invalid or expired token.";
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
    <style>
        body {
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 400px;
            margin: 100px auto;
            background-color: #0a0450;
            padding: 30px;
            border-radius: 15px;
            color: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        input[type="password"], button {
            width: 100%;
            padding: 12px;
            margin: 10px 0 20px;
            border: none;
            border-radius: 8px;
        }
        input[type="password"] {
            background-color: #fff;
            color: #000;
        }
        button {
            background-color: white;
            color: #0a0450;
            font-weight: bold;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Reset Your Password</h2>
        <form method="POST" action="update-password.php">
        <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">

            <label for="new_password">New Password:</label>
            <input type="password" id="new_password" name="new_password" required>

            <label for="confirm_password">Confirm Password:</label>
            <input type="password" id="confirm_password" name="confirm_password" required>

            <button type="submit">Update Password</button>
        </form>
    </div>
</body>
</html>