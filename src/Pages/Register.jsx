import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import API from '../Services/api';
import { toast } from 'react-toastify';
import { Button, Container, TextField, Typography } from '@mui/material';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async ()=>{
    try{
      const {data} = await API.post("/users/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      toast.success("Registration successful!");
      navigate("/");
    }catch(error){
      toast.error(error.response?.data?.message || "Registration failed");
    }
  }

  return (
    <Container maxWidth="sm" sx={{mt: 8}}>
      <Typography variant='h4' gutterBottom>Create an Account</Typography>
      <TextField 
        label="Full Name"
        fullWidth
        margin='normal'
        value={name}
        onChange={(e)=> setName(e.target.value)}
      />
      <TextField 
        label="Email"
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
        onClick={handleRegister}
      >
        Register
      </Button>
      
    </Container>
  )
}

export default Register
