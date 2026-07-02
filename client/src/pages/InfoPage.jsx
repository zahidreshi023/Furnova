import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, MapPin, ShieldCheck, Truck, Mail, Phone, Clock, ChevronRight } from 'lucide-react';

export default function InfoPage({ contactSettings }) {
  const { topic } = useParams();

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

  const topics = {
    'careers': {
      title: 'Careers',
      subtitle: 'Join Our Design Showrooms & Workshops',
      icon: <Sparkles size={22} style={{ color: 'var(--primary)' }} />,
      bgImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&auto=format&fit=crop',
      content: (
        <div>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            At Furnova, we believe that crafting premium spaces starts with passionate individuals. We are always looking for woodworkers, showroom designers, and customer logistics experts who share our dedication to design excellence and quality timber joinery.
          </p>
          
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Current Openings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '17px', color: 'var(--text-primary)' }}>Senior Interior Designer (Full-Time)</strong>
                  <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>Showroom: Seattle, WA</span>
                </div>
                <span style={{ padding: '4px 10px', background: 'rgba(255,126,64,0.1)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600 }}>Design Dept</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.6' }}>Help clients configure modern spaces using custom layouts and luxury furniture textures. Work directly in our flagship design center.</p>
            </div>
            
            <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '17px', color: 'var(--text-primary)' }}>Apprentice Cabinet Maker & Joiner</strong>
                  <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>Workshop: Portland, OR</span>
                </div>
                <span style={{ padding: '4px 10px', background: 'rgba(255,126,64,0.1)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600 }}>Craftsmanship</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.6' }}>Work alongside master craftsmen to construct structural timber frames, joints, drawers, and hand-oil applications.</p>
            </div>
          </div>
          
          <div style={{ marginTop: '40px', padding: '30px', background: 'rgba(255, 126, 64, 0.03)', border: '1px dashed var(--primary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>How to Apply</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Interested in joining our team? Send your cover letter, resume, and portfolio link to our HR desk:
            </p>
            <a href="mailto:careers@furnova.com" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>careers@furnova.com</a>
          </div>
        </div>
      )
    },
    'press-kit': {
      title: 'Press Kit',
      subtitle: 'Official Brand Assets & PR Resources',
      icon: <Sparkles size={22} style={{ color: 'var(--primary)' }} />,
      bgImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&auto=format&fit=crop',
      content: (
        <div>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Welcome to the Furnova Media Center. We provide high-resolution assets, guidelines, and materials for publishers, design blogs, and editorial journalists.
          </p>
          
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Media Assets</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div style={{ padding: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ display: 'block', fontSize: '15px' }}>Official Logo Pack</strong>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '8px 0 16px' }}>Includes SVG and high-resolution PNG variants in light/dark themes.</p>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}>Download Vector Assets</button>
            </div>
            
            <div style={{ padding: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ display: 'block', fontSize: '15px' }}>Editorial Photography</strong>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '8px 0 16px' }}>FSC-certified wood textures, lifestyle catalog, and workshop snaps.</p>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}>Download Images (.ZIP, 140MB)</button>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Press Contacts</h3>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            For all press-related inquiries, interview requests with our lead designers, or to arrange loan furniture pieces for photoshoots, please drop a line to:
          </p>
          <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'inline-block' }}>
            <strong>PR & Communications</strong>
            <br />
            <a href="mailto:press@furnova.com" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-block', marginTop: '4px' }}>press@furnova.com</a>
          </div>
        </div>
      )
    },
    'store-locations': {
      title: 'Store Locations',
      subtitle: 'Visit Our Luxury Design Showrooms',
      icon: <MapPin size={22} style={{ color: 'var(--primary)' }} />,
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop',
      content: (
        <div>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Experience the weight, solid joinery, and premium fabric grades of our handcrafted furniture in person. Walk through configured bedroom, dining, and living sets guided by design experts.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {settings.showrooms.map((room, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', borderBottom: idx < settings.showrooms.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '30px' }}>
                <img 
                  src={room.image} 
                  alt={room.name} 
                  style={{ width: '200px', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', background: '#f1f5f9' }} 
                />
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{room.name}</h3>
                  <p style={{ color: 'var(--text-primary)', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="var(--primary)" /> {room.address}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> {room.hours}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} /> {room.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'shipping-delivery': {
      title: 'Shipping & Delivery',
      subtitle: 'White-Glove Doorstep Delivery & Logistics',
      icon: <Truck size={22} style={{ color: 'var(--primary)' }} />,
      bgImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&auto=format&fit=crop',
      content: (
        <div>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            We operate our own logistics and delivery fleet because we believe premium furniture deserves premium handling. We treat every order with maximum care, from our kiln warehouses straight to your door.
          </p>
          
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>White-Glove Support</h3>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
            Our shipping includes in-home white-glove setup. Our trained logistics specialists will carry the furniture into your home, place it in your room of choice, assemble all structures (beds, tables, drawer attachments), level the base pads, and clean up/recycle all wood crates or packaging boxes.
          </p>
          
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Logistics Timelines</h3>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
            Items currently in inventory are processed and dispatched within 3-5 business days. Once the shipment reaches your municipal hub, our local delivery dispatcher will call you to schedule a convenient 3-hour delivery window.
          </p>
          
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Shipping Rates</h3>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            We offer shipping to all pin codes at a flat rate of ₹99.00. Orders totaling over ₹500.00 qualify for **Free Shipping & Free Assembly** automatically.
          </p>
        </div>
      )
    },
    'warranty-details': {
      title: 'Warranty Details',
      subtitle: 'Our 10-Year Structural Timber Guarantee',
      icon: <ShieldCheck size={22} style={{ color: 'var(--primary)' }} />,
      bgImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&auto=format&fit=crop',
      content: (
        <div>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            At Furnova, we build home centerpieces intended to outlast seasonal trends. We guarantee that all structural components are engineered to endure.
          </p>
          
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>What is Covered?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ padding: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>10-Year Framework</span>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>Covers structural solid wood joints, leg frames, mortise-and-tenon connections, and metal slate supports.</p>
            </div>
            
            <div style={{ padding: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>3-Year Finishes</span>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>Covers velvet/linen upholstery stitching, zipper seams, high-density foam compression, and drawer runners.</p>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Filing a Claim</h3>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
            If you encounter structural shifting, wood cracking, or joint defects, take a photo or brief video and submit it through our support dashboard. Our customer team will review it and dispatch a service craftsman to repair or replace the unit at no charge.
          </p>
        </div>
      )
    },
    'returns-refunds': {
      title: 'Returns & Refunds',
      subtitle: 'Our 30-Day Home Comfort Trial',
      icon: <Truck size={22} style={{ color: 'var(--primary)' }} />,
      bgImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&auto=format&fit=crop',
      content: (
        <div>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            We want you to feel confident in your choice of home furniture. If a table doesn't fit your layout or the sofa fabric conflicts with your wall paint, we are happy to assist with returns.
          </p>
          
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>30-Day Return Window</h3>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
            You can request a return for any product in clean, original condition within 30 days of doorstep delivery. We will schedule our logistics team to pick up the item directly from your room—no packing required.
          </p>
          
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Processing Fees</h3>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            Furniture returns incur a flat return pickup fee of ₹99.00, which is deducted from your refund balance. The remainder is credited back to your original payment method within 5-7 business days of the warehouse inspection.
          </p>
        </div>
      )
    }
  };

  const currentTopicKey = topic ? topic.toLowerCase() : 'careers';
  const data = topics[currentTopicKey] || topics['careers'];

  const sidebarLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Careers', path: '/info/careers', key: 'careers' },
    { label: 'Press Kit', path: '/info/press-kit', key: 'press-kit' },
    { label: 'Store Locations', path: '/info/store-locations', key: 'store-locations' },
    { label: 'Shipping & Delivery', path: '/info/shipping-delivery', key: 'shipping-delivery' },
    { label: 'Warranty Details', path: '/info/warranty-details', key: 'warranty-details' },
    { label: 'Returns & Refunds', path: '/info/returns-refunds', key: 'returns-refunds' },
    { label: 'Contact Support', path: '/contact' }
  ];

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* 1. Header Banner */}
      <section 
        style={{
          position: 'relative',
          padding: '80px 0',
          background: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.8)), url("${data.bgImage}") no-repeat center center/cover`,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
            {data.icon} {data.title}
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 800, color: 'white', margin: '0 0 8px' }}>{data.title}</h1>
          <p style={{ fontSize: '16px', color: 'hsl(210, 15%, 85%)', margin: 0 }}>{data.subtitle}</p>
        </div>
      </section>

      {/* 2. Content Layout Grid */}
      <section className="container" style={{ marginTop: '48px' }}>
        <div className="info-layout-grid">
          {/* Side Menu */}
          <aside style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', position: 'sticky', top: '100px' }}>
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '1px', fontWeight: 700, marginBottom: '16px', paddingLeft: '8px' }}>Company Directory</h4>
            <nav>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {sidebarLinks.map((link, idx) => {
                  const isActive = link.key === currentTopicKey;
                  return (
                    <li key={idx}>
                      <Link 
                        to={link.path}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          fontSize: '14px',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                          textDecoration: 'none',
                          borderRadius: 'var(--radius-sm)',
                          background: isActive ? 'var(--primary-light)' : 'transparent',
                          transition: 'all 0.2s'
                        }}
                      >
                        {link.label}
                        <ChevronRight size={14} style={{ opacity: isActive ? 1 : 0.3 }} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Right Main Content */}
          <article style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '48px' }}>
            {data.content}
          </article>
        </div>
      </section>
    </div>
  );
}
