const request = require("supertest");

const app = require("../../../src/server/app");
const Book = require("../../../src/server/models/book");
const {
  bookOne,
  bookTwo,
  bookThree,
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
  expect(book.owner).toBe(_id);
});

test("Should get all user's books", async () => {
});

test("Should get book by id", async () => {

});

test("Should update book", async () => { });

test("Should delete book", async () => { });
