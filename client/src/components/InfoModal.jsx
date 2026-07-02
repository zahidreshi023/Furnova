import React from 'react';
import { X, ShieldCheck, Mail, Phone, Clock, MapPin, Sparkles, Truck } from 'lucide-react';

export default function InfoModal({ topic, contactSettings, onClose }) {
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

  if (!topic) return null;

  // Rich Content Database for all company & support links
  const modalContent = {
    'About Us': {
      subtitle: 'OUR TIMBER PHILOSOPHY AND ARCHITECTURE',
      icon: <Sparkles size={24} style={{ color: 'var(--primary)' }} />,
      content: (
        <div>
          <p style={{ marginBottom: '16px', lineHeight: '1.7' }}>
            Founded in 2026, **Furnova** was established on a simple premise: home furniture should be built to endure for generations, not just seasons. We strictly reject particle boards, MDF veneers, and cheap laminate overlays for our primary framing.
          </p>
          <h4 style={{ margin: '20px 0 10px', fontSize: '16px', fontWeight: 700 }}>Solid Timber Sourcing</h4>
          <p style={{ marginBottom: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            Every piece of timber we use—from our rich American Walnut to our light Scandinavian Ash—is harvested from sustainably managed forests certified by the Forest Stewardship Council (FSC). We track each log from the forest floor to our kilns.
          </p>
          <h4 style={{ margin: '20px 0 10px', fontSize: '16px', fontWeight: 700 }}>Kiln Curing & Construction</h4>
          <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            Our wood undergoes a specialized 14-stage kiln drying cycle, lowering moisture levels to a precise 8% threshold. This structural treatment ensures our furniture remains immune to warping, cracking, or expansion caused by temperature or air humidity changes.
          </p>
        </div>
      )
    },
    'Careers': {
      subtitle: 'JOIN OUR DESIGN SHOWROOMS',
      icon: <Sparkles size={24} style={{ color: 'var(--primary)' }} />,
      content: (
        <div>
          <p style={{ marginBottom: '20px', lineHeight: '1.7' }}>
            We are always looking for passionate woodworkers, showroom designers, and logistics experts. Join us in crafting premium home environments.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <strong style={{ display: 'block', fontSize: '15px' }}>Senior Interior Designer (Full-Time)</strong>
              <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>Showroom: Seattle, WA</span>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>Help clients configure modern spaces using custom layouts and furniture textures.</p>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <strong style={{ display: 'block', fontSize: '15px' }}>Apprentice Cabinet Maker & Joiner</strong>
              <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>Workshop: Portland, OR</span>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>Work alongside master craftsmen to construct drawers, joinery, and framing overlays.</p>
            </div>
          </div>
          <p style={{ marginTop: '24px', fontSize: '13px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Interested in applying? Send your cover letter and portfolio to <strong style={{ color: 'var(--text-primary)' }}>careers@furnova.com</strong>.
          </p>
        </div>
      )
    },
    'Press Kit': {
      subtitle: 'MEDIA RESOURCES AND MEDIA CONTACTS',
      icon: <Sparkles size={24} style={{ color: 'var(--primary)' }} />,
      content: (
        <div>
          <p style={{ marginBottom: '16px', lineHeight: '1.7' }}>
            Access approved Furnova logos, high-resolution product photography packs, brand palettes, and corporate press releases.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            <button className="btn btn-secondary" style={{ width: '100%', padding: '10px', fontSize: '14px' }}>
              Download Logo Pack (.SVG / .PNG)
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', padding: '10px', fontSize: '14px' }}>
              Download Showroom Photography (.ZIP, 140MB)
            </button>
          </div>
          <h4 style={{ margin: '24px 0 8px', fontSize: '15px', fontWeight: 700 }}>Media Contact</h4>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            For PR inquiries or loan arrangements for editorial shoots, contact our communications desk at <strong style={{ color: 'var(--text-primary)' }}>press@furnova.com</strong>.
          </p>
        </div>
      )
    },
    'Store Locations': {
      subtitle: 'VISIT OUR LUXURY SHOWROOMS',
      icon: <MapPin size={24} style={{ color: 'var(--primary)' }} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {settings.showrooms.map((room, idx) => (
            <div style={{ display: 'flex', gap: '12px' }} key={idx}>
              <MapPin size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '16px' }}>{room.name}</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{room.address}</p>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>Hours: {room.hours}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block' }}>Phone: {room.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )
    },
    'Shipping & Delivery': {
      subtitle: 'WHITE-GLOVE DOORSTEP LOGISTICS',
      icon: <Truck size={24} style={{ color: 'var(--primary)' }} />,
      content: (
        <div>
          <p style={{ marginBottom: '16px', lineHeight: '1.7' }}>
            We operate our own in-house logistics network to ensure that your solid timber furniture is handled with care throughout the shipping pipeline.
          </p>
          <h4 style={{ margin: '20px 0 8px', fontSize: '15px', fontWeight: 700 }}>White-Glove Service</h4>
          <p style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Our standard shipping rate of $99 (or free for orders over $500) includes white-glove doorstep delivery. Our drivers will carry the items to your room of choice, assemble all frames, level the legs, and recycle all cardboard packaging.
          </p>
          <h4 style={{ margin: '20px 0 8px', fontSize: '15px', fontWeight: 700 }}>Logistics Timelines</h4>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            In-stock items are dispatched within 3-5 business days. Once your order enters your local hub, our delivery coordinator will call you to schedule a convenient 3-hour delivery window.
          </p>
        </div>
      )
    },
    'Warranty Details': {
      subtitle: 'THE TEN-YEAR STRUCTURAL PROTECTION',
      icon: <ShieldCheck size={24} style={{ color: 'var(--primary)' }} />,
      content: (
        <div>
          <p style={{ marginBottom: '16px', lineHeight: '1.7' }}>
            At Furnova, we believe in the quality of our craftsmanship. Every product comes backed by a comprehensive warranty plan designed to give you peace of mind.
          </p>
          <h4 style={{ margin: '20px 0 8px', fontSize: '15px', fontWeight: 700 }}>What is Covered?</h4>
          <p style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            - **10 Years**: Structural wood joints, timber framing, slat supports, and drawer runners.
            <br />- **3 Years**: Fabric upholstery stitching, zipper seams, foam compression tolerances, and leather wear.
          </p>
          <h4 style={{ margin: '20px 0 8px', fontSize: '15px', fontWeight: 700 }}>Claim Process</h4>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            To report an issue, take photos of the affected joint or structural element and submit a claim ticket via our support desk. We will arrange a craftsman visit or product replacement free of charge.
          </p>
        </div>
      )
    },
    'Returns & Refunds': {
      subtitle: '30-DAY COMFORT ASSURANCES',
      icon: <Truck size={24} style={{ color: 'var(--primary)' }} />,
      content: (
        <div>
          <p style={{ marginBottom: '16px', lineHeight: '1.7' }}>
            We want you to love your new furniture. If it doesn't fit your layout or meet your expectations, we offer a straightforward returns policy.
          </p>
          <h4 style={{ margin: '20px 0 8px', fontSize: '15px', fontWeight: 700 }}>30-Day Window</h4>
          <p style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            You can return any furniture item in original condition within 30 days of delivery. We will arrange a pickup team to retrieve the item directly from your home.
          </p>
          <h4 style={{ margin: '20px 0 8px', fontSize: '15px', fontWeight: 700 }}>Logistics & Processing Fees</h4>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Returns incur a flat $99 return logistics pickup fee, which is deducted from your refund total. Refunds are processed back to the original payment card within 5-7 business days after the item is received and inspected at our distribution center.
          </p>
        </div>
      )
    },
    'Contact Support': {
      subtitle: '24/7 CUSTOMER CARE CENTRE',
      icon: <Mail size={24} style={{ color: 'var(--primary)' }} />,
      content: (
        <div>
          <p style={{ marginBottom: '24px', lineHeight: '1.7' }}>
            Have a question about dimensions, wood oil coatings, or tracking a scheduled delivery? Connect with our dedicated support agents.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '10px', borderRadius: '50%' }}>
                <Phone size={18} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>Phone Hotline</strong>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{settings.phone}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '10px', borderRadius: '50%' }}>
                <Mail size={18} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>Email Support Helpdesk</strong>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{settings.email}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '10px', borderRadius: '50%' }}>
                <Clock size={18} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>Working Hours</strong>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{settings.hours}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  const data = modalContent[topic];
  if (!data) return null;

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
          animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'var(--transition-fast)',
          }}
          title="Close Modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          {data.icon}
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>
            {data.subtitle}
          </span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          {topic}
        </h2>

        {/* Body content */}
        <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
          {data.content}
        </div>
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
