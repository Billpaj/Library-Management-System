<?php
require_once 'db.php';
header('Content-Type: application/json');

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit();
}

// Sanitize and validate inputs
$title    = trim($_POST['title'] ?? '');
$author   = trim($_POST['author'] ?? '');
$isbn     = trim($_POST['isbn'] ?? '');
$genre    = trim($_POST['genre'] ?? '');
$quantity = trim($_POST['quantity'] ?? '');

if (
    $title === '' || $author === '' || $isbn === '' || $genre === '' ||
    !is_numeric($quantity) || (int)$quantity < 0
) {
    http_response_code(422); // Unprocessable Entity
    echo json_encode(["success" => false, "message" => "Please fill out all fields correctly."]);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO books (title, author, isbn, genre, quantity) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$title, $author, $isbn, $genre, (int)$quantity]);

    http_response_code(201); // Created
    echo json_encode(["success" => true, "message" => "Book added successfully."]);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
