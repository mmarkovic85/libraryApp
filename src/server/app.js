const path = require("path");
const express = require("express");
require("./db/mongoose");

const bookRouter = require("./routers/book");
const clientRouter = require("./routers/client");
const userRouter = require("./routers/user");

const app = express();

// Serve public dir
app.use(
  express.static(
    path.join(__dirname, "..", "..", "public")
  )
);

// Request body parser
app.use(express.json());

// API routes
app.use("/api", userRouter);
app.use("/api", bookRouter);
// React router
app.use("/", clientRouter);

module.exports = app;
