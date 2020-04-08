const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  author: {
    type: String,
    maxlength: [30, "Author field must be 30 characters or less"],
    required: [true, "Author field is required"],
    trim: true
  },
  title: {
    type: String,
    maxlength: [50, "Title field must be 50 characters or less"],
    required: [true, "Title field is required"],
    trim: true
  },
  year: {
    type: String,
    validate() {
      // TODO:
      // length == 4
      // min - year of first printed book
      // max - current year
    }
  },
  genre: {
    type: String,
    maxlength: [50, "Genre field must be 50 characters or less"],
    trim: true
  },
  publisher: {
    type: String,
    maxlength: [50, "Publisher field must be 50 characters or less"],
    trim: true
  },
  language: {
    type: String,
    maxlength: [20, "Language field must be 20 characters or less"],
    trim: true
  },
  isbn: {
    type: String,
    validate() {
      // TODO:
      // length == 10 || 13
    }
  },
  notes: {
    type: String,
    maxlength: [255, "Notes field must be 255 characters or less"],
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Owner field is required"],
    ref: "User"
  }
}, {
  timestamps: true
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;