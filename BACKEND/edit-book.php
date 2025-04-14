<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

// 🔐 Admin-only access
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  echo json_encode(["success" => false, "message" => "Unauthorized access."]);
  exit();
}

parse_str(file_get_contents("php://input"), $_PUT);

$id       = $_GET['id'] ?? null;
$title    = trim($_PUT['title'] ?? '');
$author   = trim($_PUT['author'] ?? '');
$isbn     = trim($_PUT['isbn'] ?? '');
$genre    = trim($_PUT['genre'] ?? '');
$quantity = trim($_PUT['quantity'] ?? '');

if ($id && $title && $author && $isbn && $genre && is_numeric($quantity)) {
  try {
    $stmt = $pdo->prepare("UPDATE books SET title = ?, author = ?, isbn = ?, genre = ?, quantity = ? WHERE id = ?");
    $stmt->execute([$title, $author, $isbn, $genre, (int)$quantity, $id]);

    echo json_encode(["success" => true, "message" => "Book updated successfully."]);
  } catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
  }
} else {
  echo json_encode(["success" => false, "message" => "Missing or invalid fields."]);
}
