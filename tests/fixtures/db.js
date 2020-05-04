const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../../src/server/models/user");
const Book = require("../../src/server/models/book");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  email: "filozof@atina.edu",
  username: "Sokrat",
  password: "nistaneznam",
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  email: "emperor@rome.com",
  username: "Cezar",
  password: "princeps",
  isProfilePrivate: true,
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
  }]
};

const userThree = {
  email: "cleo@pyramid.edu",
  username: "Kleopatra",
  password: "otrovnice",
  isProfilePrivate: true
}

const bookOne = {
  author: "Rodžer Zelazni",
  title: "Gospodar svetlosti",
  yaer: "2013",
  genre: "naučna fantastika",
  publisher: "ZARDOZ",
  language: "srpski",
  notes: "prevod: Aleksandar B. Nedeljković",
  isBookRead: true,
  owner: userOne._id
};

const bookTwo = {
  author: "Svetislav Basara",
  title: "Fama o biciklistima",
  yaer: "2013",
  publisher: "Laguna",
  language: "srpski",
  isbn: "9788652110902",
  owner: userOne._id
};

const bookThree = {
  author: "Borislav Pekić",
  title: "Sentimentalna povest Britanskog carstva",
  yaer: "2006",
  publisher: "Solaris",
  language: "srpski",
  isBookRead: true,
  owner: userTwo._id
};

const setupDatabase = async () => {
  await User.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await Book.deleteMany();
  await new Book(bookOne).save();
  await new Book(bookTwo).save();
  await new Book(bookThree).save();
};

module.exports = {
  userOne,
  userTwo,
  userThree,
  bookOne,
  bookTwo,
  bookThree,
  setupDatabase
};
