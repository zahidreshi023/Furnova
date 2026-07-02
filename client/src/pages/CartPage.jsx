import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';

export default function CartPage({ user, cart, onUpdateQuantity, onRemoveFromCart, showToast }) {
  const navigate = useNavigate();

  const items = cart || [];
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99.00; // Free shipping over $500
  const tax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + shipping + tax;

  const handleCheckoutClick = () => {
    if (!user) {
      showToast('You must sign in to complete your purchase.', 'warning');
      navigate('/auth?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '120px 24px' }}>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          <ShoppingBag size={64} style={{ margin: '0 auto', opacity: 0.3 }} />
        </div>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Your shopping cart is empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Explore our catalog and find the perfect additions to your home.</p>
        <Link to="/products" className="btn btn-primary">Browse Furniture Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 800, marginTop: '40px', marginBottom: '8px' }}>Shopping Cart</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Review items in your active shopping session</p>

      <div className="cart-layout">
        {/* Items list */}
        <div className="cart-items-list">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=100&auto=format&fit=crop'}
                alt={item.name}
                className="cart-item-img"
              />
              <div className="cart-item-details">
                <h3 className="cart-item-name">
                  <Link to={`/products/${item.productId}`}>{item.name}</Link>
                </h3>
                <span className="cart-item-price">₹{parseFloat(item.price).toFixed(2)} each</span>
              </div>

              {/* Quantity Picker */}
              <div className="quantity-picker" style={{ margin: '0 24px' }}>
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  style={{ padding: '8px 12px' }}
                >
                  <Minus size={14} />
                </button>
                <span className="qty-val" style={{ padding: '0 12px' }}>{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  style={{ padding: '8px 12px' }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Total and Delete */}
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '24px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-family-display)' }}>
                  ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => onRemoveFromCart(item.productId)}
                  style={{ background: 'none', cursor: 'pointer', color: 'var(--text-secondary)', hover: 'color: var(--error)' }}
                  title="Remove Item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary side panel */}
        <div className="summary-panel">
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>Order Summary</h3>

          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>Shipping &amp; Logistics</span>
            <span style={{ fontWeight: 600 }}>
              {shipping === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `₹${shipping.toFixed(2)}`}
            </span>
          </div>

          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>Sales Tax (8%)</span>
            <span style={{ fontWeight: 600 }}>₹{tax.toFixed(2)}</span>
          </div>

          <div className="summary-row summary-total">
            <span>Total</span>
            <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
          </div>

          {shipping > 0 && (
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '16px 0 24px', textAlign: 'center' }}>
              Add <strong style={{ color: 'var(--primary)' }}>₹{(500 - subtotal).toFixed(2)}</strong> more to qualify for Free Shipping!
            </p>
          )}

          <button
            className="btn btn-primary"
            onClick={handleCheckoutClick}
            style={{ width: '100%', marginTop: '16px' }}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
