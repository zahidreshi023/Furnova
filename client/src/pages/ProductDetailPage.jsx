import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Truck, ShieldCheck, HelpCircle, MessageSquare } from 'lucide-react';

export default function ProductDetailPage({ user, csrfToken, onAddToCart, showToast }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = () => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load product:', err);
        setLoading(false);
      });
  };



  const handleQuantityChange = (dir) => {
    if (dir === 'inc') {
      if (quantity < product.stock) {
        setQuantity(q => q + 1);
      } else {
        showToast(`Only ${product.stock} units are currently in stock.`, 'warning');
      }
    } else {
      if (quantity > 1) {
        setQuantity(q => q - 1);
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please type a comment for your review.', 'warning');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({
          productId: product.id,
          rating,
          comment: comment.trim(),
        }),
      });

      const resData = await response.json();
      if (response.ok) {
        showToast('Review submitted successfully!', 'success');
        setComment('');
        setRating(5);
        // Refresh product to load new review and average rating
        fetchProductDetails();
      } else {
        showToast(resData.error || 'Failed to submit review.', 'error');
      }
    } catch (err) {
      showToast('A network error occurred. Please try again.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '120px 0' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading furniture details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '120px 24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Furniture item not found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>The item you requested may have been removed or updated.</p>
        <Link to="/products" className="btn btn-primary">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      {/* Breadcrumbs */}
      <div style={{ marginTop: '30px', fontSize: '14px', color: 'var(--text-secondary)' }}>
        <Link to="/" style={{ hover: 'color: var(--text-primary)' }}>Home</Link> &gt;{' '}
        <Link to="/products" style={{ hover: 'color: var(--text-primary)' }}>Catalog</Link> &gt;{' '}
        <Link to={`/products?category=${product.category}`} style={{ hover: 'color: var(--text-primary)' }}>{product.category}</Link> &gt;{' '}
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</span>
      </div>

      <div className="detail-layout">
        {/* Gallery */}
        <div className="gallery-container">
          <div className="main-image-wrapper">
            <img
              src={activeImage ? (activeImage.startsWith('http') ? activeImage : `http://localhost:5000${activeImage}`) : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format&fit=crop'}
              alt={product.name}
              className="main-img"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="thumbnails-list">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumbnail-item ${activeImage === img ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img.startsWith('http') ? img : `http://localhost:5000${img}`} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info detail */}
        <div className="detail-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="detail-category">{product.category}</span>
          </div>
          <h1 className="detail-name">{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '16px', fontWeight: 700 }}>
              <Star size={18} className="rating-star" />
              <span>{product.ratings > 0 ? product.ratings.toFixed(1) : 'New'}</span>
            </div>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--error)', fontWeight: 700 }}>
              {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
            </span>
          </div>

          <div className="detail-price">₹{parseFloat(product.price).toFixed(2)}</div>

          <p className="detail-description">{product.description}</p>

          {/* Specifications */}
          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">Material composition</span>
              <span className="spec-value">{product.material || 'Solid Hardwood'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Primary Color</span>
              <span className="spec-value">{product.color || 'Natural Stained'}</span>
            </div>
            <div className="spec-item" style={{ gridColumn: 'span 2' }}>
              <span className="spec-label">Overall Dimensions</span>
              <span className="spec-value">{product.dimensions || 'No dimensions set'}</span>
            </div>
          </div>

          {/* Quantity and Cart Addition */}
          {product.stock > 0 ? (
            <div className="qty-buy-wrapper">
              <div className="quantity-picker">
                <button className="qty-btn" onClick={() => handleQuantityChange('dec')}>-</button>
                <span className="qty-val">{quantity}</span>
                <button className="qty-btn" onClick={() => handleQuantityChange('inc')}>+</button>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => onAddToCart(product.id, quantity)}
                style={{ flexGrow: 1 }}
              >
                <ShoppingBag size={20} /> Add to Shopping Cart
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary" disabled style={{ marginBottom: '40px', cursor: 'not-allowed' }}>
              Currently Out of Stock
            </button>
          )}

          {/* Trust points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <Truck size={18} style={{ color: 'var(--primary)' }} />
              <span>Complimentary Delivery &amp; Assembly within 40 miles</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--primary)' }} />
              <span>10-Year Frame protection structural guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '64px', marginTop: '40px' }}>
        <div className="reviews-layout-grid">
          {/* List reviews */}
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={24} /> Customer Reviews ({product.Reviews ? product.Reviews.length : 0})
            </h2>

            {!product.Reviews || product.Reviews.length === 0 ? (
              <div style={{ padding: '40px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No reviews yet for this product. Be the first to review!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {product.Reviews.map((rev) => (
                  <div key={rev.id} style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 700 }}>{rev.userName}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="rating-star"
                          fill={i < rev.rating ? 'currentColor' : 'none'}
                          style={{ color: i < rev.rating ? '#fb8c00' : 'var(--border-color)' }}
                        />
                      ))}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leave a review */}
          <div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>Write a Review</h3>

              {user ? (
                <form onSubmit={handleReviewSubmit}>
                  {/* Rating Selector */}
                  <div className="form-group">
                    <label className="form-label">Overall Rating</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          style={{ background: 'none', cursor: 'pointer', outline: 'none' }}
                        >
                          <Star
                            size={28}
                            className="rating-star"
                            fill={num <= rating ? 'currentColor' : 'none'}
                            style={{ color: num <= rating ? '#fb8c00' : 'var(--border-color)', transition: 'var(--transition-fast)' }}
                          />
                        </button>
                      ))}
                      <span style={{ fontWeight: 700, marginLeft: '8px', fontSize: '15px' }}>{rating} / 5</span>
                    </div>
                  </div>

                  {/* Review Text comment */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="review-comment">Your Review Comment</label>
                    <textarea
                      id="review-comment"
                      className="form-control"
                      rows="4"
                      placeholder="Share your experience with the dimensions, wood grain, or assembly..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      style={{ background: 'var(--bg-primary)', resize: 'vertical' }}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submittingReview}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    {submittingReview ? 'Submitting Review...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    You must be logged in to share your experience.
                  </p>
                  <Link to="/auth" className="btn btn-secondary" style={{ width: '100%' }}>
                    Sign In to Review
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
