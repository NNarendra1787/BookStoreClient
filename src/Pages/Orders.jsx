import React, { useEffect, useState } from "react";
import API from "../Services/api";
import { toast } from "react-toastify";
import { CircularProgress, Container,Card,CardMedia ,CardContent ,Typography } from "@mui/material";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await API.get("/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
      } catch (error) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5">No orders found 🧾</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {orders.map((order) => (
        <Card key={order._id} sx={{ mt: 2 }}>
          <CardMedia
                component="img"
                sx={{ width: 30, height: 40, borderRadius: 2 }}
                image={order.imageUrl || "https://via.placeholder.com/120"}
                alt={order.title}
              />
          <CardContent>
            <Typography variant="body1">Order ID: {order._id}</Typography>
            <Typography variant="body2" color="text.secondary">
              Total: ₹{order.totalPrice}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default Orders;
