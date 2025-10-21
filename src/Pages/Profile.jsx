import React, { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { Email, ShoppingBag, AccountCircle, Save, Edit, Logout } from "@mui/icons-material";
import  { jwtDecode } from "jwt-decode";
import API from "../Services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "",email: "" ,password: "" });
  const navigate = useNavigate();

  // 🧩 Fetch user info + orders
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setFormData({name: decoded?.name || "", email: "", password: ""});
        fetchOrders();
      } catch (error) {
        toast.error("Failed to load profile");
      }
    } else {
      navigate("/login");
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders/my-orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.info("Logged out successfully");
    navigate("/login");
  };

  // handle Form Changes
  const handleChange = (e)=>{
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  // Save profile updates

   const handleSave = async () => {
    try {
      const { data } = await API.put("/users/update-profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Profile updated successfully!");
      setUser(data.user);
      setEditMode(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading)
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );



  return (
 <Container sx={{ mt: 6, mb: 6 }}>
      {/* Header Section */}
      <Card sx={{ p: 3, mb: 4, boxShadow: 3, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 72,
                height: 72,
                fontSize: "2rem",
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </Grid>

          <Grid item xs>
            {editMode ? (
              <>
                <TextField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="New Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                />
              </>
            ) : (
              <>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {user?.name || "User"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
                >
                  <Email fontSize="small" /> {user?.email}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  <AccountCircle fontSize="small" /> Role:{" "}
                  {user?.role || "Customer"}
                </Typography>
              </>
            )}
          </Grid>

          <Grid item>
            {editMode ? (
              <Button
                variant="contained"
                color="success"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              startIcon={<Logout />}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Orders Section */}
      <Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          <ShoppingBag sx={{ verticalAlign: "middle", mr: 1 }} /> My Orders
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {orders.length === 0 ? (
          <Typography color="textSecondary" sx={{ textAlign: "center", mt: 4 }}>
            You haven’t placed any orders yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} md={6} lg={4} key={order._id}>
                <Card
                  sx={{
                    boxShadow: 2,
                    borderRadius: 2,
                    "&:hover": { boxShadow: 4 },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Order #{order._id.slice(-6).toUpperCase()}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                      Total Price: ₹{order.totalPrice}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Placed On:{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </Typography>

                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                      <Chip
                        label={order.status}
                        color={
                          order.status === "Pending"
                            ? "warning"
                            : order.status === "Delivered"
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                      <Chip
                        label={order.paymentStatus}
                        color={
                          order.paymentStatus === "Paid"
                            ? "success"
                            : "error"
                        }
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default Profile;
