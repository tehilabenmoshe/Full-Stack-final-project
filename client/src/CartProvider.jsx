import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [orderId, setOrderId] = useState(null);
  const [items, setItems]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/cart`, { headers: auth() });
      setOrderId(res.data?.orderId ?? null);
      setItems(res.data?.items ?? []);
      setTotal(res.data?.total ?? 0);
    } finally { setLoading(false); }
  }, []);

  const addItem = useCallback(async ({ dishId, qty, addons, note }) => {
    await axios.post(`${API}/cart/add`, { dishId, qty, addons, note }, { headers: auth() });
    await load();
  }, [load]);

  const updateQty = useCallback(async (itemId, qty) => {
    await axios.patch(`${API}/cart/item/${itemId}`, { qty }, { headers: auth() });
    await load();
  }, [load]);

  const removeItem = useCallback(async (itemId) => {
    await axios.delete(`${API}/cart/item/${itemId}`, { headers: auth() });
    await load();
  }, [load]);

  useEffect(() => { load(); }, [load]);

  const count = useMemo(() => items.reduce((s, it) => s + Number(it.quantity || 0), 0), [items]);

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
