<?php
require_once 'db.php';

header('Content-Type: application/json');

try {
  $stmt = $pdo->query("SELECT COUNT(*) AS total_users FROM users");
  $result = $stmt->fetch(PDO::FETCH_ASSOC);
  echo json_encode($result);
} catch (PDOException $e) {
  echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
