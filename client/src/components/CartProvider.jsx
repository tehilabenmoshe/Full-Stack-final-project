import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthProvider";   

const API = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

function authHeaders() {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : undefined;
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();  //  ניגשים ל־user כדי לדעת אם יש התחברות
  const [orderId, setOrderId] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const headers = authHeaders();
    if (!headers) {           // אין טוקן -> ריקון העגלה
      setOrderId(null); 
      setItems([]); 
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/cart`, { headers });
      setOrderId(data?.orderId ?? null);
      setItems(data?.items ?? []);
      setTotal(data?.total ?? 0);
    } catch (e) {
      const status = e.response?.status;
      console.warn("load cart error:", status, e.response?.data || e.message);
      if (status === 401) {   // טוקן פג/חסר/לא תקין
        setOrderId(null); setItems([]); setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async ({ dishId, qty, addons, note }) => {
    const headers = authHeaders();
    if (!headers) return;    
    await axios.post(`${API}/cart/add`, { dishId, qty, addons, note }, { headers });
    await load();
  }, [load]);

  const updateQty = useCallback(async (itemId, qty) => {
    const headers = authHeaders();
    if (!headers) return;
    await axios.patch(`${API}/cart/item/${itemId}`, { qty }, { headers });
    await load();
  }, [load]);

  const removeItem = useCallback(async (itemId) => {
    const headers = authHeaders();
    if (!headers) return;
    await axios.delete(`${API}/cart/item/${itemId}`, { headers });
    await load();
  }, [load]);

  useEffect(() => {
    if (user) {
      load();
    } else {
      setOrderId(null);
      setItems([]);
      setTotal(0);
    }
  }, [user, load]);

  const count = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.quantity || 0), 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ orderId, items, total, count, loading, load, addItem, updateQty, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
// bla