import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import usersData from "../data/users.json"; // Sample user data from your JSON file

const AdminWrapper = styled(Paper)(({ theme }) => ({
  width: "80%",
  padding: "1em",
  textAlign: "center",
  margin: "2em auto",
  backgroundColor: "#ECECEC",
}));

const StyledLink = styled(Button)(({ theme }) => ({
  textDecoration: "none",
  display: "flex",
  color: "white",
  backgroundColor: "#9c27b0",
  alignItems: "center",
  left: "1%",
  marginTop: "1%",
  width: "10%",
  marginBottom: "1rem",
}));

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [dishes, setDishes] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [userTablePage, setUserTablePage] = useState(0);
  const [userTableRowsPerPage, setUserTableRowsPerPage] = useState(5);

  const [dishTablePage, setDishTablePage] = useState(0);
  const [dishTableRowsPerPage, setDishTableRowsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users from session storage or use the initial data from users.json
    const storedUsers = localStorage.getItem("users");

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(usersData);
    }
    // Fetch dishes from local storage
    const storedDishes = JSON.parse(localStorage.getItem("itemList"));
    if (storedDishes) {
      setDishes(storedDishes);
    }
  }, []);

  const handleDelete = (userId) => {
    setDeleteUserId(userId); // Set the user ID to delete in the state
    setOpenDeleteConfirmation(true); // Open the delete confirmation dialog
  };

  const handleDeleteConfirmation = () => {
    if (deleteUserId !== null) {
      const deletedUser = users.find((user) => user.id === deleteUserId);

      // Update the dishes' points based on the deleted user's choices
      const updatedDishes = dishes.map((dish) => {
        if (dish.id === deletedUser.choices.rank1) {
          dish.points -= 30;
        }
        if (dish.id === deletedUser.choices.rank2) {
          dish.points -= 20;
        }
        if (dish.id === deletedUser.choices.rank3) {
          dish.points -= 10;
        }
        return dish;
      });

      // Delete user from the state and local storage
      const updatedUsers = users.filter((user) => user.id !== deleteUserId);
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Update dishes in local storage
      localStorage.setItem("itemList", JSON.stringify(updatedDishes));

      // Close the delete confirmation dialog and reset deleteUserId
      setOpenDeleteConfirmation(false);
      setDeleteUserId(null);
    }
  };

  const handleEditOpen = (user) => {
    setEditedUser(user);
    setEditedUsername(user.username);
    setEditedPassword(user.password);
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setEditedUser(null);
    setEditedUsername("");
    setEditedPassword("");
  };

  const handleEditSave = () => {
    const updatedUsers = users.map((user) =>
      user.id === editedUser.id
        ? { ...user, username: editedUsername, password: editedPassword }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    handleEditClose();
  };


  //For user table's pagination.
  const handleUserTablePageChange = (event, newPage) => {
    setUserTablePage(newPage);
  };

  const handleUserTableRowsPerPageChange = (event) => {
    setUserTableRowsPerPage(parseInt(event.target.value, 10));
    setUserTablePage(0);
  };

  //For dish table's pagination 
  const handleDishTablePageChange = (event, newPage) => {
    setDishTablePage(newPage);
  };

  const handleDishTableRowsPerPageChange = (event) => {
    setDishTableRowsPerPage(parseInt(event.target.value, 10));
    setDishTablePage(0);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: "#1b1b1b" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dish Polling Web App
          </Typography>
          <StyledLink onClick={() => navigate(-1)} to={""}>
            &lt; Back
          </StyledLink>
        </Toolbar>
      </AppBar>
      

      <AdminWrapper>
        <Typography
          variant="h4"
          color="secondary"
          style={{ fontFamily: "Roboto" }}
        >
          Admin Panel
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Rank 1</TableCell>
                <TableCell>Rank 2</TableCell>
                <TableCell>Rank 3</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>Rank 1 Position</TableCell>
                <TableCell>Rank 2 Position</TableCell>
                <TableCell>Rank 3 Position</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(
                  userTablePage * userTableRowsPerPage,
                  userTablePage * userTableRowsPerPage + userTableRowsPerPage
                )
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      {(user.choices.rank1 > 0 &&
                        dishes.find((dish) => dish.id === user.choices.rank1)
                          ?.dishName) ||
                        0}
                    </TableCell>
                    <TableCell>
                      {(user.choices.rank2 > 0 &&
                        dishes.find((dish) => dish.id === user.choices.rank2)
                          ?.dishName) ||
                        0}
                    </TableCell>
                    <TableCell>
                      {(user.choices.rank3 > 0 &&
                        dishes.find((dish) => dish.id === user.choices.rank3)
                          ?.dishName) ||
                        0}
                    </TableCell>
                    <TableCell>
                      {user.choices.rank1 > 0 &&
                      user.choices.rank2 > 0 &&
                      user.choices.rank3 > 0
                        ? dishes.find((dish) => dish.id === user.choices.rank1)
                            ?.points +
                          dishes.find((dish) => dish.id === user.choices.rank2)
                            ?.points +
                          dishes.find((dish) => dish.id === user.choices.rank3)
                            ?.points
                        : 0}
                    </TableCell>
                    <TableCell>
                      {user.choices.rank1 > 0
                        ? dishes.findIndex(
                            (dish) => dish.id === user.choices.rank1
                          ) + 1
                        : 0}
                    </TableCell>
                    <TableCell>
                      {user.choices.rank2 > 0
                        ? dishes.findIndex(
                            (dish) => dish.id === user.choices.rank2
                          ) + 1
                        : 0}
                    </TableCell>
                    <TableCell>
                      {user.choices.rank3 > 0
                        ? dishes.findIndex(
                            (dish) => dish.id === user.choices.rank3
                          ) + 1
                        : 0}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditOpen(user)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25]}
          count={users.length}
          page={userTablePage}
          onPageChange={handleUserTablePageChange}
          rowsPerPage={userTableRowsPerPage}
          onRowsPerPageChange={handleUserTableRowsPerPageChange}
        />
        <Typography
          variant="h4"
          color="secondary"
          style={{ marginTop: "1em", fontFamily: "Roboto" }}
        >
          Dishes and User Ranks
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dish</TableCell>
                <TableCell>Rank 1</TableCell>
                <TableCell>Rank 2</TableCell>
                <TableCell>Rank 3</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dishes
                .slice(
                  dishTablePage * dishTableRowsPerPage,
                  dishTablePage * dishTableRowsPerPage + dishTableRowsPerPage
                )
                .map((dish) => (
                  <TableRow key={dish.id}>
                    <TableCell>{dish.dishName}</TableCell>
                    <TableCell>
                      {users
                        .filter((user) => user.choices.rank1 === dish.id)
                        .map((user) => user.username)
                        .join(", ")}
                    </TableCell>
                    <TableCell>
                      {users
                        .filter((user) => user.choices.rank2 === dish.id)
                        .map((user) => user.username)
                        .join(", ")}
                    </TableCell>
                    <TableCell>
                      {users
                        .filter((user) => user.choices.rank3 === dish.id)
                        .map((user) => user.username)
                        .join(", ")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25]}
          count={dishes.length}
          page={dishTablePage}
          onPageChange={handleDishTablePageChange}
          rowsPerPage={dishTableRowsPerPage}
          onRowsPerPageChange={handleDishTableRowsPerPageChange}
        />
      </AdminWrapper>

      <Dialog open={openEditDialog} onClose={handleEditClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <br />
          <TextField
            label="Username"
            variant="outlined"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
            fullWidth
          />
          <br />
          <br />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            value={editedPassword}
            onChange={(e) => setEditedPassword(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteConfirmation}
        onClose={() => setOpenDeleteConfirmation(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user data and rankings?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirmation(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmation}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default AdminPanel;
