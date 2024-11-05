// App.js
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./home/index.jsx";
import SignIn from "./signIn/index.jsx";
import SignUp from "./signUp/index.jsx";
import UserProfile from "./userProfile/index.jsx";
import NavBar from "./navBar/index.jsx";
import CreateStory from "./createStory/index.jsx";
import ChatWidget from "./chatWidget/index.jsx";
import io from "socket.io-client";
import "./styles.css"; // Import CSS for styling
import jwt from "jsonwebtoken";
import axiosInstance from "./axios/axiosInstance.js";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [followedUsers, setFollowedUsers] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [isSocketReady, setIsSocketReady] = useState(false);

  const socketRef = useRef();

  useEffect(() => {
    console.log("main use effect");
    const token = sessionStorage.getItem("token");
    let decodedToken;
    if (token) {
      decodedToken = jwt.decode(token);
    }

    const checkIsLoggedIn = async () => {
      if (decodedToken && decodedToken.userId) {
        try {
          const response = await axiosInstance.get(
            "/api/user/getInitialUserData/" + decodedToken.userId,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data.message === "success") {
            setToken(token);
            setUserId(decodedToken.userId);
            setFollowedUsers(response.data.followedUsers);
            setFollowers(response.data.followers);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error(
            "Getting initial data failed:",
            error.response ? error.response.data : error.message
          );
        }
      } else {
        console.log("User  ID not found in decoded token.");
      }
    };

    if (token) {
      checkIsLoggedIn();
    }

    // Set up socket connection when logged in
    if (isLoggedIn && !socketRef.current) {
      socketRef.current = io("http://localhost:4000");

      socketRef.current.on("connect", () => {
        console.log("Socket connected");
        const followedUserIds = followedUsers
          ? followedUsers.map((user) => user.id)
          : [];
        const followerIds = followers
          ? followers.map((follower) => follower.id)
          : [];
        console.log("Joining with userId: " + userId);
        socketRef.current.emit("join", {
          userId,
          followedUsers: followedUserIds,
          followers: followerIds,
        });
        setIsSocketReady(true);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsSocketReady(false);
      });
    }

    // Clean up on logout
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isLoggedIn]);

  const toggleChatWidget = () => {
    setShowChat((prevShowChat) => !prevShowChat);
  };

  return (
    <>
      <Router>
        <NavBar />
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/signIn">Sign In</Link>
            </li>
            <li>
              <Link to="/signUp">Sign Up</Link>
            </li>
            <li>
              <Link to="/userProfile">User Profile</Link>
            </li>
            <li>
              <Link to="/createStory">Create Story</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signIn"
            element={
              <SignIn
                setToken={setToken}
                setUserId={setUserId}
                setFollowedUsers={setFollowedUsers}
                setFollowers={setFollowers}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/createStory" element={<CreateStory />} />
        </Routes>
      </Router>

      {isLoggedIn && token && (
        <>
          <div className="chat-icon" onClick={toggleChatWidget}>
            💬
          </div>
          {showChat && (
            <div className="chat-widget-container">
              <ChatWidget
                socket={socketRef.current}
                isSocketReady={isSocketReady} // Pass down the socket ready state
                token={token}
                userId={userId}
                followedUsers={followedUsers}
                followers={followers}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
