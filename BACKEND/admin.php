<?php
session_start();

// ✅ Admin-only access
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  header("Location: ../FRONTEND/Login.html");
  exit();
}

require_once '/BACKEND/db.php';

// Fetch all books from the database
$books = $pdo->query("SELECT * FROM books ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Dashboard - Library System</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="stylesheet" href="/FRONTEND/css/admin.css">
</head>
<body>
  <div class="admin-container">
    <aside class="sidebar">
      <div class="logo">
        <i class="fas fa-book-reader"></i>
        <span>Library Admin</span>
      </div>
      <nav>
        <ul>
          <li class="active"><i class="fas fa-chart-line"></i> Dashboard</li>
          <li><i class="fas fa-book"></i> Manage Books</li>
          <li><i class="fas fa-users"></i> Users</li>
          <li><i class="fas fa-cogs"></i> Settings</li>
          <li><i class="fas fa-sign-out-alt"></i> <a href="logout.php">Logout</a></li>
        </ul>
        <button id="toggle-theme" class="btn btn-toggle">Toggle Theme</button>
      </nav>
    </aside>

    <main class="main-content">
      <header class="dashboard-header">
        <h1>Manage Books</h1>
        <button class="btn btn-add" onclick="openModal()"><i class="fas fa-plus"></i> Add New Book</button>
      </header>

      <section class="summary-cards">
        <div class="card">
          <h3>Total Books</h3>
          <p id="totalBooks"><?= count($books) ?></p>
        </div>
        <div class="card">
          <h3>Total Users</h3>
          <p id="totalUsers">--</p>
        </div>
        <div class="card">
          <h3>Books Borrowed</h3>
          <p id="booksBorrowed">--</p>
        </div>
      </section>

      <section class="table-section">
        <table class="book-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Genre</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="book-list">
            <?php foreach ($books as $book): ?>
              <tr>
                <td><?= htmlspecialchars($book['title']) ?></td>
                <td><?= htmlspecialchars($book['author']) ?></td>
                <td><?= htmlspecialchars($book['isbn']) ?></td>
                <td><?= htmlspecialchars($book['genre']) ?></td>
                <td><?= htmlspecialchars($book['quantity']) ?></td>
                <td>
                  <button class="btn btn-edit" onclick="openModal(<?= $book['id'] ?>)">Edit</button>
                  <button class="btn btn-delete" onclick="deleteBook(<?= $book['id'] ?>)">Delete</button>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </section>
    </main>
  </div>

  <!-- Modal -->
  <div class="modal" id="bookModal">
    <div class="modal-content">
      <h2 id="modal-title">Add New Book</h2>
      <input type="text" id="book-title" placeholder="Book Title">
      <input type="text" id="book-author" placeholder="Author">
      <input type="text" id="book-isbn" placeholder="ISBN">
      <input type="text" id="book-genre" placeholder="Genre">
      <input type="number" id="book-quantity" placeholder="Quantity">
      <div class="modal-actions">
        <button class="btn btn-add" onclick="saveBook()">Save</button>
        <button class="btn btn-close" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="/BACKEND/js/admin.js"></script>
</body>
</html>
