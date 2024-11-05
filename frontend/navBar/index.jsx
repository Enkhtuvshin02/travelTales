import React, { useState } from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import axiosInstance from "../axios/axiosInstance";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const NavBar = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null); // For Menu Icon
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null); // For Avatar

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleAvatarClick = (event) => {
    setAvatarAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
    setAvatarAnchorEl(null);
  };

  return (
    <Grid
      container
      direction="row"
      sx={{
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <Grid item xs={1} md={1}>
        <h5>Logo</h5>
      </Grid>
      <Grid item xs={6} md={6}>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="" />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Grid>
      <Grid
        item
        xs={1}
        md={1}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <IconButton onClick={handleMenuClick}>
          <MenuOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem onClick={handleClose}>
            <Link to="/signIn">Sign In</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/signUp">Sign Up</Link>
          </MenuItem>
        </Menu>

        {/* Avatar with Popup */}
        <IconButton onClick={handleAvatarClick}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </IconButton>
        <Menu
          anchorEl={avatarAnchorEl}
          open={Boolean(avatarAnchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem onClick={handleClose}>
            <Link to="/signIn">Sign In</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/signUp">Sign Up</Link>
          </MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
};

export default NavBar;
