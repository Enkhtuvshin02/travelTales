import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.js";
import Chat from "../models/chat.js";
import jwt from "jsonwebtoken";

const signIn = async (req, res) => {
  const { loginName, password } = req.body;
  try {
    const user = await User.findOne({ loginName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordCorrect = password === user.password;
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Fetch followers
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

    // Generate JWT token
    const jwtToken = generateToken(user._id);
    res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      followers,
      followedUsers,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const googleSignIn = async (req, res) => {
  const { name, email } = req.body;
  try {
    console.log("google sign in " + name + email);
    const user = await User.findOne({ name: name, email: email });
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

    // Generate JWT token
    const jwtToken = generateToken(user._id);
    res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      followers,
      followedUsers,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
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

export default { signIn, googleSignIn };
