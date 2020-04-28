const server = require("./app.js");

const port = process.env.PORT || 3000;

// Run server
server.listen(
  port,
  () => console.log(`Nineveh app is live on port: ${port}`)
);
