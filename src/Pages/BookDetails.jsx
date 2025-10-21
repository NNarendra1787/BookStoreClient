import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../Services/api';
import { toast } from 'react-toastify';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Typography
} from '@mui/material';
import { useCart } from '../Context/CartContext';

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await API.get(`/books/${id}`);
        setBook(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load book details");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book);
      toast.success(`${book.title} added to cart!`);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!book) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Book not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card>
        <CardMedia
          component="img"
          height="400"
          image={book.imageUrl && book.imageUrl.startsWith("http") ? book.imageUrl : "https://via.placeholder.com/400"}
          alt={book.title}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {book.title}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            {book.author}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {book.description}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Genre: {book.genre || "N/A"}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            ₹{book.price}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleAddToCart}
          >
            Add To Cart
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default BookDetails;
