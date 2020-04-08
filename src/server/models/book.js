const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  author: {},
  title: {},
  year: {},
  genre: {},
  publisher: {},
  language: {},
  isbn: {},
  notes: {},
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, {
  timestamps: true
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;