<?php
session_start();
require_once 'db.php';
header('Content-Type: application/json');

// 🔐 Ensure the user is logged in and has the 'user' role
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'user') {
  echo json_encode(["success" => false, "message" => "Unauthorized"]);
  exit;
}

$user_id = $_SESSION['user_id'] ?? null;
$book_id = $_POST['book_id'] ?? null;

if (!$user_id || !$book_id || !is_numeric($book_id)) {
  echo json_encode(["success" => false, "message" => "Invalid book ID or user."]);
  exit;
}

try {
  // ✅ Ensure the book is currently borrowed by this user and not returned
  $stmt = $pdo->prepare("SELECT * FROM borrowed_books WHERE user_id = ? AND book_id = ? AND returned = 0");
  $stmt->execute([$user_id, $book_id]);

  if ($stmt->rowCount() === 0) {
    echo json_encode(["success" => false, "message" => "No active borrow record found for this book."]);
    exit;
  }

  // ✅ Mark the book as returned
  $update = $pdo->prepare("UPDATE borrowed_books SET returned = 1, return_date = NOW() WHERE user_id = ? AND book_id = ? AND returned = 0");
  $update->execute([$user_id, $book_id]);

  echo json_encode(["success" => true, "message" => "Book returned successfully."]);

} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
