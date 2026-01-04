import React, { useEffect, useState } from "react";
import API from "../services/bookService";

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/");
      setBooks(res.data);
    } catch (err) {
      setError("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="book-list"><h3>⏳ Loading...</h3></div>;
  if (error) return <div className="book-list"><h3 className="error">{error}</h3></div>;

  return (
    <div className="book-list">
      <h3>📚 Book Inventory ({books.length})</h3>
      {books.length === 0 ? (
        <p>Add books using the form above!</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book._id} className="book-card">
              <h4>{book.title}</h4>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Copies:</strong> {book.availableCopies}</p>
              <p><strong>ID:</strong> {book._id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookList;
