<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

// Optional: Only allow admins
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  echo json_encode(["success" => false, "message" => "Unauthorized access."]);
  exit();
}

$title    = trim($_POST['title'] ?? '');
$author   = trim($_POST['author'] ?? '');
$isbn     = trim($_POST['isbn'] ?? '');
$genre    = trim($_POST['genre'] ?? '');
$quantity = trim($_POST['quantity'] ?? '');
$id       = $_POST['id'] ?? null;

if ($title && $author && $isbn && $genre && is_numeric($quantity)) {
  try {
    if ($id) {
      // UPDATE
      $stmt = $pdo->prepare("UPDATE books SET title = ?, author = ?, isbn = ?, genre = ?, quantity = ? WHERE id = ?");
      $stmt->execute([$title, $author, $isbn, $genre, (int)$quantity, $id]);
      echo json_encode(["success" => true, "message" => "Book updated successfully."]);
    } else {
      // INSERT
      $stmt = $pdo->prepare("INSERT INTO books (title, author, isbn, genre, quantity) VALUES (?, ?, ?, ?, ?)");
      $stmt->execute([$title, $author, $isbn, $genre, (int)$quantity]);
      echo json_encode(["success" => true, "message" => "Book added successfully."]);
    }
  } catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
  }
} else {
  echo json_encode(["success" => false, "message" => "Missing or invalid fields."]);
}
