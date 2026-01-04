const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  publisher: { type: String },
  genre: { type: String },
  technology: { type: String },
  availableCopies: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model("Book", bookSchema);
