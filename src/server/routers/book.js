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
// Update
router.put("/books", async (req, res) => { });
// Delete
router.delete("/books", async (req, res) => { });

module.exports = router;
