const express = require('express');
const { connectDB } = require("./config/database")
const app = express();  //Creating a Server using Express
const User = require('./models/user');

app.use(express.json()); //Converts the JSON to JS Object, and applicable is all routes.


app.post("/signup", async (req, res) => {
  // console.log(req.body); //this will give the JS object passed from the Postman.

  // Creating a new instance of the User model
  const user = new User(req.body);

  // Always write try and catch for DB handling.
  try{
    await user.save();
  res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
  
})

// GET user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try{
	  const user= await User.findOne();
    if(!user){
      res.status(400).send("User not found");
    } else{
      res.send(user);
    }

    // const users = await User.find({emailId: userEmail});
    // if(users.length === 0){
    //   res.status(404).send("User not found");
    // } else {
    //   res.send(users);
    // }
  } catch {
    res.status(400).send("Something went wrong!!");
  }
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => { 
  try{
    const users = await User.find({});
    res.send(users); 
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});


app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try{
    // const user = await User.findByIdAndDelete({_id: userId});
    const user = await User.findByIdAndDelete(userId);

    res.send("User Deleted successfully");
  } catch {
    res.status(400).send("something went wrong");
  }
});

// Update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try{
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdateAllowed){
      throw new Error("Update not allowed");
    }
    if(data?.skills.length > 10){
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({_id: userId}, data, {returnDocument: "after", runValidators: true,});
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED " + err.message);
  }
});



connectDB()
  .then(() => {
    console.log("Databasee connection established!!");
    app.listen(7777, ()=>{
      console.log("Server is successfully listening on port 7777");
  });
}).catch(err => {
  console.error("Database cannot be connected!!");
});
