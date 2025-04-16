<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

// 🔐 Admin-only access
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  http_response_code(403);
  echo json_encode(["success" => false, "message" => "Unauthorized"]);
  exit();
}

try {
  // ✅ Fetch all users except the admin viewing
  $stmt = $pdo->query("SELECT id, username, email, role FROM users ORDER BY id DESC");
  $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($users);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
