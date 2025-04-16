<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

// ✅ User-only access
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'user') {
  echo json_encode(["success" => false, "message" => "Unauthorized action."]);
  exit();
}

$user_id = $_SESSION['user_id'] ?? null;
$book_id = $_POST['book_id'] ?? null;

if (!$user_id || !$book_id || !is_numeric($book_id)) {
  echo json_encode(["success" => false, "message" => "Invalid request."]);
  exit();
}

try {
  // ✅ Check for existing borrow (not returned)
  $stmt = $pdo->prepare("SELECT * FROM borrowed_books WHERE user_id = ? AND book_id = ? AND returned = 0");
  $stmt->execute([$user_id, $book_id]);

  if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "You have already borrowed this book."]);
    exit();
  }

  // ✅ Insert borrow record
  $borrow_date = date('Y-m-d');
  $due_date = date('Y-m-d', strtotime('+14 days'));

  $insert = $pdo->prepare("INSERT INTO borrowed_books (user_id, book_id, borrow_date, due_date, returned) VALUES (?, ?, ?, ?, 0)");
  $insert->execute([$user_id, $book_id, $borrow_date, $due_date]);

  echo json_encode(["success" => true, "message" => "Book borrowed successfully."]);

} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
