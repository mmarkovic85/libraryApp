const express = require("express");

const User = require("../models/user");

const router = new express.Router();

// Create
router.post("/users", async (req, res) => {
  try {
    // Create new user and token
    const user = new User(req.body);
    await user.save();
    const token = await user.createJWT();
    // Send response
    res.status(201).send({ user, token });
  } catch (e) {
    // In case of error, send error message
    res.status(400).send({ error: e.message })
  };
});
// Read
router.get("/users", async (req, res) => { });
// Update
router.put("/users", async (req, res) => { });
// Delete
router.delete("/users", async (req, res) => { });

module.exports = router;
