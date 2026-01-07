
import React, { useState } from 'react';
import { CartItem, ShippingOption } from '../types';
import { SHIPPING_OPTIONS } from '../constants';

interface CheckoutViewProps {
  items: CartItem[];
  onSuccess: (customer: string, total: number) => Promise<boolean>;
  onBack: () => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ items, onSuccess, onBack }) => {
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0]);
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + selectedShipping.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !address || !phone) {
      alert("Bhai, saari fields fill karein taake order ship ho sakay!");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // We await the result. If it returns false or throws, we stop loading so user can retry.
      const success = await onSuccess(customerName, total);
      if (!success) {
        setIsSubmitting(false);
      }
    } catch (e) {
      console.error("Checkout submission failed", e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <button onClick={onBack} className="flex items-center text-slate-400 hover:text-indigo-600 mb-12 font-black uppercase text-[10px] tracking-widest transition-colors">
        <span className="mr-3 text-lg">←</span> Return to Shop
      </button>

      <h2 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter">Secure Checkout.</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-12">
            <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-black mb-10 flex items-center tracking-tight">
                <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mr-4 text-xs font-black">01</span>
                Shipping Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                   <input 
                    type="text" 
                    placeholder="e.g. Ali Ahmed" 
                    required 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-5 bg-slate-50 rounded-2xl border-none font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all" 
                   />
                </div>
                <div className="sm:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Address</label>
                   <input 
                    type="text" 
                    placeholder="House, Street, Area..." 
                    required 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-5 bg-slate-50 rounded-2xl border-none font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all" 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                   <input type="text" placeholder="e.g. Lahore" required className="w-full p-5 bg-slate-50 rounded-2xl border-none font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-600/10" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                   <input 
                    type="tel" 
                    placeholder="03xx-xxxxxxx" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-5 bg-slate-50 rounded-2xl border-none font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all" 
                   />
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-black mb-10 flex items-center tracking-tight">
                <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mr-4 text-xs font-black">02</span>
                Shipping Speed
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {SHIPPING_OPTIONS.map(opt => (
                  <label key={opt.id} className={`flex items-center justify-between p-6 rounded-[30px] border-2 cursor-pointer transition-all ${selectedShipping.id === opt.id ? 'border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-100/50' : 'border-slate-50 bg-white hover:border-slate-200'}`}>
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-6 transition-colors ${selectedShipping.id === opt.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                        {selectedShipping.id === opt.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        <input 
                          type="radio" 
                          name="shipping" 
                          className="hidden"
                          checked={selectedShipping.id === opt.id}
                          onChange={() => setSelectedShipping(opt)}
                        />
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-lg">{opt.name}</div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{opt.estimatedDays}</div>
                      </div>
                    </div>
                    <div className="font-black text-slate-900 text-xl">
                      {opt.price === 0 ? 'FREE' : `₨ ${opt.price.toLocaleString()}`}
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-10 rounded-[50px] shadow-2xl sticky top-32 border border-white/5">
            <h3 className="text-2xl font-black mb-10 tracking-tight">Order Abstract.</h3>
            
            <div className="space-y-6 mb-12 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex items-center space-x-4">
                     <img src={item.image} className="w-12 h-12 rounded-xl object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest line-clamp-1">{item.name}</p>
                        <p className="text-sm font-bold">Quantity: {item.quantity}</p>
                     </div>
                  </div>
                  <span className="font-black text-sm">₨ {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-white/10">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Items Subtotal</span>
                <span className="text-white">₨ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Shipping Fee</span>
                <span className="text-white">{selectedShipping.price === 0 ? 'FREE' : `₨ ${selectedShipping.price.toLocaleString()}`}</span>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 flex justify-between items-end mb-12">
              <div>
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Grand Total</p>
                 <span className="text-4xl font-black text-white tracking-tighter">₨ {total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-6 bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-3xl hover:bg-indigo-400 transition-all shadow-2xl shadow-indigo-900/50 active:scale-95 disabled:opacity-50 flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Complete Purchase'}
            </button>
            
            <div className="mt-8 flex items-center justify-center space-x-3 opacity-30 group cursor-help">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04a11.357 11.357 0 00-1.018 4.386c0 4.103 2.184 7.691 5.457 9.723l.474.294l.474-.294c3.273-2.032 5.457-5.62 5.457-9.723c0-1.547-.312-3.021-.87-4.358z" /></svg>
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
