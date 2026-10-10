
<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/session.php';

if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

$error = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
        $error = 'Please enter a valid email and password.';
    } else {
        $stmt = $conn->prepare(
            'SELECT id, full_name, email, password_hash
             FROM users WHERE email = ?'
        );

        $stmt->bind_param('s', $email);
        $stmt->execute();

        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();

        if ($user && password_verify($password, $user['password_hash'])) {
            session_regenerate_id(true);

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['full_name'];
            $_SESSION['user_email'] = $user['email'];

            header('Location: index.php');
            exit;
        }

        $error = 'Invalid email or password.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | NutriWell</title>
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

        .auth-card h1,
        .auth-card .subtitle {
            text-align: center;
        }

        .auth-card .subtitle {
            margin-bottom: 24px;
        }

        .auth-card label {
            display: block;
            margin: 15px 0 6px;
        }

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

        .auth-success {
            padding: 12px;
            margin-bottom: 16px;
            border-radius: 8px;
            background: #e6f4ea;
            color: #1e6b34;
        }

        .auth-switch {
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <main class="auth-card">
        <h1>Welcome Back</h1>
        <p class="subtitle">Log in to continue your NutriWell journey.</p>

        <?php if (isset($_GET['registered'])): ?>
            <div class="auth-success">
                Account created successfully. Please log in.
            </div>
        <?php endif; ?>

        <?php if ($error !== ''): ?>
            <div class="auth-message">
                <?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php">
            <label for="email">Email Address</label>
            <input
                type="email"
                id="email"
                name="email"
                maxlength="255"
                required
                value="<?= htmlspecialchars($email, ENT_QUOTES, 'UTF-8') ?>"
            >

            <label for="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                required
            >

            <button type="submit">Log In</button>
        </form>

        <p class="auth-switch">
            Don't have an account?
            <a href="signup.php">Sign up</a>
        </p>
    </main>
</body>
</html>
