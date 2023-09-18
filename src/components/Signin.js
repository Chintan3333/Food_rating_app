import { useState } from "react";
import { Link } from "react-router-dom";
import Toast from "react-hot-toast";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import { useUserContext } from "./UserProvider";

//const users = require("../db/users.json");

const useInputField = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange,
  };
};

const Signin = () => {
  const userName = useInputField("");
  const password = useInputField("");

  const { updateAuth } = useUserContext();
  const users = JSON.parse(localStorage.getItem("users"));

  const signin = async () => {
    console.log(users);
    const user = users.find((user) => user.username === userName.value);
    if (user) {
      Toast.error("User already exists");
      return;
    }

    const newUser = {
      id: users.length + 1,
      username: userName.value,
      password: password.value,
      isAdmin: true,
      choices: {
        rank1: 0,
        rank2: 0,
        rank3: 0,
      },
    };

    localStorage.setItem("loginuser", JSON.stringify(newUser));
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    Toast.success("Registered successfully!");
    if (newUser.isAdmin) {
      localStorage.setItem("userRole", true);
    } else {
      localStorage.setItem("userRole", false);
    }

    updateAuth();
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={{ flex: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ backgroundColor: "#1b1b1b" }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Dish Polling Web App
            </Typography>
          </Toolbar>
        </AppBar>
        <Paper
          sx={{
            width: 450,
            margin: "5em auto",
            padding: "1em",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            boxShadow: "1px 1px 3px",
          }}
        >
          <Typography variant="h4">Sign up</Typography>
          <TextField
            label="User Name"
            variant="outlined"
            {...userName}
            required
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            {...password}
            required
          />

          <Button variant="contained" onClick={signin}>
            Sign up
          </Button>

          <Link to="/">Already an accout? login here.....</Link>
        </Paper>
      </div>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: "#1b1b1b" }}>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            &copy; {new Date().getFullYear()} Dish Polling Web App
          </Typography>
          <div style={{ textAlign: "right" }}>
            <Typography variant="body2">@Chintan Patoliya</Typography>
            <Typography variant="body2">Contact: +91 7990478528</Typography>
            <Typography variant="body2">
              Email: chintanpato36912@gmail.com
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Signin;
