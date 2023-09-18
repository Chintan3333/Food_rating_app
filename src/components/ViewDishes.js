import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import styled from "styled-components";
import Toast from "react-hot-toast";
import styles from "../Styles/dish.module.css";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import usersData from "../data/users.json";
import Pagination from "@mui/material/Pagination";

const DishWrapper = styled(Paper)({
  width: "80%",
  padding: "1em",
  textAlign: "center",
  margin: "2em auto",
});

const StyledLink = styled(Button)({
  textDecoration: "none",
  display: "flex",
  color: "white",
  backgroundColor: "#9c27b0",
  alignItems: "center",
  left: "1%",
  marginTop: "1%",
  marginBottom: "1rem",
});

const ViewDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [rank1, setRank1] = useState(null);
  const [rank2, setRank2] = useState(null);
  const [rank3, setRank3] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [votingInProcess, setVotingInProcess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

  useEffect(() => {
    const fetchDishes = async () => {
      const response = await axios.get(
        "https://raw.githubusercontent.com/syook/react-dishpoll/main/db.json"
      );
      setDishes(response.data);
      if (!localStorage.getItem("itemList")) {
        localStorage.setItem("itemList", JSON.stringify(response.data));
      }

      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchDishes();
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(usersData);
    }
  }, []);

  const cardsPerPage = 9;
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentDishes = dishes.slice(indexOfFirstCard, indexOfLastCard);
  // Handle vote button for polling ...
  // handle rank functions
  const rankOne = (id) => {
    // switch rank between different item
    if (id !== rank2 && id !== rank3) {
      setRank1(id);
    }

    // switch rank within same item
    if (id === rank2) {
      setRank2(null);
      setRank1(id);
    }
    if (id === rank3) {
      setRank3(null);
      setRank1(id);
    }
  };

  const rankTwo = (id) => {
    if (id !== rank1 && id !== rank3) {
      setRank2(id);
    }
    if (id === rank1) {
      setRank1(null);
      setRank2(id);
    }
    if (id === rank3) {
      setRank3(null);
      setRank2(id);
    }
  };

  const rankThree = (id) => {
    if (id !== rank1 && id !== rank2) {
      setRank3(id);
    }
    if (id === rank1) {
      setRank1(null);
      setRank3(id);
    }
    if (id === rank2) {
      setRank2(null);
      setRank3(id);
    }
  };

  // polling dish function
  function updateItem(id, val) {
    let arr = JSON.parse(localStorage.getItem("itemList"));
    let newItemList = arr.map((item) => {
      if (item.id === id) {
        if (item?.points) {
          item.points += val;
        } else item.points = val;
      } else {
        if (!item?.points) item.points = 0;
      }
      return item;
    });

    newItemList.sort((a, b) => {
      return parseFloat(b.points) - parseFloat(a.points);
    });
    localStorage.setItem("itemList", JSON.stringify(newItemList));
  }
  const userId = localStorage.getItem("loginuser");

  // Check if the user has already made choices
  let userChoices = JSON.parse(localStorage.getItem("userChoices"));
  const hasMadeChoices = userChoices && userChoices.userId === userId;

  // handle vote button for polling
  const handleVote = () => {
    if (!hasMadeChoices) {
      setVotingInProcess(true);
      updateItem(rank1, 30);
      updateItem(rank2, 20);
      updateItem(rank3, 10);

      let userChoices = {
        userId: userId,
        rank1: rank1,
        rank2: rank2,
        rank3: rank3,
      };

      //console.log(rank1,rank2,rank3);
      //add ranks into 'users' in local storage
      const updatedUsers = users.map((user) =>
        user.id === loginuser.id
          ? {
              ...user,
              choices: {
                rank1: rank1,
                rank2: rank2,
                rank3: rank3,
              },
            }
          : user
      );
      setUsers(updatedUsers);
      //console.log(users);
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // navigate('/dashboard'); // Redirect back to dashboard or other appropriate page
      setTimeout(() => {
        setVotingInProcess(false);
        Toast.success("Request successfull!", {
          position: "top-right",
        });
        navigate("/list/results");
      }, 1000);

      // Save user choices in local storage or send to server
      localStorage.setItem("userChoices", JSON.stringify(userChoices));
      //console.log(userChoices);
    } else {
      Toast.error("You have already made choices");
    }
  };

  const handleeditVote = async () => {
    setVotingInProcess(true);

    if (hasMadeChoices) {
      userChoices = JSON.parse(localStorage.getItem("userChoices"));
      console.log(userChoices);
    }
    // Subtract previous points from the user's previous choices
    if (userChoices) {
      updateItem(userChoices.rank1, -30);
      updateItem(userChoices.rank2, -20);
      updateItem(userChoices.rank3, -10);
    }

    updateItem(rank1, 30);
    updateItem(rank2, 20);
    updateItem(rank3, 10);

    const newuserChoices = {
      userId: userId,
      rank1: rank1,
      rank2: rank2,
      rank3: rank3,
    };

    //add ranks into 'users' in local storage
    const updatedUsers = users.map((user) =>
      user.id === loginuser.id
        ? {
            ...user,
            choices: {
              rank1: rank1,
              rank2: rank2,
              rank3: rank3,
            },
          }
        : user
    );
    setUsers(updatedUsers);
    console.log(users);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // navigate('/dashboard'); // Redirect back to dashboard or other appropriate page
    setTimeout(() => {
      setVotingInProcess(false);
      Toast.success("changes saved succesfully", {
        position: "top-right",
      });
      navigate("/list/results");
    }, 1000);

    // Save user choices in local storage or send to server
    localStorage.setItem("userChoices", JSON.stringify(newuserChoices));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
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

      <DishWrapper elevation={3}>
        {rank1 && rank2 && rank3 ? (
          <Button
            variant="contained"
            className={styles.voteBtn}
            onClick={handleVote}
          >
            {votingInProcess ? "Proccessing" : "Vote"}
          </Button>
        ) : (
          <Button variant="contained" className={styles.disableBtn} disabled>
            Vote
          </Button>
        )}
        {"  "}
        {rank1 && rank2 && rank3 ? (
          <Button variant="contained" onClick={handleeditVote}>
            Edit & SAVE Choice
          </Button>
        ) : (
          <Button variant="contained" className={styles.disableBtn} disabled>
            Edit & SAVE Choice
          </Button>
        )}

        {loading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh"
          >
            <CircularProgress size={100} />
          </Box>
        ) : (
          <>
            <ul>
              {currentDishes.map((dish) => (
                <Card key={dish.id} sx={{ marginTop: "5%" }}>
                  <CardContent sx={{ width: "100%" }}>
                    <img src={dish.image} alt="dish-img" width={200} />
                    <Typography variant="h6">{dish.dishName}</Typography>
                    <CardActions className={styles.rankContainer}>
                      <Button
                        onClick={() => rankOne(dish.id)}
                        className={
                          rank1 === dish.id
                            ? `${styles.rankActiveBtn} gold-button` // Apply gold style for rank 1
                            : styles.rank
                        }
                        sx={{ backgroundColor: "gold", color: "black" }}
                      >
                        1
                      </Button>

                      <Button
                        onClick={() => rankTwo(dish.id)}
                        className={
                          rank2 === dish.id
                            ? `${styles.rankActiveBtn} silver-button` // Apply silver style for rank 2
                            : styles.rank
                        }
                        sx={{ backgroundColor: "silver", color: "black" }}
                      >
                        2
                      </Button>

                      <Button
                        onClick={() => rankThree(dish.id)}
                        className={
                          rank3 === dish.id
                            ? `${styles.rankActiveBtn} bronze-button` // Apply bronze style for rank 3
                            : styles.rank
                        }
                        sx={{ backgroundColor: "#cd7f32", color: "black" }}
                      >
                        3
                      </Button>
                    </CardActions>
                    <Typography>{dish.description}</Typography>
                  </CardContent>
                </Card>
              ))}
            </ul>
          </>
        )}
        <Pagination
          count={Math.ceil(dishes.length / cardsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          color="primary"
          size="large"
          style={{ marginTop: "1rem" }}
        />
      </DishWrapper>
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
    </>
  );
};

export default ViewDishes;
