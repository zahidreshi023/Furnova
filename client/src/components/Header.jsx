import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, LogOut, Sofa, Menu, X, Home, Grid, Info, Phone, MoreHorizontal, Image as ImageIcon, ChevronRight } from 'lucide-react';

export default function Header({ user, onLogout, cartCount, wishlistCount, brandingSettings }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeParentCategory, setActiveParentCategory] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const siteName = brandingSettings?.siteName || 'Furnova';
  const logoUrl = brandingSettings?.logoUrl || '';
  const displayLogoUrl = logoUrl.startsWith('http') ? logoUrl : (logoUrl ? `http://localhost:5000${logoUrl}` : '');

  // Fetch categories for mega menu
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0) setActiveParentCategory(data[0]);
      })
      .catch(() => {});
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search matches for autocomplete
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.slice(0, 5)); // top 5 results
          setShowDropdown(true);
        }
      } catch (err) {
        // Silently fail autocomplete
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleResultClick = (productId) => {
    navigate(`/products/${productId}`);
    setSearchQuery('');
    setShowDropdown(false);
  };

  // Close mobile menu on path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header-glass">
      <div className="header-container nav-container">
        {/* Brand Logo - Dynamic */}
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', minWidth: '150px' }}>
          {brandingSettings === null ? (
            /* Invisible placeholder to prevent layout shift while loading */
            <div style={{ height: '36px', width: '150px' }}></div>
          ) : displayLogoUrl ? (
            <img src={displayLogoUrl} alt={siteName} style={{ height: '36px', objectFit: 'contain' }} />
          ) : (
            <>
              <Sofa size={28} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>{siteName}</span>
            </>
          )}
        </Link>

        {/* Navigation Links - Icon Based */}
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link-icon ${isActive('/')}`}>
                <Home size={20} /> <span className="nav-icon-label">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/products" className={`nav-link-icon ${isActive('/products')}`}>
                <Grid size={20} /> <span className="nav-icon-label">Catalog</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className={`nav-link-icon ${isActive('/about')}`}>
                <Info size={20} /> <span className="nav-icon-label">About</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`nav-link-icon ${isActive('/contact')}`}>
                <Phone size={20} /> <span className="nav-icon-label">Contact</span>
              </Link>
            </li>
            <li 
              className="nav-item-more"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <button className="nav-link-icon">
                <MoreHorizontal size={20} /> <span className="nav-icon-label">More</span>
              </button>

              {/* Mega Menu Dropdown */}
              {showMegaMenu && categories.length > 0 && (
                <div className="mega-menu-dropdown two-pane-layout">
                  <div className="mega-menu-left-pane">
                    <h4 style={{ margin: '0 0 12px 12px', fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)' }}>Departments</h4>
                    <ul className="mega-menu-parent-list">
                      {categories.map(cat => (
                        <li key={cat.id || cat._id}>
                          <Link 
                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                            className={`mega-menu-parent-link ${activeParentCategory && (activeParentCategory.id || activeParentCategory._id) === (cat.id || cat._id) ? 'active' : ''}`}
                            onMouseEnter={() => setActiveParentCategory(cat)}
                            onClick={() => setShowMegaMenu(false)}
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mega-menu-right-pane">
                    {activeParentCategory && (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '12px' }}>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{activeParentCategory.name}</h4>
                          <Link to={`/products?category=${encodeURIComponent(activeParentCategory.name)}`} style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }} onClick={() => setShowMegaMenu(false)}>
                            View All {activeParentCategory.name} &rarr;
                          </Link>
                        </div>
                        
                        {activeParentCategory.subCategories && activeParentCategory.subCategories.length > 0 ? (
                          <div className="mega-menu-grid">
                            {activeParentCategory.subCategories.map(subCat => {
                              const imgUrl = subCat.image ? (subCat.image.startsWith('http') ? subCat.image : `http://localhost:5000${subCat.image}`) : null;
                              return (
                                <Link 
                                  key={subCat.id || subCat._id} 
                                  to={`/products?category=${encodeURIComponent(subCat.name)}`}
                                  className="mega-menu-card"
                                  onClick={() => setShowMegaMenu(false)}
                                >
                                  <div className="mega-menu-card-img-wrapper">
                                    {imgUrl ? (
                                      <img src={imgUrl} alt={subCat.name} className="mega-menu-card-img" />
                                    ) : (
                                      <ImageIcon size={24} color="#94a3b8" />
                                    )}
                                  </div>
                                  <span className="mega-menu-card-title">{subCat.name}</span>
                                </Link>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <p>Browse all items in {activeParentCategory.name}</p>
                            {activeParentCategory.image && (
                              <img src={activeParentCategory.image.startsWith('http') ? activeParentCategory.image : `http://localhost:5000${activeParentCategory.image}`} alt={activeParentCategory.name} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginTop: '16px' }} />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* Live Autocomplete Search Bar */}
        <div className="search-input-wrapper" style={{ flex: '1 1 200px', maxWidth: '350px', margin: '0', position: 'relative' }} ref={dropdownRef}>
          <form onSubmit={handleSearchSubmit}>
            <div style={{ position: 'relative', marginBottom: 0 }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                className="search-bar"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setShowDropdown(true)}
                style={{ width: '100%', margin: 0, padding: '10px 16px 10px 42px', borderRadius: 'var(--radius-full)', background: 'rgba(15, 23, 42, 0.05)', border: '1px solid transparent', fontSize: '14px' }}
              />
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="autocomplete-dropdown" style={{ borderRadius: 'var(--radius-sm)' }}>
              {searchResults.map((prod) => (
                <div
                  key={prod.id}
                  className="autocomplete-item"
                  onClick={() => handleResultClick(prod.id)}
                >
                  <img
                    src={prod.images && prod.images.length > 0 ? prod.images[0] : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=80&auto=format&fit=crop'}
                    alt={prod.name}
                    className="autocomplete-img"
                  />
                  <div className="autocomplete-details">
                    <span className="autocomplete-name">{prod.name}</span>
                    <span className="autocomplete-price">₹{parseFloat(prod.price).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side Icons & Actions - NO admin icon */}
        <div className="nav-actions">
          {/* Wishlist */}
          <Link to="/account?tab=wishlist" className="nav-btn" title="Wishlist">
            <Heart size={20} />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>

          {/* Shopping Cart */}
          <Link to="/cart" className="nav-btn" title="Shopping Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          {/* User Profile Menu - No admin dashboard icon, hide if admin user */}
          {user && user.role !== 'admin' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/account" className="nav-btn" title="User Account Dashboard" style={{ gap: '6px' }}>
                <User size={20} />
                <span className="desktop-only-name" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user?.name?.split(' ')[0] || ''}
                </span>
              </Link>

              <button className="nav-btn" onClick={onLogout} title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : !user ? (
            <Link to="/login" className="btn btn-primary" style={{ padding: '8px 18px', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}>
              Sign In
            </Link>
          ) : null}
        </div>

        {/* Hamburger Menu Toggle (Mobile) */}
        <button
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          title="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {/* Mobile Search Bar */}
          <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="search-input-wrapper" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowDropdown(true)}
                  style={{ padding: '12px 16px 12px 40px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', width: '100%' }}
                />
                <Search size={18} className="search-icon-absolute" style={{ left: '14px' }} />
              </div>
            </form>

            {/* Autocomplete Dropdown inside Mobile Search */}
            {showDropdown && searchResults.length > 0 && (
              <div className="autocomplete-dropdown" style={{ borderRadius: 'var(--radius-sm)', width: '100%', position: 'absolute', top: '100%', left: 0 }}>
                {searchResults.map((prod) => (
                  <div
                    key={prod.id}
                    className="autocomplete-item"
                    onClick={() => {
                      handleResultClick(prod.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <img
                      src={prod.images && prod.images.length > 0 ? prod.images[0] : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=80&auto=format&fit=crop'}
                      alt={prod.name}
                      className="autocomplete-img"
                    />
                    <div className="autocomplete-details">
                      <span className="autocomplete-name">{prod.name}</span>
                      <span className="autocomplete-price">₹{parseFloat(prod.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ul className="mobile-nav-links">
            <li>
              <Link to="/" className={`mobile-nav-link ${isActive('/')}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Home size={20} /> Home
              </Link>
            </li>
            <li>
              <Link to="/products" className={`mobile-nav-link ${isActive('/products')}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Grid size={20} /> Shop Catalog
              </Link>
            </li>
            <li>
              <Link to="/about" className={`mobile-nav-link ${isActive('/about')}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Info size={20} /> About
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`mobile-nav-link ${isActive('/contact')}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Phone size={20} /> Contact
              </Link>
            </li>
            
            <li className="mobile-nav-divider"></li>
            <li className="mobile-nav-section-title">Shop By Category</li>
            
            <li style={{ display: 'block' }}>
              <ul className="mobile-categories-scroll" style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '4px', listStyle: 'none', padding: 0, margin: 0 }}>
                {categories.map(cat => {
                  const catId = cat.id || cat._id;
                  const hasSubs = cat.subCategories && cat.subCategories.length > 0;
                  const isExpanded = expandedCategory === catId;
                  
                  return (
                    <li key={catId} style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Link 
                          to={`/products?category=${encodeURIComponent(cat.name)}`} 
                          className="mobile-nav-link mobile-nav-sublink" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{ flex: 1, paddingRight: '0' }}
                        >
                          <ImageIcon size={16} /> {cat.name}
                        </Link>
                        {hasSubs && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setExpandedCategory(isExpanded ? null : catId);
                            }}
                            aria-label="Toggle subcategories"
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '8px 16px',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'transform 0.2s',
                              transform: isExpanded ? 'rotate(90deg)' : 'none'
                            }}
                          >
                            <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                      
                      {hasSubs && isExpanded && (
                        <ul style={{ listStyle: 'none', paddingLeft: '16px', margin: 0 }}>
                          {cat.subCategories.map(subCat => (
                            <li key={subCat.id || subCat._id}>
                              <Link 
                                to={`/products?category=${encodeURIComponent(subCat.name)}`} 
                                className="mobile-nav-link mobile-nav-sublink" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{ paddingLeft: '36px', fontSize: '13px', opacity: 0.8 }}
                              >
                                {subCat.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
