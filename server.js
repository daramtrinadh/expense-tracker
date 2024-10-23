const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotEnv = require("dotenv");
const transactionRoutes=require('./routes/transactionRoutes')

dotEnv.config();

const app = express();
app.use(bodyParser.json());

app.get("/getmethod", (req, res) => {
  res.send({ message: "get method" });
});

app.use('/api',transactionRoutes)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

app.listen(3000, () => {
  console.log(`Server started and running on localhost:3000}`);
});
