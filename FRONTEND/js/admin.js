let selectedBookIndex = null;
let books = [];

const body = document.body;
const toggleBtn = document.getElementById("toggle-theme");
const ctx = document.getElementById("bookChart")?.getContext("2d");

function openModal(index = null) {
  selectedBookIndex = index;
  const fields = ["title", "author", "isbn", "genre", "quantity"];
  fields.forEach((field) => {
    document.getElementById(`book-${field}`).value =
      index !== null ? books[index][field] : "";
  });
  document.getElementById("book-image").value = ""; // clear file input
  document.getElementById("modal-title").innerText =
    index !== null ? "Edit Book" : "Add New Book";
  document.getElementById("bookModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("bookModal").style.display = "none";
}

function showMessage(message, isError = false) {
  const msgBox = document.createElement("div");
  msgBox.className = `toast ${isError ? "error" : "success"}`;
  msgBox.innerText = message;
  document.body.appendChild(msgBox);
  setTimeout(() => msgBox.remove(), 3000);
}

function saveBook() {
  const title = document.getElementById("book-title").value.trim();
  const author = document.getElementById("book-author").value.trim();
  const isbn = document.getElementById("book-isbn").value.trim();
  const genre = document.getElementById("book-genre").value.trim();
  const quantity = document.getElementById("book-quantity").value.trim();
  const imageFile = document.getElementById("book-image").files[0];

  if (!title || !author || !isbn || !genre || !quantity || isNaN(quantity)) {
    showMessage("Please fill out all fields correctly.", true);
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("author", author);
  formData.append("isbn", isbn);
  formData.append("genre", genre);
  formData.append("quantity", quantity);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  if (selectedBookIndex !== null) {
    formData.append("id", books[selectedBookIndex].id);
  }

  fetch("../BACKEND/add-book.php", {
    method: "POST",
    body: formData,
    credentials: "include",
  })
    .then((response) => response.text())
    .then((text) => {
      try {
        const data = JSON.parse(text);
        showMessage(data.message, !data.success);
        if (data.success) {
          closeModal();
          fetchBooks();
        }
      } catch (e) {
        console.error("JSON Parse Error:", e, text);
        showMessage("Server error. Please try again.", true);
      }
    })
    .catch((error) => {
      console.error("Save Error:", error);
      showMessage("An error occurred while saving.", true);
    });
}

function deleteBook(index) {
  const confirmDelete = confirm("Are you sure you want to delete this book?");
  if (!confirmDelete) return;

  const bookId = books[index].id;

  fetch("../BACKEND/delete-book.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ id: bookId }),
  })
    .then((res) => res.json())
    .then((data) => {
      showMessage(data.message, !data.success);
      if (data.success) fetchBooks();
    })
    .catch((err) => {
      console.error("Delete error:", err);
      showMessage("Failed to delete book.", true);
    });
}

function fetchBooks() {
  fetch("../BACKEND/fetch-books.php", {
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      books = data.books || [];
      renderBooks();
      updateChart();
      updateSummaryCounts(data.total || 0);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      showMessage("Failed to load books.", true);
<<<<<<< HEAD
=======
    });
}

// 🔄 Toggle to Users View
document.getElementById("usersLink")?.addEventListener("click", () => {
  document.querySelector(".charts").style.display = "none";
  document.querySelector(".summary-cards").style.display = "none";
  document.querySelectorAll(".table-section").forEach(el => el.style.display = "none");

  document.getElementById("usersSection").style.display = "block";
  document.getElementById("backToDashboard").style.display = "inline-block"; // ensure visible

  fetch("../BACKEND/get-users.php", { credentials: "include" })
    .then(res => res.json())
    .then(users => {
      const userList = document.getElementById("user-list");
      userList.innerHTML = "";

      users.forEach(user => {
        userList.innerHTML += `
          <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><button onclick="deleteUser(${user.id})">Delete</button></td>
          </tr>
        `;
      });
      
      document.getElementById("totalUsersCount").innerText = users.length;

      // 🔍 Add search functionality
      document.getElementById("userSearchInput")?.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        document.querySelectorAll("#user-list tr").forEach(row => {
          const rowText = row.innerText.toLowerCase();
          row.style.display = rowText.includes(query) ? "" : "none";
        });
      });
    })
    .catch(error => {
      console.error("Failed to load users:", error);
      showMessage("Unable to load users.", true);
    });
});

