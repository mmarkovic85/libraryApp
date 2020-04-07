const path = require("path");
const express = require("express");
require("./db/mongoose");

const server = express();
const port = process.env.PORT || 3000;

// Serve public dir
server.use(
  express.static(
    path.join(__dirname, "..", "..", "public")
  )
);

// Run server
server.listen(
  port,
  () => console.log(`Nineveh app is live on port: ${port}`)
);
