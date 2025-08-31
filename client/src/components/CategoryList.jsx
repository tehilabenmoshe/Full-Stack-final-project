
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CategoryList.css";
import { useAuth } from "../AuthProvider";   

const API = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('');   
  const { user } = useAuth();                           
  const navigate = useNavigate();

  // get categories
  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    axios.get(`${API}/menu/categories`, { headers: authHeaders() })
      .then(res => {
        const data = res.data;
        setCategories(Array.isArray(data) ? data : (Array.isArray(data?.categories) ? data.categories : []));
        setError('');
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load categories');
        setCategories([]);
      });
  }, []);

  // add new category - admin only
  const handleAddCategory = async () => {
    if (!newCatName) return alert("חובה למלא שם קטגוריה");
    try {
      const res = await axios.post(
        `${API}/menu/categories`,
        { 
          name: newCatName, 
          description: newCatDesc, 
          image_url: newCatImage || null 
        },
        { headers: { ...authHeaders(), "Content-Type": "application/json" } }
      );
      setCategories([...categories, res.data]);
      setNewCatName('');
      setNewCatDesc('');
      setNewCatImage('');
    } catch (err) {
      alert(err.response?.data?.error || "נכשל בהוספת קטגוריה");
    }
  };

  // delete category- admin only
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("למחוק את הקטגוריה הזאת?")) return;
    try {
      await axios.delete(`${API}/menu/categories/${id}`, { headers: authHeaders() });
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "נכשל במחיקה");
    }
  };

  return (
    <div className="category-menu">
      <h2 className="category-title">Just Click To Eat!</h2>
      {error && <p className="error-message">{error}</p>}

      {/* add category form*/}
      {user?.role === "admin" && (
        <div className="add-category">
          <input
            type="text"
            placeholder="name"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />
          <input
            type="text"
            placeholder="description"
            value={newCatDesc}
            onChange={(e) => setNewCatDesc(e.target.value)}
          />
          <input
            type="text"
            placeholder=" photo path (URL)"
            value={newCatImage}
            onChange={(e) => setNewCatImage(e.target.value)}
          />
          <button onClick={handleAddCategory}> add</button>
        </div>
      )}

    
      <div className="categories-grid">
        {(Array.isArray(categories) ? categories : []).map(cat => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => navigate(`categories/${cat.id}`)} 
          >
            {cat.image_url && <img src={cat.image_url} alt={cat.name} className="category-image" />}
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>

            {user?.role === "admin" && (
              <button
                className="category-delete-btn"
                onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
              >
                 delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
