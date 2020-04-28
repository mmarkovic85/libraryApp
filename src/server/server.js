const app = require("./app.js");

const port = process.env.PORT || 3000;

// Run server
app.listen(
  port,
  () => console.log(`Nineveh app is live on port: ${port}`)
);
