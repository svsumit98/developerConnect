const express = require("express");
const { connectDB } = require("./config/database");
const app = express(); //Creating a Server using Express
const cookieParser = require("cookie-parser");
const user = require("./models/user");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json()); //Converts the JSON to JS Object, and applicable is all routes, act as Middleware.
app.use(cookieParser()); // without this console.log(cookies) will show undefined (reference: /profile API)

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Databasee connection established!!");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
