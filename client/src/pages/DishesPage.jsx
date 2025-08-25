import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DishModal from "../components/DishModal";
import "../styles/DishesPage.css";
import { useCart } from "../components/CartProvider";

const API = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });

export default function DishesPage() {
  const { id } = useParams(); // categoryId
  const [dishes, setDishes] = useState([]);
  const [activeDish, setActiveDish] = useState(null);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    if (!localStorage.getItem('token')) { setError('Not authenticated'); return; }
    axios.get(`${API}/menu/items`, { headers: authHeaders(), params: { categoryId: id } })
      .then(res => {
        const data = res.data;
        const list = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
        if (!list.length && data?.error) throw new Error(data.error);
        setDishes(list);
        setError('');
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load dishes');
        setDishes([]); // הגנה מפני .map על אובייקט
      });
  }, [id]);

  /*async function handleAddToCart({ dishId, qty, addons, note }) {
    try {
      await axios.post(`${API}/cart/add`, { dishId, qty, addons, note }, { headers: authHeaders() });
      setActiveDish(null);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to add to cart');
    }
  }
    */

  
  async function handleAddToCart(payload) {
    await addItem(payload);   // זה גם מרענן את העגלה
    setActiveDish(null);
  }

  return (
    <div className="dishes-menu">
      <h2 className="dishes-title">Dishes</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="dishes-grid">
        {(Array.isArray(dishes) ? dishes : []).map(dish => (
          <div
            key={dish.id}
            className="dish-card"
            role="button"
            tabIndex={0}
            onClick={() => setActiveDish(dish)}
            onKeyDown={(e) => e.key === "Enter" && setActiveDish(dish)}
          >
            {dish.image_url && <img src={dish.image_url} alt={dish.name} className="dish-image" />}
            <h3 className="dish-name">{dish.name}</h3>
            {dish.description && <p className="dish-description">{dish.description}</p>}
            <p className="dish-price"><strong>{Number(dish.price).toFixed(2)} ₪</strong></p>
          </div>
        ))}
      </div>

      {activeDish && (
        <DishModal
          dish={activeDish}
          onClose={() => setActiveDish(null)}
          onAdd={handleAddToCart}
        />
      )}
    </div>
  );
}
