import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  TableContainer,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ Fetch all orders (Admin only)
  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders");
      if (error.response?.status === 403) navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(
        `/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order status updated!");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // ✅ View Details modal
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Admin — Manage Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography>No orders found</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.user?.name || "Deleted User"}</TableCell>
                  <TableCell>{order.user?.email || "-"}</TableCell>
                  <TableCell>₹{order.totalPrice}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      size="small"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(order)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ✅ Modal for Order Details */}
      <Dialog open={!!selectedOrder} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>User:</strong> {selectedOrder.user?.name} ({selectedOrder.user?.email})
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Total Price:</strong> ₹{selectedOrder.totalPrice}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Status:</strong> {selectedOrder.status}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Items:
              </Typography>
              {selectedOrder.items?.map((item, index) => (
                <Box key={index} sx={{ mb: 2, borderBottom: "1px solid #ddd", pb: 1 }}>
                  <Typography>
                    <strong>Book:</strong> {item.book?.title || "Deleted Book"}
                  </Typography>
                  <Typography>
                    <strong>Quantity:</strong> {item.quantity}
                  </Typography>
                  <Typography>
                    <strong>Price:</strong> ₹{item.price}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminDashboard;
