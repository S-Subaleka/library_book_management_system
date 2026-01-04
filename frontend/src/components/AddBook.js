import React, { useState } from "react";
import API from "../services/bookService";

function AddBook() {
  const [book, setBook] = useState({
    title: "", author: "", category: "", publisher: "",
    availableCopies: "", genre: "", technology: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setBook({ ...book, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await API.post("/", book);
      alert("✅ Book added successfully!");
      setBook({ title: "", author: "", category: "", publisher: "",
        availableCopies: "", genre: "", technology: "" });
    } catch (err) {
      setError("❌ Backend not running? Check http://localhost:5000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book">
      <h3>📖 Add New Book</h3>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        {Object.keys(book).map((key) => (
          <input
            key={key}
            name={key}
            type={key === 'availableCopies' ? 'number' : 'text'}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={book[key]}
            onChange={handleChange}
            required
            disabled={loading}
            className="form-input"
          />
        ))}
        <button type="submit" disabled={loading} className="add-btn">
          {loading ? "⏳ Adding..." : "➕ Add Book"}
        </button>
      </form>
    </div>
  );
}

export default AddBook;


