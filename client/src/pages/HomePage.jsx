import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function HomePage({ onAddToCart, wishlist, onToggleWishlist, bannerSettings }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const categoryScrollRef = useRef(null);
  const navigate = useNavigate();

  const banners = bannerSettings && bannerSettings.length > 0 ? bannerSettings : [];

  useEffect(() => {
    // Fetch top 4 rated products as featured
    fetch('/api/products?sortBy=rating')
      .then(res => res.json())
      .then(data => {
        setFeaturedProducts(data.slice(0, 4));
      })
      .catch(() => {});

    // Fetch categories dynamically
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data.filter(c => !c.parentCategoryId));
      })
      .catch(() => {});
  }, []);

  // Auto-rotate banners every 5 seconds
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1 || isHovered) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [banners.length, nextSlide, isHovered]);

  const currentBanner = banners[currentSlide] || banners[0];

  const getCatImageUrl = (cat) => {
    if (!cat.image) return null;
    if (cat.image.startsWith('http')) return cat.image;
    return `http://localhost:5000${cat.image}`;
  };

  const getBannerImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  const scrollCategories = (direction) => {
    if (!categoryScrollRef.current) return;
    const scrollAmount = 280;
    categoryScrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <div>
      {/* 1. Dynamic Hero Banner Slider */}
      {banners.length > 0 ? (
        <section 
          className="hero-slider" 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Background Image */}
          <img
            src={getBannerImageUrl(currentBanner.image)}
            alt={currentBanner.headline || 'Banner'}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.35)',
              transition: 'opacity 0.6s ease-in-out',
            }}
          />

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.4) 60%, rgba(15,23,42,0.7) 100%)',
          }} />

          {/* Slider Arrow - Previous */}
          {banners.length > 1 && (
            <button
              onClick={prevSlide}
              className="hero-slider-arrow hero-slider-arrow-left"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Content */}
          <div className="hero-slider-content">
            <div className="hero-slider-text">
              <div style={{ color: '#ff7e40', marginBottom: '12px', fontSize: '14px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                <Sparkles size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                {currentBanner.tag || 'Exclusive Collection'}
              </div>
              <h1 className="hero-slider-headline">
                {currentBanner.headline}
              </h1>
              <p className="hero-slider-subtitle">
                {currentBanner.subtitle}
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Link to={currentBanner.ctaLink || '/products'} className="btn btn-primary" style={{ boxShadow: '0 4px 16px rgba(255,126,64,0.3)' }}>
                  {currentBanner.ctaText || 'Shop Now'} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Slider Arrow - Next */}
          {banners.length > 1 && (
            <button
              onClick={nextSlide}
              className="hero-slider-arrow hero-slider-arrow-right"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Dot Indicators */}
          {banners.length > 1 && (
            <div className="hero-slider-dots">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    width: idx === currentSlide ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: idx === currentSlide ? '#ff7e40' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="hero-slider" style={{ position: 'relative', overflow: 'hidden', minHeight: '400px', background: 'linear-gradient(135deg, hsl(220, 30%, 12%) 0%, hsl(220, 25%, 20%) 100%)' }}>
          <div className="hero-slider-content" style={{ textAlign: 'center', alignItems: 'center' }}>
            <div className="hero-slider-text" style={{ maxWidth: '500px', textAlign: 'center' }}>
              <Sparkles size={40} style={{ color: '#ff7e40', marginBottom: '16px' }} />
              <h1 className="hero-slider-headline" style={{ fontSize: '36px' }}>
                Welcome to Furnova
              </h1>
              <p className="hero-slider-subtitle" style={{ margin: '0 auto 24px' }}>
                Premium home furniture, crafted with care. Browse our collection below.
              </p>
              <Link to="/products" className="btn btn-primary" style={{ boxShadow: '0 4px 16px rgba(255,126,64,0.3)' }}>
                Explore Collection <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 2. Feature Highlights */}
      <section style={{ padding: '60px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ color: 'var(--primary)' }}>
              <Truck size={36} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>White-Glove Delivery</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Free in-home assembly and packaging recycling.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ color: 'var(--primary)' }}>
              <ShieldCheck size={36} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>10-Year Warranty</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Guaranteed longevity on structural timber frame components.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ color: 'var(--primary)' }}>
              <Sparkles size={36} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>Custom Finishes</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Choose from over 20+ velvet fabric grades and wood oils.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dynamic Categories - Horizontal Scroll */}
      <section style={{ padding: '80px 0 40px' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse By Category</h2>
            <Link to="/products" style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              See All Products <ArrowRight size={16} />
            </Link>
          </div>
          <div className="categories-scroll-wrapper">
            <button className="cat-scroll-arrow cat-scroll-arrow-left" onClick={() => scrollCategories('left')} aria-label="Scroll categories left">
              <ChevronLeft size={20} />
            </button>
            <div className="categories-scroll" ref={categoryScrollRef}>
              {categories.map((cat, idx) => {
                const imgUrl = getCatImageUrl(cat);
                return (
                  <div
                    key={cat.id || cat._id || idx}
                    className="category-scroll-card"
                    onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                  >
                    {imgUrl ? (
                      <img src={imgUrl} alt={cat.name} className="category-scroll-card-img" />
                    ) : (
                      <div className="category-scroll-card-placeholder">
                        <span>{cat.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div className="category-scroll-card-overlay">
                      <h3 className="category-scroll-card-name">{cat.name}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="cat-scroll-arrow cat-scroll-arrow-right" onClick={() => scrollCategories('right')} aria-label="Scroll categories right">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Featured Products Slider */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Highly Rated Furniture</h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Our customers favorites</span>
          </div>
          <div className="product-grid">
            {featuredProducts.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.includes(prod.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Promotional banner */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <div className="promo-banner-grid">
          {/* Subtle background glow */}
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--primary)', filter: 'blur(100px)', opacity: '0.15' }}></div>

          <div>
            <h2 style={{ color: 'white', fontSize: '38px', fontWeight: 800, lineHeight: '1.2', marginBottom: '16px' }}>
              Crafted in Elegance, Built to Endure.
            </h2>
            <p style={{ color: 'hsl(210, 15%, 75%)', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px' }}>
              Every single table and chair we manufacture undergoes a rigorous 14-stage dry-kiln curing process. This ensures that our solid timber remains immune to warp, split, and atmospheric expansion for decades.
            </p>
            <Link to="/products?category=Tables" className="btn btn-primary" style={{ boxShadow: 'none' }}>
              Explore Masterpieces
            </Link>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&auto=format&fit=crop"
              alt="Marrakesh Walnut Table Detail"
              style={{ width: '100%', borderRadius: 'var(--radius-md)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
