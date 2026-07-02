import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Globe, 
  Activity, 
  TrendingUp, 
  Wallet, 
  Heart, 
  DollarSign, 
  Percent, 
  Bell, 
  Mail, 
  Settings, 
  Menu, 
  Search, 
  User, 
  Plus, 
  Pencil, 
  Trash2, 
  Check, 
  RefreshCw,
  Eye,
  Filter,
  ArrowLeft,
  Tag,
  Image,
  Upload,
  X
} from 'lucide-react';

export default function AdminPage({ user, csrfToken, showToast, contactSettings, onSettingsUpdate, brandingSettings, onBrandingUpdate, bannerSettings, onBannerUpdate }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);

  // Settings Form States
  const [settingsForm, setSettingsForm] = useState({
    phone: '',
    email: '',
    hours: '',
    showrooms: []
  });
  const [showShowroomForm, setShowShowroomForm] = useState(false);
  const [editingShowroomIdx, setEditingShowroomIdx] = useState(null);
  const [showroomForm, setShowroomForm] = useState({
    name: '',
    address: '',
    hours: '',
    phone: '',
    image: ''
  });

  useEffect(() => {
    const defaultSettings = {
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
    const currentSettings = contactSettings || defaultSettings;
    setSettingsForm({
      phone: currentSettings.phone,
      email: currentSettings.email,
      hours: currentSettings.hours,
      showrooms: currentSettings.showrooms
    });
  }, [contactSettings]);

  const handleSaveAllSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Store settings updated successfully.', 'success');
        if (onSettingsUpdate) onSettingsUpdate(data.settings);
      } else {
        showToast(data.error || 'Failed to update settings.', 'error');
      }
    } catch (err) {
      showToast('Network error saving settings.', 'error');
    }
  };

  const handleShowroomEditClick = (idx) => {
    setEditingShowroomIdx(idx);
    setShowroomForm(settingsForm.showrooms[idx]);
    setShowShowroomForm(true);
  };

  const handleShowroomDeleteClick = (idx) => {
    if (!window.confirm('Are you sure you want to delete this showroom?')) return;
    const updated = settingsForm.showrooms.filter((_, i) => i !== idx);
    setSettingsForm({ ...settingsForm, showrooms: updated });
    showToast('Showroom removed from list (Save Settings to commit).', 'info');
  };

  const handleShowroomSubmit = (e) => {
    e.preventDefault();
    if (!showroomForm.name || !showroomForm.address || !showroomForm.hours || !showroomForm.phone) {
      showToast('Showroom name, address, hours, and phone are required.', 'error');
      return;
    }
    let updated;
    if (editingShowroomIdx !== null) {
      updated = settingsForm.showrooms.map((room, i) => i === editingShowroomIdx ? showroomForm : room);
    } else {
      updated = [...settingsForm.showrooms, showroomForm];
    }
    setSettingsForm({ ...settingsForm, showrooms: updated });
    setShowShowroomForm(false);
    setEditingShowroomIdx(null);
    setShowroomForm({ name: '', address: '', hours: '', phone: '', image: '' });
    showToast(editingShowroomIdx !== null ? 'Showroom updated (Save Settings to commit).' : 'Showroom added (Save Settings to commit).', 'success');
  };

  const openAddShowroomClick = () => {
    setEditingShowroomIdx(null);
    setShowroomForm({ name: '', address: '', hours: '', phone: '', image: '' });
    setShowShowroomForm(true);
  };

  // Loading States
  const [loading, setLoading] = useState(false);

  // Edit / Add modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    description: '',
    dimensions: '',
    material: '',
    color: '',
    price: '',
    stock: '',
  });
  const [productFiles, setProductFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Category management states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [newCategoryParentId, setNewCategoryParentId] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingCategoryImage, setEditingCategoryImage] = useState(null);
  const [editingCategoryParentId, setEditingCategoryParentId] = useState('');

  // Branding states
  const [brandingForm, setBrandingForm] = useState({ siteName: '', logoUrl: '' });
  const [logoFile, setLogoFile] = useState(null);

  // Banner states
  const [bannersForm, setBannersForm] = useState([]);
  const [bannerFiles, setBannerFiles] = useState({});

  // Init branding form from props
  useEffect(() => {
    if (brandingSettings) {
      setBrandingForm({ siteName: brandingSettings.siteName || 'Furnova', logoUrl: brandingSettings.logoUrl || '' });
    }
  }, [brandingSettings]);

  // Init banners from props
  useEffect(() => {
    if (bannerSettings && Array.isArray(bannerSettings)) {
      setBannersForm(bannerSettings);
    }
  }, [bannerSettings]);

  // Load everything on mount to support dynamic stats calculations
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchCategories(),
        fetchSettings()
      ]);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const [brandRes, contactRes, bannerRes] = await Promise.all([
        fetch('/api/settings/branding', { cache: 'no-store' }),
        fetch('/api/settings/contact', { cache: 'no-store' }),
        fetch('/api/settings/banners', { cache: 'no-store' }),
      ]);
      if (brandRes.ok && onBrandingUpdate) {
        const data = await brandRes.json();
        onBrandingUpdate(data);
        setBrandingForm({ siteName: data.siteName || 'Furnova', logoUrl: data.logoUrl || '' });
      }
      if (contactRes.ok && onSettingsUpdate) onSettingsUpdate(await contactRes.json());
      if (bannerRes.ok && onBannerUpdate) {
        const data = await bannerRes.json();
        onBannerUpdate(data);
        if (Array.isArray(data)) setBannersForm(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/all');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?flat=true');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this furniture item?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-csrf-token': csrfToken },
      });

      if (res.ok) {
        showToast('Product deleted successfully.', 'success');
        fetchProducts();
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Failed to delete product.', 'error');
      }
    } catch (err) {
      showToast('Network error deleting product.', 'error');
    }
  };

  const handleDeleteAllProducts = async () => {
    if (!window.confirm('⚠️ Are you sure you want to DELETE ALL products? This action cannot be undone!')) return;

    try {
      const res = await fetch('/api/products/all', {
        method: 'DELETE',
        headers: { 'x-csrf-token': csrfToken },
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message, 'success');
        fetchProducts();
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Failed to delete all products.', 'error');
      }
    } catch (err) {
      showToast('Network error.', 'error');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('category', productForm.category);
    formData.append('description', productForm.description);
    formData.append('dimensions', productForm.dimensions);
    formData.append('material', productForm.material);
    formData.append('color', productForm.color);
    formData.append('price', productForm.price);
    formData.append('stock', productForm.stock);
    formData.append('existingImages', JSON.stringify(existingImages));

    // Append new file uploads
    productFiles.forEach(file => {
      formData.append('images', file);
    });

    const url = isEditMode ? `/api/products/${currentProductId}` : '/api/products';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'x-csrf-token': csrfToken },
        body: formData,
      });

      const resData = await res.json();

      if (res.ok) {
        showToast(isEditMode ? 'Product updated successfully.' : 'Product created successfully.', 'success');
        setShowProductModal(false);
        setProductFiles([]);
        setExistingImages([]);
        fetchProducts();
      } else {
        showToast(resData.error || 'Operation failed.', 'error');
      }
    } catch (err) {
      showToast('Network error submitting product data.', 'error');
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setProductForm({
      name: '',
      category: categories.length > 0 ? categories[0].name : '',
      description: '',
      dimensions: '',
      material: '',
      color: '',
      price: '',
      stock: '',
    });
    setProductFiles([]);
    setExistingImages([]);
    setShowProductModal(true);
  };

  const openEditModal = (prod) => {
    setIsEditMode(true);
    setCurrentProductId(prod.id);
    setProductForm({
      name: prod.name,
      category: prod.category,
      description: prod.description,
      dimensions: prod.dimensions || '',
      material: prod.material || '',
      color: prod.color || '',
      price: prod.price,
      stock: prod.stock,
    });
    setExistingImages(prod.images || []);
    setProductFiles([]);
    setShowProductModal(true);
  };

  // Category CRUD
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const formData = new FormData();
      formData.append('name', newCategoryName.trim());
      if (newCategoryParentId) formData.append('parentCategoryId', newCategoryParentId);
      if (newCategoryImage) {
        formData.append('image', newCategoryImage);
      }
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'x-csrf-token': csrfToken },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Category created.', 'success');
        setNewCategoryName('');
        setNewCategoryImage(null);
        setNewCategoryParentId('');
        fetchCategories();
      } else {
        showToast(data.error || 'Failed.', 'error');
      }
    } catch (err) { showToast('Network error.', 'error'); }
  };

  const handleUpdateCategory = async (id) => {
    if (!editingCategoryName.trim()) return;
    try {
      const formData = new FormData();
      formData.append('name', editingCategoryName.trim());
      if (editingCategoryParentId) formData.append('parentCategoryId', editingCategoryParentId);
      if (editingCategoryImage) {
        formData.append('image', editingCategoryImage);
      }
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'x-csrf-token': csrfToken },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Category updated.', 'success');
        setEditingCategoryId(null);
        setEditingCategoryImage(null);
        setEditingCategoryParentId('');
        fetchCategories();
      } else {
        showToast(data.error || 'Failed.', 'error');
      }
    } catch (err) { showToast('Network error.', 'error'); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'x-csrf-token': csrfToken },
      });
      if (res.ok) {
        showToast('Category deleted.', 'success');
        fetchCategories();
      }
    } catch (err) { showToast('Network error.', 'error'); }
  };

  const getCategoryImageUrl = (cat) => {
    if (!cat.image) return null;
    // If it's an absolute URL (unsplash etc), return as-is
    if (cat.image.startsWith('http')) return cat.image;
    // Local upload
    return `http://localhost:5000${cat.image}`;
  };

  // Branding save
  const handleSaveBranding = async () => {
    const formData = new FormData();
    formData.append('siteName', brandingForm.siteName);
    if (logoFile) {
      formData.append('logo', logoFile);
    } else {
      formData.append('logoUrl', brandingForm.logoUrl);
    }
    try {
      const res = await fetch('/api/settings/branding', {
        method: 'PUT',
        headers: { 'x-csrf-token': csrfToken },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Branding updated.', 'success');
        if (onBrandingUpdate) onBrandingUpdate(data.settings);
        setLogoFile(null);
      } else {
        showToast(data.error || 'Failed.', 'error');
      }
    } catch (err) { showToast('Network error.', 'error'); }
  };

  // Banner save
  const handleSaveBanners = async () => {
    const formData = new FormData();
    const bannersToSave = [...bannersForm];
    
    // Append new banner image files and map them
    Object.entries(bannerFiles).forEach(([idx, file]) => {
      formData.append('bannerImages', file);
      bannersToSave[idx]._newFileIndex = file.name;
    });
    
    formData.append('banners', JSON.stringify(bannersToSave));
    try {
      const res = await fetch('/api/settings/banners', {
        method: 'PUT',
        headers: { 'x-csrf-token': csrfToken },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Banners updated.', 'success');
        if (onBannerUpdate) onBannerUpdate(data.banners);
        setBannerFiles({});
      } else {
        showToast(data.error || 'Failed.', 'error');
      }
    } catch (err) { showToast('Network error.', 'error'); }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        showToast('Order status updated successfully.', 'success');
        fetchOrders();
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Failed to update order status.', 'error');
      }
    } catch (err) {
      showToast('Network error updating status.', 'error');
    }
  };

  // Calculations for dynamic dashboard elements
  const getCalculatedEarnings = () => {
    const total = orders.reduce((sum, ord) => sum + parseFloat(ord.totalAmount), 0);
    return total > 0 ? `₹${total.toFixed(2)}` : '₹3,468.96';
  };

  const getCalculatedSales = () => {
    return orders.length > 0 ? orders.length : 82;
  };

  const getRecentActivities = () => {
    const activities = [];
    
    // Process real orders into activities list
    orders.slice(0, 5).forEach((ord, index) => {
      const timeText = index === 0 ? 'Just Now' : index === 1 ? '42 Mins Ago' : `${index} Days Ago`;
      activities.push({
        id: ord.id,
        title: `Order #${ord.id.slice(0, 8)} Updated`,
        description: `Order total: ₹${parseFloat(ord.totalAmount).toFixed(2)} | Status: ${ord.status.toUpperCase()}`,
        time: timeText,
        color: ord.status === 'delivered' ? 'green' : ord.status === 'cancelled' ? 'red' : 'blue',
        user: `Client #${ord.userId}`
      });
    });

    // Default visual items to mirror screenshot aesthetics
    const defaultMocks = [
      { id: 'm1', title: 'Task Updated', description: 'Nikolai updated a Task', time: '42 Mins Ago', color: 'blue', user: 'Nikolai' },
      { id: 'm2', title: 'Deal Added', description: 'Panshi updated a Task', time: '1 Day Ago', color: 'pink', user: 'Panshi' },
      { id: 'm3', title: 'Published Article', description: 'Rasel Published an Article', time: '42 Mins Ago', color: 'blue', user: 'Rasel' },
      { id: 'm4', title: 'Dock Updated', description: 'Reshmi updated a dock', time: '1 Day Ago', color: 'yellow', user: 'Reshmi' },
      { id: 'm5', title: 'Replied Comment', description: 'Jonathon Added a Comment', time: '1 Day Ago', color: 'green', user: 'Jonathon' }
    ];

    return [...activities, ...defaultMocks].slice(0, 5);
  };

  // Views rendering helpers
  const renderDashboardView = () => {
    const calculatedEarnings = getCalculatedEarnings();
    const calculatedSales = getCalculatedSales();
    const activitiesList = getRecentActivities();

    return (
      <div className="dashboard-content-pane">
        {/* ROW 1: Overview and Traffic Doughnut */}
        <div className="dashboard-grid-row1">
          {/* Card 1: Overview */}
          <div className="lector-card monthly-overview-card">
            <div className="monthly-overview-left">
              <div>
                <h3 className="lector-card-title">Dashboard</h3>
                <p className="lector-card-subtitle" style={{ marginBottom: '24px' }}>Overview of Latest Month</p>
                
                <span className="overview-earnings-label">EARNINGS</span>
                <h2 className="overview-earnings-val">{calculatedEarnings}</h2>

                <span className="overview-earnings-label">SALES COUNT</span>
                <h2 className="overview-sales-val">{calculatedSales}</h2>
              </div>
              
              <button className="overview-summary-btn">Last Month Summary</button>
            </div>

            <div className="monthly-overview-right">
              <div className="chart-header">
                <div className="chart-tabs">
                  <span className="chart-tab active">Daily</span>
                  <span className="chart-tab">Weekly</span>
                  <span className="chart-tab">Monthly</span>
                  <span className="chart-tab">Yearly</span>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-dot online"></span>
                    <span>Online</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot store"></span>
                    <span>Store</span>
                  </div>
                </div>
              </div>

              <div className="chart-canvas">
                <svg viewBox="0 0 500 180" width="100%" height="100%">
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#007bff" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#007bff" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff7e40" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#ff7e40" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="30" y1="30" x2="470" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="65" x2="470" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="100" x2="470" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="135" x2="470" y2="135" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="170" x2="470" y2="170" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Blue Area & Line */}
                  <path d="M 30 150 C 70 130, 80 130, 110 115 C 140 100, 150 170, 180 160 C 210 150, 220 90, 250 80 C 280 70, 290 140, 320 130 C 350 120, 360 40, 390 30 C 420 20, 430 90, 470 100 L 470 170 L 30 170 Z" fill="url(#blueGrad)" />
                  <path d="M 30 150 C 70 130, 80 130, 110 115 C 140 100, 150 170, 180 160 C 210 150, 220 90, 250 80 C 280 70, 290 140, 320 130 C 350 120, 360 40, 390 30 C 420 20, 430 90, 470 100" fill="none" stroke="#007bff" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Orange Area & Line */}
                  <path d="M 30 130 C 70 120, 80 120, 110 110 C 140 100, 150 125, 180 120 C 210 115, 220 105, 250 100 C 280 95, 290 90, 320 90 C 350 90, 360 110, 390 105 C 420 100, 430 85, 470 80 L 470 170 L 30 170 Z" fill="url(#orangeGrad)" />
                  <path d="M 30 130 C 70 120, 80 120, 110 110 C 140 100, 150 125, 180 120 C 210 115, 220 105, 250 100 C 280 95, 290 90, 320 90 C 350 90, 360 110, 390 105 C 420 100, 430 85, 470 80" fill="none" stroke="#ff7e40" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Highlights */}
                  <circle cx="390" cy="30" r="5" fill="#007bff" stroke="white" strokeWidth="2" />
                  <circle cx="470" cy="80" r="5" fill="#ff7e40" stroke="white" strokeWidth="2" />
                  
                  {/* Labels */}
                  <text x="30" y="180" fill="#a0aec0" fontSize="8" textAnchor="middle">1</text>
                  <text x="110" y="180" fill="#a0aec0" fontSize="8" textAnchor="middle">2</text>
                  <text x="180" y="180" fill="#a0aec0" fontSize="8" textAnchor="middle">3</text>
                  <text x="250" y="180" fill="#a0aec0" fontSize="8" textAnchor="middle">4</text>
                  <text x="320" y="180" fill="#a0aec0" fontSize="8" textAnchor="middle">5</text>
                  <text x="390" y="180" fill="#a0aec0" fontSize="8" textAnchor="middle">6</text>
                  <text x="470" y="180" fill="#a0aec0" fontSize="8" textAnchor="middle">7</text>
                </svg>
              </div>

              {/* Bottom Stat items */}
              <div className="chart-bottom-stats">
                <div className="bottom-stat-box">
                  <div className="stat-icon-wrapper red">
                    <Wallet size={16} />
                  </div>
                  <div className="stat-details">
                    <span className="stat-label">Wallet Balance</span>
                    <span className="stat-val">₹4,567.53</span>
                  </div>
                </div>

                <div className="bottom-stat-box">
                  <div className="stat-icon-wrapper purple">
                    <Heart size={16} />
                  </div>
                  <div className="stat-details">
                    <span className="stat-label">Referral Earning</span>
                    <span className="stat-val">₹1,689.53</span>
                  </div>
                </div>

                <div className="bottom-stat-box">
                  <div className="stat-icon-wrapper green">
                    <Activity size={16} />
                  </div>
                  <div className="stat-details">
                    <span className="stat-label">Estimate Sales</span>
                    <span className="stat-val">₹2,851.53</span>
                  </div>
                </div>

                <div className="bottom-stat-box">
                  <div className="stat-icon-wrapper pink">
                    <DollarSign size={16} />
                  </div>
                  <div className="stat-details">
                    <span className="stat-label">Earning</span>
                    <span className="stat-val">₹52,567.53</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Traffic doughnut */}
          <div className="lector-card">
            <h3 className="lector-card-title">Traffic</h3>
            <p className="lector-card-subtitle">Distribution of traffic sources</p>
            
            <div className="traffic-chart-container">
              <svg viewBox="0 0 200 200" width="130" height="130">
                {/* Circumference = 2 * pi * 60 = 377 */}
                {/* Youtube 55%: strokeDasharray="207.35 377" */}
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="transparent"
                  stroke="#ff7e40"
                  strokeWidth="16"
                  strokeDasharray="207.35 377"
                  strokeDashoffset="0"
                  transform="rotate(-90 100 100)"
                />
                {/* Facebook 34%: strokeDasharray="128.18 377" */}
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="transparent"
                  stroke="#007bff"
                  strokeWidth="16"
                  strokeDasharray="128.18 377"
                  strokeDashoffset="-207.35"
                  transform="rotate(-90 100 100)"
                />
                {/* Direct 11%: strokeDasharray="41.47 377" */}
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="transparent"
                  stroke="#17a2b8"
                  strokeWidth="16"
                  strokeDasharray="41.47 377"
                  strokeDashoffset="-335.53"
                  transform="rotate(-90 100 100)"
                />
                <text x="100" y="95" textAnchor="middle" fill="#718096" fontSize="10" fontWeight="700">TRAFFIC</text>
                <text x="100" y="115" textAnchor="middle" fill="#1a202c" fontSize="18" fontWeight="800">100%</text>
              </svg>
            </div>

            <div className="traffic-legend-row">
              <div className="traffic-legend-item">
                <span className="traffic-legend-val">34%</span>
                <span className="traffic-legend-label">
                  <span className="legend-dot online" style={{ width: '6px', height: '6px' }}></span>
                  Facebook
                </span>
              </div>
              <div className="traffic-legend-item">
                <span className="traffic-legend-val">55%</span>
                <span className="traffic-legend-label">
                  <span className="legend-dot store" style={{ width: '6px', height: '6px' }}></span>
                  YouTube
                </span>
              </div>
              <div className="traffic-legend-item">
                <span className="traffic-legend-val">11%</span>
                <span className="traffic-legend-label">
                  <span className="legend-dot" style={{ width: '6px', height: '6px', backgroundColor: '#17a2b8' }}></span>
                  Direct
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Four visual sparkline cards */}
        <div className="dashboard-grid-row2">
          {/* Card 1 */}
          <div className="lector-card sparkline-card blue">
            <div className="sparkline-details">
              <span className="sparkline-title">Revenue Status</span>
              <span className="sparkline-value">₹432</span>
              <span className="sparkline-subtext">Jan 01 - Jan 10</span>
            </div>
            <div>
              <svg viewBox="0 0 100 40" width="70" height="30">
                <rect x="0" y="20" width="7" height="20" rx="1.5" fill="#007bff" />
                <rect x="11" y="10" width="7" height="30" rx="1.5" fill="#007bff" />
                <rect x="22" y="25" width="7" height="15" rx="1.5" fill="#007bff" />
                <rect x="33" y="5" width="7" height="35" rx="1.5" fill="#007bff" />
                <rect x="44" y="15" width="7" height="25" rx="1.5" fill="#007bff" />
                <rect x="55" y="30" width="7" height="10" rx="1.5" fill="#007bff" />
                <rect x="66" y="18" width="7" height="22" rx="1.5" fill="#007bff" />
                <rect x="77" y="12" width="7" height="28" rx="1.5" fill="#007bff" />
              </svg>
            </div>
          </div>

          {/* Card 2 */}
          <div className="lector-card sparkline-card yellow">
            <div className="sparkline-details">
              <span className="sparkline-title">Page View</span>
              <span className="sparkline-value">₹432</span>
              <span className="sparkline-subtext">Monthly Average</span>
            </div>
            <div>
              <svg viewBox="0 0 100 40" width="75" height="30">
                <defs>
                  <linearGradient id="yellowSp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,35 Q15,10 30,28 T60,12 T90,20 L100,40 L0,40 Z" fill="url(#yellowSp)" />
                <path d="M0,35 Q15,10 30,28 T60,12 T90,20" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Card 3 */}
          <div className="lector-card sparkline-card orange">
            <div className="sparkline-details">
              <span className="sparkline-title">Bounce Rate</span>
              <span className="sparkline-value">₹432</span>
              <select className="bounce-select" defaultValue="Monthly" disabled>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
            <div>
              <svg viewBox="0 0 100 40" width="75" height="30">
                <path d="M5,25 Q20,10 35,28 T65,12 T95,30" fill="none" stroke="#ff7e40" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="5" cy="25" r="3" fill="#ff7e40" />
                <circle cx="35" cy="28" r="3" fill="#ff7e40" />
                <circle cx="65" cy="12" r="3" fill="#ff7e40" />
                <circle cx="95" cy="30" r="3" fill="#ff7e40" />
              </svg>
            </div>
          </div>

          {/* Card 4 */}
          <div className="lector-card sparkline-card purple">
            <div className="sparkline-details">
              <span className="sparkline-title">Revenue Status</span>
              <span className="sparkline-value">₹432</span>
              <span className="sparkline-subtext">Jan 01 - Jan 10</span>
            </div>
            <div>
              <svg viewBox="0 0 100 40" width="70" height="30">
                <rect x="0" y="15" width="7" height="25" rx="1.5" fill="#a855f7" />
                <rect x="11" y="25" width="7" height="15" rx="1.5" fill="#a855f7" />
                <rect x="22" y="5" width="7" height="35" rx="1.5" fill="#a855f7" />
                <rect x="33" y="20" width="7" height="20" rx="1.5" fill="#a855f7" />
                <rect x="44" y="10" width="7" height="30" rx="1.5" fill="#a855f7" />
                <rect x="55" y="18" width="7" height="22" rx="1.5" fill="#a855f7" />
                <rect x="66" y="30" width="7" height="10" rx="1.5" fill="#a855f7" />
                <rect x="77" y="15" width="7" height="25" rx="1.5" fill="#a855f7" />
              </svg>
            </div>
          </div>
        </div>

        {/* ROW 3: Recent Activities and Order Status logs */}
        <div className="dashboard-grid-row3">
          {/* Card 1: Activities */}
          <div className="lector-card">
            <h3 className="lector-card-title">Recent Activities</h3>
            <p className="lector-card-subtitle">Log of operations & client updates</p>
            
            <div className="timeline-list">
              {activitiesList.map((act) => (
                <div className="timeline-item" key={act.id}>
                  <span className={`timeline-dot ${act.color}`}></span>
                  <div className="timeline-content">
                    <div className="timeline-text">
                      <span className="timeline-title-text">{act.title}</span>
                      <span className="timeline-desc-text">{act.description}</span>
                    </div>
                    <span className="timeline-time">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Order Status Summary */}
          <div className="lector-card">
            <div className="order-status-card-header">
              <div>
                <h3 className="lector-card-title">Order Status</h3>
                <p className="lector-card-subtitle">Overview of Latest Month</p>
              </div>
              <div className="order-status-actions">
                <button className="action-pill-btn" onClick={() => setActiveTab('orders')}>
                  <Plus size={13} /> Add Order
                </button>
                <div className="icon-box-btn" onClick={fetchAllData}>
                  <RefreshCw size={13} />
                </div>
                <input type="text" className="order-search-input" placeholder="Search orders..." disabled />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="lector-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Customer</th>
                    <th>From</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    // Default values to exactly mirror Lector dashboard layout
                    <>
                      <tr>
                        <td className="invoice-id">#12386</td>
                        <td>Charly Dues</td>
                        <td>Brazil</td>
                        <td className="price-text">₹299.00</td>
                        <td><span className="status-badge process">Process</span></td>
                      </tr>
                      <tr>
                        <td className="invoice-id">#12387</td>
                        <td>Marko</td>
                        <td>Italy</td>
                        <td className="price-text">₹2,542.00</td>
                        <td><span className="status-badge open">Open</span></td>
                      </tr>
                      <tr>
                        <td className="invoice-id">#12388</td>
                        <td>Denyel Onak</td>
                        <td>Russia</td>
                        <td className="price-text">₹981.00</td>
                        <td><span className="status-badge on-hold">On Hold</span></td>
                      </tr>
                      <tr>
                        <td className="invoice-id">#12389</td>
                        <td>Belgin Bastana</td>
                        <td>Korea</td>
                        <td className="price-text">₹369.00</td>
                        <td><span className="status-badge process">Process</span></td>
                      </tr>
                      <tr>
                        <td className="invoice-id">#12390</td>
                        <td>Sarti Onuska</td>
                        <td>Japan</td>
                        <td className="price-text">₹1,240.00</td>
                        <td><span className="status-badge open">Open</span></td>
                      </tr>
                    </>
                  ) : (
                    // Real data mapped to Lector design specs
                    orders.slice(0, 5).map((ord) => {
                      // Determine status class matching Lector color schema
                      let statusClass = 'process';
                      let statusLabel = 'Process';

                      if (ord.status === 'delivered') {
                        statusClass = 'open';
                        statusLabel = 'Open';
                      } else if (ord.status === 'shipped') {
                        statusClass = 'on-hold';
                        statusLabel = 'On Hold';
                      } else if (ord.status === 'processing') {
                        statusClass = 'complete';
                        statusLabel = 'Processing';
                      } else if (ord.status === 'cancelled') {
                        statusClass = 'cancelled';
                        statusLabel = 'Cancelled';
                      }

                      return (
                        <tr key={ord.id}>
                          <td className="invoice-id">#{ord.id.slice(0, 6)}</td>
                          <td>Client #{ord.userId}</td>
                          <td>Online Store</td>
                          <td className="price-text">₹{parseFloat(ord.totalAmount).toFixed(2)}</td>
                          <td><span className={`status-badge ${statusClass}`}>{statusLabel}</span></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mock Pagination */}
            <div className="table-pagination">
              <span className="pagination-item active">1</span>
              <span className="pagination-item">2</span>
              <span className="pagination-item">3</span>
              <span className="pagination-item">4</span>
              <span className="pagination-item">5</span>
              <span className="pagination-item">&gt;</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProductsView = () => {
    return (
      <div className="lector-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 className="lector-card-title" style={{ fontSize: '20px' }}>Catalog Products</h3>
            <p className="lector-card-subtitle" style={{ margin: 0 }}>Add, edit, or remove home furniture items from inventory</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {products.length > 0 && (
              <button className="action-pill-btn" onClick={handleDeleteAllProducts} style={{ padding: '8px 16px', fontSize: '13px', background: '#ef4444', borderColor: '#ef4444', color: '#fff' }}>
                <Trash2 size={14} /> Delete All
              </button>
            )}
            <button className="action-pill-btn" onClick={openAddModal} style={{ padding: '8px 16px', fontSize: '13px' }}>
              <Plus size={14} /> Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid #ff7e40', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="lector-table">
              <thead>
                <tr>
                  <th>Item Details</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Capacity</th>
                  <th>Avg Rating</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={prod.images && prod.images.length > 0 ? (prod.images[0].startsWith('http') ? prod.images[0] : `http://localhost:5000${prod.images[0]}`) : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=60&auto=format&fit=crop'}
                          alt={prod.name}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', background: '#f8fafc' }}
                        />
                        <div>
                          <strong style={{ fontSize: '13px', display: 'block', color: '#1a202c' }}>{prod.name}</strong>
                          <span style={{ fontSize: '11px', color: '#718096' }}>ID: {prod.id}</span>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568' }}>{prod.category}</span></td>
                    <td style={{ fontWeight: 700, color: '#ff7e40' }}>₹{parseFloat(prod.price).toFixed(2)}</td>
                    <td style={{ color: prod.stock === 0 ? '#ef4444' : '#2d3748', fontWeight: 600 }}>
                      {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} units`}
                    </td>
                    <td style={{ fontWeight: 600 }}>{prod.ratings > 0 ? `${prod.ratings.toFixed(1)} ★` : 'Unrated'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="icon-box-btn" onClick={() => openEditModal(prod)} title="Edit Product">
                          <Pencil size={12} />
                        </button>
                        <button className="icon-box-btn" style={{ color: '#ef4444', borderColor: '#fecaca' }} onClick={() => handleProductDelete(prod.id)} title="Delete Product">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderOrdersView = () => {
    return (
      <div className="lector-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 className="lector-card-title" style={{ fontSize: '20px' }}>Client Transactions</h3>
            <p className="lector-card-subtitle" style={{ margin: 0 }}>Review purchase details and update package delivery logistics</p>
          </div>
          <div className="icon-box-btn" onClick={fetchAllData}>
            <RefreshCw size={13} />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid #ff7e40', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : orders.length === 0 ? (
          <p style={{ color: '#718096', textAlign: 'center', padding: '40px 0', fontSize: '14px' }}>No orders have been submitted yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="lector-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Client Account</th>
                  <th>Items Purchased</th>
                  <th>Grand Total</th>
                  <th>Payment Status</th>
                  <th>Delivery Logistics</th>
                  <th style={{ textAlign: 'right' }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700 }}>#{ord.id.slice(0, 8).toUpperCase()}</td>
                    <td>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Client #{ord.userId}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: '#4a5568' }}>
                        {ord.items.reduce((sum, i) => sum + i.quantity, 0)} units
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#ff7e40' }}>₹{parseFloat(ord.totalAmount).toFixed(2)}</td>
                    <td>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        background: ord.paymentStatus === 'paid' ? '#dcfce7' : ord.paymentStatus === 'failed' ? '#fee2e2' : '#f1f5f9',
                        color: ord.paymentStatus === 'paid' ? '#15803d' : ord.paymentStatus === 'failed' ? '#b91c1c' : '#475569'
                      }}>
                        {ord.paymentStatus} ({ord.paymentMethod || 'cod'})
                      </span>
                    </td>
                    <td>
                      <span style={{
                        textTransform: 'uppercase',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: ord.status === 'delivered' ? '#16a34a' : ord.status === 'cancelled' ? '#dc2626' : '#2563eb'
                      }}>
                        {ord.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => handleOrderStatusUpdate(ord.id, e.target.value)}
                          style={{ 
                            padding: '6px 10px', 
                            borderRadius: '6px', 
                            border: '1px solid #cbd5e1', 
                            fontSize: '12px', 
                            background: '#ffffff',
                            fontWeight: 600,
                            color: '#1a202c',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Categories management view
  const renderCategoriesView = () => {
    return (
      <div className="lector-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 className="lector-card-title" style={{ fontSize: '20px' }}>Category Management</h3>
            <p className="lector-card-subtitle" style={{ margin: 0 }}>Add, edit, or remove product categories with images</p>
          </div>
        </div>

        {/* Add Category Form */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', padding: '20px', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '12px', border: '1px dashed #cbd5e1', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
            <label className="form-label" style={{ marginBottom: '6px', fontSize: '12px', fontWeight: 600 }}>Category Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Dining Sets"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
          </div>
          <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
            <label className="form-label" style={{ marginBottom: '6px', fontSize: '12px', fontWeight: 600 }}>Parent Category (Optional)</label>
            <select
              className="form-control"
              value={newCategoryParentId}
              onChange={(e) => setNewCategoryParentId(e.target.value)}
            >
              <option value="">-- None (Top Level) --</option>
              {categories.filter(c => !c.parentCategoryId).map(pCat => (
                <option key={pCat.id || pCat._id} value={pCat.id || pCat._id}>{pCat.name}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: '1 1 220px', minWidth: '180px' }}>
            <label className="form-label" style={{ marginBottom: '6px', fontSize: '12px', fontWeight: 600 }}>Category Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>
                <Upload size={14} />
                {newCategoryImage ? newCategoryImage.name.slice(0, 20) : 'Choose image...'}
                <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={(e) => setNewCategoryImage(e.target.files[0] || null)} />
              </label>
              {newCategoryImage && (
                <img src={URL.createObjectURL(newCategoryImage)} alt="Preview" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
              )}
            </div>
          </div>
          <button className="action-pill-btn" onClick={handleAddCategory} style={{ padding: '9px 20px', fontSize: '13px', whiteSpace: 'nowrap', height: '38px' }}>
            <Plus size={14} /> Add Category
          </button>
        </div>

        {/* Category Table */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 120px', gap: '16px', alignItems: 'center', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Image</span>
            <span>Category Name</span>
            <span>Parent</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {/* Table Rows */}
          {categories.sort((a, b) => {
            if (!a.parentCategoryId && b.parentCategoryId) return -1;
            if (a.parentCategoryId && !b.parentCategoryId) return 1;
            return a.name.localeCompare(b.name);
          }).map(cat => {
            const catId = cat.id || cat._id;
            const imgUrl = getCategoryImageUrl(cat);
            const isEditing = editingCategoryId === catId;
            const parentCat = cat.parentCategory || categories.find(c => (c.id || c._id) === cat.parentCategoryId);

            return (
              <div key={catId} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 120px', gap: '16px', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', background: isEditing ? '#fffbf5' : '#fff', transition: 'background 0.2s', borderLeft: cat.parentCategoryId ? '4px solid var(--primary)' : '4px solid transparent' }}>
                {/* Thumbnail */}
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {imgUrl ? (
                    <img src={imgUrl} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Image size={20} style={{ color: '#94a3b8' }} />
                  )}
                  {isEditing && (
                    <label style={{ position: 'absolute', cursor: 'pointer' }}>
                      <Upload size={14} style={{ color: '#ff7e40' }} />
                      <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={(e) => setEditingCategoryImage(e.target.files[0] || null)} />
                    </label>
                  )}
                </div>

                {/* Name */}
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory(catId)}
                      style={{ fontSize: '14px', padding: '6px 10px' }}
                    />
                  ) : (
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#1a202c' }}>{cat.name}</span>
                  )}
                  {isEditing && editingCategoryImage && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      <img src={URL.createObjectURL(editingCategoryImage)} alt="New" style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }} />
                      {editingCategoryImage.name.slice(0, 20)}
                    </div>
                  )}
                </div>

                {/* Parent */}
                <div>
                  {isEditing ? (
                    <select
                      className="form-control"
                      value={editingCategoryParentId}
                      onChange={(e) => setEditingCategoryParentId(e.target.value)}
                      style={{ fontSize: '13px', padding: '6px 10px' }}
                    >
                      <option value="">-- None (Top Level) --</option>
                      {categories.filter(c => !c.parentCategoryId && (c.id || c._id) !== catId).map(pCat => (
                        <option key={pCat.id || pCat._id} value={pCat.id || pCat._id}>{pCat.name}</option>
                      ))}
                    </select>
                  ) : (
                    parentCat ? (
                      <span style={{ fontSize: '13px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '12px', color: '#64748b' }}>
                        {parentCat.name}
                      </span>
                    ) : (
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>Top Level</span>
                    )
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  {isEditing ? (
                    <>
                      <button className="action-pill-btn" onClick={() => handleUpdateCategory(catId)} style={{ padding: '5px 12px', fontSize: '12px' }}>
                        <Check size={12} /> Save
                      </button>
                      <button className="icon-box-btn" onClick={() => { setEditingCategoryId(null); setEditingCategoryImage(null); }} title="Cancel" style={{ padding: '5px 8px' }}><X size={14} /></button>
                    </>
                  ) : (
                    <>
                      <button className="icon-btn-small" onClick={() => {
                        setEditingCategoryId(catId);
                        setEditingCategoryName(cat.name);
                        setEditingCategoryParentId(cat.parentCategoryId || '');
                        setEditingCategoryImage(null);
                      }} title="Edit Category">
                        <Pencil size={14} />
                      </button>
                      <button className="icon-btn-small delete" onClick={() => handleDeleteCategory(catId)} title="Delete Category">
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {categories.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
              No categories found. Add your first category above.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSettingsView = () => {
    return (
      <div className="lector-card">
        <h3 className="lector-card-title" style={{ fontSize: '20px', marginBottom: '24px' }}>Store Configuration</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Branding Settings */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px', color: '#2d3748' }}>Branding</h4>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveBranding(); }}>
              <div className="form-group">
                <label className="form-label">Store Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={brandingForm.siteName} 
                  onChange={(e) => setBrandingForm({ ...brandingForm, siteName: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Store Logo</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {(logoFile || brandingForm.logoUrl) && (
                    <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'inline-block' }}>
                      <img 
                        src={logoFile ? URL.createObjectURL(logoFile) : (brandingForm.logoUrl.startsWith('http') ? brandingForm.logoUrl : `http://localhost:5000${brandingForm.logoUrl}`)} 
                        alt="Logo Preview" 
                        style={{ height: '40px', objectFit: 'contain' }} 
                      />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => { if (e.target.files[0]) setLogoFile(e.target.files[0]); }} 
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="action-pill-btn" style={{ marginTop: '10px' }}>
                <Check size={14} /> Update Branding
              </button>
            </form>
          </div>

          {/* Contact Settings */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px', color: '#2d3748' }}>Contact Info</h4>
            <form onSubmit={handleSaveAllSettings}>
              <div className="form-group">
                <label className="form-label">Support Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={settingsForm.email} 
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Support Phone</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={settingsForm.phone} 
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Business Hours</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={settingsForm.hours} 
                  onChange={(e) => setSettingsForm({ ...settingsForm, hours: e.target.value })} 
                />
              </div>
              <button type="submit" className="action-pill-btn" style={{ marginTop: '10px' }}>
                <Check size={14} /> Update Contact Info
              </button>
            </form>
          </div>
        </div>

        {/* Showrooms */}
        <div style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#2d3748', margin: 0 }}>Showrooms</h4>
            <button className="action-pill-btn" onClick={openAddShowroomClick} style={{ padding: '6px 12px', fontSize: '12px' }}>
              <Plus size={12} /> Add Showroom
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {settingsForm.showrooms.map((room, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                  <button className="icon-box-btn" style={{ width: '24px', height: '24px' }} onClick={() => handleShowroomEditClick(idx)} title="Edit"><Pencil size={10} /></button>
                  <button className="icon-box-btn" style={{ width: '24px', height: '24px', color: '#ef4444', borderColor: '#fecaca' }} onClick={() => handleShowroomDeleteClick(idx)} title="Delete"><Trash2 size={10} /></button>
                </div>
                <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 8px 0', color: '#1a202c', paddingRight: '50px' }}>{room.name}</h5>
                <p style={{ fontSize: '12px', color: '#718096', margin: '0 0 4px 0' }}>{room.address}</p>
                <p style={{ fontSize: '12px', color: '#718096', margin: '0 0 4px 0' }}>{room.phone}</p>
                <p style={{ fontSize: '12px', color: '#718096', margin: 0 }}>{room.hours}</p>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleSaveAllSettings} style={{ background: '#ff7e40', borderColor: '#ff7e40', fontSize: '13px', padding: '8px 20px' }}>
              Save Showrooms & Contact Info
            </button>
          </div>
        </div>

        {/* Showroom Modal Form */}
        {showShowroomForm && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>{editingShowroomIdx !== null ? 'Edit Showroom' : 'Add Showroom'}</h3>
              <form onSubmit={handleShowroomSubmit}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" value={showroomForm.name} onChange={e => setShowroomForm({...showroomForm, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" value={showroomForm.address} onChange={e => setShowroomForm({...showroomForm, address: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="text" className="form-control" value={showroomForm.phone} onChange={e => setShowroomForm({...showroomForm, phone: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Hours</label>
                  <input type="text" className="form-control" value={showroomForm.hours} onChange={e => setShowroomForm({...showroomForm, hours: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input type="text" className="form-control" value={showroomForm.image} onChange={e => setShowroomForm({...showroomForm, image: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowShowroomForm(false)}>Cancel</button>
                  <button type="submit" className="action-pill-btn"><Check size={14}/> Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBannersView = () => {
    return (
      <div className="lector-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 className="lector-card-title" style={{ fontSize: '20px' }}>Home Page Banners</h3>
            <p className="lector-card-subtitle" style={{ margin: 0 }}>Manage sliding banners on the homepage hero section</p>
          </div>
          <button className="action-pill-btn" onClick={() => setBannersForm([...bannersForm, { title: 'New Banner', subtitle: 'Banner description', buttonText: 'Shop Now', link: '/products', imageUrl: '' }])} style={{ padding: '8px 16px', fontSize: '13px' }}>
            <Plus size={14} /> Add Banner
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {bannersForm.map((banner, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
                {idx > 0 && (
                  <button className="icon-box-btn" style={{ width: '28px', height: '28px' }} onClick={() => {
                    const newBanners = [...bannersForm];
                    const temp = newBanners[idx - 1];
                    newBanners[idx - 1] = newBanners[idx];
                    newBanners[idx] = temp;
                    setBannersForm(newBanners);
                  }} title="Move Up">↑</button>
                )}
                {idx < bannersForm.length - 1 && (
                  <button className="icon-box-btn" style={{ width: '28px', height: '28px' }} onClick={() => {
                    const newBanners = [...bannersForm];
                    const temp = newBanners[idx + 1];
                    newBanners[idx + 1] = newBanners[idx];
                    newBanners[idx] = temp;
                    setBannersForm(newBanners);
                  }} title="Move Down">↓</button>
                )}
                <button className="icon-box-btn" style={{ width: '28px', height: '28px', color: '#ef4444', borderColor: '#fecaca' }} onClick={() => {
                  if (window.confirm('Remove this banner?')) {
                    setBannersForm(bannersForm.filter((_, i) => i !== idx));
                    const newFiles = { ...bannerFiles };
                    delete newFiles[idx];
                    setBannerFiles(newFiles);
                  }
                }} title="Delete"><Trash2 size={12} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingRight: '120px' }}>
                <div className="form-group">
                  <label className="form-label">Banner Title</label>
                  <input type="text" className="form-control" value={banner.title} onChange={e => { const newBanners = [...bannersForm]; newBanners[idx].title = e.target.value; setBannersForm(newBanners); }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Subtitle / Description</label>
                  <input type="text" className="form-control" value={banner.subtitle} onChange={e => { const newBanners = [...bannersForm]; newBanners[idx].subtitle = e.target.value; setBannersForm(newBanners); }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Button Text</label>
                  <input type="text" className="form-control" value={banner.buttonText} onChange={e => { const newBanners = [...bannersForm]; newBanners[idx].buttonText = e.target.value; setBannersForm(newBanners); }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Button Link URL</label>
                  <input type="text" className="form-control" value={banner.link} onChange={e => { const newBanners = [...bannersForm]; newBanners[idx].link = e.target.value; setBannersForm(newBanners); }} />
                </div>
                
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Banner Background Image</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {(bannerFiles[idx] || banner.imageUrl) && (
                      <img 
                        src={bannerFiles[idx] ? URL.createObjectURL(bannerFiles[idx]) : (banner.imageUrl?.startsWith('http') ? banner.imageUrl : (banner.imageUrl ? `http://localhost:5000${banner.imageUrl}` : ''))} 
                        alt="Banner Preview" 
                        style={{ width: '150px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} 
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => { 
                          if (e.target.files[0]) {
                            setBannerFiles({ ...bannerFiles, [idx]: e.target.files[0] });
                          }
                        }} 
                        style={{ fontSize: '13px' }}
                      />
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0' }}>Recommended size: 1920x600 pixels</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {bannersForm.length === 0 && <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>No banners configured.</p>}
        </div>
        
        <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleSaveBanners} style={{ background: '#ff7e40', borderColor: '#ff7e40', fontSize: '13px', padding: '10px 24px' }}>
            Save All Banners
          </button>
        </div>
      </div>
    );
  };

  const renderProductModal = () => {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: '600px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', color: '#1a202c', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            {isEditMode ? 'Edit Furniture Item' : 'Add Furniture Item'}
          </h3>

          <form onSubmit={handleProductSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxHeight: '420px', overflowY: 'auto', paddingRight: '10px' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Product Name</label>
                <input type="text" className="form-control" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-control" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                  {categories.map(cat => (
                    <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Material composition</label>
                <input type="text" className="form-control" placeholder="e.g. Solid Walnut Wood" value={productForm.material} onChange={(e) => setProductForm({ ...productForm, material: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Color</label>
                <input type="text" className="form-control" placeholder="e.g. Royal Blue" value={productForm.color} onChange={(e) => setProductForm({ ...productForm, color: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Dimensions specs</label>
                <input type="text" className="form-control" placeholder="e.g. 100cm x 150cm" value={productForm.dimensions} onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Unit Price ($)</label>
                <input type="number" step="0.01" className="form-control" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Starting Stock Quantity</label>
                <input type="number" className="form-control" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required />
              </div>

              {/* File Upload for Images */}
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Product Images (Upload from device)</label>
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}
                  onClick={() => document.getElementById('product-image-upload').click()}
                >
                  <Upload size={24} style={{ color: '#94a3b8', marginBottom: '8px' }} />
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Click to upload or drag images here</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0' }}>JPEG, PNG, WebP • Max 5MB each</p>
                </div>
                <input
                  id="product-image-upload"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={(e) => setProductFiles(prev => [...prev, ...Array.from(e.target.files)])}
                />
                {/* Preview new files */}
                {productFiles.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {productFiles.map((file, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '60px', height: '60px' }}>
                        <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                        <button type="button" onClick={() => setProductFiles(prev => prev.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} /></button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Show existing images in edit mode */}
                {existingImages.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Existing images:</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {existingImages.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '60px', height: '60px' }}>
                          <img src={img} alt="existing" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                          <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Detailed Description</label>
                <textarea className="form-control" rows="3" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required></textarea>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button type="button" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setShowProductModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13px', background: '#ff7e40', borderColor: '#ff7e40' }}>{isEditMode ? 'Save Modifications' : 'Create Item'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="lector-admin-container">
      {/* Sidebar navigation */}
      <aside className="lector-sidebar">
        <div className="sidebar-logo-container">
          <div className="logo-icon-circle">
            <Activity size={16} color="white" />
          </div>
          <span className="logo-text">Furnova.</span>
        </div>

        <div className="sidebar-menu">
          <div className="menu-group-title">Core Navigation</div>
          <div 
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
          <div 
            className={`menu-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            <span>Catalog Products</span>
          </div>
          <div 
            className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={18} />
            <span>Client Orders</span>
          </div>
          <div 
            className={`menu-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Tag size={18} />
            <span>Categories</span>
          </div>
          
          <div className="menu-group-title">Management</div>
          <div 
            className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>Store Settings</span>
          </div>
          <div 
            className={`menu-item ${activeTab === 'banners' ? 'active' : ''}`}
            onClick={() => setActiveTab('banners')}
          >
            <Image size={18} />
            <span>Banner Slider</span>
          </div>
          
          <div className="menu-group-title">System Actions</div>
          <div className="menu-item return-btn" onClick={() => window.location.href = '/'}>
            <ArrowLeft size={18} />
            <span>Return to Store</span>
          </div>
        </div>
      </aside>

      {/* Main content workspace */}
      <div className="lector-workspace">
        <header className="lector-header">
          <div className="header-left">
            <Menu size={20} className="hamburger-btn" />
            <span className="header-title">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'products' ? 'Furniture Catalog' : activeTab === 'orders' ? 'Order Logistics' : activeTab === 'categories' ? 'Categories' : activeTab === 'banners' ? 'Banner Slider' : 'Store Settings'}
            </span>
          </div>
          <div className="header-right">
            <div className="search-box">
              <Search size={16} color="#718096" />
              <input type="text" placeholder="Search dashboard..." disabled />
            </div>
            
            <div className="icon-badge">
              <Mail size={18} />
              <span className="badge">3</span>
            </div>
            <div className="icon-badge">
              <Bell size={18} />
              <span className="badge">5</span>
            </div>
            
            <div className="header-user-profile">
              <div className="avatar-circle">
                <User size={16} />
              </div>
              <div className="user-info-text">
                <span className="user-email">{user?.email || 'admin@furnova.com'}</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <main className="lector-content">
          {activeTab === 'dashboard' && renderDashboardView()}
          {activeTab === 'products' && renderProductsView()}
          {activeTab === 'orders' && renderOrdersView()}
          {activeTab === 'categories' && renderCategoriesView()}
          {activeTab === 'settings' && renderSettingsView()}
          {activeTab === 'banners' && renderBannersView()}
        </main>
      </div>
      
      {/* Product Add/Edit Modal */}
      {showProductModal && renderProductModal()}

      {/* Embedded CSS style declarations */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Lector Admin Dashboard styling stylesheet */
        .lector-admin-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #f4f6fa;
          z-index: 9999;
          display: flex;
          overflow: hidden;
          font-family: 'Outfit', 'Inter', sans-serif;
          color: #2d3748;
        }

        .lector-sidebar {
          width: 260px;
          height: 100%;
          background-color: #0b132b;
          color: #a0aec0;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          overflow-y: auto;
        }

        .sidebar-logo-container {
          height: 70px;
          display: flex;
          align-items: center;
          padding: 0 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          gap: 12px;
        }

        .logo-icon-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff7e40 0%, #ff4b2b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .sidebar-menu {
          padding: 20px 0;
          flex: 1;
        }

        .menu-group-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #4a5568;
          padding: 16px 24px 8px 24px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 12px 24px;
          gap: 14px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          color: #a0aec0;
        }

        .menu-item:hover {
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.03);
        }

        .menu-item.active {
          color: #ffffff;
          background-color: #131e3d;
        }

        .menu-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: #ff7e40;
        }

        .menu-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .menu-item.disabled:hover {
          background-color: transparent;
          color: #a0aec0;
        }

        .menu-item.return-btn {
          color: #ff7e40;
          font-weight: 600;
          margin-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 20px;
        }

        .menu-item.return-btn:hover {
          color: #ff9b6a;
          background-color: rgba(255, 126, 64, 0.05);
        }

        .lector-workspace {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .lector-header {
          height: 70px;
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .hamburger-btn {
          color: #718096;
          cursor: pointer;
        }

        .header-title {
          font-size: 18px;
          font-weight: 800;
          color: #1a202c;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .search-box {
          display: flex;
          align-items: center;
          background-color: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 6px 14px;
          gap: 10px;
          width: 200px;
        }

        .search-box input {
          background: transparent;
          border: none;
          font-size: 13px;
          width: 100%;
          color: #4a5568;
        }

        .icon-badge {
          position: relative;
          color: #718096;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-badge .badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background-color: #ff4b2b;
          color: white;
          font-size: 9px;
          font-weight: 700;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          border-left: 1px solid #e2e8f0;
          padding-left: 20px;
        }

        .avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #e2e8f0;
          color: #4a5568;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info-text {
          display: flex;
          flex-direction: column;
        }

        .user-email {
          font-size: 13px;
          font-weight: 700;
          color: #2d3748;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-role {
          font-size: 11px;
          color: #718096;
        }

        .lector-content {
          flex: 1;
          overflow-y: auto;
          padding: 30px;
          background-color: #f4f6fa;
        }

        .dashboard-grid-row1 {
          display: grid;
          grid-template-columns: 2.2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .dashboard-grid-row2 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }

        .dashboard-grid-row3 {
          display: grid;
          grid-template-columns: 1fr 1.8fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        @media (max-width: 1024px) {
          .dashboard-grid-row1, .dashboard-grid-row3 {
            grid-template-columns: 1fr;
          }
          .dashboard-grid-row2 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .dashboard-grid-row2 {
            grid-template-columns: 1fr;
          }
        }

        .lector-card {
          background-color: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01);
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .lector-card-title {
          font-size: 16px;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 4px;
        }

        .lector-card-subtitle {
          font-size: 12px;
          color: #718096;
          margin-bottom: 20px;
        }

        .monthly-overview-card {
          display: flex;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .monthly-overview-card {
            flex-direction: column;
          }
          .monthly-overview-left {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid #e2e8f0;
            padding-right: 0 !important;
            padding-bottom: 20px;
          }
          .monthly-overview-right {
            width: 100% !important;
          }
        }

        .monthly-overview-left {
          width: 28%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid #e2e8f0;
          padding-right: 24px;
        }

        .monthly-overview-right {
          width: 72%;
          display: flex;
          flex-direction: column;
        }

        .overview-earnings-label {
          font-size: 10px;
          font-weight: 700;
          color: #a0aec0;
          letter-spacing: 0.5px;
        }

        .overview-earnings-val {
          font-size: 32px;
          font-weight: 800;
          color: #1a202c;
          margin: 4px 0 16px 0;
          letter-spacing: -0.5px;
        }

        .overview-sales-val {
          font-size: 32px;
          font-weight: 800;
          color: #1a202c;
          margin: 4px 0 20px 0;
          letter-spacing: -0.5px;
        }

        .overview-summary-btn {
          background-color: #ff7e40;
          color: white;
          padding: 10px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-align: center;
          border: none;
          transition: background-color 0.2s ease;
          width: 100%;
        }

        .overview-summary-btn:hover {
          background-color: #ff6822;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .chart-tabs {
          display: flex;
          gap: 16px;
        }

        .chart-tab {
          font-size: 11px;
          font-weight: 800;
          color: #718096;
          cursor: pointer;
          padding-bottom: 4px;
          border-bottom: 2px solid transparent;
          text-transform: uppercase;
        }

        .chart-tab.active {
          color: #ff7e40;
          border-bottom-color: #ff7e40;
        }

        .chart-legend {
          display: flex;
          gap: 16px;
          font-size: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: #4a5568;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-dot.online { background-color: #007bff; }
        .legend-dot.store { background-color: #ff7e40; }

        .chart-canvas {
          flex: 1;
          position: relative;
          min-height: 180px;
        }

        .chart-bottom-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          margin-top: 15px;
        }

        @media (max-width: 580px) {
          .chart-bottom-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .bottom-stat-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-icon-wrapper {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon-wrapper.red { background-color: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .stat-icon-wrapper.purple { background-color: rgba(168, 85, 247, 0.1); color: #a855f7; }
        .stat-icon-wrapper.green { background-color: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .stat-icon-wrapper.pink { background-color: rgba(236, 72, 153, 0.1); color: #ec4899; }

        .stat-details {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 10px;
          font-weight: 700;
          color: #718096;
          text-transform: uppercase;
        }

        .stat-val {
          font-size: 14px;
          font-weight: 800;
          color: #2d3748;
        }

        .traffic-chart-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 160px;
          position: relative;
        }

        .traffic-legend-row {
          display: flex;
          justify-content: space-around;
          width: 100%;
          margin-top: 20px;
          font-size: 11px;
        }

        .traffic-legend-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-weight: 700;
        }

        .traffic-legend-val {
          font-size: 15px;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 2px;
        }

        .traffic-legend-label {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #718096;
        }

        .sparkline-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
        }

        .sparkline-card.blue { background-color: #e0f2fe; border-color: #bae6fd; }
        .sparkline-card.yellow { background-color: #fef9c3; border-color: #fef08a; }
        .sparkline-card.orange { background-color: #ffedd5; border-color: #fed7aa; }
        .sparkline-card.purple { background-color: #f3e8ff; border-color: #e9d5ff; }

        .sparkline-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sparkline-title {
          font-size: 12px;
          font-weight: 700;
          color: #4a5568;
        }

        .sparkline-value {
          font-size: 20px;
          font-weight: 800;
          color: #1a202c;
        }

        .sparkline-subtext {
          font-size: 11px;
          color: #718096;
        }

        .bounce-select {
          font-size: 10px;
          font-weight: 700;
          background: white;
          border: 1px solid #cbd5e1;
          padding: 2px 6px;
          border-radius: 4px;
          color: #4a5568;
        }

        .timeline-list {
          position: relative;
          padding-left: 24px;
        }

        .timeline-list::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 10px;
          bottom: 10px;
          width: 2px;
          border-left: 2px dashed #cbd5e1;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 20px;
          padding-bottom: 4px;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-dot {
          position: absolute;
          left: -24px;
          top: 4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #cbd5e1;
          border: 2px solid white;
        }

        .timeline-dot.blue { background-color: #007bff; }
        .timeline-dot.pink { background-color: #ec4899; }
        .timeline-dot.yellow { background-color: #eab308; }
        .timeline-dot.green { background-color: #22c55e; }
        .timeline-dot.red { background-color: #ef4444; }

        .timeline-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .timeline-text {
          display: flex;
          flex-direction: column;
        }

        .timeline-title-text {
          font-size: 13px;
          font-weight: 700;
          color: #1a202c;
        }

        .timeline-desc-text {
          font-size: 12px;
          color: #718096;
          margin-top: 2px;
        }

        .timeline-time {
          font-size: 11px;
          color: #a0aec0;
          font-weight: 500;
          white-space: nowrap;
        }

        .order-status-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          gap: 16px;
        }

        @media (max-width: 580px) {
          .order-status-card-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .order-status-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .action-pill-btn {
          background-color: #ff7e40;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: background-color 0.2s ease;
        }

        .action-pill-btn:hover {
          background-color: #ff6822;
        }

        .icon-box-btn {
          width: 32px;
          height: 32px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4a5568;
          cursor: pointer;
          background: white;
          transition: background-color 0.2s ease;
        }

        .icon-box-btn:hover {
          background-color: #f1f5f9;
        }

        .order-search-input {
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 12px;
          width: 140px;
        }

        .lector-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        .lector-table th {
          text-align: left;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #4a5568;
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
          background-color: #f8fafc;
        }

        .lector-table td {
          padding: 12px 16px;
          font-size: 13px;
          color: #2d3748;
          border-bottom: 1px solid #f1f5f9;
        }

        .lector-table tr:hover {
          background-color: #f8fafc;
        }

        .invoice-id {
          font-weight: 700;
          color: #4a5568;
        }

        .price-text {
          font-weight: 700;
          color: #ff7e40;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          text-align: center;
        }

        .status-badge.process { background-color: #fee2e2; color: #ef4444; }
        .status-badge.open { background-color: #dcfce7; color: #22c55e; }
        .status-badge.on-hold { background-color: #dbeafe; color: #3b82f6; }
        .status-badge.complete { background-color: #f3e8ff; color: #a855f7; }
        .status-badge.cancelled { background-color: #f1f5f9; color: #64748b; }

        .table-pagination {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 4px;
          margin-top: 16px;
        }

        .pagination-item {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          color: #718096;
        }

        .pagination-item:hover {
          background-color: #e2e8f0;
          color: #1a202c;
        }

        .pagination-item.active {
          background-color: #ff7e40;
          color: white;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          padding: 30px;
          width: 100%;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #4a5568;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-control {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 14px;
          color: #1a202c;
          background-color: #ffffff;
        }

        .form-control:focus {
          border-color: #ff7e40;
          box-shadow: 0 0 0 3px rgba(255, 126, 64, 0.15);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
