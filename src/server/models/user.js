const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {},
  username: {},
  password: {},
  tokens: [{
    token: {}
  }]
}, {
  timestamps: true
});

userSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "owner"
})

const User = mongoose.model("User", userSchema);

module.exports = User;