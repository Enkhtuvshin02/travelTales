import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import axiosInstance from "../axios/axiosInstance";
import jwt from "jsonwebtoken";
const Google = ({
  isSignUp,
  onSuccess,
  setToken,
  setUserId,
  setFollowedUsers,
  setFollowers,
  setIsLoggedIn,
}) => {
  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        const tokenResponse = await axios.post(
          "https://oauth2.googleapis.com/token",
          {
            code: codeResponse.code,
            client_id:
              "822984547120-mto7jlae1uekhpm2ve3aqqn55bojkh1n.apps.googleusercontent.com",
            client_secret: "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",
            redirect_uri: "http://localhost:3000",
            grant_type: "authorization_code",
          }
        );

        const accessToken = tokenResponse.data.access_token;
        const userInfo = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
        );

        console.log(userInfo.status);
        if (userInfo.status === 200) {
          console.log("success");
          handleGoogleSuccess(userInfo.data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: (errorResponse) => {
      console.error("Login Failed:", errorResponse);
    },
  });

  const handleGoogleSuccess = async (decoded) => {
    try {
      const formData = new FormData();
      console.log(isSignUp);
      if (isSignUp) {
        formData.append("name", decoded.name);
        formData.append("email", decoded.email);
        formData.append("googleId", decoded.id);
        formData.append("profilePicUrl", decoded.picture);
        const response = await axios.post(
          "/api/user/createUserGoogle",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Response:", response.data);
        const token = response.data.token;
        sessionStorage.setItem("token", token);
        const decodedToken = jwt.decode(token);
        setUserId(decodedToken.userId);
        setFollowedUsers(response.data.followedUsers);
        setFollowers(response.data.followers);
        setToken(token);
        setIsLoggedIn(true);
      } else {
        formData.append("name", decoded.name);
        formData.append("email", decoded.email);

        const response = await axiosInstance.post(
          "/api/auth/googleSignIn",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const token = response.data.token;
        sessionStorage.setItem("token", token);
        const decodedToken = jwt.decode(token);
        setUserId(decodedToken.userId);
        setFollowedUsers(response.data.followedUsers);
        setFollowers(response.data.followers);
        setToken(token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error submitting the form", error);
      alert("There was an error submitting the form.");
    }
    console.log("Google Login Success");
  };

  return (
    <button onClick={() => login()}>
      {isSignUp ? "Sign Up with Google" : "Sign In with Google"} 🚀
    </button>
  );
};

export default Google;
