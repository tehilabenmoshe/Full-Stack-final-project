import { useEffect, useMemo, useState } from "react";
import "../styles/DishModal.css";

export default function DishModal({ dish, onClose, onAdd, fetchAddons }) {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [addons, setAddons] = useState([]);        // [{id,name,price}]
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    let alive = true;
    (async () => {
      // תוספות למנה – אם לא עברת fetchAddons, אפשר להשאיר ריק
      try {
        if (fetchAddons) {
          const rows = await fetchAddons(dish.id);
          if (alive) setAddons(rows || []);
        }
      } catch {
        /* swallow – נשאר בלי תוספות */
      }
    })();
    return () => { alive = false; };
  }, [dish?.id, fetchAddons]);

  const base = Number(dish.price || 0);
  const extrasSum = useMemo(
    () => [...selected].reduce((sum, id) => {
      const a = addons.find(x => x.id === id);
      return sum + (a ? Number(a.price) : 0);
    }, 0),
    [selected, addons]
  );
  const unit = base + extrasSum;
  const total = unit * qty;

  function toggleAddon(id) {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  function add() {
    onAdd({
      dishId: dish.id,
      name: dish.name,
      qty,
      note,
      addons: [...selected],   // מזהים של תוספות
      unitPrice: unit,
      totalPrice: total
    });
  }

  return (
    <div className="dm-backdrop" onClick={onClose}>
      <div className="dm-card" onClick={e => e.stopPropagation()}>
        <button className="dm-close" onClick={onClose}>×</button>

        <h3 className="dm-title">{dish.name}</h3>
        {dish.description && <p className="dm-desc">{dish.description}</p>}

        <div className="dm-row">
          <span className="dm-label">Quantity</span>
          <div className="dm-qty">
            <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => q + 1)}>+</button>
          </div>
        </div>

        {!!addons.length && (
          <div className="dm-section">
            <div className="dm-label">Add-ons</div>
            <ul className="dm-addons">
              {addons.map(a => (
                <li key={a.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selected.has(a.id)}
                      onChange={() => toggleAddon(a.id)}
                    />
                    <span>{a.name}</span>
                    <span className="dm-price">+ ₪{Number(a.price).toFixed(2)}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="dm-section">
          <div className="dm-label">Note to the restaurant</div>
          <textarea
            className="dm-note"
            placeholder="E.g. no onions, extra sauce…"
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
          />
        </div>

        <div className="dm-footer">
          <div >
            <div className="dm-unit">Unit: ₪{unit.toFixed(2)}</div>
            <div className="dm-total"><strong>Total: ₪{total.toFixed(2)}</strong></div>
          </div>
          <button className="dm-add" onClick={add}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
