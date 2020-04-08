const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  /** TODO: add schema properties */
}, {
  timestamps
});

const User = mongoose.model("User", userSchema);

module.exports = User;