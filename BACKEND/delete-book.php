<?php
session_start();                      // ✅ Start the session to check user login status
require_once 'db.php';               // ✅ Include your database connection

header('Content-Type: application/json');  // ✅ Ensure response is returned as JSON

// 1. Protect route: Only allow access if user is an admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  echo json_encode([
    "success" => false,
    "message" => "Unauthorized access."
  ]);
  exit();
}

//  Handle only POST requests for deleting
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $id = $_POST['id'] ?? null;

  // Validate that the ID is numeric
  if ($id && is_numeric($id)) {
    try {
      //  Use a prepared statement to securely delete book
      $stmt = $pdo->prepare("DELETE FROM books WHERE id = ?");
      $stmt->execute([$id]);

      echo json_encode([
        "success" => true,
        "message" => "Book deleted successfully."
      ]);
    } catch (PDOException $e) {
      // Error handling for database issues
      echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
      ]);
    }
  } else {
    // Validation failure
    echo json_encode([
      "success" => false,
      "message" => "Invalid book ID."
    ]);
  }
} else {
  // Method not allowed
  echo json_encode([
    "success" => false,
    "message" => "Invalid request method."
  ]);
}
