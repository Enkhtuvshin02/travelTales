import React, { useState } from "react";
import jwt from "jsonwebtoken";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import axiosInstance from "../axios/axiosInstance";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Google from "./google.jsx";

const SignIn = ({
  setToken,
  setUserId,
  setFollowedUsers,
  setFollowers,
  setIsLoggedIn,
}) => {
  const [loginName, setLoginName] = useState("");
  const [password, setPassWord] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    setUserId(null);
    setFollowedUsers(null);
    setFollowers(null);
    setToken(null);
    setIsLoggedIn(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("loginName", loginName);
    formData.append("password", password);
    try {
      const response = await axiosInstance.post("/api/auth/signIn", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const token = response.data.token;
      sessionStorage.setItem("token", token);
      const decodedToken = jwt.decode(token);
      setUserId(decodedToken.userId);
      setFollowedUsers(response.data.followedUsers);
      setFollowers(response.data.followers);
      setToken(token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error signing in", error);
      alert("There was an error signing in.");
    }
  };

  const handleSignUp = async (decoded) => {
    const formData = new FormData();
    formData.append("name", decoded.name);
    formData.append("email", decoded.email);
    formData.append("googleId", decoded.id);
    formData.append("profilePicUrl", decoded.picture);
    try {
      const response = await axiosInstance.post(
        "/api/user/createUser Google",
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
    } catch (error) {
      console.error("Error signing up", error);
      alert("There was an error signing up.");
    }
  };

  return (
    <div>
      <h1>{isSignUp ? "Sign Up" : "Sign In"}</h1>
      <TextField
        id="outlined-basic"
        label="Login Name"
        variant="outlined"
        value={loginName}
        onChange={(e) => setLoginName(e.target.value)}
      />
      <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassWord(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
      <Button variant="outlined" onClick={handleSignIn}>
        {"Sign In"}
      </Button>
      <Button variant="outlined" onClick={handleSignOut}>
        Sign out
      </Button>

      <GoogleOAuthProvider clientId="822984547120-mto7jlae1uekhpm2ve3aqqn55bojkh1n.apps.googleusercontent.com">
        <div>
          <Google
            setToken={setToken}
            setUserId={setUserId}
            setFollowedUsers={setFollowedUsers}
            setFollowers={setFollowers}
            setIsLoggedIn={setIsLoggedIn}
            isSignUp={isSignUp}
          />
        </div>
        <div>
          <Google
            setToken={setToken}
            setUserId={setUserId}
            setFollowedUsers={setFollowedUsers}
            setFollowers={setFollowers}
            setIsLoggedIn={setIsLoggedIn}
            isSignUp={!isSignUp}
          />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default SignIn;
