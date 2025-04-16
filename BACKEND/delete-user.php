<?php
session_start();
require_once 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  echo json_encode(["success" => false, "message" => "Unauthorized."]);
  exit;
}

$id = $_POST['id'] ?? '';
if (!$id || !is_numeric($id)) {
  echo json_encode(["success" => false, "message" => "Invalid ID."]);
  exit;
}

try {
  $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
  $stmt->execute([$id]);
  echo json_encode(["success" => true, "message" => "User deleted successfully."]);
} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
