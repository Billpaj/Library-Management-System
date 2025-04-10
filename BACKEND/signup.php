<?php
require_once "db.php"; // Connect to the database

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Collect and sanitize form inputs
  $username = htmlspecialchars(trim($_POST['username']));
  $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
  $role = $_POST['role'];
  $dob = $_POST['dob'];
  $phone = htmlspecialchars(trim($_POST['phone']));
  $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

  try {
    // Prepare SQL insert statement
    $stmt = $pdo->prepare("INSERT INTO users (username, email, role, dob, phone, password) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$username, $email, $role, $dob, $phone, $password]);

    echo "<script>alert('Account created successfully! Please log in.'); window.location.href = '../FRONTEND/login.html';</script>";
    exit();

  } catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Duplicate email error
      echo "<script>alert('This email is already registered. Please log in.'); window.location.href = '../FRONTEND/signup.html';</script>";
    } else {
      echo "<script>alert('Signup failed: " . $e->getMessage() . "'); window.location.href = '../FRONTEND/signup.html';</script>";
    }
    exit();
  }
} else {
  header("Location: ../FRONTEND/signup.html");
  exit();
}
?>
