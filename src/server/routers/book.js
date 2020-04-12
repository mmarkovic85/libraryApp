const express = require("express");

const router = new express.Router();

// Create
router.post("/books", async (req, res) => { });
// Read
router.get("/books", async (req, res) => { });
// Update
router.put("/books", async (req, res) => { });
// Delete
router.delete("/books", async (req, res) => { });

module.exports = router;
