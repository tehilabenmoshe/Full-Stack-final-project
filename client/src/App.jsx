import { useState } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Customer from './pages/Customer'
/*import Cart from './pages/Cart'*/
/*import Checkout from './pages/Checkout'*/

export default function App(){
  return (
    <>
      <nav style={{padding:12, borderBottom:'1px solid #eee'}}>
        <Link to="/">Click2Eat</Link> | <Link to="/menu">Menu</Link> | <Link to="/cart">Cart</Link>
      </nav>
      <main style={{padding:16}}>
        <Routes>
          <Route path="/" element={<Customer/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/menu" element={<Menu/>} />
          
        </Routes>
      </main>
    </>
  )
}
