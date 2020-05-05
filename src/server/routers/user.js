const express = require("express");

const User = require("../models/user");

const router = new express.Router();

// Create user
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

// Login user
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // find user and generate token
    const user = await User.findByCredentials(email, password);
    const token = await user.createJWT();
    // Send response
    res.status(200).send({ user, token });
  } catch (e) {
    // In case of error, send error message
    res.status(400).send({ error: e.message });
  };
});
// Read
router.get("/users", async (req, res) => { });
// Update
router.put("/users", async (req, res) => { });
// Delete
router.delete("/users", async (req, res) => { });

module.exports = router;
