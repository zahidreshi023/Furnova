import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import InfoModal from './components/InfoModal';

// Pages
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AuthPage from './pages/AuthPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import InfoPage from './pages/InfoPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [activeInfoTopic, setActiveInfoTopic] = useState('');
  const [contactSettings, setContactSettings] = useState(null);
  const [brandingSettings, setBrandingSettings] = useState(null);
  const [bannerSettings, setBannerSettings] = useState(null);


  // Show status warnings/toasts
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    // Auto-clear after 4 seconds
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  };

  // Verify active HTTP-Only cookie session on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setCsrfToken(data.csrfToken);
          fetchCart();
        }
        setLoadingSession(false);
      })
      .catch(() => {
        setLoadingSession(false);
      });
  }, []);

  // Fetch contact details, branding, and banners on mount
  useEffect(() => {
    fetch('/api/settings/contact', { cache: 'no-store' })
      .then(res => { if (res.ok) return res.json(); throw new Error('fail'); })
      .then(data => setContactSettings(data))
      .catch(() => {});

    fetch('/api/settings/branding', { cache: 'no-store' })
      .then(res => { if (res.ok) return res.json(); throw new Error('fail'); })
      .then(data => setBrandingSettings(data))
      .catch(() => {});

    fetch('/api/settings/banners', { cache: 'no-store' })
      .then(res => { if (res.ok) return res.json(); throw new Error('fail'); })
      .then(data => setBannerSettings(data))
      .catch(() => {});
  }, []);


  // Fetch cart contents
  const fetchCart = () => {
    fetch('/api/cart')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to load cart');
      })
      .then(data => {
        setCart(data.items || []);
      })
      .catch(err => {});
  };

  const handleAuthSuccess = (userData, token) => {
    setUser(userData);
    setCsrfToken(token);
    fetchCart();
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (response.ok) {
        setUser(null);
        setCsrfToken('');
        setCart([]);
        showToast('Logged out successfully.', 'info');
        // Clear state & reload as mandated by Session Lifecycle guide
        window.location.href = '/';
      }
    } catch (err) {
      showToast('Logout request failed.', 'error');
    }
  };

  // Cart operations
  const handleAddToCart = async (productId, quantity = 1) => {
    if (!user) {
      showToast('Please sign in to add items to your cart.', 'warning');
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart.items);
        showToast('Added item to cart!', 'success');
      } else {
        showToast(data.error || 'Failed to add item.', 'error');
      }
    } catch (err) {
      showToast('Network error updating cart.', 'error');
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart.items);
      } else {
        showToast(data.error || 'Failed to update quantity.', 'error');
      }
    } catch (err) {
      showToast('Network error updating cart.', 'error');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await fetch(`/api/cart/items/${productId}`, {
        method: 'DELETE',
        headers: {
          'x-csrf-token': csrfToken,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart.items);
        showToast('Item removed from cart.', 'info');
      } else {
        showToast(data.error || 'Failed to remove item.', 'error');
      }
    } catch (err) {
      showToast('Network error updating cart.', 'error');
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (productId) => {
    if (!user) {
      showToast('Please sign in to save items to your wishlist.', 'warning');
      return;
    }

    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      showToast('Removed from wishlist.', 'info');
    } else {
      setWishlist([...wishlist, productId]);
      showToast('Added to wishlist!', 'success');
    }
  };

  const handleToggleRole = async () => {
    try {
      const response = await fetch('/api/auth/toggle-role', {
        method: 'POST',
        headers: {
          'x-csrf-token': csrfToken,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        if (data.csrfToken) setCsrfToken(data.csrfToken);
        showToast(`Role switched to ${data.user.role}!`, 'success');
        if (data.user.role === 'admin') {
          window.location.href = '/admin';
        }
      } else {
        showToast(data.error || 'Failed to toggle role.', 'error');
      }
    } catch (err) {
      showToast('Network error toggling role.', 'error');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Determine if we should show header/footer (hide on admin routes)
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  if (loadingSession) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Authenticating Secure Session...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navigation Header - Hidden on admin routes */}
        <HeaderWrapper
          user={user}
          onLogout={handleLogout}
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          brandingSettings={brandingSettings}
        />

        {/* Dynamic Page Routing */}
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onAddToCart={handleAddToCart}
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                  bannerSettings={bannerSettings}
                />
              }
            />
            <Route
              path="/products"
              element={
                <ProductListPage
                  user={user}
                  csrfToken={csrfToken}
                  showToast={showToast}
                  onAddToCart={handleAddToCart}
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                />
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProductDetailPage
                  user={user}
                  csrfToken={csrfToken}
                  onAddToCart={handleAddToCart}
                  showToast={showToast}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  user={user}
                  cart={cart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveFromCart={handleRemoveFromCart}
                  showToast={showToast}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                user ? (
                  <CheckoutPage
                    user={user}
                    csrfToken={csrfToken}
                    cart={cart}
                    onClearCart={handleClearCart}
                    showToast={showToast}
                  />
                ) : (
                  <Navigate to="/login?redirect=checkout" />
                )
              }
            />
            <Route
              path="/account"
              element={
                user ? (
                  <AccountPage
                    user={user}
                    csrfToken={csrfToken}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onRoleToggle={handleToggleRole}
                    showToast={showToast}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* Admin route: shows dashboard if admin, login page if not admin */}
            <Route
              path="/admin/*"
              element={
                user && user.role === 'admin' ? (
                  <AdminPage
                    user={user}
                    csrfToken={csrfToken}
                    showToast={showToast}
                    contactSettings={contactSettings}
                    onSettingsUpdate={setContactSettings}
                    brandingSettings={brandingSettings}
                    onBrandingUpdate={setBrandingSettings}
                    bannerSettings={bannerSettings}
                    onBannerUpdate={setBannerSettings}
                  />
                ) : (
                  <AdminLoginPage
                    onAuthSuccess={handleAuthSuccess}
                    showToast={showToast}
                  />
                )
              }
            />
            <Route
              path="/admin/login"
              element={
                user && user.role === 'admin' ? (
                  <Navigate to="/admin" />
                ) : (
                  <AdminLoginPage
                    onAuthSuccess={handleAuthSuccess}
                    showToast={showToast}
                  />
                )
              }
            />
            {/* Separate user login and signup */}
            <Route
              path="/login"
              element={
                user ? <Navigate to="/account" /> : (
                  <AuthPage
                    onAuthSuccess={handleAuthSuccess}
                    showToast={showToast}
                  />
                )
              }
            />
            <Route
              path="/signup"
              element={
                user ? <Navigate to="/account" /> : (
                  <SignupPage
                    onAuthSuccess={handleAuthSuccess}
                    showToast={showToast}
                  />
                )
              }
            />
            {/* Backward compatibility: /auth redirects to /login */}
            <Route path="/auth" element={<Navigate to="/login" />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/contact"
              element={
                <ContactPage
                  contactSettings={contactSettings}
                  showToast={showToast}
                />
              }
            />
            <Route path="/info/:topic" element={<InfoPage contactSettings={contactSettings} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Global Footer - Hidden on admin routes */}
        <FooterWrapper
          onOpenInfo={setActiveInfoTopic}
          contactSettings={contactSettings}
          brandingSettings={brandingSettings}
        />

        {/* Dynamic Glassmorphic Info Modal */}
        <InfoModal
          topic={activeInfoTopic}
          contactSettings={contactSettings}
          onClose={() => setActiveInfoTopic('')}
        />


        {/* Toast Notification HUD */}
        {toast && (
          <div className="toast">
            <AlertCircle size={18} style={{ color: toast.type === 'error' ? 'var(--error)' : toast.type === 'warning' ? 'var(--primary)' : 'var(--success)' }} />
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </Router>
  );
}

// Wrapper components to hide header/footer on /admin routes
function HeaderWrapper({ user, onLogout, cartCount, wishlistCount, brandingSettings }) {
  // Use window.location to check; re-renders happen on route changes
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const check = () => setIsAdmin(window.location.pathname.startsWith('/admin'));
    check();
    // Listen for popstate to catch back/forward navigation
    window.addEventListener('popstate', check);
    return () => window.removeEventListener('popstate', check);
  }, []);

  // Also re-check on every render (catches programmatic navigations)
  useEffect(() => {
    setIsAdmin(window.location.pathname.startsWith('/admin'));
  });

  if (isAdmin) return null;

  return (
    <Header
      user={user}
      onLogout={onLogout}
      cartCount={cartCount}
      wishlistCount={wishlistCount}
      brandingSettings={brandingSettings}
    />
  );
}

function FooterWrapper({ onOpenInfo, contactSettings, brandingSettings }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const check = () => setIsAdmin(window.location.pathname.startsWith('/admin'));
    check();
    window.addEventListener('popstate', check);
    return () => window.removeEventListener('popstate', check);
  }, []);

  useEffect(() => {
    setIsAdmin(window.location.pathname.startsWith('/admin'));
  });

  if (isAdmin) return null;

  return (
    <Footer
      onOpenInfo={onOpenInfo}
      contactSettings={contactSettings}
      brandingSettings={brandingSettings}
    />
  );
}
