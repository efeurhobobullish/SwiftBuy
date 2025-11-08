export const COLORS = {
  primary: '#1976d2',
  secondary: '#f50057',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  background: '#ffffff',
  surface: '#f5f5f5',
  text: '#212121',
  textSecondary: '#757575',
  border: '#e0e0e0',
  accent: '#ff4081',
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
};

export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: 'laptop' },
  { id: 'fashion', name: 'Fashion', icon: 'shirt' },
  { id: 'home', name: 'Home & Living', icon: 'home' },
  { id: 'beauty', name: 'Beauty', icon: 'sparkles' },
];

export const DELIVERY_OPTIONS = [
  { city: 'Lagos', state: 'Lagos', fee: 1500, estimatedDays: 1 },
  { city: 'Abuja', state: 'FCT', fee: 2000, estimatedDays: 2 },
  { city: 'Port Harcourt', state: 'Rivers', fee: 2500, estimatedDays: 3 },
  { city: 'Kano', state: 'Kano', fee: 3000, estimatedDays: 4 },
  { city: 'Ibadan', state: 'Oyo', fee: 2000, estimatedDays: 2 },
  { city: 'Benin City', state: 'Edo', fee: 2500, estimatedDays: 3 },
];

export const PAYSTACK_PUBLIC_KEY = 'pk_test_YOUR_PAYSTACK_PUBLIC_KEY';

export const API_ENDPOINTS = {
  products: '/api/products',
  orders: '/api/orders',
  auth: '/api/auth',
};