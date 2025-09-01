import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DishModal from "../components/DishModal";
import "../styles/DishesPage.css";
import { useCart } from "../components/CartProvider";
import { useAuth } from "../AuthProvider";   
import { ADDONS } from "../data/addons";

const API = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });

export default function DishesPage() {
  const { id } = useParams(); // categoryId
  const [dishes, setDishes] = useState([]);
  const [activeDish, setActiveDish] = useState(null);
  const [error, setError] = useState('');
  const [modalDish, setModalDish] = useState(null);

  // addDish dields
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');     
  const [newDishImage, setNewDishImage] = useState('');   

  const { addItem } = useCart();
  const { user } = useAuth();   

  // get dishes
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
        setDishes([]);
      });
  }, [id]);


  async function fetchAddons(dishId) {
    const dish = dishes.find(d => d.id === dishId);
    const key =
      (dish?.category_name || dish?.category || dish?.name || "")
        .toLowerCase();

    if (key.includes("pizza"))   return ADDONS.pizza;
    if (key.includes("shawarma")) return ADDONS.shawarma;

    return []; 
  }

  // add dish func
  async function handleAddDish() {
    if (!newDishName || !newDishPrice) return alert("חובה למלא שם ומחיר");
    try {
      const res = await axios.post(
        `${API}/menu/items`,
        {
          name: newDishName,
          price: newDishPrice,
          category_id: id,
          description: newDishDesc || null,     // ✅ נשלח לשרת
          image_url: newDishImage || null       // ✅ נשלח לשרת
        },
        { headers: { ...authHeaders(), "Content-Type": "application/json" } }
      );
      setDishes([...dishes, res.data]);
      //reset page
      setNewDishName('');
      setNewDishPrice('');
      setNewDishDesc('');
      setNewDishImage('');
    } catch (e) {
      alert(e.response?.data?.error || "נכשל בהוספת מנה");
    }
  }

  // delete dish func
  async function handleDeleteDish(dishId) {
    if (!window.confirm("למחוק את המנה הזאת?")) return;
    try {
      await axios.delete(`${API}/menu/items/${dishId}`, { headers: authHeaders() });
      setDishes(dishes.filter(d => d.id !== dishId));
    } catch (e) {
      alert(e.response?.data?.error || "נכשל במחיקה");
    }
  }

  // add to cart func
  async function handleAddToCart(payload) {
    await addItem(payload);
    setActiveDish(null);
  }

  return (
    <div className="dishes-menu">
      <h2 className="dishes-title">Dishes</h2>
      {error && <p className="error-message">{error}</p>}

      {/* add dish form- admin only*/}
      {user?.role === "admin" && (
        <div className="add-dish">
          <input
            type="text"
            placeholder=" dish name"
            value={newDishName}
            onChange={(e) => setNewDishName(e.target.value)}
          />
           <input
            type="text"
            placeholder="description"
            value={newDishDesc}
            onChange={(e) => setNewDishDesc(e.target.value)}
          />
          <input
            type="number"
            placeholder="price"
            value={newDishPrice}
            onChange={(e) => setNewDishPrice(e.target.value)}
            step="0.01"
            min="0"
          />
         
          <input
            type="text"
            placeholder=" photo path (URL)"
            value={newDishImage}
            onChange={(e) => setNewDishImage(e.target.value)}
          />
          <button onClick={handleAddDish}> add </button>
        </div>
      )}

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

            {/* delete botton- admin only*/}
            {user?.role === "admin" && (
              <button
                className="dish-delete-btn"
                onClick={(e) => { e.stopPropagation(); handleDeleteDish(dish.id); }}
              >
                 delete
              </button>
            )}
          </div>
        ))}
      </div>

      {activeDish && (
        <DishModal
          dish={activeDish}
          onClose={() => setActiveDish(null)}
          onAdd={(payload) => { handleAddToCart(payload); setModalDish(null); }}
          fetchAddons={fetchAddons}  
        />
      )}
    </div>
  );
}
