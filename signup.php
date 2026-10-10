
<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/session.php';

if (isset($_SESSION['user_id'])) {
    header('Location: index.html');
    exit;
}

$error = '';
$fullName = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = trim($_POST['full_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    if ($fullName === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter your name and a valid email address.';
    } elseif (strlen($password) < 8) {
        $error = 'Password must contain at least 8 characters.';
    } elseif ($password !== $confirmPassword) {
        $error = 'Passwords do not match.';
    } else {
        $stmt = $conn->prepare(
            'SELECT id FROM users WHERE email = ?'
        );
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $error = 'This email is already registered.';
        }
        $stmt->close();

        if ($error === '') {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $conn->prepare(
                'INSERT INTO users (full_name, email, password_hash)
                 VALUES (?, ?, ?)'
            );
            $stmt->bind_param('sss', $fullName, $email, $passwordHash);

            if ($stmt->execute()) {
                $stmt->close();
                header('Location: login.php?registered=1');
                exit;
            }

            $stmt->close();
            $error = 'Registration failed. Please try again.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up | NutriWell</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .auth-card {
            max-width: 460px;
            margin: 50px auto;
            padding: 32px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 8px 30px rgba(0,0,0,.10);
        }
        .auth-card h1 { text-align: center; margin-bottom: 10px; }
        .auth-card .subtitle { text-align: center; margin-bottom: 24px; }
        .auth-card label { display: block; margin: 15px 0 6px; }
        .auth-card input {
            box-sizing: border-box;
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 8px;
        }
        .auth-card button {
            width: 100%;
            margin-top: 22px;
            padding: 13px;
            border: none;
            border-radius: 8px;
            background: #245b45;
            color: white;
            font-size: 16px;
            cursor: pointer;
        }
        .auth-message {
            padding: 12px;
            margin-bottom: 16px;
            border-radius: 8px;
            background: #fff0ef;
            color: #a32121;
        }
        .auth-switch { text-align: center; margin-top: 20px; }
    </style>
</head>
<body>
    <main class="auth-card">
        <h1>Create Account</h1>
        <p class="subtitle">Join NutriWell for a healthier lifestyle.</p>

        <?php if ($error !== ''): ?>
            <div class="auth-message">
                <?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="signup.php">
            <label for="full_name">Full Name</label>
            <input type="text" id="full_name" name="full_name"
                   maxlength="100" required
                   value="<?= htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8') ?>">

            <label for="email">Email Address</label>
            <input type="email" id="email" name="email"
                   maxlength="255" required
                   value="<?= htmlspecialchars($email, ENT_QUOTES, 'UTF-8') ?>">

            <label for="password">Password</label>
            <input type="password" id="password" name="password"
                   minlength="8" required>

            <label for="confirm_password">Confirm Password</label>
            <input type="password" id="confirm_password"
                   name="confirm_password" minlength="8" required>

            <button type="submit">Create Account</button>
        </form>

        <p class="auth-switch">
            Already have an account? <a href="login.php">Log in</a>
        </p>
    </main>
</body>
</html>
