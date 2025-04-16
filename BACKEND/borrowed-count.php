<?php
session_start();
require_once 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  echo json_encode(["count" => 0]);
  exit;
}

$stmt = $pdo->query("SELECT COUNT(*) AS count FROM borrowed_books WHERE returned = 0");
$result = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode(["count" => (int)$result['count']]);
