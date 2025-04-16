<?php
session_start();
require_once 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  echo json_encode([]);
  exit;
}

$stmt = $pdo->query("SELECT id, username, email, role FROM users ORDER BY id DESC");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($users);
