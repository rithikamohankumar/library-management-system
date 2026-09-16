const API_URL = "http://127.0.0.1:8000/api/books/";
const DASHBOARD_URL = "http://127.0.0.1:8000/api/dashboard/";
// Load books when page opens
loadBooks();
loadDashboard();

// Add book
document.getElementById("bookForm").addEventListener("submit", function(event) {
    event.preventDefault();
const price = document.getElementById("price").value;

if (price < 0) {
    alert("Price cannot be negative.");
    return;
}
    const book = {
        book_name: document.getElementById("book_name").value,
        author: document.getElementById("author").value,
        category: document.getElementById("category").value,
        price: document.getElementById("price").value,
        available: document.getElementById("available").checked
    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
    })
    .then(response => response.json())
    .then(data => {
        alert("Book added successfully!");
        document.getElementById("bookForm").reset();
        loadBooks();
loadDashboard();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to add book.");
    });
});

// Display books
function loadBooks() {
    fetch(API_URL)
        .then(response => response.json())
        .then(books => {
            const bookList = document.getElementById("bookList");
            bookList.innerHTML = "";

            books.forEach(book => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.book_name}</td>
                    <td>${book.author}</td>
                    <td>${book.category}</td>
                    <td>${book.price}</td>
                    <td>${book.available ? "Yes" : "No"}</td>
                    <td>
                        <button onclick="editBook(${book.id})">Edit</button>
                        <button onclick="deleteBook(${book.id})">Delete</button>
                    </td>
                `;

                bookList.appendChild(row);
            });
        })
        .catch(error => console.error("Error:", error));
}

// Delete book
function deleteBook(id) {
    if (confirm("Are you sure you want to delete this book?")) {
        fetch(`${API_URL}${id}/`, {
            method: "DELETE"
        })
        .then(() => {
            alert("Book deleted successfully!");
            loadBooks();
loadDashboard();
    
        })
        .catch(error => console.error("Error:", error));
    }
}
function editBook(id) {
    const newBookName = prompt("Enter new book name:");

    if (newBookName === null || newBookName.trim() === "") {
        return;
    }

    fetch(`${API_URL}${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            book_name: newBookName
        })
    })
    .then(response => response.json())
    .then(data => {
        alert("Book updated successfully!");
        loadBooks();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to update book.");
    });
}
document.getElementById("searchInput").addEventListener("input", function() {
    const searchText = this.value.toLowerCase();

    fetch(API_URL)
        .then(response => response.json())
        .then(books => {
            const filteredBooks = books.filter(book =>
    book.book_name.toLowerCase().includes(searchText) ||
    book.author.toLowerCase().includes(searchText) ||
    book.category.toLowerCase().includes(searchText)
);

            displayBooks(filteredBooks);
        });
});
function displayBooks(books) {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";
if (books.length === 0) {
    bookList.innerHTML = `
        <tr>
            <td colspan="7">No books found.</td>
        </tr>
    `;
    return;
}
    books.forEach(book => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.book_name}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${book.price}</td>
            <td>${book.available ? "Yes" : "No"}</td>
            <td>
                <button onclick="editBook(${book.id})">Edit</button>
                <button onclick="deleteBook(${book.id})">Delete</button>
            </td>
        `;

        bookList.appendChild(row);
    });
}
// Load dashboard statistics
function loadDashboard() {
    fetch(DASHBOARD_URL)
        .then(response => response.json())
        .then(data => {
            document.getElementById("totalBooks").textContent =
                data.total_books;

            document.getElementById("availableBooks").textContent =
                data.available_books;

            document.getElementById("issuedBooks").textContent =
                data.issued_books;
        })
        .catch(error => {
            console.error("Dashboard Error:", error);
        });
}