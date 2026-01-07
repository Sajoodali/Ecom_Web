
import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { supabase } from '../lib/supabase';

interface OrderTrackingViewProps {
  onBack: () => void;
  initialOrderId?: string;
}

const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ onBack, initialOrderId }) => {
  const [orderId, setOrderId] = useState(initialOrderId || '');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      handleTrack(undefined, initialOrderId);
    }
  }, [initialOrderId]);

  const handleTrack = async (e?: React.FormEvent, idToTrack?: string) => {
    if (e) e.preventDefault();
    const targetId = idToTrack || orderId;
    if (!targetId) return;

    setLoading(true);
    setFoundOrder(null); // Clear previous result while searching
    try {
      // Allow searching by internal ID OR the user-facing Tracking ID (TRK-...)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${targetId},tracking_id.eq.${targetId}`)
        .single();
      
      if (error) throw error;
      setFoundOrder(data);
    } catch (err) {
      alert("Order nahi mila! Bhai, Tracking ID check karke dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStep = foundOrder ? steps.indexOf(foundOrder.status) : -1;

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 animate-in fade-in duration-700">
      <button onClick={onBack} className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-12 flex items-center">
        <span className="mr-2">←</span> Store
      </button>

      <div className="text-center mb-16">
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">Track Package.</h1>
        <p className="text-slate-400 text-xl font-medium">Har pal ki update, aapke haath mein.</p>
      </div>

      <form onSubmit={(e) => handleTrack(e)} className="flex flex-col sm:flex-row gap-4 mb-20">
        <input 
          type="text" 
          placeholder="Paste Tracking ID (TRK-...)" 
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 p-6 bg-white border border-slate-200 rounded-[30px] outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold shadow-sm"
        />
        <button className="px-12 py-6 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-[30px] shadow-2xl hover:bg-indigo-600 transition-all">
          {loading ? 'Finding...' : 'Update Me'}
        </button>
      </form>

      {foundOrder && (
        <div className="bg-white rounded-[50px] p-12 md:p-20 shadow-xl border border-slate-100 animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
            <div>
              <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2">Recipient</p>
              <h3 className="text-4xl font-black text-slate-900">{foundOrder.customer}</h3>
              <p className="text-xs text-slate-400 mt-2 font-bold tracking-wider">{foundOrder.tracking_id}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Live Progress</p>
              <h3 className="text-2xl font-black text-indigo-600">{foundOrder.status}</h3>
            </div>
          </div>

          <div className="relative pt-10">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
            </div>
            <div className="relative flex justify-between">
              {steps.map((step, idx) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm z-10 transition-colors ${idx <= currentStep ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-4 border-slate-100 text-slate-300'}`}>
                    {idx + 1}
                  </div>
                  <p className={`mt-4 text-[10px] font-black uppercase tracking-widest ${idx <= currentStep ? 'text-slate-900' : 'text-slate-400'}`}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-slate-50">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {foundOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center space-x-6 p-6 bg-slate-50 rounded-3xl">
                    <img src={item.image} className="w-16 h-16 rounded-2xl object-cover" />
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-400 font-bold">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingView;
