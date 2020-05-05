require("core-js/stable");
require("regenerator-runtime/runtime");
const request = require("supertest");

const app = require("../../../src/server/app");
const User = require("../../../src/server/models/user");
const {
  userOne,
  userTwo,
  userThree,
  setupDatabase
} = require("../../fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const { email, username, password, isProfilePrivate } = userThree;

  const response = await request(app)
    .post("/api/users")
    .send(userThree)
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
  const { _id: id, email, username, isProfilePrivate = false } = userOne;

  const response = await request(app)
    .get(`/api/users/${id}`)
    .send()
    .expect(200);

  expect(response.body).toMatchObject({
    user: { email, username, isProfilePrivate }
  });
});

test("Should not get profile for private user", async () => {
  const { _id: id } = userTwo;
  await request(app)
    .get(`/api/users/${id}`)
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

test("Should delete account for user", async () => { });

test("Should not delete account for unauthenticated user", async () => { });

test("Should update valid user fields", async () => { });

test("Should not update invalid users field", async () => { });

test("Should not update user if unauthenticated", async () => { });
