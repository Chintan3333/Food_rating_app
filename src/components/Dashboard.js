import { React } from "react";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import { useUserContext } from "./UserProvider";

const Navbar = () => {
  const { userRole, logoutAuth } = useUserContext();
  const navigate = useNavigate();
  const storedUserRole = localStorage.getItem("userRole");
  const roleToDisplay = storedUserRole || userRole;

  const handleLogout = () => {
    logoutAuth();

    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          justifyContent: "flex-end",
          gap: "1rem",
          backgroundColor: "#1b1b1b",
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dish Polling Web App
        </Typography>
        {roleToDisplay ? (
          <Button
            component={Link}
            to={"/admin"}
            variant="contained"
            color="error"
          >
            AdminPanel
          </Button>
        ) : (
          <br />
        )}

        <Button
          variant="contained"
          color="error"
          onClick={() => handleLogout()}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

const DashBoard = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={{ flex: 1 }}>
        <Navbar />
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "2.5em",
            width: "50%",
            margin: "auto",
            marginTop: "10%",
            boxShadow: "1px 1px 3px",
          }}
        >
          <Typography variant="h5" textAlign="center" marginBottom="5%">
            Welcome To Food world, Rate your most favourite dishes....
          </Typography>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "20px" }}
          >
            <Button
              component={Link}
              to={"/list"}
              variant="contained"
              color="success"
            >
              Rate food
            </Button>
            <Button
              component={Link}
              to={"/list/results"}
              variant="contained"
              color="success"
            >
              Trending food
            </Button>
          </div>
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

export default DashBoard;
