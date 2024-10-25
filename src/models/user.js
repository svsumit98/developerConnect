const mongoose = require('mongoose');


// Defining  a Schema
const userSchema =new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String
  },
  password: {
    type: String
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  }
});

// Creating a mongoose model.
// const User = mongoose.model("User", userSchema);

// module.exports = User;

// OR
module.exports = mongoose.model("User", userSchema);
