import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, isWishlisted, onToggleWishlist }) {
  // Use first image or fall back to empty placeholder if none exists
  const resolveImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  const imgUrl = product.images && product.images.length > 0
    ? resolveImageUrl(product.images[0])
    : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop';

  return (
    <div className="product-card">
      <div className="product-img-wrapper">
        <Link to={`/products/${product.id}`}>
          <img
            src={imgUrl}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
          />
        </Link>
        {product.stock === 0 && (
          <div className="product-badge" style={{ backgroundColor: 'var(--error)' }}>
            Out of Stock
          </div>
        )}
        {product.stock > 0 && product.stock <= 3 && (
          <div className="product-badge" style={{ backgroundColor: 'var(--primary)' }}>
            Only {product.stock} Left
          </div>
        )}
        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={() => onToggleWishlist(product.id)}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        <div className="product-rating">
          <Star size={16} className="rating-star" />
          <span>{product.ratings > 0 ? product.ratings.toFixed(1) : 'New'}</span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
            ({product.material || 'Premium Wood'})
          </span>
        </div>

        <div className="product-footer">
          <span className="product-price">₹{parseFloat(product.price).toFixed(2)}</span>
          <button
            className="add-cart-btn"
            onClick={() => onAddToCart(product.id, 1)}
            disabled={product.stock === 0}
            title={product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
