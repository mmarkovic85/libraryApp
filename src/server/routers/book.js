const express = require("express");

const auth = require("../middleware/user-auth");
const Book = require("../models/book");

const router = new express.Router();

// Create new book
router.post("/books", auth, async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      owner: req.user._id
    });
    await book.save();
    res.status(201).send(book);
  } catch (e) {
    res.status(400).send({ error: e.message });
  };
});
// Read
router.get("/books", async (req, res) => { });

// Update user's book
router.put("/books/:id", async (req, res) => { });

// Delete user's book
router.delete("/books/:id", auth, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    book ?
      res.send(book) :
      res.status(404).send();
  } catch (e) {
    res.status(500).send();
  };
});

module.exports = router;
