import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.js";
import Chat from "../models/chat.js";
import photoController from "./photoController.js";
import chatController from "./chatController.js";
import jwt from "jsonwebtoken";
const createUser = async (req, res) => {
  const { name, age, gender, bio, preference, loginName, password } = req.body;
  console.log("Gender" + gender);
  let followedUsers = [1];
  let followers = [2];
  try {
    const newUser = new User({
      name,
      age,
      gender,
      bio,
      preference,
      loginName,
      password,
      followedUsers,
      followers,
    });
    if (req.file != null) {
      const profilePicUrl = await photoController.uploadProfilePic(
        newUser._id,
        req.file
      );
      newUser.profilePicUrl = profilePicUrl;
      await newUser.save();
      console.log(newUser);
    } else {
      await newUser.save();
      console.log(newUser);
    }

    console.log(newUser);
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const createUserGoogle = async (req, res) => {
  const { name, email, googleId, profilePicUrl } = req.body;
  let followedUsers = [];
  let followers = [];
  try {
    console.log("google sign up " + name + email);
    const newUser = new User({
      name,
      email,
      googleId,
      profilePicUrl,
      followedUsers,
      followers,
    });
    await newUser.save();
    const jwtToken = generateToken(newUser._id);
    res.status(200).json({
      message: "Sign up successful",
      token: jwtToken,
      followers,
      followedUsers,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, age, gender, bio, preference, loginName, password } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        age,
        gender,
        bio,
        preference,
        loginName,
        password,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserDataById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.find({ userId });
    const chats = chatController.getChatMessages(chatId);
    res.status(200).json(user, chats);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getInitialUserData = async (req, res) => {
  console.log("getInitialUserData");
  const { userId } = req.params;
  try {
    console.log("getInitialUserData");
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const followers = await Promise.all(
      user.followers.map(async (followerId) => {
        const follower = await User.findOne({ _id: followerId });
        let chat = await Chat.findOne({
          connectedUsers: { $all: [user._id, follower._id] },
        });
        if (!chat) {
          chat = new Chat({
            connectedUsers: [user._id, follower._id],
            userUnreadMessages: {
              [user._id]: 0,
              [follower._id]: 0,
            },
          });
          await chat.save();
        }
        return {
          id: follower._id,
          name: follower.name,
          chatId: chat._id,
          profilePicUrl: follower.profilePicUrl,
        };
      })
    );

    // Fetch followed users
    const followedUsers = await Promise.all(
      user.followedUsers.map(async (followedUserId) => {
        const followedUser = await User.findOne({ _id: followedUserId });
        let chat = await Chat.findOne({
          connectedUsers: { $all: [user._id, followedUser._id] },
        });
        if (!chat) {
          chat = new Chat({
            connectedUsers: [user._id, followedUser._id],
            userUnreadMessages: {
              [user._id]: 0,
              [followedUser._id]: 0,
            },
          });
          await chat.save();
        }
        return {
          id: followedUser._id,
          name: followedUser.name,
          chatId: chat._id,
          profilePicUrl: followedUser.profilePicUrl,
        };
      })
    );
    res.status(200).json({
      message: "success",
      followers,
      followedUsers,
    });
  } catch (error) {
    console.error("Error getting users initial data :", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//token authenticator middleware

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.supersecretkey, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};

const generateToken = (userId) => {
  const token = jwt.sign(
    {
      userId,
    },
    process.env.supersecretkey
  );
  return token;
};

export default {
  createUser,
  updateUser,
  getUserDataById,
  getInitialUserData,
  createUserGoogle,
};
