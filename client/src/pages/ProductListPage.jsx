import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, RefreshCw, Plus } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductFormModal from '../components/ProductFormModal';

export default function ProductListPage({ user, csrfToken, showToast, onAddToCart, wishlist, onToggleWishlist }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter States
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Trigger load when parameters modify
  useEffect(() => {
    setLoading(true);
    let url = `/api/products?`;
    const params = new URLSearchParams();

    if (categoryParam) params.append('category', categoryParam);
    if (searchParam) params.append('search', searchParam);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (selectedMaterial) params.append('material', selectedMaterial);
    if (selectedColor) params.append('color', selectedColor);
    if (sortBy) params.append('sortBy', sortBy);

    fetch(url + params.toString())
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to retrieve products:', err);
        setLoading(false);
      });
  }, [categoryParam, searchParam, minPrice, maxPrice, selectedMaterial, selectedColor, sortBy, refreshTrigger]);

  const handleAddProductSubmit = async (formData) => {
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      images: formData.images ? formData.images.split(',').map(img => img.trim()) : [],
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (res.ok) {
        showToast('Furniture product created successfully.', 'success');
        setShowAddModal(false);
        setRefreshTrigger(prev => prev + 1);
      } else {
        showToast(resData.error || 'Failed to create product.', 'error');
      }
    } catch (err) {
      showToast('Network error creating product.', 'error');
    }
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedMaterial('');
    setSelectedColor('');
    setSortBy('newest');
    setSearchParams({}); // Clear query parameters as well
  };

  const handleCategoryChange = (catName) => {
    const nextParams = new URLSearchParams(searchParams);
    if (catName) {
      nextParams.set('category', catName);
    } else {
      nextParams.delete('category');
    }
    setSearchParams(nextParams);
  };

  const materials = ['Solid Oak Wood', 'Solid American Walnut', 'Solid Ash Wood', 'Velvet & Solid Oak Wood', 'Premium Mesh & Nylon Base', 'Italian Top-Grain Leather & Walnut', 'White Oak Veneer & Brass Handles', 'Faux Leather & Beech Wood', 'MDF & Oak Veneer', 'Belgian Linen & Pine Wood', 'Pine Wood & Gold Steel'];
  const colors = ['Royal Blue', 'Charcoal Black', 'Cognac Tan', 'Natural Walnut', 'Bleached Oak', 'Light Ash', 'Oxblood Red', 'Forest Green & Ash', 'Oatmeal Beige', 'Walnut & Brass'];

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      {/* 1. Header Info */}
      <div style={{ marginTop: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 800 }}>
            {categoryParam ? `${categoryParam} Collection` : 'All Furniture'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {searchParam ? `Showing search results for "${searchParam}"` : `Browse our collection of luxury furniture items`}
          </p>
        </div>
        {user && user.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      <div className="listings-layout">
        {/* 2. Sidebar Filters */}
        <aside className="sidebar-filters">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={18} /> Filters
            </h3>
            <button
              onClick={clearFilters}
              style={{ background: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RefreshCw size={12} /> Clear All
            </button>
          </div>

          {/* Categories select list */}
          <div className="filter-group">
            <h4 className="filter-title">Categories</h4>
            <div className="filter-options">
              {['All', 'Beds', 'Chairs', 'Sofas', 'Tables', 'Storage'].map(cat => (
                <label key={cat} className="filter-checkbox" style={{ fontWeight: (categoryParam === cat || (!categoryParam && cat === 'All')) ? 700 : 400, color: (categoryParam === cat || (!categoryParam && cat === 'All')) ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  <input
                    type="radio"
                    name="category-radio"
                    checked={categoryParam === cat || (!categoryParam && cat === 'All')}
                    onChange={() => handleCategoryChange(cat === 'All' ? '' : cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                className="price-input"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span style={{ color: 'var(--text-secondary)' }}>to</span>
              <input
                type="number"
                placeholder="Max"
                className="price-input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Material Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Wood & Material</h4>
            <select
              className="form-control"
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              style={{ background: 'var(--bg-primary)', padding: '10px' }}
            >
              <option value="">All Materials</option>
              {materials.map(mat => (
                <option key={mat} value={mat}>{mat}</option>
              ))}
            </select>
          </div>

          {/* Color Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Colors</h4>
            <select
              className="form-control"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              style={{ background: 'var(--bg-primary)', padding: '10px' }}
            >
              <option value="">All Colors</option>
              {colors.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* 3. Products List Area */}
        <main>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              Showing {products.length} matching item{products.length !== 1 ? 's' : ''}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ArrowUpDown size={16} style={{ color: 'var(--text-secondary)' }} />
              <select
                className="form-control"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '180px', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid list */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Curating Catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No furniture matches your criteria</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Try adjusting price ranges, search terms, or clearing filters.</p>
              <button className="btn btn-primary" onClick={clearFilters}>Reset Catalog Filters</button>
            </div>
          ) : (
            <div className="product-grid">
              {products.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist.includes(prod.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
      <ProductFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddProductSubmit}
      />
    </div>
  );
}
