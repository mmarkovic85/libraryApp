const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userOne = {
  _id: new mongoose.Types.ObjectId(),
  email: "filozof@atina.edu",
  username: "Sokrat",
  password: "nistaneznam",
  tokens: [{
    token: jwt.sign({ _id: userTwoId._id }, process.env.JWT_SECRET)
  }]
};

const userTwo = {
  _id: new mongoose.Types.ObjectId(),
  email: "emperor@rome.com",
  username: "Cezar",
  password: "princeps",
  isProfilePrivate: true,
  tokens: [{
    token: jwt.sign({ _id: userOneId._id }, process.env.JWT_SECRET)
  }]
};

const setupDatabase = async () => {
  await User.deleteMany();
};

module.exports = {
  userOne,
  userTwo,
  setupDatabase
};
