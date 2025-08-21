import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CategoryList.css";

const API = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  return (
    <div className="category-menu">
      <h2 className="category-title">Just Click To Eat!</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="categories-grid">
        {(Array.isArray(categories) ? categories : []).map(cat => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => navigate(`categories/${cat.id}`)} // נתיב יחסי: נשארים בתוך /customer
          >
            {cat.image_url && <img src={cat.image_url} alt={cat.name} className="category-image" />}
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
