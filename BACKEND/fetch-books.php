<?php
require_once 'db.php';

header('Content-Type: application/json');

$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
$offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
if ($limit > 0) {
  $stmt = $pdo->prepare("SELECT * FROM books ORDER BY id DESC LIMIT ? OFFSET ?");
  $stmt->bindParam(1, $limit, PDO::PARAM_INT);
  $stmt->bindParam(2, $offset, PDO::PARAM_INT);
} else {
  $stmt = $pdo->prepare("SELECT * FROM books ORDER BY id DESC");
}

try {
  // Fetch paginated books
  $stmt = $pdo->prepare("SELECT * FROM books ORDER BY id DESC LIMIT ? OFFSET ?");
  $stmt->bindParam(1, $limit, PDO::PARAM_INT);
  $stmt->bindParam(2, $offset, PDO::PARAM_INT);
  $stmt->execute();
  $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Update image path for each book (prepend FRONTEND/ to make it accessible)
  foreach ($books as &$book) {
    if (!empty($book['image'])) {
      $book['image'] = '../FRONTEND/' . ltrim($book['image'], '/');
    }
  }

  // Count total
  $countStmt = $pdo->query("SELECT COUNT(*) AS total FROM books");
  $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

  echo json_encode([
    "books" => $books,
    "total" => (int)$total
  ]);

} catch (PDOException $e) {
  echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
