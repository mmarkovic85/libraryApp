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
  isbn: "978-86-521-1090-2",
  owner: userOne._id
};

const bookThree = {
  author: "Sentimentalna povest Britanskog carstva",
  title: "Borislav Pekić",
  yaer: "2006",
  publisher: "Solaris",
  language: "srpski",
  isBookRead: true,
  owner: userTwo._id
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Book.deleteMany();
};

module.exports = {
  bookOne,
  bookTwo,
  bookThree,
  userOne,
  userTwo,
  setupDatabase
};
