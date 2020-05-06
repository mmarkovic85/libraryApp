const request = require("supertest");

const app = require("../../../src/server/app");
const User = require("../../../src/server/models/user");
const Book = require("../../../src/server/models/book");
const {
  userOne,
  userTwo,
  userData,
  setupDatabase
} = require("../../fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const { email, username, password, isProfilePrivate } = userData;

  const response = await request(app)
    .post("/api/users")
    .send(userData)
    .expect(201)

  const user = await User.findById(response.body.user._id);

  expect(user).not.toBeNull();
  expect(response.body).toMatchObject({
    user: {
      email, username, isProfilePrivate
    },
    token: user.tokens[0].token
  });
  expect(user.password).not.toBe(password);
});

test("Should login existing user", async () => {
  const { email, password, username } = userOne;

  const response = await request(app)
    .post("/api/users/login")
    .send({
      email,
      password
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);

  expect(user).not.toBeNull();
  expect(response.body).toMatchObject({
    user: {
      email, username, isProfilePrivate: false
    },
    token: user.tokens[3].token
  });
  expect(user.password).not.toBe(password);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/api/users/login")
    .send({
      email: "user@user.com",
      password: "userpassword"
    })
    .expect(400);
});

test("Should logout user from current device", async () => {
  const { _id, tokens: [{ token }] } = userOne;

  await request(app)
    .post("/api/users/logout")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  const user = await User.findById(_id);
  expect(user.tokens).not.toContain(token);
});

test("Should logout user from all devices", async () => {
  const { _id, tokens: [{ token }] } = userOne;

  await request(app)
    .post("/api/users/logoutall")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  const user = await User.findById(_id);
  expect(user.tokens.length).toBe(0);
});

test("Should get profile for public user", async () => {
  const { _id, email, username, isProfilePrivate = false } = userOne;

  const response = await request(app)
    .get(`/api/users/${_id}`)
    .send()
    .expect(200);

  expect(response.body).toMatchObject({
    user: { email, username, isProfilePrivate }
  });
});

test("Should not get profile for private user", async () => {
  const { _id } = userTwo;
  await request(app)
    .get(`/api/users/${_id}`)
    .expect(404);
});

test("Should get user's private profile to him/her", async () => {
  const {
    email,
    username,
    isProfilePrivate,
    tokens: [{ token }]
  } = userTwo;

  const response = await request(app)
    .get("/api/users/me")
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(200);

  expect(response.body).toMatchObject({
    user: { email, username, isProfilePrivate }
  });
});

test("Should delete account for user", async () => {
  const { _id, tokens: [{ token }] } = userOne;

  await request(app)
    .delete("/api/users/delete")
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(200);

  const user = await User.findById(_id);
  expect(user).toBeNull();
  const books = await Book.find({ owner: _id });
  expect(books.length).toBe(0);
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app)
    .delete("/api/users/delete")
    .send()
    .expect(401);
});

test("Should update valid user fields", async () => {
  const { _id, tokens: [{ token }] } = userTwo;

  await request(app)
    .put("/api/users/me")
    .set("Authorization", `Bearer ${token}`)
    .send({ username: "Oktavijan" })
    .expect(200);

  const user = await User.findById(_id);
  expect(user.username).toBe("Oktavijan");
});

test("Should not update invalid users field", async () => {
  const { tokens: [{ token }] } = userOne;

  await request(app)
    .put("/api/users/me")
    .set("Authorization", `Bearer ${token}`)
    .send({ location: "Sparta" })
    .expect(400);
});

test("Should not update user if unauthenticated", async () => {
  await request(app)
    .put("/api/users/me")
    .send()
    .expect(401);
});
