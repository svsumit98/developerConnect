const express = require('express');

const app = express();  //Creating a Server using Express

const { adminAuth, userAuth } = require("./middlewares/auth");

// Handle Auth Middleware for all GET, POST, ... requests
app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) =>{
  res.send("User Data Sent");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data Sent");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted a user");
});
 

app.listen(7777, ()=>{
  console.log("Server is successfully listening on port 7777");
});
