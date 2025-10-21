import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Badge,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import { useCart } from "../Context/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const { cart } = useCart();

  // 🧩 Decode token
  let userName = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userName = decoded?.name || decoded?.email?.split("@")[0];
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  // 🎯 Menu state for avatar dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // 🧹 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    handleMenuClose();
  };

  return (
    <AppBar position="sticky" color="primary" elevation={3}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          📚 Bookstore
        </Typography>

        {/* Middle Nav Links */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/books">
            Books
          </Button>
          {userRole === "admin" && (
            <Button color="inherit" component={Link} to="/admin/orders">
              Manage Orders
            </Button>
          )}
        </Box>

        {/* Right side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* 🛒 Cart Icon with count */}
          <IconButton
            color="inherit"
            component={Link}
            to="/cart"
            aria-label="cart"
          >
            <Badge badgeContent={cart.length} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* 👤 User Section */}
          {token ? (
            <>
              {/* User avatar and name */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={handleMenuOpen}
              >
                <Avatar sx={{ bgcolor: "#ff9800", width: 32, height: 32 }}>
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <Typography sx={{ ml: 1, fontWeight: 500 }}>
                  {userName ? userName.split(" ")[0] : "User"}
                </Typography>
              </Box>

              {/* Dropdown menu */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem disabled>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {userName || "User"}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
