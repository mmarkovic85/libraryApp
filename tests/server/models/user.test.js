require("core-js/stable");
require("regenerator-runtime/runtime");
const request = require("supertest");

const app = require("../../../src/server/app");
const User = require("../../../src/server/models/user");
const { setupDatabase } = require("../../fixtures/db");

// TODO import fixtures

beforeEach(setupDatabase);

test("Should test something", async () => { });
