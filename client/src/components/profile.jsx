import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthProvider";  
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

export default function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);

  // get user details
  useEffect(() => {
    if (user && token) {
      axios
        .get(`http://localhost:3000/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setProfile(res.data))
        .catch((err) => {
          console.error("Error loading profile:", err);
          setMessage("Error loading user details");
        });
    }
  }, [user, token]);

  // get user orders
  useEffect(() => {
    if (user && token) {
      axios
        .get(`http://localhost:3000/api/orders/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error loading orders:", err));
    }
  }, [user, token]);

  // change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/${user.id}/password`,
        { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "Password updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating password");
    }
  };

  // delete account
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      logout();
      navigate("/register");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting account");
    }
  };

  if (!user) {
    return <p>You must be logged in to view the profile</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>

        {profile && (
          <div className="section user-info">
            <h3>Personal Details</h3>
            <p><b>Name:</b> {profile.name}</p>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Phone:</b> {profile.phone}</p>
          </div>
        )}

        <div className="section orders">
          <h3>My Orders</h3>
          {orders.length === 0 ? (
            <p>No previous orders</p>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <p><b>Date:</b> {new Date(order.order_date).toLocaleString()}</p>
                  <p><b>Total:</b> {order.total_price} ₪</p>
                  <p>
                    <b>Status:</b>{" "}
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </p>
                  <ul>
                    {order.items && order.items.length > 0 ? (
                      order.items.map(item => (
                        <li key={item.id}>
                          {item.dish_name} × {item.quantity} — ₪{item.price}
                        </li>
                      ))
                    ) : (
                      <li>No items in this order</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section password">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordChange}>
            <input
              type="password"
              placeholder="Old password"
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
            />
            <input
              type="password"
              placeholder="New password"
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            />
            <button type="submit" className="btn save-btn">Update Password</button>
          </form>
        </div>

        <div className="section danger">
          <button className="btn deleteAccount-btn" onClick={handleDelete}>
            Delete Account
          </button>
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
