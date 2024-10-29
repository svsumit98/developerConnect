const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const authRouter = require("./auth");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connections request for the loggedIn user
userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl age gender about skills");
    // }).populate("fromUserId", ["firstName", "lastName"]); //Above and this line doing exactly same. If we just write "fromUserId" and do not mentioned the firstName etc, then loggedin user will see all the details of user who send him request.

    res.json({ message: "Data fetched successfully", data: connectionRequests});
    } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {toUserId: loggedInUser._id, status: "accepted"},
        {fromUserId: loggedInUser._id, status: "accepted"},
      ]
    })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) =>{
      if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {     // Object is converting into string (toString);
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({data});
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    // Find all the connection requests (sent + received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [{fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const user = await User.find({
      $and: [
        { _id: {$nin: Array.from(hideUsersFromFeed)} },
        { _id: {$ne: loggedInUser._id} },
      ],
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.send(user);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

module.exports = userRouter;