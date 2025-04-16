const borrowedBooks = [];

// 📦 Fetch available books and render
window.addEventListener("DOMContentLoaded", () => {
  const bookGrid = document.getElementById("bookGrid");

  fetch("../BACKEND/fetch-books.php")
    .then((response) => response.json())
    .then((data) => {
      const books = Array.isArray(data.books) ? data.books : data; // fallback
      if (!Array.isArray(books)) {
        showToast("Failed to load books.", "error");
        return;
      }

      books.forEach((book) => {
        const card = document.createElement("div");
        card.className = "book-card";
        const imageUrl = book.image ? book.image : "assets/images/book.jpg";

        card.innerHTML = `
  <img src="${imageUrl}" alt="${book.title}">
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
            body: new URLSearchParams({ book_id: bookId }),
          })
            .then((res) => res.json())
            .then((res) => {
              showToast(res.message, res.success ? "success" : "error");
              if (res.success) {
                button.innerText = "Borrowed";
                button.disabled = true;
                button.style.backgroundColor = "gray";
                loadBorrowedBooks(); // refresh list
              }
            })
            .catch(() => showToast("Something went wrong.", "error"));
        });

        bookGrid.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      showToast("Error fetching books.", "error");
    });

  loadBorrowedBooks(); // Load borrowed list on load
});

// 🧾 Load and render borrowed books
function loadBorrowedBooks() {
  fetch("../BACKEND/get-borrowed.php", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      const listContainer =
        document.getElementById("borrowedList") ||
        document.querySelector(".borrowed-list");
      listContainer.innerHTML = "";

      if (!data.length) {
        listContainer.innerHTML =
          "<p style='padding:10px;'>No books borrowed yet.</p>";
        const countEl = document.getElementById("borrowedCount");
        if (countEl) countEl.innerText = "0";
        return;
      }

      data.forEach((book) => {
        const item = document.createElement("div");
        item.className = "borrowed-entry";
        item.style.padding = "8px 15px";
        item.style.borderBottom = "1px solid #eee";
        item.style.marginBottom = "5px";
        item.style.display = "flex";
        item.style.flexDirection = "column";

        item.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span><strong>${book.title}</strong> - ${book.author}</span>
            <button class="return-btn" data-id="${book.id}">Return</button>
          </div>
          <small style="color:#555; font-size:13px;">📆 Borrowed: ${book.borrow_date} | ⏳ Due: ${book.due_date}</small>
        `;

        listContainer.appendChild(item);
      });

      const countEl = document.getElementById("borrowedCount");
      if (countEl) countEl.innerText = data.length;

      const returnBtns = listContainer.querySelectorAll(".return-btn");
      returnBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const bookId = this.getAttribute("data-id");

          fetch("../BACKEND/return-book.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `book_id=${bookId}`,
          })
            .then((res) => res.json())
            .then((res) => {
              showToast(res.message, res.success ? "success" : "error");
              if (res.success) {
                loadBorrowedBooks(); // Refresh after return
              }
            });
        });
      });
    })
    .catch(() => {
      showToast("Could not load borrowed books.", "error");
    });
}

// ✅ Toast message system
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.right = "20px";
  toast.style.padding = "12px 20px";
  toast.style.backgroundColor = type === "success" ? "#2ecc71" : "#e74c3c";
  toast.style.color = "#fff";
  toast.style.borderRadius = "6px";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  toast.style.zIndex = 1000;
  toast.style.opacity = 0;
  toast.style.transform = "translateY(-10px)";
  toast.style.transition = "all 0.3s ease";
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = 1;
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = 0;
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
