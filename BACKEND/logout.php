<?php
session_start();

// 🔓 Clear all session variables
$_SESSION = [];

// 🔒 Destroy the session cookie if it's being used
if (ini_get("session.use_cookies")) {
  $params = session_get_cookie_params();
  setcookie(
    session_name(), '', time() - 42000,
    $params["path"], $params["domain"],
    $params["secure"], $params["httponly"]
  );
}

// 🧼 Unset session and destroy it
session_unset();
session_destroy();

// 🚪 Redirect to login page
header("Location: ../FRONTEND/login.html");
exit();
?>
