<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = trim($_POST['username']);
  $email = trim($_POST['email']);
  $password = $_POST['password'];
  $role = $_POST['role'];
  $phone = trim($_POST['phone']);
  $dob = $_POST['dob'];

  if ($username && $email && $password && $role && $phone && $dob) {
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
      $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role, phone, dob) VALUES (?, ?, ?, ?, ?, ?)");
      $stmt->execute([$username, $email, $hashedPassword, $role, $phone, $dob]);

      echo "<script>alert('Account created successfully!'); window.location.href = '../FRONTEND/Login.html';</script>";
      exit();

    } catch (PDOException $e) {
      if ($e->getCode() === '23000') {
        echo "<script>alert('Email already exists.'); window.location.href = '../FRONTEND/signup.html';</script>";
      } else {
        echo "<script>alert('Error: " . $e->getMessage() . "'); window.location.href = '../FRONTEND/signup.html';</script>";
      }
    }
  } else {
    echo "<script>alert('All fields are required.'); window.location.href = '../FRONTEND/signup.html';</script>";
  }
} else {
  header("Location: ../FRONTEND/signup.html");
  exit();
}
?>
