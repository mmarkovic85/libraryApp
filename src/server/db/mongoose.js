const mongoose = require("mongoose");

// Connect to database
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch(er => console.log("Mongoose connection error: ", er.message));
