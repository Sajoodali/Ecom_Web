
import React, { useState, useRef, useMemo } from 'react';
import { Product, Order } from '../types';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  onBack: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, products, setProducts, orders, setOrders }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders'>('overview');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Electronics',
    description: '',
    image: '',
    stock: 10
  });

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({message, type});
    setTimeout(() => setFeedback(null), 3000);
  };

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    return {
      revenue: totalRevenue,
      avgValue: avgOrderValue,
      totalOrders: orders.length,
      totalProducts: products.length
    };
  }, [orders, products]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'admin123') setIsAuthorized(true);
    else alert("Invalid Code Bhai! Admin se rabta karein.");
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (error) throw error;
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
        showFeedback(`Order status: ${newStatus}`, 'success');
    } catch (err: any) {
        showFeedback("Update failed: " + err.message, 'error');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // If a File is selected in the input, upload it to Supabase storage and set formData.image
      if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]) {
        const file = fileInputRef.current.files[0];
        const filePath = `product-images/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;
        const { data: urlData } = await supabase.storage.from('product-images').getPublicUrl(uploadData.path);
        formData.image = urlData.publicUrl;
      }
      if (editingProduct) {
        const { id, ...updateData } = formData;
        const { data, error } = await supabase.from('products').update(updateData).eq('id', editingProduct.id).select();
        if (error) throw error;
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? data[0] : p));
        showFeedback("Product optimized", 'success');
      } else {
        const { data, error } = await supabase.from('products').insert([formData]).select();
        if (error) throw error;
        setProducts(prev => [data[0], ...prev]);
        showFeedback("Product deployed to storefront", 'success');
      }
      setIsFormOpen(false);
    } catch (err: any) {
      showFeedback("Sync failed: " + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="admin-dashboard min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="mesh-bg absolute inset-0 opacity-20"></div>
        <div className="w-full max-w-xs login-card relative z-10 text-center animate-fade-up">
          <div className="login-brand">
            <div className="brand-badge">A</div>
            <div>
              <h2 className="login-title">Console Gate</h2>
              <div className="login-sub">Administrator access — authorized personnel only</div>
            </div>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <input 
              type="password" 
              placeholder="••••" 
              value={adminPass}
              autoFocus
              onChange={(e) => setAdminPass(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-center text-slate-900"
            />
            <div className="flex flex-col gap-2">
              <button className="btn-primary w-full">Authenticate</button>
              <button type="button" onClick={onBack} className="btn-ghost">Return to Surface</button>
            </div>
            <div className="login-help">Need help? Contact the owner for credentials.</div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard flex flex-col lg:flex-row min-h-screen bg-[#fcfdff]">
      {feedback && (
        <div className={`fixed top-10 right-10 px-8 py-5 rounded-3xl shadow-3xl z-[150] text-white font-black animate-fade-up flex items-center gap-4 ${feedback.type === 'success' ? 'bg-slate-900' : 'bg-rose-500'}`}>
           <span className="text-xl">{feedback.type === 'success' ? '✓' : '✕'}</span>
           <span className="text-xs uppercase tracking-widest">{feedback.message}</span>
        </div>
      )}

      <aside className="w-full lg:w-80 bg-white border-r border-slate-100 p-10 flex flex-col sticky top-0 h-screen z-20 shadow-sm">
        <div className="flex items-center space-x-4 mb-20">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl shadow-indigo-100">A</div>
          <span className="text-2xl font-black tracking-tighter">Console<span className="text-indigo-600">.</span></span>
        </div>
        
        <nav className="flex-1 space-y-6">
          {[
            { id: 'overview', label: 'Systems', icon: '📊' },
            { id: 'inventory', label: 'Stock', icon: '📦' },
            { id: 'orders', label: 'Fulfillment', icon: '🚚' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-5 px-8 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200 -translate-y-1' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <span className="text-2xl opacity-80">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        
        <button onClick={onBack} className="mt-10 p-6 bg-rose-50 text-rose-500 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm">Logout Security</button>
      </aside>

      <main className="flex-1 p-10 lg:p-20 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-24 animate-fade-up">
          <div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter capitalize">{activeTab} Hub.</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-3">Monitoring store vitals in real-time</p>
          </div>
          {activeTab === 'inventory' && (
            <button onClick={() => { setEditingProduct(null); setFormData({ name: '', price: 0, category: 'Electronics', description: '', image: '', stock: 10 }); setIsFormOpen(true); }} className="px-12 py-6 bg-indigo-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-slate-900 active:scale-95 transition-all">+ Add To Drop</button>
          )}
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-xl group hover:-translate-y-2 transition-all overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">Total Revenue</p>
                <h3 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 relative z-10">₨ {stats.revenue.toLocaleString()}</h3>
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full relative z-10">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                   <p className="text-[10px] text-green-600 font-black uppercase">Live Profits</p>
                </div>
              </div>
              
              <div className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-xl group hover:-translate-y-2 transition-all">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Volume</p>
                <h3 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">{stats.totalOrders}</h3>
                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">Total Transactions</p>
              </div>

              <div className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-xl group hover:-translate-y-2 transition-all">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Avg Value</p>
                <h3 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">₨ {Math.round(stats.avgValue).toLocaleString()}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Per Customer Spends</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[60px] p-16 text-white shadow-3xl shadow-indigo-200 flex flex-col md:flex-row items-center justify-between">
               <div>
                  <h4 className="text-4xl font-black tracking-tighter mb-4">Inventory Health.</h4>
                  <p className="text-indigo-100 text-xl font-medium max-w-md">Currently hosting {stats.totalProducts} live products across global categories. Supply chain is optimal.</p>
               </div>
               <div className="mt-10 md:mt-0">
                  <span className="text-9xl font-black text-white/10 select-none">{stats.totalProducts}</span>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-[50px] border border-slate-100 overflow-hidden shadow-2xl animate-fade-up">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black border-b border-slate-100">
                   <tr>
                     <th className="px-12 py-10">Product Entity</th>
                     <th className="px-12 py-10 text-right">Market Price</th>
                     <th className="px-12 py-10 text-center">Unit Stock</th>
                     <th className="px-12 py-10 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {products.map(p => (
                     <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-12 py-10">
                          <div className="flex items-center space-x-8">
                             <img src={p.image} className="w-20 h-20 rounded-3xl object-cover shadow-lg group-hover:rotate-3 transition-transform" />
                             <div>
                                <p className="font-black text-slate-900 text-xl tracking-tight">{p.name}</p>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">{p.category}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-12 py-10 text-right font-black text-2xl tracking-tighter text-slate-900">₨ {p.price.toLocaleString()}</td>
                       <td className="px-12 py-10 text-center">
                          <span className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${p.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {p.stock} Units
                          </span>
                       </td>
                       <td className="px-12 py-10 text-right">
                         <button onClick={() => { setEditingProduct(p); setFormData(p); setIsFormOpen(true); }} className="px-6 py-3 bg-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Adjust</button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-[50px] border border-slate-100 overflow-hidden shadow-2xl animate-fade-up">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black border-b border-slate-100">
                   <tr>
                     <th className="px-12 py-10">Logistics Data</th>
                     <th className="px-12 py-10">Tracking Code</th>
                     <th className="px-12 py-10 text-right">Total PKR</th>
                     <th className="px-12 py-10 text-center">Operation Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {orders.map(o => (
                     <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-12 py-10">
                         <p className="font-black text-slate-900 text-xl tracking-tight">{o.customer}</p>
                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Order Ref: {o.id}</p>
                       </td>
                       <td className="px-12 py-10">
                         <div className="px-4 py-2 bg-slate-100 rounded-xl inline-block">
                            <code className="text-xs font-black text-indigo-600 tracking-wider">{o.tracking_id || 'N/A'}</code>
                         </div>
                       </td>
                       <td className="px-12 py-10 text-right font-black text-2xl tracking-tighter text-slate-900">₨ {o.total.toLocaleString()}</td>
                       <td className="px-12 py-10 text-center">
                         <select 
                            value={o.status} 
                            onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                            className={`border-none rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all ${
                              o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                            }`}
                         >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                         </select>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
          <div className="bg-white w-full max-w-2xl rounded-[60px] p-12 lg:p-20 shadow-4xl overflow-y-auto max-h-[90vh] animate-fade-up">
            <div className="flex justify-between items-center mb-16">
               <div>
                  <h2 className="text-4xl font-black tracking-tighter">{editingProduct ? 'Update Gear' : 'Deploy New Gear'}</h2>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">Syncing to master database</p>
               </div>
               <button onClick={() => setIsFormOpen(false)} className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">✕</button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-10">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Identity</label>
                 <input type="text" placeholder="e.g. Aura Pro Gen 5" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-3xl text-xl font-black outline-none focus:border-indigo-600 transition-all" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Valuation (PKR)</label>
                   <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-3xl text-xl font-black outline-none focus:border-indigo-600 transition-all" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reserve Units</label>
                   <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-3xl text-xl font-black outline-none focus:border-indigo-600 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                   <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-3xl text-sm font-bold outline-none focus:border-indigo-600 transition-all">
                     {['Electronics','Lifestyle','Accessories','Wellness','Home'].map(c => (
                       <option key={c} value={c}>{c}</option>
                     ))}
                   </select>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Image (or paste URL below)</label>
                   <div className="flex items-center gap-3">
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" id="image-upload" onChange={() => {
                        const f = fileInputRef.current?.files?.[0];
                        if (f) setFormData(prev => ({...prev, image: URL.createObjectURL(f)}));
                      }} />
                      <label htmlFor="image-upload" className="px-4 py-3 bg-slate-100 rounded-2xl cursor-pointer text-sm font-black">Choose file</label>
                      <span className="text-xs text-slate-400">or drag & drop</span>
                   </div>
                   {formData.image && (
                     <div className="mt-2">
                       <img src={formData.image} className="w-28 h-20 object-cover rounded-md shadow-sm" />
                     </div>
                   )}
                </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Asset URL</label>
                 <input type="text" placeholder="High-res image URL..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-3xl text-sm font-bold outline-none focus:border-indigo-600 transition-all" />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Manifesto</label>
                 <textarea placeholder="The narrative behind this product..." rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[32px] text-sm font-semibold resize-none outline-none focus:border-indigo-600 transition-all" />
              </div>

              <div className="pt-10 flex flex-col gap-4">
                 <button disabled={isSubmitting} className="w-full py-8 bg-indigo-600 text-white font-black uppercase tracking-[0.3em] text-xs rounded-[32px] shadow-3xl shadow-indigo-200 hover:bg-slate-950 transition-all disabled:opacity-50 active:scale-95">
                    {isSubmitting ? 'Syncing...' : 'Deploy Asset'}
                 </button>
                 <button type="button" onClick={() => setIsFormOpen(false)} className="w-full text-[10px] text-slate-400 font-black uppercase tracking-widest py-4 hover:text-rose-500 transition-colors">Abort Sync</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
