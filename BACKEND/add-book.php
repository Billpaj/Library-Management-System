<?php
require_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit();
}

$title    = trim($_POST['title'] ?? '');
$author   = trim($_POST['author'] ?? '');
$isbn     = trim($_POST['isbn'] ?? '');
$genre    = trim($_POST['genre'] ?? '');
$quantity = trim($_POST['quantity'] ?? '');

if (
    $title === '' || $author === '' || $isbn === '' || $genre === '' ||
    !is_numeric($quantity) || (int)$quantity < 0
) {
    http_response_code(422);
    echo json_encode(["success" => false, "toast" => true, "type" => "error", "message" => "Please fill out all fields correctly."]);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO books (title, author, isbn, genre, quantity) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$title, $author, $isbn, $genre, (int)$quantity]);

    http_response_code(201);
    echo json_encode(["success" => true, "toast" => true, "type" => "success", "message" => "Book added successfully."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "toast" => true, "type" => "error", "message" => "Database error: " . $e->getMessage()]);
}
