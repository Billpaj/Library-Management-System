<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

//  Only admins can update settings
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  echo json_encode(["success" => false, "message" => "Unauthorized"]);
  exit;
}

$key = $_POST['key'] ?? '';
$value = $_POST['value'] ?? '';

if (!$key || !$value) {
  echo json_encode(["success" => false, "message" => "Missing data"]);
  exit;
}

try {
  $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value)
    VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
  $stmt->execute([$key, $value, $value]);

  echo json_encode(["success" => true, "message" => "Setting updated."]);
} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
