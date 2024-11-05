import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import "./styles.css";
import axios from "axios";
import axiosInstance from "../axios/axiosInstance";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [preference, setPreference] = useState([]);
  const [types, setTypes] = useState([]); // To store types fetched from API
  const [loginName, setLoginName] = useState("");
  const [password, setPassWord] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Fetch types on component mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axiosInstance.get("/api/type/getTypes");
        setTypes(response.data); // Ensure response.data is an array or valid format
      } catch (error) {
        console.error("Error fetching types", error);
      }
    };
    fetchTypes();
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePic(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("bio", bio);
    formData.append("preference", JSON.stringify(preference));
    formData.append("loginName", loginName);
    formData.append("password", password);
    formData.append("profilePic", profilePic);

    try {
      const response = await axios.post("/api/user/createUser", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response.data);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting the form", error);
      alert("There was an error submitting the form.");
    }
  };

  const handleTypeSelection = (type) => {
    if (preference.includes(type)) {
      setPreference(preference.filter((pref) => pref !== type));
    } else {
      setPreference([...preference, type]);
    }
  };

  return (
    <div id="signUpDiv">
      <h3>Sign Up</h3>
      <input type="file" accept="image/*" onChange={handleProfilePicChange} />

      <TextField
        id="outlined-basic"
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        id="outlined-basic"
        label="Age"
        variant="outlined"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <TextField
        id="outlined-basic"
        label="Gender"
        variant="outlined"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      />

      <TextField
        id="outlined-basic"
        label="Bio"
        variant="outlined"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <div>
        <h4>Select Preferences:</h4>
        {types.map((type) => (
          <Button
            key={type._id}
            variant={preference.includes(type.name) ? "contained" : "outlined"}
            onClick={() => handleTypeSelection(type.name)}
            style={{ margin: "5px" }}
          >
            {type.name}
          </Button>
        ))}
      </div>

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
                onMouseUp={handleMouseUpPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>

      <Button variant="outlined" onClick={handleSignUp}>
        Sign Up
      </Button>
    </div>
  );
};

export default SignUp;
