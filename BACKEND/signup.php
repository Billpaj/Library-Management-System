<?php
require_once 'db.php';
session_start();

header('Content-Type: application/json');

// ✅ Block invalid methods
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(["success" => false, "message" => "Invalid request method."]);
  exit();
}

// ✅ Input sanitization
function sanitize($data) {
  return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// ✅ Get and clean form input
$username = sanitize($_POST['username'] ?? '');
$email    = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$password = $_POST['password'] ?? '';
$role     = sanitize($_POST['role'] ?? '');
$dob      = $_POST['dob'] ?? '';
$phone    = sanitize($_POST['phone'] ?? '');

// ✅ Validate all fields
if (!$username || !$email || !$password || !$role || !$dob || !$phone) {
  echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
  exit();
}

try {
  // ✅ Check for duplicate email
  $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
  $stmt->execute([$email]);

  if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "Email already registered."]);
    exit();
  }

  // ✅ Hash password
  $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

  // ✅ Save to database
  $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role, dob, phone) VALUES (?, ?, ?, ?, ?, ?)");
  $stmt->execute([$username, $email, $hashedPassword, $role, $dob, $phone]);

  echo json_encode(["success" => true, "message" => "Account created successfully."]);

} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
