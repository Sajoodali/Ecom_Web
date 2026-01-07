
import { Product, ShippingOption, Order } from './types';

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Aura Pro Max Headphones",
    price: 55000,
    category: "Electronics",
    description: "Industry-leading noise cancellation with spatial audio for an immersive experience.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    stock: 15
  },
  {
    id: "2",
    name: "Classic Chronograph Watch",
    price: 22000,
    category: "Accessories",
    description: "Handcrafted stainless steel watch with genuine leather strap and sapphire glass.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    stock: 8
  },
  {
    id: "3",
    name: "Ergo-Aluminum Laptop Stand",
    price: 7500,
    category: "Electronics",
    description: "Ventilated design made from aircraft-grade aluminum. Perfect for workspace ergonomics.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop",
    rating: 4.6,
    stock: 25
  },
  {
    id: "4",
    name: "Temperature Control Mug 2",
    price: 15000,
    category: "Lifestyle",
    description: "Smart mug that keeps your coffee at the exact degree you like for up to 3 hours.",
    image: "https://images.unsplash.com/photo-1517254456976-ee8682099819?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    stock: 12
  },
  {
    id: "5",
    name: "Pro-Grip Yoga Mat",
    price: 5200,
    category: "Wellness",
    description: "Extra thick, eco-friendly TPE material with non-slip texture for high-intensity sessions.",
    image: "https://images.unsplash.com/photo-1592178036041-001099153314?q=80&w=1000&auto=format&fit=crop",
    rating: 4.5,
    stock: 50
  }
];

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'standard', name: 'Standard Shipping', price: 0, estimatedDays: '5-7 business days' },
  { id: 'express', name: 'Express Delivery', price: 1500, estimatedDays: '2-3 business days' },
  { id: 'overnight', name: 'Next Day Air', price: 3000, estimatedDays: '1 business day' }
];

export const MOCK_ORDERS: Order[] = [];
