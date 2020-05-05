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
    minlength: [8, "Password field must be 8 characters or more"]
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

userSchema.methods.toJSON = function () { // custom json stringify
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.createJWT = async function () { // create new jwt for user
  const user = this;
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);

  user.tokens = [...user.tokens, { token }];
  user.save();

  return token;
};

// find user by email and password static method
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials!");
  if (!bc.compareSync(password, user.password)) throw new Error("Invalid credentials!");
  return user;
}

// pre save hook
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) this.password = await bc.hash(this.password, 8);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
