import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import chatController from "./controllers/chatController.js";
import connectDB from "./config/db.js";
import Chat from "./models/chat.js";
connectDB();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const activeUsers = new Map();

// Connect
io.on("connection", (socket) => {
  socket.on("join", ({ userId, followedUsers, followers }) => {
    console.log("userId " + userId);
    followedUsers = followedUsers.map(String); // Convert followedUsers to strings
    followers = followers.map(String); // Convert followers to strings

    activeUsers.set(userId, {
      socketId: socket.id,
      followedUsers,
      followers,
      chatOpen: null,
    });
    console.log("Manual map test:", Array.from(activeUsers.entries()).length);
    // Notify followers that the current user is active
    followers.forEach((followerId) => {
      const followerData = activeUsers.get(followerId);
      if (followerData) {
        io.to(followerData.socketId).emit("followerActive", { userId });
      }
    });

    // Notify followed users that their follower is active
    followedUsers.forEach((followedUserId) => {
      const followedUserData = activeUsers.get(followedUserId);
      if (followedUserData) {
        io.to(followedUserData.socketId).emit("followedActive", { userId });
      }
    });
  });
  socket.on("checkStatus", (followedUsersIds) => {
    console.log(followedUsersIds);
    const activeFollowedUsers = followedUsersIds.filter((id) =>
      activeUsers.has(id)
    );
    socket.emit("activeUsers", activeFollowedUsers);
  });
  // Disconnect
  socket.on("disconnect", () => {
    let disconnectedUserId = null;

    for (let [userId, userData] of activeUsers.entries()) {
      if (userData.socketId === socket.id) {
        disconnectedUserId = userId;
        break;
      }
    }

    if (disconnectedUserId) {
      const { followers = [], followedUsers = [] } =
        activeUsers.get(disconnectedUserId) || {};

      // Notify followers that the current user is disconnected
      followers.forEach((followerId) => {
        const followerData = activeUsers.get(followerId);
        if (followerData) {
          io.to(followerData.socketId).emit("followedInactive", {
            disconnectedUserId,
          });
        }
      });

      // Notify followed users that their follower is disconnected
      followedUsers.forEach((followedUserId) => {
        const followedUserData = activeUsers.get(followedUserId);
        if (followedUserData) {
          io.to(followedUserData.socketId).emit("followerInactive", {
            disconnectedUserId,
          });
        }
      });

      // Remove the disconnected user from activeUsers
      activeUsers.delete(disconnectedUserId);
    }
  });

  // Chat
  socket.on(
    "sendMessage",
    async ({ senderId, recieverId, chatId, message }) => {
      console.log(
        `From userId: ${senderId}, message: "${message}" to userId: ${recieverId}`
      );

      const recipientData = activeUsers.get(recieverId);
      if (recipientData) {
        io.to(recipientData.socketId).emit("receiveMessage", {
          chatId,
          fromUserId: senderId,
          message,
        });
      }

      let chat;
      try {
        // Check if chat exists or create one if not
        if (!chatId) {
          chat = await chatController.getChat(senderId, recieverId);
          chatId = chat._id; // Assign the new or retrieved chat ID to chatId
        } else {
          // Fetch the chat document directly if chatId is provided
          chat = await Chat.findById(chatId);
        }

        // Check if the recipient has the chat open or if we need to update unread messages
        if (recipientData?.openChat !== senderId) {
          console.log(
            "sender id " +
              senderId +
              "reciever id " +
              recieverId +
              " chat id " +
              chatId
          );
          console.log("your send message unread your");
          try {
            const updatedChat = await Chat.findByIdAndUpdate(
              chatId,
              {
                $inc: { [`userUnreadMessages.${recieverId}`]: 1 },
              },
              { new: true }
            );

            if (!updatedChat) {
              console.error("Chat not found for chatId:", chatId);
            } else {
              console.log("Chat updated successfully:", updatedChat);
            }
          } catch (error) {
            console.error("Error updating chat:", error);
          }
        }

        // Create the chat message in the database
        const response = await chatController.createChatMessage(
          chatId,
          senderId,
          message
        );

        if (response !== "success") {
          console.log("Chat message creation failed");
        }
      } catch (error) {
        console.log("Error handling chat:", error);
      }
    }
  );

  socket.on("chatSelected", async ({ userId, user }) => {
    try {
      const userData = activeUsers.get(userId);
      if (userData) {
        userData.chatOpen = user;
        activeUsers.set(userId, userData);

        console.log(`Open chat setted with userId: ${user}`);
      } else {
        console.log(`User  data not found for userId: ${userId}`);
      }
    } catch (error) {
      console.log("Error handling chat:", error);
    }
  });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
