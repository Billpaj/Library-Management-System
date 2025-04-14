<?php
session_start();

// ✅ User-only access
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'user') {
  header("Location: ../FRONTEND/Login.html");
  exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Dashboard</title>
  <link rel="stylesheet" href="../FRONTEND/css/dashboard.css">
</head>
<body>
  <header>
    <h1>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h1>
    <p>Role: <?php echo htmlspecialchars($_SESSION['role']); ?></p>
    <a href="logout.php" class="btn">Logout</a>
  </header>

  <main>
    <section>
      <h2>Dashboard Content</h2>
      <p>This is a protected area accessible only after login.</p>
    </section>
  </main>
</body>
</html>
