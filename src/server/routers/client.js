const path = require("path");
const express = require("express");

const router = new express.Router();

router.get("*", (req, res) => res.sendFile(path.join(
  __dirname,
  "..",
  "..",
  "..",
  "public",
  "index.html"
)));

module.exports = router;
