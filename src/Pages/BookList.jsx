import React, { useEffect, useState } from 'react';
import API from '../Services/api';
import { Card, CardContent, CardMedia, CircularProgress, Container, Grid, Typography, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchBooks = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/books?page=${page}&limit=12`);
      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching books: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  if (loading) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant='h4' gutterBottom>
        📚 Available Books
      </Typography>
      {books.length === 0 ? (
        <Typography>No Books available</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <Card sx={{ maxWidth: 345, cursor: "pointer" }} onClick={() => navigate(`/book/${book._id}`)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={book.imageUrl && book.imageUrl.startsWith("http") ? book.imageUrl : "https://via.placeholder.com/150"}
                    alt={book.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant='h6'>{book.title}</Typography>
                    <Typography gutterBottom variant='body2' color='text.secondary'>{book.author}</Typography>
                    <Typography variant='body1' sx={{ mt: 1 }}>₹{book.price}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            sx={{ mt: 4, display: "flex", justifyContent: "center" }}
          />
        </>
      )}
    </Container>
  );
}

export default BookList;
