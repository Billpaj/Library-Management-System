let selectedBookIndex = null;
let books = [];

const body = document.body;
const toggleBtn = document.getElementById("toggle-theme");
const ctx = document.getElementById("bookChart").getContext("2d");

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

function saveBook() {
  const book = {
    title: document.getElementById("book-title").value,
    author: document.getElementById("book-author").value,
    isbn: document.getElementById("book-isbn").value,
    genre: document.getElementById("book-genre").value,
    quantity: document.getElementById("book-quantity").value
  };

  if (selectedBookIndex !== null) {
    books[selectedBookIndex] = book;
  } else {
    books.push(book);
  }

  renderBooks();
  updateChart();
  closeModal();
}

function deleteBook(index) {
  books.splice(index, 1);
  renderBooks();
  updateChart();
}

function renderBooks() {
  let bookList = document.getElementById("book-list");
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

// Theme toggle
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const isLight = body.classList.contains("light-mode");

    // Update ChartJS colors to match theme
    bookChart.options.plugins.legend.labels.color = isLight ? "#333333" : "#e0e0e0";
    bookChart.options.scales.x.ticks.color = isLight ? "#333333" : "#e0e0e0";
    bookChart.options.scales.y.ticks.color = isLight ? "#333333" : "#e0e0e0";
    bookChart.update();
  });
}

// Chart.js chart
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

// Initial render
renderBooks();
