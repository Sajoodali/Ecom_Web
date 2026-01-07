
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CartItem, View, User, Order } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AIShoppingAssistant from './components/AIShoppingAssistant';
import AuthModal from './components/AuthModal';
import CheckoutView from './components/CheckoutView';
import AdminDashboard from './components/AdminDashboard';
import OrderTrackingView from './components/OrderTrackingView';
import UserProfileView from './components/UserProfileView';
import Footer from './components/Footer';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura-cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura-user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: prodData, error: prodError } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      const { data: orderData, error: orderError } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      
      if (prodError) throw prodError;
      setProducts(prodData || []);
      setOrders(orderData || []);
    } catch (err: any) {
      console.error("Data Fetch Error:", err);
      setError("Unable to connect to the store. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    localStorage.setItem('aura-cart', JSON.stringify(cart));
    if (user) {
      localStorage.setItem('aura-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aura-user');
    }
  }, [cart, user]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleGoHome = () => {
    setView('home');
    setSelectedProduct(null);
    setSearchTerm('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async (customer: string, total: number): Promise<boolean> => {
    if (cart.length === 0) return false;

    const newOrder = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customer,
      customer_email: user?.email || null,
      total,
      status: 'Processing',
      date: new Date().toLocaleDateString('en-GB'),
      items: cart,
      tracking_id: `TRK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };

    try {
      const { data, error } = await supabase.from('orders').insert([newOrder]).select();
      if (error) throw error;
      
      if (data && data[0]) {
        setOrders(prev => [data[0], ...prev]);
        setLastOrder(data[0]); 
        setCart([]); 
        localStorage.removeItem('aura-cart');
        setView('success');
        return true;
      }
      return false;
    } catch (err: any) {
      alert("Order processing mein unexpected error: " + err.message);
      return false;
    }
  };

  if (view === 'admin') {
    return <AdminDashboard onBack={handleGoHome} products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdff]">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        user={user}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onGoHome={handleGoHome}
        onOpenAdmin={() => setView('admin')}
        onOpenTracking={() => setView('tracking')}
        onOpenProfile={() => setView('profile')}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="flex-1 w-full pt-28">
        {loading ? (
          <div className="h-[70vh] flex flex-col items-center justify-center">
            <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Warming up the store...</p>
          </div>
        ) : error ? (
           <div className="h-[70vh] flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
             <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[32px] flex items-center justify-center text-3xl mb-8 animate-bounce">⚠️</div>
             <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">Connection Lost.</h2>
             <p className="text-slate-500 font-medium mb-10">{error}</p>
             <button onClick={fetchData} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-200 hover:bg-slate-900 transition-all">Try Again Bhai</button>
           </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            {view === 'home' && (
              <div className="space-y-24">
                {/* Modern Hero Section */}
                <div className="relative rounded-[60px] overflow-hidden bg-slate-950 h-[500px] sm:h-[650px] flex items-center shadow-3xl shadow-slate-200/50 group">
                  <div className="absolute inset-0">
                    <img 
                      src="https://images.unsplash.com/photo-1542491595-3395bbff9fe0?q=80&w=2000" 
                      className="w-full h-full object-cover opacity-60 transition-transform duration-[10s] group-hover:scale-110" 
                      alt="Hero"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/60 to-indigo-900/40"></div>
                  </div>
                  <div className="relative z-10 max-w-2xl px-12 sm:px-20 animate-fade-up">
                    <span className="inline-flex items-center px-4 py-1.5 bg-indigo-600/20 backdrop-blur-md text-indigo-400 border border-indigo-400/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                       Season Drop 025
                    </span>
                    <h1 className="text-6xl sm:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                      Define <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 italic">Your Desk.</span>
                    </h1>
                    <p className="text-slate-400 text-lg sm:text-xl mb-12 max-w-md leading-relaxed">
                      Precision-engineered gear for the elite workspace. Experience ultimate minimalism.
                    </p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => document.getElementById('grid')?.scrollIntoView({ behavior: 'smooth' })} 
                        className="px-10 py-5 bg-white text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-slate-900/20"
                      >
                        Explore Drop
                      </button>
                      <button className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-all">
                        Lookbook
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filter & Categories */}
                <div id="grid" className="flex flex-col lg:flex-row justify-between items-end gap-10 reveal">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">The Essentials<span className="text-indigo-600">.</span></h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Curated for excellence</p>
                  </div>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar max-w-full pb-2">
                    {['All', 'Electronics', 'Lifestyle', 'Accessories', 'Wellness', 'Home'].map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => setActiveCategory(cat)} 
                        className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border-slate-50 hover:border-slate-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {filteredProducts.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={handleAddToCart} 
                        onClick={(p) => { setSelectedProduct(p); setView('product'); }} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-32 text-center reveal">
                    <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-4xl mx-auto mb-8 opacity-50">🔍</div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">No gear found, bhai.</h3>
                    <p className="text-slate-400 font-medium">Try broadening your search or choosing another category.</p>
                  </div>
                )}
              </div>
            )}

            {view === 'product' && selectedProduct && (
               <div className="max-w-6xl mx-auto animate-fade-up py-10">
                 <button onClick={handleGoHome} className="group text-slate-400 text-[10px] font-black uppercase tracking-widest mb-12 flex items-center hover:text-indigo-600 transition-colors">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-indigo-600 group-hover:text-white transition-all">←</span> 
                    Back to Gallery
                 </button>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                   <div className="relative group">
                     <div className="absolute -inset-4 bg-indigo-50 rounded-[60px] scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700"></div>
                     <img src={selectedProduct.image} className="relative rounded-[50px] w-full shadow-2xl shadow-indigo-100/50 z-10" alt={selectedProduct.name} />
                   </div>
                   <div className="flex flex-col">
                     <div className="flex items-center space-x-4 mb-6">
                        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedProduct.category}</span>
                        <div className="flex text-amber-400 text-sm font-black">★ {selectedProduct.rating}</div>
                     </div>
                     <h2 className="text-5xl sm:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none">{selectedProduct.name}</h2>
                     <p className="text-slate-500 text-xl leading-relaxed mb-12 font-medium">{selectedProduct.description}</p>
                     
                     <div className="glass p-10 rounded-[40px] shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                       <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Price for Quality</p>
                         <p className="text-5xl font-black text-slate-900 tracking-tighter">₨ {selectedProduct.price.toLocaleString()}</p>
                       </div>
                       <button 
                         onClick={() => handleAddToCart(selectedProduct)} 
                         className="w-full sm:w-auto px-12 py-6 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 active:scale-95"
                       >
                         Add to Bag
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
            )}

            {view === 'checkout' && <CheckoutView items={cart} onBack={handleGoHome} onSuccess={handlePlaceOrder} />}
            
            {view === 'success' && (
              <div className="text-center py-24 glass rounded-[80px] shadow-3xl shadow-slate-200/50 animate-fade-up max-w-4xl mx-auto border-none">
                <div className="relative inline-block mb-12">
                   <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                   <div className="w-32 h-32 bg-green-500 text-white rounded-[45px] flex items-center justify-center mx-auto relative text-5xl shadow-2xl shadow-green-200 rotate-12">✓</div>
                </div>
                <h2 className="text-6xl sm:text-8xl font-black mb-6 tracking-tighter text-slate-900">Order <br/><span className="text-indigo-600">Confirmed.</span></h2>
                <p className="text-slate-500 text-xl mb-12 max-w-md mx-auto font-medium">Mubarak ho bhai! Aapka naya gear raste mein hai. Humne aapko email bhej di hai.</p>
                
                {lastOrder && (
                  <div className="mb-16 max-w-sm mx-auto bg-slate-950 p-8 rounded-[40px] shadow-2xl shadow-indigo-100 rotate-[-1deg]">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-4">Secret Tracking ID</p>
                    <div className="flex items-center justify-center space-x-3 mb-4">
                       <span className="text-3xl font-black text-white tracking-widest select-all">{lastOrder.tracking_id}</span>
                       <button onClick={() => {navigator.clipboard.writeText(lastOrder.tracking_id || ''); alert('Copied!');}} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                       </button>
                    </div>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Keep this safe for tracking!</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-4 px-8">
                  <button onClick={handleGoHome} className="px-12 py-6 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-xl hover:bg-indigo-600 transition-all">Back to Store</button>
                  <button onClick={() => { if(lastOrder) { setView('tracking'); } }} className="px-12 py-6 bg-white text-slate-900 border-2 border-slate-100 font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-slate-50 transition-all">Track Order</button>
                </div>
              </div>
            )}
            
            {view === 'tracking' && <OrderTrackingView onBack={handleGoHome} initialOrderId={lastOrder?.tracking_id} />}
            {view === 'profile' && user && <UserProfileView user={user} onBack={handleGoHome} onTrackOrder={(id) => { setView('tracking'); }} onLogout={() => { setUser(null); handleGoHome(); }} />}
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} onUpdateQty={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onCheckout={() => { if(!user) { setIsAuthOpen(true); setIsCartOpen(false); } else { setView('checkout'); setIsCartOpen(false); } }} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={(n, e) => { setUser({ name: n, email: e, isAuthenticated: true }); setIsAuthOpen(false); }} />
      <AIShoppingAssistant />
    </div>
  );
};

export default App;
