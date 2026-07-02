import React, { useState } from 'react';
import { KeyRound, Mail, Shield, AlertTriangle } from 'lucide-react';

export default function AdminLoginPage({ onAuthSuccess, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.role !== 'admin') {
          setError('This account does not have administrator access.');
          // Logout the non-admin user immediately
          await fetch('/api/auth/logout', { method: 'POST' });
          setLoading(false);
          return;
        }
        showToast('Welcome back, Administrator.', 'success');
        onAuthSuccess(data.user, data.csrfToken);
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '20px',
    }}>
      {/* Ambient glow effects */}
      <div style={{ position: 'fixed', top: '-200px', right: '-200px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255, 126, 64, 0.08)', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-200px', left: '-200px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.06)', filter: 'blur(120px)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '40px',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #ff7e40, #f97316)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(255, 126, 64, 0.3)',
          }}>
            <Shield size={28} color="white" />
          </div>
          <h1 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
            Admin Portal
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>
            Secure access for store administrators only
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#fca5a5',
          }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-login-email"
                type="email"
                placeholder="admin@furnova.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 42px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255, 126, 64, 0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 42px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255, 126, 64, 0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
              <KeyRound size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #ff7e40, #f97316)',
              color: 'white',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s, transform 0.2s',
              boxShadow: '0 4px 16px rgba(255, 126, 64, 0.3)',
            }}
            onMouseEnter={(e) => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#475569' }}>
          Only authorized administrators can access this portal.
        </p>
      </div>
    </div>
  );
}
