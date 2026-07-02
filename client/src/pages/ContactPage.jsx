import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Send, HelpCircle } from 'lucide-react';

export default function ContactPage({ contactSettings, showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate server POST submission
    setTimeout(() => {
      showToast('Thank you! Your message has been received. Our concierge team will respond within 24 hours.', 'success');
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
      });
      setSubmitting(false);
    }, 1000);
  };

  const settings = contactSettings || {
    phone: '1-800-FURNOVA (387-6682)',
    email: 'support@furnova.com',
    hours: 'Mon - Sun (9:00 AM - 8:00 PM EST)',
    showrooms: [
      {
        name: 'Seattle Flagship Showroom',
        address: '1024 Pine Street, Seattle, WA 98101',
        hours: 'Mon - Sun (10:00 AM - 7:00 PM)',
        phone: '1-800-387-6682 (Ext. 101)',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop',
      },
      {
        name: 'San Francisco Showroom',
        address: '450 Sutter Street, San Francisco, CA 94108',
        hours: 'Mon - Sat (10:00 AM - 6:00 PM)',
        phone: '1-800-387-6682 (Ext. 102)',
        image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop',
      },
      {
        name: 'New York Flatiron Showroom',
        address: '120 Fifth Ave, New York, NY 10011',
        hours: 'Mon - Sun (10:00 AM - 8:00 PM)',
        phone: '1-800-387-6682 (Ext. 103)',
        image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&auto=format&fit=crop',
      },
    ]
  };

  const showrooms = settings.showrooms;

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* 1. Hero Section */}
      <section 
        className="contact-hero" 
        style={{
          position: 'relative',
          padding: '120px 0',
          background: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.75)), url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop") no-repeat center center/cover',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span 
            style={{ 
              fontSize: '14px', 
              fontWeight: 700, 
              color: 'var(--primary)', 
              letterSpacing: '3px', 
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '16px'
            }}
          >
            Get In Touch
          </span>
          <h1 
            style={{ 
              fontSize: '56px', 
              fontWeight: 800, 
              color: 'white', 
              lineHeight: '1.1', 
              letterSpacing: '-1.5px',
              maxWidth: '800px',
              margin: '0 auto 24px'
            }}
          >
            Connect With Us
          </h1>
          <p 
            style={{ 
              fontSize: '18px', 
              color: 'hsl(210, 15%, 85%)', 
              maxWidth: '600px', 
              margin: '0 auto', 
              lineHeight: '1.7' 
            }}
          >
            Visit our architectural showrooms or reach our design desk directly.
          </p>
        </div>
      </section>

      {/* 2. Showrooms Section */}
      <section style={{ padding: '80px 0 60px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Design Showrooms
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: 800, marginTop: '8px' }}>
              Experience Furnova Live
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '16px' }}>
              Walk on our solid oak floors and experience the texture of premium fabrics in person.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {showrooms.map((room, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'var(--bg-secondary)', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid var(--border-color)', 
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition-smooth)'
                }}
                className="showroom-card-hover"
              >
                <div style={{ height: '220px', overflow: 'hidden', background: '#e2e8f0' }}>
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                    className="showroom-image-scale"
                  />
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>{room.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <MapPin size={16} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                      <span>{room.address}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <Clock size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <span>{room.hours}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <Phone size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <span>{room.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Form & Contact Details Split */}
      <section style={{ padding: '60px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container contact-layout-grid">
          {/* Details */}
          <div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Direct Channels
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: 800, margin: '12px 0 24px', lineHeight: '1.2' }}>
              Need immediate assistance?
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '32px', fontSize: '15px' }}>
              Our customer care team is available seven days a week to answer questions regarding custom fabrics, order statuses, or delivery scheduling.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Phone hotline</span>
                  <strong style={{ display: 'block', fontSize: '16px', marginTop: '2px' }}>{settings.phone}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Email Support</span>
                  <strong style={{ display: 'block', fontSize: '16px', marginTop: '2px' }}>{settings.email}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Working Hours</span>
                  <strong style={{ display: 'block', fontSize: '16px', marginTop: '2px' }}>{settings.hours}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div 
            style={{ 
              background: 'white', 
              padding: '40px', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>Send a Message</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="contact-form-grid">
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>Your Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Subject</label>
                <select
                  className="form-control"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ background: '#fff', cursor: 'pointer' }}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Custom Order Request">Custom Order Request</option>
                  <option value="Logistics & Delivery">Logistics & Delivery</option>
                  <option value="Warranty Claim">Warranty Claim</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontSize: '11px' }}>How can we help?</label>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Detail your request here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)' }}
                disabled={submitting}
              >
                {submitting ? 'Sending Message...' : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .showroom-card-hover:hover {
          transform: translateY(-6px);
          border-color: var(--primary) !important;
          box-shadow: var(--shadow-md) !important;
        }
        .showroom-card-hover:hover .showroom-image-scale {
          transform: scale(1.05);
        }
        .showroom-image-scale {
          transition: transform 0.4s ease;
        }
      `}} />
    </div>
  );
}
