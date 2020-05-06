const request = require("supertest");

const app = require("../../../src/server/app");
const Book = require("../../../src/server/models/book");
const {
  bookOne,
  bookTwo,
  bookThree,
  bookData,
  userOne,
  userTwo,
  setupDatabase
} = require("../../fixtures/db");

beforeEach(setupDatabase);

test("Should create new book", async () => {
  const { _id, tokens: [{ token }] } = userTwo;

  const response = await request(app)
    .post("/api/books")
    .set("Authorization", `Bearer ${token}`)
    .send(bookData)
    .expect(201);

  const book = await Book.findById(response.body._id);
  expect(book).not.toBeNull();
  expect(book.owner).toEqual(_id);
});

test("Should get all user's books", async () => {
});

test("Should get book by id", async () => {

});

test("Should update book", async () => {

});

test("Should delete user's book", async () => {
  const { _id } = bookOne;
  const { tokens: [{ token }] } = userOne;

  await request(app)
    .delete(`/api/books/${_id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  const book = await Book.findById(_id);
  expect(book).toBeNull();
});

test("Should not delete book of another user", async () => {
  const { _id } = bookThree;
  const { tokens: [{ token }] } = userOne;

  await request(app)
    .delete(`/api/books/${_id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(404);
});
