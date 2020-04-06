const path = require("path");
const express = require("express");

const server = express();
const port = process.env.PORT || 3000;
const public_directory_path = path.join(__dirname, "../../public");

server.use(express.static(public_directory_path));

server.listen(port, () => console.log(`Nineveh app is live on port: ${port}`));