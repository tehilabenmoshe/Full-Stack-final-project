import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import CartButton from '../components/CartButton'; 
import '../styles/customer.css';
import { useAuth } from '../AuthProvider';
import { useCart } from '../components/CartProvider';

function Customer() {
  const [q, setQ] = useState('');
  const [dishes, setDishes] = useState([]);   // רשימת מנות
  const { user } = useAuth();
  const { load } = useCart();  // 

  // 
  useEffect(() => {
    async function fetchDishes() {
      try {
        const url = q
          ? `http://localhost:3000/api/menu/search?q=${encodeURIComponent(q)}`
          : `http://localhost:3000/api/menu/items`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch dishes");
        const data = await res.json();
        setDishes(data);
      } catch (err) {
        console.error(err);
        setDishes([]);
      }
    }
    fetchDishes();
  }, [q]);

  // add dish to cart from search
  async function handleAddToCart(dish) {
    try {
      const res = await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          dishId: dish.id,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      await load(); //
      alert(`${dish.name} נוסף לעגלה `);
    } catch (err) {
      console.error(err);
      alert("שגיאה בהוספת מנה לעגלה");
    }
  }

  return (
    <div className="layout">
      <div className="sidebar"><Sidebar /></div>
      <div className="main">
        <Topbar query={q} onChange={setQ} />

        <div className="customer-header">
          <CartButton />
        </div>

        {/* ✅ כאן מוצגות המנות */}
        <div className="dishes-list">
          {dishes.length > 0 ? (
            dishes.map(d => (
              <div key={d.id} className="dish-card">
                <img src={d.image_url} alt={d.name} className="dish-image" />
                <div className="dish-info">
                  <h3 className="dish-name">{d.name}</h3>
                  <p className="dish-description">{d.description}</p>
                </div>

                {/* ✅ footer חדש למחיר + כפתור */}
                <div className="dish-footer">
                  <p className="dish-price">{d.price} ₪</p>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(d)}
                  >
                    🛒
                  </button>
                </div>
              </div>
            ))
          ) : (
            q && <p>לא נמצאו מנות.</p>
          )}
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default Customer;
