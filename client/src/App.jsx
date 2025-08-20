import { useState } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Customer from './pages/Customer'
import DishesPage from './pages/DishesPage'

export default function App(){
  return (
    <>
     
      <main>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/customer" element={<Customer/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/Register" element={<Register/>} />
          <Route path="/categories/:id" element={<DishesPage />} /> 

         
          
          
        </Routes>
      </main>
    </>
  )
}
