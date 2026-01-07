
import React, { useEffect, useState } from 'react';
import { User, Order } from '../types';
import { supabase } from '../lib/supabase';

interface UserProfileViewProps {
  user: User;
  onBack: () => void;
  onTrackOrder: (id: string) => void;
  onLogout: () => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ user, onBack, onTrackOrder, onLogout }) => {
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_email', user.email)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setUserOrders(data || []);
      } catch (err) {
        console.error("Error fetching profile orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user.email]);

  return (
    <div className="max-w-5xl mx-auto py-16 px-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-16">
        <button onClick={onBack} className="text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center">
          <span className="mr-2">←</span> Store
        </button>
        <button onClick={onLogout} className="text-red-500 font-black uppercase text-[10px] tracking-widest border border-red-100 px-6 py-3 rounded-2xl hover:bg-red-50 transition-all">
          Logout Account
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-start mb-20">
        <div className="w-32 h-32 bg-indigo-600 rounded-[40px] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-100">
          {user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-2">{user.name}</h1>
          <p className="text-slate-400 text-xl font-medium">{user.email}</p>
          <div className="mt-6 flex gap-4">
            <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Verified Customer</span>
            <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">{userOrders.length} Orders</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Purchase History</h3>
        
        {loading ? (
          <div className="h-40 flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : userOrders.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100">
            <p className="text-slate-400 text-lg font-medium">Abhi tak koi order nahi kiya. Shopping shuru karein!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {userOrders.map((order) => (
              <div key={order.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-indigo-100 transition-all">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">ID: {order.id.substring(0,8)}</span>
                    <span className="text-slate-400 text-xs font-bold">{order.date}</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900">₨ {order.total.toLocaleString()}</h4>
                  <p className="text-slate-500 text-sm">{order.items.length} items purchased</p>
                </div>
                
                <div className="flex items-center space-x-6 w-full md:w-auto">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Status</p>
                    <p className={`font-black text-sm ${order.status === 'Delivered' ? 'text-green-500' : 'text-indigo-600'}`}>{order.status}</p>
                  </div>
                  <button 
                    onClick={() => onTrackOrder(order.id)}
                    className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100"
                  >
                    Track Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
