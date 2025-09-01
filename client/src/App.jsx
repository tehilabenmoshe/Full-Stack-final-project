import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Customer from './pages/Customer'
import DishesPage from './pages/DishesPage'
import CategoryList from './components/CategoryList'
import Profile from './components/Profile';
import Checkout from './pages/Checkout';
import PickupPage from './pages/PickupPage';
import OrderSummary from "./pages/OrderSummary";


export default function App(){
  return (
    <>
     
      <main>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/Register" element={<Register/>} />

          <Route path="/customer" element={<Customer />}>
            <Route index element={<CategoryList />} />                      {/* /customer */}
            <Route path="categories/:id" element={<DishesPage />} />        {/* /customer/categories/:id */}
            <Route path="/customer/profile" element={<Profile />} />
            <Route path="checkout" element={<Checkout />} /> 
            <Route path="pickup" element={<PickupPage />} />
            <Route path="order-summary" element={<OrderSummary />} />
          </Route>

          


          <Route path="*" element={<Navigate to="/login" replace />} /> 
          
          
        </Routes>
      </main>
    </>
  )
}
