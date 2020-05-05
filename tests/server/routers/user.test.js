require("core-js/stable");
require("regenerator-runtime/runtime");
const request = require("supertest");

const app = require("../../../src/server/app");
const User = require("../../../src/server/models/user");
const { userOne, userThree, setupDatabase } = require("../../fixtures/db");

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
  const { email, password } = userOne;

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
    token: user.tokens[1].token
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

test("Should get profile for public user", async () => { });

test("Should not get profile for private user", async () => { });

test("Should not get profile for unauthenticated user", async () => { })

test("Should delete account for user", async () => { });

test("Should not delete account for unauthenticated user", async () => { });

test("Should update valid user fields", async () => { });

test("Should not update invalid users field", async () => { });

test("Should not update user if unauthenticated", async () => { });
