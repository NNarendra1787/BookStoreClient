import React from "react";
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../Services/api";
import {
  Button,
  Container,
  Divider,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

const handlePlaceOrder = async () => {
  toast.info("Processing your order...");
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first!");
      navigate("/login");
      return;
    }

    const orderData = {
      items: cart.map((item) => ({
        book: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
    };

    console.log("Auth Header: ", `Bearer ${token}`);
    const response = await API.post("/orders", orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 201 || response.status === 200) {
      toast.success("🎉 Order placed successfully!");
      clearCart();
      navigate("/orders");
    } else {
      toast.error("Unexpected response from server");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    toast.error(error.response?.data?.message || "Order failed. Try again.");
  }
};


  if (cart.length === 0) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5">Your Cart is Empty 🛒</Typography>
      </Container>
    );
  }
  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        🧾 Checkout
      </Typography>

      <Grid container spacing={3}>
        {cart.map((item) => (
          <Grid item xs={12} md={6} key={item._id}>
            <Card sx={{ display: "flex", alignItems: "center", p: 1 }}>
              <CardMedia
                component="img"
                sx={{ width: 100, height: 140, borderRadius: 2 }}
                image={item.imageUrl || "https://via.placeholder.com/120"}
                alt={item.title}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2">
                  Quantity: {item.quantity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{item.price} × {item.quantity}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Typography variant="h5">Total: ₹{totalPrice.toFixed(2)}</Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => {
          handlePlaceOrder();
        }}
        // onClick={()=>{ navigate("/orders")}}
      >
        Place Order
      </Button>
    </Container>
  );
}

export default Checkout;
