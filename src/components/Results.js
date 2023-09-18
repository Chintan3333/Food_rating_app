import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";

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

const Title = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "1rem",
});

const StyledTableContainer = styled(TableContainer)({
  marginBottom: "2rem",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
});

const StyledTableCellHeader = styled(TableCell)({
  backgroundColor: "#f0f0f0",
  fontWeight: "bold",
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Results = () => {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Adjust the number of rows per page as needed

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("itemList")) {
      const arr = JSON.parse(localStorage.getItem("itemList"));
      //console.log(arr);
      setItems(arr);
    }
    // console.log(items);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (items) {
      const sortedData = items.sort((a, b) => {
        return parseFloat(b.points) - parseFloat(a.points);
      });
      localStorage.setItem("itemList", JSON.stringify(sortedData));
    }
  }, [items]); // Runs whenever 'items' state changes

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
          <DishWrapper>
            <Title variant="h4">Top Three Trending Dishes</Title>
            <StyledTableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCellHeader>RANK</StyledTableCellHeader>
                    <StyledTableCellHeader>DISH NAME</StyledTableCellHeader>
                    <StyledTableCellHeader>POINTS</StyledTableCellHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items !== null &&
                    items.map((item, index) => {
                      if (index <= 2) {
                        return (
                          <StyledTableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.dishName}</TableCell>
                            <TableCell>{item.points}</TableCell>
                          </StyledTableRow>
                        );
                      }
                      return null;
                    })}
                </TableBody>
              </Table>
            </StyledTableContainer>

            <Title variant="h4">Others</Title>
            <StyledTableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCellHeader>RANK</StyledTableCellHeader>
                    <StyledTableCellHeader>DISH NAME</StyledTableCellHeader>
                    <StyledTableCellHeader>POINTS</StyledTableCellHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items !== null &&
                    items
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item, index) => {
                        const rowIndex = page * rowsPerPage + index + 3; // Calculate the index relative to the entire list
                        return (
                          <StyledTableRow key={item.id}>
                            <TableCell>{rowIndex + 1}</TableCell>
                            <TableCell>{item.dishName}</TableCell>
                            <TableCell>{item.points}</TableCell>
                          </StyledTableRow>
                        );
                      })}
                </TableBody>
              </Table>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]} // You can adjust the available options
                component="div"
                count={items.length - 3} // Exclude the top three items from the count
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </StyledTableContainer>
          </DishWrapper>
        </>
      )}
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

export default Results;
