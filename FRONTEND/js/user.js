// JavaScript to enable borrowing functionality and dynamic update of 'Books Borrowed' from backend with toast notifications

const borrowedBooks = [];

window.addEventListener("DOMContentLoaded", () => {
  const bookGrid = document.getElementById("bookGrid");
  const borrowedList = document.querySelector(".borrowed-list");

  fetch("../BACKEND/fetch-books.php")
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data)) {
        showToast("Failed to load books.", "error");
        return;
      }
      data.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
          <img src="assets/images/book.jpg" alt="${book.title}">
          <h4>${book.title}</h4>
          <p>${book.author}</p>
          <button data-id="${book.id}">Borrow</button>
        `;

        const button = card.querySelector("button");
        button.addEventListener("click", () => {
          const bookId = button.getAttribute("data-id");

          fetch("../BACKEND/borrow-book.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ book_id: bookId })
          })
            .then(res => res.json())
            .then(res => {
              showToast(res.message, res.success ? "success" : "error");
              if (res.success) {
                borrowedBooks.push(book);
                updateBorrowedList();
                button.innerText = "Borrowed";
                button.disabled = true;
                button.style.backgroundColor = "gray";
              }
            })
            .catch(() => showToast("Something went wrong.", "error"));
        });

        bookGrid.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Fetch error:", error);
      showToast("Error fetching books.", "error");
    });

  updateBorrowedList();
});

function updateBorrowedList() {
  const listContainer = document.querySelector(".borrowed-list");
  listContainer.innerHTML = "";

  if (borrowedBooks.length === 0) {
    listContainer.innerHTML = "<p style='padding:10px;'>No books borrowed yet.</p>";
  } else {
    borrowedBooks.forEach(book => {
      const item = document.createElement("div");
      item.style.padding = "8px 15px";
      item.style.borderBottom = "1px solid #eee";
      item.style.fontSize = "14px";
      item.textContent = `${book.title} - ${book.author}`;
      listContainer.appendChild(item);
    });
  }
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.top = '20px';
  toast.style.right = '20px';
  toast.style.padding = '12px 20px';
  toast.style.backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';
  toast.style.color = '#fff';
  toast.style.borderRadius = '6px';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  toast.style.zIndex = 1000;
  toast.style.opacity = 0;
  toast.style.transform = 'translateY(-10px)';
  toast.style.transition = 'all 0.3s ease';
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = 1;
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = 0;
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
