import React from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

function Cart() {
  const { cart, removeFromCart, updateQuentity, clearCart } = useCart();
  const navigate = useNavigate();

  // const totalPrice = cart.reduce(
  //   (sum, item) => sum + item.price * item.quantity,
  //   0
  // );

  const totalPrice = cart.reduce((sum, item)=>{
    const price = item.price || item.book?.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0)

  if (cart.length === 0) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5">Your cart is Empty 🛒</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        🛍️ Your Cart
      </Typography>

      <Grid container spacing={3}>
        {cart.map((item) => (
          <Grid item xs={12} md={6} key={item._id}>
            <Card sx={{ display: "flex", alignItems: "center" }}>
              <CardMedia
                component="img"
                sx={{ width: 100, height: 150, borderRadius: 2 }}
                image={item.imageUrl || "https://via.placeholder.com/120"}
                alt={item.title}
              />

              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{ item.book?.title || item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{item.book?.price || item.price} × {item.book?.quantity || item.quantity}
                </Typography>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => updateQuentity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Remove />
                  </IconButton>

                  <Typography variant="body1" sx={{ mx: 1 }}>
                    {item.quantity}
                  </Typography>

                  <IconButton
                    color="primary"
                    onClick={() => updateQuentity(item._id, item.quantity + 1)}
                  >
                    <Add />
                  </IconButton>

                  <IconButton
                    color="error"
                    sx={{ ml: 2 }}
                    onClick={() => removeFromCart(item._id)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mt: 4 }}>
        Total: ₹{totalPrice.toFixed(2)}
      </Typography>

      <div style={{ marginTop: 20 }}>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2, mr: 2 }}
          onClick={clearCart}
        >
          Clear Cart
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={()=>{
            navigate("/checkout")
          }}
        >
          Proceed to Checkout
        </Button>
      </div>
    </Container>
  );
}

export default Cart;
