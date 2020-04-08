const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  /** TODO: add schema properties */
}, {
  timestamps
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;