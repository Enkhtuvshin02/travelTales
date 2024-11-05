import React, { useState, useEffect, useRef, useCallback } from "react";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import "./styles.css";
import axiosInstance from "../axios/axiosInstance.js";
import chat from "../../backend/models/chat.js";

const ChatWidget = ({
  socket,
  isSocketReady,
  token,
  userId,
  followedUsers,
  followers,
}) => {
  if (!socket || !isSocketReady) {
    return null; // Return null if socket is not ready or null
  }

  const [users, setUsers] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistories, setChatHistories] = useState({});
  const selectedChatUserRef = useRef(null);
  const [fetchChat, setFetchChat] = useState(true);
  const usersRef = useRef(null);
  const chatHistoryRef = useRef(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatHistories, selectedChatUser]);

  useEffect(() => {
    usersRef.current = users;
    if (fetchChat) {
      setFetchChat(false);
    }
  }, [users]);
  useEffect(() => {
    selectedChatUserRef.current = selectedChatUser;
  }, [selectedChatUser]);

  useEffect(() => {
    if (isSocketReady) {
      const initialUsers = followedUsers.map((user) => ({
        userId: user.id,
        chatId: user.chatId,
        name: user.name,
        profilePicUrl: user.profilePicUrl,
        isActive: false,
        unreadChat: 0,
      }));
      setUsers(initialUsers);

      if (!socket.connected) {
        socket.connect();
      }
      socket.emit(
        "checkStatus",
        followedUsers.map((user) => user.id)
      );

      socket.on("activeUsers", (activeFollowedUsers) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => ({
            ...user,
            isActive: activeFollowedUsers.includes(user.userId),
          }))
        );
      });

      socket.on("followerActive", ({ userId }) =>
        updateUserStatus(userId, true)
      );
      socket.on("followedActive", ({ userId }) =>
        updateUserStatus(userId, true)
      );
      socket.on("followerInactive", ({ disconnectedUserId }) =>
        updateUserStatus(disconnectedUserId, false)
      );
      socket.on("followedInactive", ({ disconnectedUserId }) =>
        updateUserStatus(disconnectedUserId, false)
      );

      socket.on("receiveMessage", handleReceiveMessage);
    }
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [isSocketReady, socket]);

  const updateUserStatus = (userId, isActive) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === userId ? { ...user, isActive } : user
      )
    );
  };

  const handleReceiveMessage = ({ fromUserId, message }) => {
    const currentSelectedUser = selectedChatUserRef.current;

    setChatHistories((prevChatHistories) => {
      const newChatHistory = {
        ...prevChatHistories,
        [fromUserId]: [
          ...(Array.isArray(prevChatHistories[fromUserId])
            ? prevChatHistories[fromUserId]
            : []),
          { sender: fromUserId, message, time: Date.now() },
        ],
      };

      if (currentSelectedUser && currentSelectedUser.userId === fromUserId) {
        console.log("chat opened same user");
        return newChatHistory;
      }

      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers];
        const userIndex = updatedUsers.findIndex(
          (user) => user.userId === fromUserId
        );

        if (userIndex === -1) {
          const sender = followers.find(
            (follower) => follower.id === fromUserId
          );
          if (sender) {
            updatedUsers.push({
              userId: sender.id,
              name: sender.name,
              profilePicUrl: sender.profilePicUrl,
              chatId: sender.chatId,
              isActive: true,
              unreadChat: 1,
            });
          }
        } else {
          updatedUsers[userIndex] = {
            ...updatedUsers[userIndex],
            unreadChat: (updatedUsers[userIndex].unreadChat || 0) + 1,
          };
        }

        return updatedUsers;
      });

      return newChatHistory;
    });
    scrollToBottom();
  };

  const getChats = async (chatId) => {
    try {
      const response = await axiosInstance.get(
        `/api/chat/getChatMessages/${chatId}/${userId}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting chats:", error);
      return [];
    }
  };
  useEffect(() => {
    const fetchChats = async () => {
      console.log("fetching chats");
      const currentUsers = usersRef.current;

      for (const user of currentUsers) {
        try {
          const chat = await getChats(user.chatId);
          console.log("user id in fetch chats " + userId);
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.userId === chat.userId
                ? { ...u, unreadChat: chat.userUnreadMessages[userId] }
                : u
            )
          );
          console.log("chat" + JSON.stringify(chat));
          setChatHistories((prevChatHistories) => {
            const newChatHistory = {
              ...prevChatHistories,
              [chat.userId]: [
                ...(Array.isArray(prevChatHistories[chat.userId])
                  ? prevChatHistories[chat.userId]
                  : []),
                ...chat.chatMessages.map((message) => ({
                  sender: message.sender,
                  message: message.message,
                  time: message.time,
                })),
              ],
            };
            return newChatHistory;
          });
        } catch (error) {
          console.log("Error fetching chat:", error);
        }
      }
    };

    fetchChats();
  }, [fetchChat]);

  const handleChatSelection = async (user) => {
    if (!user || !user.userId) {
      console.error("Selected user or userId is null");
      return;
    }

    const selectedUserId = user.userId;
    const chatId = user.chatId;

    socket.emit("chatSelected", { userId, user: selectedUserId });

    if (user.unreadChat > 0) {
      console.log("user unread chats " + user.unreadChat);
      try {
        const response = await axiosInstance.put(
          `/api/chat/chatRead/${chatId}`,
          { userId },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(
          "Chat marked as read for user:",
          selectedUserId,
          response.data
        );
      } catch (error) {
        console.error("Error marking chat as read:", error);
      }
    }
    if (selectedChatUser && selectedChatUser.userId === user.userId) {
      console.log("same user");
      setSelectedChatUser(null);
    }
    setSelectedChatUser(user);
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.userId === selectedUserId ? { ...u, unreadChat: 0 } : u
      )
    );
  };

  const sendMessage = () => {
    if (selectedChatUser.userId && message.trim()) {
      socket.emit("sendMessage", {
        senderId: userId,
        recieverId: selectedChatUser.userId,
        chatId: selectedChatUser.chatId,
        message,
      });

      setChatHistories((prevChatHistories) => ({
        ...prevChatHistories,
        [selectedChatUser.userId]: [
          ...(Array.isArray(prevChatHistories[selectedChatUser.userId])
            ? prevChatHistories[selectedChatUser.userId]
            : []),
          { sender: userId, message, time: Date.now() },
        ],
      }));

      setMessage("");
    }
    scrollToBottom();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleScroll = async () => {
    if (chatHistoryRef.current) {
      const { scrollTop } = chatHistoryRef.current;
      if (scrollTop === 0) {
        setMessagesToShow((prev) => prev + 10);
      }
    }
  };
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistories]);

  return (
    <div>
      <h3>Your Followed Users and Followers</h3>
      <ul>
        {users.map((user) => (
          <li
            key={user.userId}
            onClick={() => handleChatSelection(user)}
            style={{
              cursor: "pointer",
              color: user.isActive ? "green" : "red",
            }}
          >
            {user.name}{" "}
            <span style={{ color: "black" }}>{user.unreadChat}</span>
          </li>
        ))}
      </ul>

      {selectedChatUser && (
        <div>
          <h4>Chat with {selectedChatUser.userId}</h4>
          <div
            ref={chatHistoryRef}
            style={{
              height: "200px",
              overflowY: "auto",
            }}
          >
            {chatHistories[selectedChatUser.userId]?.map((msg, index) => (
              <p
                key={index}
                style={{ textAlign: msg.sender === userId ? "right" : "left" }}
              >
                {msg.sender === userId ? "" : selectedChatUser.name + ":"}{" "}
                {msg.message}
              </p>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
          />
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
