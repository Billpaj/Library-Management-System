<?php
session_start();
header('Content-Type: application/json');

echo json_encode([
  'session_exists' => !empty($_SESSION),
  'user_id' => $_SESSION['user_id'] ?? null,
  'role' => $_SESSION['role'] ?? null,
  'username' => $_SESSION['username'] ?? null,
  'php_session_id' => session_id()
]);