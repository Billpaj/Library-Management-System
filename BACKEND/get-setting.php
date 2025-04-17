<?php
require_once 'db.php';
header('Content-Type: application/json');

$key = $_GET['key'] ?? '';

if (!$key) {
  echo json_encode(["success" => false, "message" => "No key specified"]);
  exit;
}

$stmt = $pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = ?");
$stmt->execute([$key]);

$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo json_encode(["success" => true, "value" => $row['setting_value'] ?? null]);
