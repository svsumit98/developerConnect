const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require('../models/user');
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req, res) => {
  try{
    // Validation of data
    validateSignUpData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
  
    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try{
    const { emailId, password } = req.body;

    const user = await User.findOne({emailId: emailId});
    // console.log(user);
    if(!user){
      throw new Error("Invalid Credentials");  //Dont write emailId not present in DB. (Information Leaking)
    }
    const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid) {
      // Create a JWT Token
      const token = await user.getJWT();
      // console.log(token);

      // Add the token to cookie and send the response back to the user.
      res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000)});   //server is sending cookie to user. Second entry -> JWT.
      res.send("Login Successful!!");
    } else{
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = authRouter;