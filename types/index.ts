export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  features?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: Address;
  paymentMethod: string;
  status: 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface DeliveryOption {
  city: string;
  state: string;
  fee: number;
  estimatedDays: number;
}

export interface PaymentData {
  amount: number;
  email: string;
  reference: string;
  callback: (response: any) => void;
  onClose: () => void;
}