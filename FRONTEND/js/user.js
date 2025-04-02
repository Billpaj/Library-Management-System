// JavaScript to enable borrowing functionality and dynamic update of 'Books Borrowed'

const borrowedBooks = [];

window.addEventListener("DOMContentLoaded", () => {
  const bookGrid = document.getElementById("bookGrid");
  const borrowButtons = document.querySelectorAll(".book-card button");
  const borrowedList = document.querySelector(".borrowed-list");

  const books = [
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      img: "assets/images/book1.jpg"
    },
    {
      title: "1984",
      author: "George Orwell",
      img: "assets/images/book.jpg"
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      img: "assets/images/book3.jpg"
    }
    // Add more books here
  ];

  // Render book cards dynamically
  if (bookGrid && books.length > 0) {
    books.forEach(book => {
      const card = document.createElement("div");
      card.className = "book-card";

      card.innerHTML = `
        <img src="${book.img}" alt="${book.title}">
        <h4>${book.title}</h4>
        <p>${book.author}</p>
        <button>Borrow</button>
      `;

      const button = card.querySelector("button");
      button.addEventListener("click", () => {
        if (!borrowedBooks.find((b) => b.title === book.title && b.author === book.author)) {
          borrowedBooks.push(book);
          updateBorrowedList();
          button.innerText = "Borrowed";
          button.disabled = true;
          button.style.backgroundColor = "gray";
        }
      });

      bookGrid.appendChild(card);
    });
  }

  // Also attach click handlers to any pre-rendered book buttons
  borrowButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const bookCard = button.closest(".book-card");
      const title = bookCard.querySelector("h4").innerText;
      const author = bookCard.querySelector("p").innerText;

      if (!borrowedBooks.find((book) => book.title === title && book.author === author)) {
        borrowedBooks.push({ title, author });
        updateBorrowedList();
        button.innerText = "Borrowed";
        button.disabled = true;
        button.style.backgroundColor = "gray";
      }
    });
  });

  // Initial display
  updateBorrowedList();
});

function updateBorrowedList() {
  const listContainer = document.querySelector(".borrowed-list");
  listContainer.innerHTML = "";

  if (borrowedBooks.length === 0) {
    listContainer.innerHTML = "<p style='padding:10px;'>No books borrowed yet.</p>";
  } else {
    borrowedBooks.forEach((book) => {
      const item = document.createElement("div");
      item.style.padding = "8px 15px";
      item.style.borderBottom = "1px solid #eee";
      item.style.fontSize = "14px";
      item.textContent = `${book.title} - ${book.author}`;
      listContainer.appendChild(item);
    });
  }
}
