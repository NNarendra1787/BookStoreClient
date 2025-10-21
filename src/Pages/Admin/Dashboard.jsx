import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography, CircularProgress } from "@mui/material";
import { Group, Book, ShoppingBag } from "@mui/icons-material";
import API from "../../Services/api";
import { toast } from "react-toastify";

function Dashboard() {
  const [stats, setStats] = useState({ users: 0, books: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await API.get("/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
      } catch (error) {
        toast.error("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  const cards = [
    { title: "Total Users", count: stats.users, icon: <Group fontSize="large" />, color: "#1976d2" },
    { title: "Total Books", count: stats.books, icon: <Book fontSize="large" />, color: "#0288d1" },
    { title: "Total Orders", count: stats.orders, icon: <ShoppingBag fontSize="large" />, color: "#43a047" },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Box sx={{ color: card.color }}>{card.icon}</Box>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {card.count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard;
