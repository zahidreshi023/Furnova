import React from 'react';
import { Sparkles, ShieldCheck, Heart, Leaf, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* 1. Hero Section */}
      <section 
        className="about-hero" 
        style={{
          position: 'relative',
          padding: '120px 0',
          background: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.75)), url("https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&auto=format&fit=crop") no-repeat center center/cover',
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
            Our Timber Philosophy
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
            Crafted for Generations
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
            Sustainably sourced, kilned to perfection, and assembled using time-honored joinery methods to outlast seasons.
          </p>
        </div>
      </section>

      {/* 2. Core Story & Image Split Section */}
      <section style={{ padding: '80px 0 60px' }}>
        <div className="container about-layout-grid">
          <div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Built to Endure
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: 800, margin: '12px 0 20px', lineHeight: '1.2' }}>
              We strictly reject particle board & MDF veneers.
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '20px', fontSize: '16px' }}>
              Founded in 2026, **Furnova** was established on a simple premise: home furniture should be built to endure for generations, not just seasons. We believe that furniture should tell a story of natural resilience.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px' }}>
              Our design ethos balances clean Scandinavian lines with raw, organic textures. Each tabletop, frame, and headboard is crafted using hand-selected hardwoods, showcasing the natural beauty of the grain.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <img 
              src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop" 
              alt="Craftsman Wood Joinery" 
              style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
            />
            {/* Overlay detail card */}
            <div 
              className="about-cert-card"
              style={{ 
                position: 'absolute', 
                bottom: '-20px', 
                left: '-20px', 
                background: 'white', 
                padding: '24px', 
                borderRadius: 'var(--radius-md)', 
                boxShadow: 'var(--shadow-lg)', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '12px', borderRadius: '50%' }}>
                <Award size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800 }}>Certified Quality</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>FSC-certified timber only</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detail Columns (Grid) */}
      <section style={{ padding: '60px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Production Standards
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: 800, marginTop: '8px' }}>
              How we construct your furniture
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {/* Box 1 */}
            <div style={{ padding: '32px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '20px' }}><Leaf size={32} /></div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Sustainably Sourced</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '14px' }}>
                Every single plank of wood—from our deep American Walnut to our light Scandinavian Ash—is harvested from sustainably managed forests certified by the Forest Stewardship Council (FSC). We track each log from the forest floor directly to our workshops.
              </p>
            </div>

            {/* Box 2 */}
            <div style={{ padding: '32px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '20px' }}><ShieldCheck size={32} /></div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>14-Stage Kiln Curing</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '14px' }}>
                Our lumber undergoes a specialized 14-stage kiln drying cycle, lowering moisture levels to a precise 8% threshold. This structural treatment ensures our furniture remains immune to warping, cracking, or expansion caused by temperature and humidity changes.
              </p>
            </div>

            {/* Box 3 */}
            <div style={{ padding: '32px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '20px' }}><Sparkles size={32} /></div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Traditional Joinery</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '14px' }}>
                We avoid nails and staples for critical load-bearing connections. Instead, our master craftsmen construct each joint using traditional methods like mortise-and-tenon, doweling, and dovetailing. This ensures lifetime stability under weight load.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Full Width Sourcing Showcase Banner */}
      <section className="container" style={{ marginTop: '80px' }}>
        <div className="promo-banner-grid">
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--primary)', filter: 'blur(100px)', opacity: '0.15' }}></div>

          <div>
            <h2 style={{ color: 'white', fontSize: '38px', fontWeight: 800, lineHeight: '1.2', marginBottom: '16px' }}>
              Ethically Harvested, Crafted to Outlast.
            </h2>
            <p style={{ color: 'hsl(210, 15%, 75%)', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px' }}>
              We harvest timber only from regions that enforce active replanting regimes. For every tree harvested for our sofas and tables, three new saplings are planted in their place, ensuring our forests flourish.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Active Reforestation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Organic Wood Oils</span>
              </div>
            </div>
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
