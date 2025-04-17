<?php
require_once 'db.php';
header('Content-Type: application/json');

try {
  $stmt = $pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = 'borrow_limit'");
  $stmt->execute();
  $value = $stmt->fetchColumn();

  echo json_encode(["limit" => (int)$value]);
} catch (PDOException $e) {
  echo json_encode(["error" => "Error: " . $e->getMessage()]);
}
