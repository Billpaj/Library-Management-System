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
  // ✅ Check if user has already borrowed this book and not returned
  $stmt = $pdo->prepare("SELECT * FROM borrowed_books WHERE user_id = ? AND book_id = ? AND returned = 0");
  $stmt->execute([$user_id, $book_id]);

  if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "You have already borrowed this book."]);
    exit();
  }

  // ✅ Get borrow limit from settings (fallback to 3)
  $limitQuery = $pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = 'borrow_limit'");
  $limitQuery->execute();
  $limitRow = $limitQuery->fetch(PDO::FETCH_ASSOC);
  $limit = (int)($limitRow['setting_value'] ?? 3);

  // ✅ Check total active borrows for this user
  $check = $pdo->prepare("SELECT COUNT(*) FROM borrowed_books WHERE user_id = ? AND returned = 0");
  $check->execute([$user_id]);
  $activeCount = (int)$check->fetchColumn();

  if ($activeCount >= $limit) {
    echo json_encode(["success" => false, "message" => "Borrowing limit reached (Max $limit books)."]);
    exit();
  }

  // ✅ Check book availability
  $bookCheck = $pdo->prepare("SELECT quantity FROM books WHERE id = ?");
  $bookCheck->execute([$book_id]);
  $book = $bookCheck->fetch(PDO::FETCH_ASSOC);

  if (!$book || $book['quantity'] <= 0) {
    echo json_encode(["success" => false, "message" => "This book is currently unavailable."]);
    exit();
  }

  // ✅ Insert borrow record
  $borrow_date = date('Y-m-d');
  $due_date = date('Y-m-d', strtotime('+14 days'));

  $insert = $pdo->prepare("INSERT INTO borrowed_books (user_id, book_id, borrow_date, due_date, returned) VALUES (?, ?, ?, ?, 0)");
  $insert->execute([$user_id, $book_id, $borrow_date, $due_date]);

  // ✅ Reduce book quantity
  $updateQty = $pdo->prepare("UPDATE books SET quantity = quantity - 1 WHERE id = ?");
  $updateQty->execute([$book_id]);

  echo json_encode(["success" => true, "message" => "Book borrowed successfully."]);

} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
