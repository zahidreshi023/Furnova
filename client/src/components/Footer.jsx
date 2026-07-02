import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Clock } from 'lucide-react';

export default function Footer({ onOpenInfo, contactSettings, brandingSettings }) {
  const [categories, setCategories] = useState([]);

  const siteName = brandingSettings?.siteName || 'Furnova';
  const phone = contactSettings?.phone || '1-800-FURNOVA (387-6682)';
  const email = contactSettings?.email || 'support@furnova.com';
  const hours = contactSettings?.hours || 'Mon - Sun (9:00 AM - 8:00 PM EST)';

  // Fetch categories dynamically for the collections column
  useEffect(() => {
    fetch('/api/categories')
      .then(res => { if (res.ok) return res.json(); throw new Error('fail'); })
      .then(data => setCategories(data.slice(0, 5)))
      .catch(() => {});
  }, []);

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo footer-logo">
              <span>{siteName}</span>
            </div>
            <p style={{ lineHeight: '1.7', marginBottom: '24px' }}>
              Crafting premium-grade interior experiences since 2026. Specializing in high-end, solid timber home furniture tailored for modern comfort.
            </p>
          </div>
          <div>
            <h4 className="footer-heading">Collections</h4>
            <ul className="footer-links">
              {categories.length > 0 ? (
                categories.map(cat => (
                  <li key={cat.id || cat._id}>
                    <a href={`/products?category=${encodeURIComponent(cat.name)}`} className="footer-link">{cat.name}</a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="/products?category=Beds" className="footer-link">Beds</a></li>
                  <li><a href="/products?category=Chairs" className="footer-link">Chairs</a></li>
                  <li><a href="/products?category=Sofas" className="footer-link">Sofas</a></li>
                  <li><a href="/products?category=Tables" className="footer-link">Tables</a></li>
                  <li><a href="/products?category=Storage" className="footer-link">Storage</a></li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/info/careers" className="footer-link">Careers</Link></li>
              <li><Link to="/info/press-kit" className="footer-link">Press Kit</Link></li>
              <li><Link to="/info/store-locations" className="footer-link">Store Locations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-links">
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Phone size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span className="footer-link" style={{ cursor: 'default' }}>{phone}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Mail size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span className="footer-link" style={{ cursor: 'default' }}>{email}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Clock size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span className="footer-link" style={{ cursor: 'default' }}>{hours}</span>
              </li>
              <li><Link to="/contact" className="footer-link" style={{ fontWeight: 600, color: 'var(--primary)' }}>Contact Support →</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {siteName} Inc. All rights reserved. Designed for premium comfort.</p>
        </div>
      </div>
    </footer>
  );
}
