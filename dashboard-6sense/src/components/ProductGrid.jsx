import React, { useState, useEffect, useCallback } from 'react';
import { PRODUCTS, simulateFetch } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';


function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-badge">{product.category}</div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-desc">{product.description}</p>
      <div className="product-footer">
        <span className="product-price">{formatCurrency(product.price)}/yr</span>
        <span className="product-rating">★ {product.rating}</span>
      </div>
      <button className="btn btn-primary product-btn" onClick={() => onAddToCart(product)}>
        Add to Quote
      </button>
    </div>
  );
}

const MemoProductCard = React.memo(ProductCard);

// ─── Product Grid ─────────────────────────────────────────────────────────────
export default function ProductGrid() {
  const { cart, setCart } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    simulateFetch(PRODUCTS, 500).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filtered =
    categoryFilter === 'All'
      ? products
      : products.filter((p) => p.category === categoryFilter);

  const sorted = filtered.sort((a, b) => b.rating - a.rating);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const handleAddToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, [setCart]);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Product Catalog</h2>
        <span className="cart-count">{cart.length} item(s) in quote</span>
      </div>

      <div className="filter-row">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn ${categoryFilter === cat ? 'btn-primary' : ''}`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading catalog…</div>
      ) : (
        <div className="product-grid">
          {sorted.map((product, index) => {
            return (
              <MemoProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            )
          })}
        </div>
      )}
    </div>
  );
}
