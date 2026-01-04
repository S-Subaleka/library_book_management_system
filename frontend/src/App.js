import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    borrowed: 0,
    overdue: 0
  });

  // Fetch books from backend
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      setBooks(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const calculateStats = (bookList) => {
    const total = bookList.length;
    const available = bookList.filter(b => b.status === 'available').length;
    const borrowed = bookList.filter(b => b.status === 'borrowed').length;
    const overdue = bookList.filter(b => b.status === 'overdue').length;
    
    setStats({ total, available, borrowed, overdue });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBook, status: 'available' })
      });
      const addedBook = await response.json();
      setBooks([...books, addedBook]);
      setNewBook({ title: '', author: '', isbn: '', genre: '' });
      
      // Trigger hook
      await fetch('http://localhost:5000/api/hooks/book-added', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book: addedBook })
      });
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleBorrowBook = async (bookId) => {
    try {
      // Update book status
      await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'borrowed' })
      });
      
      // Trigger hook
      await fetch('http://localhost:5000/api/hooks/book-borrowed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookId, 
          userId: 'user123',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
        })
      });
      
      fetchBooks(); // Refresh list
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'available' })
      });
      
      await fetch('http://localhost:5000/api/hooks/book-returned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, userId: 'user123' })
      });
      
      fetchBooks();
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1>📚 Library Book Management System</h1>
          </div>
          <ul className="navbar-nav">
            <li><a href="#home" className="nav-link">Home</a></li>
            <li><a href="#books" className="nav-link">Books</a></li>
            <li><a href="#add" className="nav-link">Add Book</a></li>
            <li><a href="#members" className="nav-link">Members</a></li>
            <li><a href="#reports" className="nav-link">Reports</a></li>
          </ul>
        </div>
      </nav>

      <div className="container">
        {/* Search and Add Section */}
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary" onClick={() => document.getElementById('addBookModal').style.display = 'block'}>
            ➕ Add New Book
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Books</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card available">
            <h3>Available</h3>
            <p className="stat-number">{stats.available}</p>
          </div>
          <div className="stat-card borrowed">
            <h3>Borrowed</h3>
            <p className="stat-number">{stats.borrowed}</p>
          </div>
          <div className="stat-card overdue">
            <h3>Overdue</h3>
            <p className="stat-number">{stats.overdue}</p>
          </div>
        </div>

        {/* Books Table */}
        <div className="card">
          <h2>📖 Book List</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => (
                <tr key={book._id}>
                  <td>{book._id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.isbn}</td>
                  <td>
                    <span className={`status-${book.status}`}>
                      {book.status}
                    </span>
                  </td>
                  <td>
                    {book.status === 'available' ? (
                      <button className="btn-success btn-small" onClick={() => handleBorrowBook(book._id)}>
                        Borrow
                      </button>
                    ) : (
                      <button className="btn-primary btn-small" onClick={() => handleReturnBook(book._id)}>
                        Return
                      </button>
                    )}
                    <button className="btn-secondary btn-small">Edit</button>
                    <button className="btn-danger btn-small">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Book Modal */}
        <div id="addBookModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => document.getElementById('addBookModal').style.display = 'none'}>&times;</span>
            <h2>Add New Book</h2>
            <form onSubmit={handleAddBook}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author:</label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>ISBN:</label>
                <input
                  type="text"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Genre:</label>
                <select
                  value={newBook.genre}
                  onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                  required
                >
                  <option value="">Select Genre</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="Technology">Technology</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">Add Book</button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>Library Management System © 2024 | Version 1.0.0</p>
          <p>Backend: http://localhost:5000 | Frontend: http://localhost:3002</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

