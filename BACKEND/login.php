<?php
require_once 'db.php';
session_start();

header('Content-Type: application/json');

// ✅ Block any non-POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(["success" => false, "message" => "Invalid request method."]);
  exit();
}

// ✅ Sanitize helper
function sanitize($data) {
  return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$password = $_POST['password'] ?? '';
$role = sanitize($_POST['role'] ?? '');

// ✅ Check for required fields
if (!$email || !$password || !$role) {
  echo json_encode(["success" => false, "message" => "All fields are required."]);
  exit();
}

try {
  $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND role = ?");
  $stmt->execute([$email, $role]);
  $user = $stmt->fetch();

  if ($user && password_verify($password, $user['password'])) {
    // Make sure these are set in your login.php
$_SESSION['user_id'] = $user['id'];
$_SESSION['role'] = $user['role'];
$_SESSION['username'] = $user['username'];
    echo json_encode(["success" => true, "redirect" => $role === 'admin' ? 'admin.html' : 'user.html']);
  } else {
    echo json_encode(["success" => false, "message" => "Invalid credentials."]);
  }
} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
