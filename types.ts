
export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Electronics' | 'Lifestyle' | 'Accessories' | 'Wellness' | 'Home';
  description: string;
  image: string;
  rating: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

export interface User {
  name: string;
  email: string;
  isAuthenticated: boolean;
  role?: 'user' | 'admin';
}

export type View = 'home' | 'product' | 'checkout' | 'success' | 'admin' | 'tracking' | 'profile';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Order {
  id: string;
  customer: string;
  customer_email?: string; // Linked to user for history
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  date: string;
  items: any[];
  tracking_id?: string;
}
