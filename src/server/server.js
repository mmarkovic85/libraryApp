const path = require("path");
const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/user");
const bookRouter = require("./routers/book");

const server = express();
const port = process.env.PORT || 3000;

// Serve public dir
server.use(
  express.static(
    path.join(__dirname, "..", "..", "public")
  )
);

// API routes
server.use("/api", userRouter);
server.use("/api", bookRouter);

// Run server
server.listen(
  port,
  () => console.log(`Nineveh app is live on port: ${port}`)
);
