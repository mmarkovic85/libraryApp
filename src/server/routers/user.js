const express = require("express");

const auth = require("../middleware/user-auth");
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

// Logout user from current device
router.post("/users/logout", auth, async (req, res) => {
  try {
    // Invalidate current auth JWT
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();

    // Send response
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  };
});

// Logout user from all devices
router.post("/users/logoutall", auth, async (req, res) => {
  try {
    // Invalidate all auth JWT
    req.user.tokens = [];
    await req.user.save();

    // Send response
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  };
});

// Get user's profile
router.get("/users/me", auth, async (req, res) => res.send({ user: req.user }));

// Get profile of other users
router.get("/users/:id", async (req, res) => {
  try {
    // Find user
    const user = await User.findById(req.params.id);
    // Chsck if profile is private
    if (user.isProfilePrivate) throw new Error();
    // Send response
    res.status(200).send({ user });
  } catch (e) {
    // In case of error, send error message
    res.status(404).send({ error: e.message });;
  };
});

// Update user account
router.put("/users/me", auth, async (req, res) => {
  // Check if updates are valid
  const updates = Object.keys(req.body);
  const allowedUpdates = ["email", "username", "password", "isProfilePrivate"];
  const isValidUpd = updates.every(update => allowedUpdates.includes(update));

  try {
    if (!isValidUpd) throw new Error("Invalid updates!");

    updates.forEach(updateKey => req.user[updateKey] = req.body[updateKey]);
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send({ error: e.message });
  };
});

// Delete user account
router.delete("/users/delete", auth, async (req, res) => {
  try {
    // Delete user
    await req.user.remove();
    // Send response
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  };
});

module.exports = router;
