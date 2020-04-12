const express = require("express");

const router = new express.Router();

// Create
router.post("/users", async (req, res) => { });
// Read
router.get("/users", async (req, res) => { });
// Update
router.put("/users", async (req, res) => { });
// Delete
router.delete("/users", async (req, res) => { });

module.exports = router;
