import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserProvider } from "./components/UserProvider";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login";
import Signin from "./components/Signin";
import DashBoard from "./components/Dashboard";
import ViewDishes from "./components/ViewDishes";
import Results from "./components/Results";
import AdminPanel from "./components/Adminpanel";
import PrivateRoute from "./components/PrivateRoute";

const users = require("./data/users.json");
const storedUsers = localStorage.getItem("users");
if (!storedUsers) {
  localStorage.setItem("users", JSON.stringify(users));
}

const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <UserProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signin />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashBoard />
                </PrivateRoute>
              }
            />
            <Route
              path="/list"
              element={
                <PrivateRoute>
                  <ViewDishes />
                </PrivateRoute>
              }
            />
            <Route
              path="/list/results"
              element={
                <PrivateRoute>
                  <Results />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
          </Routes>
        </UserProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
