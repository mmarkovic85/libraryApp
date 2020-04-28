require("core-js/stable");
require("regenerator-runtime/runtime");
const request = require("supertest");

const app = require("../../../src/server/app");
const Book = require("../../../src/server/models/book");
const { setupDatabase } = require("../../fixtures/db");

// TODO import fixtures

beforeEach(setupDatabase);

test("Should test something", async () => { });
