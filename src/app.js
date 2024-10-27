const express = require('express');
const { connectDB } = require("./config/database")
const app = express();  //Creating a Server using Express
const cookieParser = require('cookie-parser');
const user = require('./models/user');

app.use(express.json()); //Converts the JSON to JS Object, and applicable is all routes, act as Middleware.
app.use(cookieParser());  // without this console.log(cookies) will show undefined (reference: /profile API)

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Databasee connection established!!");
    app.listen(7777, ()=>{
      console.log("Server is successfully listening on port 7777");
  });
}).catch(err => {
  console.error("Database cannot be connected!!");
});
