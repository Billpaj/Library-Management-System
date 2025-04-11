<?php
require_once 'db.php';

// Set response content type to JSON
header('Content-Type: application/json');

// Read pagination parameters from GET (default to 10 per page)
$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
$offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;

try {
  // Fetch paginated books from the database
  $stmt = $pdo->prepare("SELECT * FROM books ORDER BY id DESC LIMIT ? OFFSET ?");
  $stmt->bindParam(1, $limit, PDO::PARAM_INT);
  $stmt->bindParam(2, $offset, PDO::PARAM_INT);
  $stmt->execute();
  $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Get total number of books for frontend pagination
  $countStmt = $pdo->query("SELECT COUNT(*) AS total FROM books");
  $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

  // Return structured JSON response with data and total count
  echo json_encode([
    "books" => $books,
    "total" => (int)$total
  ]);

} catch (PDOException $e) {
  // Error handling: return error message if query fails
  echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
