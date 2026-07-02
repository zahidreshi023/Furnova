import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, CheckCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutPage({ user, csrfToken, cart, onClearCart, showToast }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  // Form States
  const [shipping, setShipping] = useState({
    name: user ? user.name : '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const shippingCost = subtotal > 500 ? 0 : 99.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!shipping.name || !shipping.street || !shipping.city || !shipping.state || !shipping.zip || !shipping.phone) {
      showToast('Please complete all shipping address fields.', 'warning');
      return;
    }

    setLoading(true);
    try {
      // 1. Submit Order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({
          shippingAddress: shipping,
          paymentMethod: paymentMethod,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        showToast(orderData.error || 'Failed to place order.', 'error');
        setLoading(false);
        return;
      }

      // 2. Handle Payment Method
      if (paymentMethod === 'cod') {
        showToast('Order placed successfully with Cash on Delivery!', 'success');
        setSuccessOrder(orderData.order);
        onClearCart();
        setLoading(false);
        return;
      }

      if (paymentMethod === 'razorpay') {
        const rzpRes = await fetch('/api/payments/razorpay/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken,
          },
          body: JSON.stringify({ orderId: orderData.order.id }),
        });
        const rzpData = await rzpRes.json();

        if (!rzpRes.ok) {
          showToast(rzpData.error || 'Failed to initiate Razorpay payment.', 'error');
          setLoading(false);
          return;
        }

        const options = {
          key: rzpData.keyId || 'rzp_test_T8iolO9ScepH95',
          amount: rzpData.amount,
          currency: rzpData.currency || 'INR',
          name: 'Furnova Furniture',
          description: `Order #${orderData.order.id}`,
          order_id: rzpData.id,
          handler: async function (response) {
            try {
              const verifyRes = await fetch('/api/payments/razorpay/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': csrfToken,
                },
                body: JSON.stringify({
                  orderId: orderData.order.id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyRes.ok) {
                showToast('Razorpay payment successful!', 'success');
                setSuccessOrder(verifyData.order);
                onClearCart();
              } else {
                showToast(verifyData.error || 'Payment verification failed.', 'error');
              }
            } catch (err) {
              showToast('Error verifying payment.', 'error');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: shipping.name,
            email: user ? user.email : '',
            contact: shipping.phone,
          },
          theme: {
            color: '#ff7e40',
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              showToast('Payment window closed. Order remains pending.', 'warning');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      showToast('A network error occurred. Please try again.', 'error');
      setLoading(false);
    }
  };

  // Success screen
  if (successOrder) {
    return (
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ color: 'var(--success)', marginBottom: '24px' }}>
          <CheckCircle size={72} style={{ margin: '0 auto' }} />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>Thank you for your order!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Your payment was processed successfully. Order ID: <strong style={{ color: 'var(--text-primary)' }}>{successOrder.id}</strong>. We've sent a receipt to {user.email}.
        </p>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', textAlign: 'left', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Order Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Status:</span><strong>Processing</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Ship To:</span><strong>{successOrder.shippingAddress.name}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Address:</span><strong>{successOrder.shippingAddress.street}, {successOrder.shippingAddress.city}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px', fontSize: '18px' }}><span style={{ fontWeight: 800 }}>Total Paid:</span><strong style={{ color: 'var(--primary)' }}>₹{parseFloat(successOrder.totalAmount).toFixed(2)}</strong></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/account" className="btn btn-primary" style={{ flex: 1 }}>Go to Order History</Link>
          <Link to="/products" className="btn btn-secondary" style={{ flex: 1 }}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div style={{ marginTop: '40px', marginBottom: '24px' }}>
        <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Return to Shopping Cart
        </Link>
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginTop: '16px' }}>Secure Checkout</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="checkout-layout-grid">
          {/* Form details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* 1. Shipping Address */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '32px', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={20} style={{ color: 'var(--primary)' }} /> 1. Shipping Address
              </h3>
              <div className="checkout-shipping-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-control" value={shipping.name} onChange={handleShippingChange} required />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Street Address</label>
                  <input type="text" name="street" className="form-control" placeholder="Apt, Suite, Street name" value={shipping.street} onChange={handleShippingChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" name="city" className="form-control" value={shipping.city} onChange={handleShippingChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">State / Province</label>
                  <input type="text" name="state" className="form-control" value={shipping.state} onChange={handleShippingChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP / Postal Code</label>
                  <input type="text" name="zip" className="form-control" value={shipping.zip} onChange={handleShippingChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" name="phone" className="form-control" value={shipping.phone} onChange={handleShippingChange} required />
                </div>
              </div>
            </div>

            {/* 2. Select Payment Method */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '32px', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={20} style={{ color: 'var(--primary)' }} /> 2. Select Payment Method
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Cash on Delivery Option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '20px',
                    border: `2px solid ${paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: paymentMethod === 'cod' ? 'rgba(255, 126, 64, 0.08)' : 'var(--bg-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                  />
                  <div>
                    <strong style={{ fontSize: '16px', display: 'block', color: 'var(--text-primary)' }}>Cash on Delivery (COD)</strong>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Pay cash upon receiving your furniture delivery at your doorstep.</span>
                  </div>
                </label>

                {/* Razorpay Online Option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '20px',
                    border: `2px solid ${paymentMethod === 'razorpay' ? 'var(--primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: paymentMethod === 'razorpay' ? 'rgba(255, 126, 64, 0.08)' : 'var(--bg-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                  />
                  <div>
                    <strong style={{ fontSize: '16px', display: 'block', color: 'var(--text-primary)' }}>Razorpay (Online Payment)</strong>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Pay securely via UPI, Credit/Debit Card, NetBanking, or Wallets using Razorpay Test Mode.</span>
                  </div>
                </label>
              </div>

              <div style={{ background: 'var(--bg-primary)', display: 'flex', gap: '12px', padding: '16px', borderRadius: 'var(--radius-sm)', marginTop: '24px', border: '1px solid var(--border-color)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                <span>All transactions are 256-bit SSL encrypted. Payment processing is handled securely by Razorpay.</span>
              </div>
            </div>
          </div>

          {/* Cart summary */}
          <div className="summary-panel">
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>Order Details</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px', maxHeight: '200px', overflowY: 'auto' }}>
              {cart.map((item) => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>{item.name} <span style={{ color: 'var(--text-secondary)' }}>x{item.quantity}</span></span>
                  <span style={{ fontWeight: 600 }}>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Shipping Logistics</span>
              <span style={{ fontWeight: 600 }}>
                {shippingCost === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `₹${shippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Sales Tax (8%)</span>
              <span style={{ fontWeight: 600 }}>₹{tax.toFixed(2)}</span>
            </div>

            <div className="summary-row summary-total">
              <span>Total due</span>
              <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '24px' }}
            >
              {loading ? 'Processing Securely...' : paymentMethod === 'cod' ? `Place Order (COD) - ₹${total.toFixed(2)}` : `Pay with Razorpay - ₹${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
