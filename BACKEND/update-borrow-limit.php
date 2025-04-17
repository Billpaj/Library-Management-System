<?php
session_start();
require_once 'db.php';
header('Content-Type: application/json');

// Admin check
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  echo json_encode(["success" => false, "message" => "Unauthorized"]);
  exit;
}

$limit = $_POST['limit'] ?? null;

if (!is_numeric($limit) || $limit <= 0) {
  echo json_encode(["success" => false, "message" => "Invalid limit"]);
  exit;
}

try {
  $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('borrow_limit', ?) 
                         ON DUPLICATE KEY UPDATE setting_value = ?");
  $stmt->execute([$limit, $limit]);

  echo json_encode(["success" => true, "message" => "Borrow limit updated to $limit."]);
} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
