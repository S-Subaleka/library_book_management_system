const Book = require("../models/Book");

// CREATE
exports.addBook = async (req, res) => {
  try {
    if (req.body.availableCopies < 0)
      return res.status(400).json({ message: "Copies cannot be negative" });

    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch {
    res.status(400).json({ message: "Invalid book data" });
  }
};

// READ (category / genre / technology)
exports.getBooks = async (req, res) => {
  const { category, genre, technology } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (genre) filter.genre = genre;
  if (technology) filter.technology = technology;

  const books = await Book.find(filter);
  res.json(books);
};

// UPDATE
exports.updateBook = async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book)
    return res.status(404).json({ message: "Book not found" });

  if (req.body.availableCopies < 0)
    return res.status(400).json({ message: "Invalid update" });

  Object.assign(book, req.body);
  await book.save();
  res.json(book);
};

// DELETE (only if copies = 0)
exports.deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book)
    return res.status(404).json({ message: "Book not found" });

  if (book.availableCopies > 0)
    return res.status(400).json({ message: "Cannot delete book with copies" });

  await book.deleteOne();
  res.json({ message: "Book deleted successfully" });
};
