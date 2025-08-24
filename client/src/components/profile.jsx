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

  //get user details
  useEffect(() => {
    if (user && token) {
      axios
        .get(`http://localhost:3000/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setProfile(res.data))
        .catch((err) => {
          console.error("Error loading profile:", err);
          setMessage("שגיאה בטעינת פרטי המשתמש");
        });
    }
  }, [user, token]);
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


  // change pass 
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage(" not matching passwords");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/${user.id}/password`,
        { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "הסיסמה עודכנה בהצלחה");
    } catch (err) {
      setMessage(err.response?.data?.message || "שגיאה בשינוי הסיסמה");
    }
  };

  //
  const handleDelete = async () => {
    if (!window.confirm("בטוחה שאת רוצה למחוק את החשבון?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      logout();
      navigate("/register"); // מחזיר לעמוד הרשמה
    } catch (err) {
      setMessage(err.response?.data?.message || "שגיאה במחיקת החשבון");
    }
  };

  if (!user) {
    return <p>צריך להתחבר כדי לראות את הפרופיל</p>;
  }

  return (
    <div className="profile-container">
      <h2>פרופיל משתמש</h2>

      {profile && (
        <div className="user-info">
          <p><b>שם:</b> {profile.name}</p>
          <p><b>אימייל:</b> {profile.email}</p>
          <p><b>טלפון:</b> {profile.phone}</p>
        </div>
      )}
        <h3>ההזמנות הקודמות שלי</h3>
        {orders.length === 0 ? (
  <p>אין הזמנות קודמות</p>
) : (
<div className="orders-list">
  {orders.map(order => (
    <div key={order.id} className="order-card">
      <p><b>תאריך:</b> {new Date(order.order_date).toLocaleString()}</p>
      <p><b>סכום כולל:</b> {order.total_price} ₪</p>
      <p><b>סטטוס:</b> {order.status}</p>

      <ul>
        {order.items && order.items.length > 0 ? (
          order.items.map(item => (
            <li key={item.id}>
              🍽️ {item.dish_name} × {item.quantity} — ₪{item.price}
            </li>
          ))
        ) : (
          <li>אין פריטים בהזמנה זו</li>
        )}
      </ul>
    </div>
  ))}
</div>

)}

      <hr />



      <h3>שינוי סיסמה</h3>
      <form onSubmit={handlePasswordChange}>
        <input
          type="password"
          placeholder="סיסמה ישנה"
          onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
        />
        <input
          type="password"
          placeholder="סיסמה חדשה"
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
        />
        <input
          type="password"
          placeholder="אישור סיסמה חדשה"
          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
        />
        <button type="submit">עדכני סיסמה</button>
      </form>

      <hr />

      <button className="delete-btn" onClick={handleDelete}>
        מחיקת חשבון
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
