const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bc = require("bcryptjs");

const { emailValidator } = require("../util/validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "E-mail field is required"],
    maxlength: [30, "E-mail field must be 50 characters or less"],
    trim: true,
    lowercase: true,
    validate: {
      validator: emailValidator,
      message: "Email input is not valid"
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
    maxlength: [20, "Password field must be 20 characters or less"]
  },
  isProfilePrivate: {
    type: Boolean,
    default: false
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
});


userSchema.method({
  createJWT() { // create new jwt for user
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
    this.tokens.push({ token });
    return token;
  },
  toJSON() { // custom json stringify
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
  }
});

// find user by email and password static method
userSchema.static("findByCredentials", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("Invalid credentials!");
  if (!bc.compareSync(password, user.password)) throw new Error("Invalid credentials!");
  return user;
});

// pre save hook
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) this.password = await bc.hash(this.password, 8);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
