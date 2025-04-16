<?php
session_start();
require_once 'db.php';
header('Content-Type: application/json');

// 🔐 Auth check
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'user') {
  echo json_encode([]);
  exit;
}

$user_id = $_SESSION['user_id'];

// 📥 Fetch borrowed books with borrow & due dates
$stmt = $pdo->prepare("
  SELECT 
    b.id, b.title, b.author,
    DATE_FORMAT(bb.borrow_date, '%Y-%m-%d') AS borrow_date,
    DATE_FORMAT(bb.due_date, '%Y-%m-%d') AS due_date
  FROM books b
  JOIN borrowed_books bb ON b.id = bb.book_id
  WHERE bb.user_id = ? AND bb.returned = 0
");
$stmt->execute([$user_id]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
