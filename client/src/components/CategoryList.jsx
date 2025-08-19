import { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryList.css"; // נוסיף קובץ עיצוב ייעודי

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token available, user might not be logged in");
      return;
    }

    axios
      .get("http://localhost:3000/api/menu/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Categories from server:", res.data);
        setCategories(res.data);
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>📂 קטגוריות בתפריט</h2>
      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="category-card">
            <img 
              src={cat.image_url} 
              alt={cat.name} 
              className="category-image"
            />
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
