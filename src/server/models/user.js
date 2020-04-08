const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "E-mail field is required"],
    maxlength: [30, "E-mail field must be 50 characters or less"],
    trim: true,
    lowercase: true,
    validate: {
      // TODO
    }
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Username field is required"],
    minlength: [3, "Username field must be 3 characters or more"],
    maxlength: [40, "Username field must be 40 characters or less"],
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password field is required"],
    minlength: [8, "Password field must be 8 characters or more"],
    maxlength: [20, "Password field must be 20 characters or less"],
    validate: {
      // TODO
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
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