// Back to Dashboard button (moved outside)
document.getElementById("backToDashboard")?.addEventListener("click", () => {
  document.getElementById("usersSection").style.display = "none";
  document.querySelector(".summary-cards").style.display = "flex";
  document.querySelector(".charts").style.display = "block";
  document.querySelector(".table-section").style.display = "block";
  document.getElementById("backToDashboard").style.display = "none";
});

function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  fetch("../BACKEND/delete-user.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ id: userId }),
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      showMessage(data.message, !data.success);
      if (data.success) usersLink.click(); // reload users view
    })
    .catch(err => {
      console.error("Delete user error:", err);
      showMessage("Failed to delete user.", true);
>>>>>>> 8695b81b2f6d45c44cb492771501f503342db4fc
    });
}

// 🔄 Toggle to Users View
document.getElementById("usersLink")?.addEventListener("click", () => {
  document.querySelector(".charts").style.display = "none";
  document.querySelector(".summary-cards").style.display = "none";

  // ✅ Hide all .table-section elements
  document.querySelectorAll(".table-section").forEach(section => {
    section.style.display = "none";
  });

  // ✅ Show users table
  document.getElementById("usersSection").style.display = "block";

  fetch("../BACKEND/get-users.php", {
    credentials: "include"
  })
    .then(res => res.json())
    .then(users => {
      const userList = document.getElementById("user-list");
      userList.innerHTML = "";

      users.forEach(user => {
        userList.innerHTML += `
          <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
          </tr>
        `;
      });

      document.getElementById("totalUsersCount").innerText = users.length;
    })
    .catch(error => {
      console.error("Failed to load users:", error);
      showMessage("Unable to load users.", true);
    });
});



function renderBooks() {
  const bookList = document.getElementById("book-list");
  bookList.innerHTML = "";
  books.forEach((book, index) => {
    bookList.innerHTML += `
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>${book.genre}</td>
        <td>${book.quantity}</td>
        <td><img src="${book.image || 'assets/images/default.jpg'}" alt="${book.title}" width="40" /></td>
        <td>
          <button class="btn btn-edit" onclick="openModal(${index})">Edit</button>
          <button class="btn btn-delete" onclick="deleteBook(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function updateSummaryCounts(totalBooks) {
  document.getElementById("totalBooks").innerText = totalBooks;
  document.getElementById("booksBorrowed").innerText = books.filter(
    (b) => b.quantity < 5
  ).length;

  fetch("../BACKEND/user-count.php")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("totalUsers").innerText = data.total_users || 0;
    });

  fetch("../BACKEND/borrowed-count.php")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("booksBorrowed").innerText = data.count || 0;
    });
}

let bookChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Book Quantities",
        data: [],
        backgroundColor: "#00ED64",
        borderRadius: 5,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: body.classList.contains("light-mode") ? "#333333" : "#e0e0e0",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: body.classList.contains("light-mode") ? "#333333" : "#e0e0e0",
        },
      },
      y: {
        ticks: {
          color: body.classList.contains("light-mode") ? "#333333" : "#e0e0e0",
        },
      },
    },
  },
});

function updateChart() {
  bookChart.data.labels = books.map((book) => book.title);
  bookChart.data.datasets[0].data = books.map(
    (book) => parseInt(book.quantity) || 0
  );
  bookChart.update();
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const isLight = body.classList.contains("light-mode");
    bookChart.options.plugins.legend.labels.color = isLight
      ? "#333333"
      : "#e0e0e0";
    bookChart.options.scales.x.ticks.color = isLight ? "#333333" : "#e0e0e0";
    bookChart.options.scales.y.ticks.color = isLight ? "#333333" : "#e0e0e0";
    bookChart.update();
  });
}

window.onclick = function (event) {
  const modal = document.getElementById("bookModal");
  if (event.target === modal) {
    closeModal();
  }
};

fetchBooks();
