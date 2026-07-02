import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = ['Beds', 'Chairs', 'Sofas', 'Tables', 'Storage']
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Beds',
    description: '',
    dimensions: '',
    material: '',
    color: '',
    price: '',
    stock: '',
    images: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Beds',
        description: initialData.description || '',
        dimensions: initialData.dimensions || '',
        material: initialData.material || '',
        color: initialData.color || '',
        price: initialData.price || '',
        stock: initialData.stock || '',
        images: initialData.images ? initialData.images.join(', ') : '',
      });
    } else {
      setFormData({
        name: '',
        category: 'Beds',
        description: '',
        dimensions: '',
        material: '',
        color: '',
        price: '',
        stock: '',
        images: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" style={{ pointerEvents: 'auto' }} onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
          borderRadius: 'var(--radius-md)',
          padding: '40px',
          maxWidth: '600px',
          width: '90%',
          animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
          title="Close Modal"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Sparkles size={24} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>
            {initialData ? 'Catalog Editor' : 'Inventory Creation'}
          </span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          {initialData ? 'Edit Furniture Item' : 'Add Furniture Item'}
        </h2>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxHeight: '420px', overflowY: 'auto', paddingRight: '8px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Product Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ background: 'var(--bg-primary)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                style={{ background: 'var(--bg-primary)', padding: '10px' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Material Composition</label>
              <input
                type="text"
                name="material"
                className="form-control"
                placeholder="e.g. Solid Oak Wood"
                value={formData.material}
                onChange={handleChange}
                style={{ background: 'var(--bg-primary)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Color</label>
              <input
                type="text"
                name="color"
                className="form-control"
                placeholder="e.g. Royal Blue"
                value={formData.color}
                onChange={handleChange}
                style={{ background: 'var(--bg-primary)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dimensions Specs</label>
              <input
                type="text"
                name="dimensions"
                className="form-control"
                placeholder="e.g. Width: 160cm, Height: 75cm"
                value={formData.dimensions}
                onChange={handleChange}
                style={{ background: 'var(--bg-primary)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                required
                style={{ background: 'var(--bg-primary)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Starting Stock Quantity</label>
              <input
                type="number"
                name="stock"
                className="form-control"
                value={formData.stock}
                onChange={handleChange}
                required
                style={{ background: 'var(--bg-primary)' }}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Product Image Links (Comma separated)</label>
              <input
                type="text"
                name="images"
                className="form-control"
                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                value={formData.images}
                onChange={handleChange}
                style={{ background: 'var(--bg-primary)' }}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Detailed Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
                style={{ background: 'var(--bg-primary)', resize: 'vertical' }}
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Save Modifications' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
