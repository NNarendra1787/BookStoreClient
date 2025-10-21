import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 10,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        📚 Welcome to the Bookstore
      </Typography>
      <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
        Discover your next favorite book — read, learn, and explore with us.
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/books")}
        >
          Browse Books
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          onClick={() => navigate("/cart")}
        >
          View Cart 🛒
        </Button>
      </Box>

      <Typography variant="body2" color="textSecondary" sx={{ mt: 6 }}>
        “A reader lives a thousand lives before he dies. The man who never reads
        lives only one.”
      </Typography>
    </Container>
  );
}

export default Home;
