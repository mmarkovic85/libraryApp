const mongoose = require("mongoose");

// Connect to database
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .catch(er => console.log("Mongoose connection error: ", er.message));
