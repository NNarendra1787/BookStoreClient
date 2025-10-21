import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import BookList from './Pages/BookList'
import BookDetails from './Pages/BookDetails'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import Navbar from './Components/Navbar'
import AdminDashboard from './Pages/AdminDashboard'
import Orders from './Pages/Orders'
import Profile from './Pages/Profile'
import AdminLayout from './Pages/Admin/AdminLayout'
import Dashboard from './Pages/Admin/Dashboard'

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/books' element={<BookList />} />
            <Route path='/book/:id' element={<BookDetails />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/admins' element={<AdminDashboard />} />
            <Route path='/profile' element={<Profile />} />
            <Route  path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
        
      </Router>
    </div>
  )
}

export default App
