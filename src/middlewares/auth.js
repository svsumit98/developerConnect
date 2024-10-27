const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try{
    // Read the token from the req cookies
    const { token } = req.cookies;
    
    // Validate the token
    if(!token){
      throw new Error("Invalid Token!!");
    }

    // Find the user
    const decodedObj = await jwt.verify(token, "DEV@Connect@123");  // returns an object with _id , exp, iat
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if(!user){
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err){
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};