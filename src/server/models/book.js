const mongoose = require("mongoose");

const { yearValidator, isbnValidator } = require("../util/validator");

const bookSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, "Author field is required"],
    minlength: [1, "Author field must be 1 characters or more"],
    maxlength: [30, "Author field must be 30 characters or less"],
    trim: true
  },
  title: {
    type: String,
    required: [true, "Title field is required"],
    minlength: [1, "Title field must be 1 characters or more"],
    maxlength: [50, "Title field must be 50 characters or less"],
    trim: true
  },
  year: {
    type: String,
    validate: {
      validator: yearValidator,
      message: "Year input is not valid"
    }
  },
  genre: {
    type: String,
    minlength: [1, "Genre field must be 1 characters or more"],
    maxlength: [50, "Genre field must be 50 characters or less"],
    trim: true
  },
  publisher: {
    type: String,
    minlength: [1, "Publisher field must be 1 characters or more"],
    maxlength: [50, "Publisher field must be 50 characters or less"],
    trim: true
  },
  language: {
    type: String,
    minlength: [1, "Language field must be 1 characters or more"],
    maxlength: [20, "Language field must be 20 characters or less"],
    trim: true
  },
  isbn: {
    type: String,
    validate: {
      validator: isbnValidator,
      message: "ISBN input is not valid"
    }
  },
  notes: {
    type: String,
    minlength: [1, "Notes field must be 1 characters or more"],
    maxlength: [255, "Notes field must be 255 characters or less"],
    trim: true
  },
  isBookRead: {
    type: Boolean,
    default: false
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
