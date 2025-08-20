import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/DishesPage.css';

export default function DishesPage() {
  const { id } = useParams(); // זה ה-categoryId מהכתובת
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token available, user might not be logged in");
      return;
    }

    axios
      .get(`http://localhost:3000/api/menu/items?categoryId=${id}`, {   // ✅ שימוש ב-query string
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Dishes from server:", res.data);
        setDishes(res.data);
      })
      .catch((err) => console.error("Error loading dishes:", err));
  }, [id]);

  return (
    <div className="dishes-menu">
      <h2 className="dishes-title">Dishes</h2>
      <div className="dishes-grid">
        {dishes.map((dish) => (
          <div key={dish.id} className="dish-card">
            <img 
              src={dish.image_url} 
              alt={dish.name} 
              className="dish-image"
            />
            <h3 className="dish-name">{dish.name}</h3>
            <p className="dish-description">{dish.description}</p>
            <p className="dish-price"><strong>{dish.price} ₪</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}
