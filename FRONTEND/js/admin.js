// admin.js with toast support for feedback messages

let selectedBookIndex = null;
let books = [];

const body = document.body;
const toggleBtn = document.getElementById("toggle-theme");
const ctx = document.getElementById("bookChart")?.getContext("2d");

function openModal(index = null) {
  selectedBookIndex = index;
  const fields = ["title", "author", "isbn", "genre", "quantity"];
  fields.forEach(field => {
    document.getElementById(`book-${field}`).value = index !== null ? books[index][field] : "";
  });
  document.getElementById("modal-title").innerText = index !== null ? "Edit Book" : "Add New Book";
  document.getElementById("bookModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("bookModal").style.display = "none";
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.top = '20px';
  toast.style.right = '20px';
  toast.style.padding = '10px 20px';
  toast.style.backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';
  toast.style.color = '#fff';
  toast.style.borderRadius = '6px';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  toast.style.zIndex = 1000;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function saveBook() {
  const title = document.getElementById("book-title").value.trim();
  const author = document.getElementById("book-author").value.trim();
  const isbn = document.getElementById("book-isbn").value.trim();
  const genre = document.getElementById("book-genre").value.trim();
  const quantity = document.getElementById("book-quantity").value.trim();

  if (!title || !author || !isbn || !genre || !quantity || isNaN(quantity)) {
    showToast("Please fill out all fields correctly.", "error");
    return;
  }

  const book = { title, author, isbn, genre, quantity };
  const method = selectedBookIndex !== null ? 'PUT' : 'POST';
  const url = selectedBookIndex !== null ? `/BACKEND/edit-book.php?id=${books[selectedBookIndex].id}` : '/BACKEND/add-book.php';

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(book)
  })
    .then(response => response.json())
    .then(data => {
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) {
        closeModal();
        fetchBooks();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showToast('An error occurred.', "error");
    });
}

function deleteBook(index) {
  const confirmDelete = confirm("Are you sure you want to delete this book?");
  if (!confirmDelete) return;

  const bookId = books[index].id;

  fetch('/BACKEND/delete-book.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ id: bookId })
  })
    .then(res => res.json())
    .then(data => {
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) fetchBooks();
    })
    .catch(err => {
      console.error('Delete error:', err);
      showToast('Failed to delete book.', "error");
    });
}

function fetchBooks() {
  fetch('/BACKEND/fetch-books.php')
    .then(response => response.json())
    .then(data => {
      books = data;
      renderBooks();
      updateChart();
      updateSummaryCounts();
    })
    .catch(err => {
      console.error('Failed to fetch books:', err);
      showToast('Failed to load books.', "error");
    });
}

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
        <td>
          <button class="btn btn-edit" onclick="openModal(${index})">Edit</button>
          <button class="btn btn-delete" onclick="deleteBook(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function updateSummaryCounts() {
  document.getElementById("totalBooks").innerText = books.length;
  document.getElementById("booksBorrowed").innerText = books.filter(b => b.quantity < 5).length;

  fetch('/BACKEND/user-count.php')
    .then(res => res.json())
    .then(data => {
      document.getElementById("totalUsers").innerText = data.total_users || 0;
    });
}

let bookChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [{
      label: "Book Quantities",
      data: [],
      backgroundColor: "#00ED64",
      borderRadius: 5
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: body.classList.contains("light-mode") ? "#333333" : "#e0e0e0"
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: body.classList.contains("light-mode") ? "#333333" : "#e0e0e0"
        }
      },
      y: {
        ticks: {
          color: body.classList.contains("light-mode") ? "#333333" : "#e0e0e0"
        }
      }
    }
  }
});

function updateChart() {
  bookChart.data.labels = books.map(book => book.title);
  bookChart.data.datasets[0].data = books.map(book => parseInt(book.quantity) || 0);
  bookChart.update();
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const isLight = body.classList.contains("light-mode");
    bookChart.options.plugins.legend.labels.color = isLight ? "#333333" : "#e0e0e0";
    bookChart.options.scales.x.ticks.color = isLight ? "#333333" : "#e0e0e0";
    bookChart.options.scales.y.ticks.color = isLight ? "#333333" : "#e0e0e0";
    bookChart.update();
  });
}

window.onclick = function(event) {
  const modal = document.getElementById("bookModal");
  if (event.target === modal) {
    closeModal();
  }
};

fetchBooks();
