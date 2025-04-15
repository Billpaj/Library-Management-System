// admin.js with delete and edit functionality

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

function showMessage(message, isError = false) {
  const msgBox = document.createElement('div');
  msgBox.innerText = message;
  msgBox.style.position = 'fixed';
  msgBox.style.top = '20px';
  msgBox.style.right = '20px';
  msgBox.style.padding = '10px 20px';
  msgBox.style.borderRadius = '6px';
  msgBox.style.color = '#fff';
  msgBox.style.backgroundColor = isError ? '#e74c3c' : '#2ecc71';
  msgBox.style.zIndex = 1000;
  document.body.appendChild(msgBox);
  setTimeout(() => msgBox.remove(), 3000);
}

function saveBook() {
  const title = document.getElementById("book-title").value.trim();
  const author = document.getElementById("book-author").value.trim();
  const isbn = document.getElementById("book-isbn").value.trim();
  const genre = document.getElementById("book-genre").value.trim();
  const quantity = document.getElementById("book-quantity").value.trim();

  if (!title || !author || !isbn || !genre || !quantity || isNaN(quantity)) {
    showMessage("Please fill out all fields correctly.", true);
    return;
  }

  const method = "POST";
  const bookData = { title, author, isbn, genre, quantity };
  if (selectedBookIndex !== null) {
    bookData.id = books[selectedBookIndex].id;
  }

  fetch('/BACKEND/add-book.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(bookData)
  })
    .then(response => response.json())
    .then(data => {
      showMessage(data.message, !data.success);
      if (data.success) {
        closeModal();
        fetchBooks();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showMessage('An error occurred.', true);
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
      showMessage(data.message, !data.success);
      if (data.success) fetchBooks();
    })
    .catch(err => {
      console.error('Delete error:', err);
      showMessage('Failed to delete book.', true);
    });
}

function fetchBooks() {
  fetch('/BACKEND/fetch-books.php')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      books = data.books || [];
      renderBooks();
      updateChart();
      updateSummaryCounts(data.total || 0);
    })
    .catch(err => {
      console.error('Failed to fetch books:', err);
      showMessage('Failed to load books.', true);
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

function updateSummaryCounts(totalBooks) {
  document.getElementById("totalBooks").innerText = totalBooks;
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