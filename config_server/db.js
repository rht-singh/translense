const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
exports.mongodbConnection = (uri) => {
  mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) throw err;
      else console.log("Mongo connected");
    }
  );
};
