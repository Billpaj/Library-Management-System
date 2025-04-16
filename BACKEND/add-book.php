<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

// ✅ Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405); // Method Not Allowed
  echo json_encode(["success" => false, "message" => "Invalid request method."]);
  exit();
}

// 🔐 Admin-only access
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  http_response_code(403); // Forbidden
  echo json_encode(["success" => false, "message" => "Unauthorized access."]);
  exit();
}

// ✅ Sanitize helper
function sanitize($input) {
  return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// 📥 Retrieve and sanitize fields
$title    = sanitize($_POST['title'] ?? '');
$author   = sanitize($_POST['author'] ?? '');
$isbn     = sanitize($_POST['isbn'] ?? '');
$genre    = sanitize($_POST['genre'] ?? '');
$quantity = trim($_POST['quantity'] ?? '');
$id       = $_POST['id'] ?? null;

$imagePath = null;

// 📸 Handle image upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
  $uploadDir = __DIR__ . '/../FRONTEND/uploads/';
  $relativePath = 'uploads/';
  if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

  $filename = time() . "_" . basename($_FILES['image']['name']);
  $targetFile = $uploadDir . $filename;
  $imagePath = $relativePath . $filename;

  if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
    $imagePath = null;
  }
}

// 🧠 Validate required fields
if ($title && $author && $isbn && $genre && is_numeric($quantity)) {
  try {
    if ($id) {
      // ✏️ Update existing book
      if ($imagePath) {
        $stmt = $pdo->prepare("UPDATE books SET title = ?, author = ?, isbn = ?, genre = ?, quantity = ?, image = ? WHERE id = ?");
        $stmt->execute([$title, $author, $isbn, $genre, (int)$quantity, $imagePath, $id]);
      } else {
        $stmt = $pdo->prepare("UPDATE books SET title = ?, author = ?, isbn = ?, genre = ?, quantity = ? WHERE id = ?");
        $stmt->execute([$title, $author, $isbn, $genre, (int)$quantity, $id]);
      }

      echo json_encode([
        "success" => true,
        "message" => "Book updated successfully."
      ]);
    } else {
      // ➕ Insert new book
      $stmt = $pdo->prepare("INSERT INTO books (title, author, isbn, genre, quantity, image) VALUES (?, ?, ?, ?, ?, ?)");
      $stmt->execute([$title, $author, $isbn, $genre, (int)$quantity, $imagePath]);

      echo json_encode([
        "success" => true,
        "message" => "Book added successfully."
      ]);
    }
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      "success" => false,
      "message" => "Database error: " . $e->getMessage()
    ]);
  }
} else {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => "Missing or invalid fields."
  ]);
}
