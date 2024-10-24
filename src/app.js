const express = require('express');

const app = express();  //Creating a Server using Express

// we can handle any incoming request by using app.use
app.use("/test", (req, res) => {
  res.send("Hello from the server!");
});

// order matters if we change the order of both app.use then both will give "Hello Sumit!".

// how to handle different incoming request 
app.use("/", (req, res) => {                          // this function is known as Request Handler.
  res.send("Hello Sumit!");
});


app.listen(7777, ()=>{
  console.log("Server is successfully listening on port 7777");
});
