<?php
session_start();
require_once "db.php"; // Connect to the database

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
  $password = $_POST['password'];
  $role = $_POST['role'];

  try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND role = ?");
    $stmt->execute([$email, $role]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
      $_SESSION['user_id'] = $user['id'];
      $_SESSION['username'] = $user['username'];
      $_SESSION['role'] = $user['role'];

      if ($role === 'admin') {
        header("Location: ../admin/dashboard.php");
      } else {
        header("Location: ../user/dashboard.php");
      }
      exit();
    } else {
      echo "<script>alert('Invalid credentials. Please try again.'); window.location.href = '../FRONTEND/login.html';</script>";
      exit();
    }
  } catch (PDOException $e) {
    echo "<script>alert('Login error: " . $e->getMessage() . "'); window.location.href = '../FRONTEND/login.html';</script>";
    exit();
  }
} else {
  header("Location: ../FRONTEND/login.html");
  exit();
}
?>
