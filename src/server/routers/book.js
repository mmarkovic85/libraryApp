const express = require("express");

const auth = require("../middleware/user-auth");
const Book = require("../models/book");
const { isValidBookUpd } = require("../util/validator");

const router = new express.Router();

// Create new book
router.post("/books", auth, async (req, res) => {
  try {
    // Create and save new book
    const book = new Book({
      ...req.body,
      owner: req.user._id
    });
    await book.save();
    // Send response
    res.status(201).send(book);
  } catch (e) {
    res.status(400).send({ error: e.message });
  };
});

// Get all books from users who have public profile
router.get("/boks/public/:id", async (req, res) => {

});

// Get all books for user
router.get("/books/private/", auth, async (req, res) => {

});

// Update user's book
router.put("/books/:id", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    // Check if updates are valid
    if (!isValidBookUpd(updates)) throw new Error("Invalid updates!");
    // Find and update
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );

    // Send response
    book ? res.send(book) : res.status(400).send();
  } catch (e) {
    res.status(400).send({ error: e.message });
  };
});

// Delete user's book
router.delete("/books/:id", auth, async (req, res) => {
  try {
    // Find and delete book
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    // Syend response
    book ? res.send(book) : res.status(404).send();
  } catch (e) {
    res.status(500).send();
  };
});

module.exports = router;
