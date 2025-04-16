<?php
require_once 'db.php';
session_start();
header('Content-Type: application/json');

// Only allow access if the logged-in user is an admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  echo json_encode([]);
  exit;
}

try {
  $stmt = $pdo->query("SELECT id, username, email, role FROM users ORDER BY id DESC");
  $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($users);
} catch (PDOException $e) {
  echo json_encode([]);
}
