import React, { useState } from "react";
import API from "../services/bookService";

function UpdateBook() {
  const [id, setId] = useState("");
  const [copies, setCopies] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateCopies = async () => {
    if (!id || !copies) {
      setError("Enter Book ID and Copies");
      return;
    }
    setLoading(true);
    try {
      await API.put(`/${id}`, { availableCopies: parseInt(copies) });
      alert("✅ Updated!");
      setId(""); setCopies("");
    } catch (err) {
      setError("Invalid Book ID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-book">
      <h3>Update Copies</h3>
      {error && <div className="error">{error}</div>}
      <div className="update-form">
        <input className="form-input" placeholder="Book ID" value={id} onChange={(e) => setId(e.target.value)} />
        <input type="number" className="form-input" placeholder="New Copies" value={copies} onChange={(e) => setCopies(e.target.value)} min="0" />
        <button onClick={updateCopies} className="update-btn" disabled={loading}>
          {loading ? "⏳ Updating..." : "🔄 Update"}
        </button>
      </div>
    </div>
  );
}

export default UpdateBook;


