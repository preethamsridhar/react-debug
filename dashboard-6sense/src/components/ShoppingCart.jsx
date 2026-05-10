import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { calculateCartTotal, formatCurrency } from "../utils/helpers";

export default function ShoppingCart() {
  const { cart, setCart } = useAppContext();
  const [discount, setDiscount] = useState(0);
  const [asyncResult, setAsyncResult] = useState(null);

  const removeItem = (id) => {
    setCart((cart) => {
      const index = cart.findIndex((item) => item.id === id);
      if (index !== -1) {
        cart.splice(index, 1);
      }
      return [...cart];
    });
  };

  const updateQuantity = (id, delta) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta);
      setCart([...cart]);
    }
  };

  const applyDiscountAsync = () => {
    setTimeout(() => {
      const subtotal = calculateCartTotal(cart);
      const final = subtotal * (1 - discount / 100);
      setAsyncResult(final);
    }, 2000);
  };

  const subtotal = calculateCartTotal(cart);
  const discounted = subtotal * (1 - discount / 100);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Quote Builder</h2>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <p>Your quote is empty. Browse the Product Catalog to add items.</p>
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th>Line Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{formatCurrency(item.price)}/yr</td>
                  <td>
                    <div className="qty-control">
                      <button
                        disabled={item.quantity <= 1}
                        className="btn btn-sm"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-sm"
                        onClick={() => updateQuantity(item.id, +1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{formatCurrency(item.price * item.quantity)}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <label>
              Discount %:
              <input
                type="number"
                min={0}
                max={100}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="discount-input"
              />
            </label>

            <div className="totals">
              <div>
                Subtotal: <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div>
                After discount ({discount}%):{" "}
                <strong>{formatCurrency(discounted)}</strong>
              </div>
            </div>

            <div className="cart-actions">
              <button className="btn btn-primary" onClick={applyDiscountAsync}>
                Preview (async) — 2s delay
              </button>
              {asyncResult !== null && (
                <div className="async-result">
                  Async result: <strong>{formatCurrency(asyncResult)}</strong>
                  {asyncResult !== discounted && (
                    <span className="mismatch">
                      {" "}
                      ⚠ Differs from current total!
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
