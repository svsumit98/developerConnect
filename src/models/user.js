const mongoose = require('mongoose');
const validator = require("validator");


// Defining  a Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,   // Mandatory Information
    minLength:2,      // Minimum length of string
    maxLength: 100,   // Maximum length of string
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase: true,   // Convert to lowercase.
    required: true,
    unique: true,   // No two same email id's will be registered.
    trim: true,     // Remove extra spaces!!
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid email address: " + value);
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("Enter a Strong Password: " + value);
      }
    },
  },
  age: {
    type: Number,
    min: 16,   // Minimum limit of number.
  },
  gender: {
    type: String,
    validate(value) {
      if(!["male", "female", "others"].includes(value)){
        throw new Error("Gender data is not valid!!");
      }
    },
  },
  photoUrl: {
    type: String,
    default: "https://picsum.photos/200/300/?blur",
    validate(value){
      if(!validator.isURL(value)){
        throw new Error("Invalid Photo URL: " + value);
      }
    },
  }, 
  about: {
    type: String,
    default: "This is a default about of the user!",  // This value will be in schema even if you have not it in signup
  },
  skills: {
    type: [String],
  },
}, {
  timestamps: true,
});

// Creating a mongoose model.
// const User = mongoose.model("User", userSchema);

// module.exports = User;

// OR
module.exports = mongoose.model("User", userSchema);
