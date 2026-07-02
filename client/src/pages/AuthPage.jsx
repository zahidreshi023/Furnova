import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { KeyRound, Mail, Sparkles, ArrowRight } from 'lucide-react';

export default function AuthPage({ onAuthSuccess, showToast }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirectUrl = searchParams.get('redirect') || '';

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Welcome back to Furnova!', 'success');
        onAuthSuccess(data.user, data.csrfToken);

        // Redirect after successful auth
        if (redirectUrl) {
          const target = redirectUrl.startsWith('/') ? redirectUrl : `/${redirectUrl}`;
          navigate(target);
        } else {
          navigate('/account');
        }
      } else {
        showToast(data.error || 'Authentication failed. Please verify credentials.', 'error');
      }
    } catch (err) {
      showToast('A network error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)' }}>
      <div className="auth-container">
        {/* Decorative Top header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            <Sparkles size={14} /> Furnova Club
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>
            Sign In to Account
          </h2>
        </div>

        {/* Auth form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="auth-email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="auth-password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
              <KeyRound size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '16px' }}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Sign Up <ArrowRight size={14} />
          </Link>
        </p>
      </div>
    </div>
  );
}
