<?php
<<<<<<< HEAD
session_start();
require_once 'db.php';
header('Content-Type: application/json');

=======
require_once 'db.php';
session_start();
header('Content-Type: application/json');

// Only allow access if the logged-in user is an admin
>>>>>>> 8695b81b2f6d45c44cb492771501f503342db4fc
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  echo json_encode([]);
  exit;
}

<<<<<<< HEAD
$stmt = $pdo->query("SELECT id, username, email, role FROM users ORDER BY id DESC");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($users);
=======
try {
  $stmt = $pdo->query("SELECT id, username, email, role FROM users ORDER BY id DESC");
  $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($users);
} catch (PDOException $e) {
  echo json_encode([]);
}
>>>>>>> 8695b81b2f6d45c44cb492771501f503342db4fc
