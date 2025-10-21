import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Container, TextField, Typography } from "@mui/material"
import API from '../Services/api';
import { toast } from "react-toastify"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async ()=>{
    try {
      const {data} = await API.post("/users/login", {email, password});
      localStorage.setItem("token", data.token);
      toast.success("Login successful");
      navigate("/");
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <Container maxWidth="sm" sx={{mt:8}}>
      <Typography variant='h4' gutterBottom>Login</Typography>
      <TextField
        label="Email"
        type='email'
        fullWidth
        margin='normal'
        value={email}
        onChange={(e)=> setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type='password'
        fullWidth
        margin='normal'
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
      />
      <Button
        variant='contained'
        color='primary'
        fullWidth
        sx={{mt: 2}}
        onClick={handleLogin} 
      >Login</Button>
    </Container>
  )
}

export default Login
