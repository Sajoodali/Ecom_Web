
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm mr-2">A</div>
              <span className="text-xl font-black tracking-tighter text-slate-900">Aura<span className="text-indigo-600">Mini.</span></span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Curating the world's most minimal and functional tech accessories for the modern workspace.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Collections</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li className="hover:text-indigo-600 cursor-pointer">Electronics</li>
              <li className="hover:text-indigo-600 cursor-pointer">Lifestyle</li>
              <li className="hover:text-indigo-600 cursor-pointer">Wellness</li>
              <li className="hover:text-indigo-600 cursor-pointer">Home Office</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li className="hover:text-indigo-600 cursor-pointer">Order Tracking</li>
              <li className="hover:text-indigo-600 cursor-pointer">Shipping Policy</li>
              <li className="hover:text-indigo-600 cursor-pointer">Returns & Exchanges</li>
              <li className="hover:text-indigo-600 cursor-pointer">Contact Support</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Newsletter</h4>
            <p className="text-slate-500 text-xs mb-4 leading-relaxed">Join for exclusive drops and tech insights.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="email@example.com" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-600/10" />
              <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Join</button>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2025 Aura MiniStore. Built for performance.</p>
          <div className="flex space-x-6">
            <div className="w-5 h-5 bg-slate-100 rounded-md"></div>
            <div className="w-5 h-5 bg-slate-100 rounded-md"></div>
            <div className="w-5 h-5 bg-slate-100 rounded-md"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
