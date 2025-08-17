import { useState } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Customer from './pages/Customer'
/*import Cart from './pages/Cart'*/
/*import Checkout from './pages/Checkout'*/

export default function App(){
  return (
    <>
      <nav style={{padding:12, borderBottom:'1px solid #eee'}}>
         <Link to="/Login">Login</Link> 
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Customer/>} />
          <Route path="/customer" element={<Customer/>} />
          <Route path="/Home" element={<Home/>} />
         
          
          
        </Routes>
      </main>
    </>
  )
}
