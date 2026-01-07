
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  cartCount: number;
  user: User | null;
  onOpenCart: () => void;
  onGoHome: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
  onOpenProfile: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  user, 
  onOpenCart, 
  onGoHome, 
  onOpenAuth, 
  onOpenAdmin, 
  onOpenTracking, 
  onOpenProfile,
  searchTerm,
  onSearchChange
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[70] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="glass rounded-[28px] px-6 h-20 flex justify-between items-center shadow-lg shadow-slate-200/50">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={onGoHome}>
            <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl group-hover:bg-indigo-600 transition-all shadow-lg rotate-3 group-hover:rotate-0">A</div>
            <div className="ml-3 hidden sm:block">
               <span className="text-xl font-black tracking-tighter text-slate-900 block leading-none">Aura<span className="text-indigo-600">.</span></span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Minimal Store</span>
            </div>
          </div>

          {/* Search Bar - Fancy & Focused */}
          <div className="flex-1 max-w-lg mx-8 relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="What are you looking for today?" 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-100/50 border-2 border-transparent rounded-[20px] py-3 pl-12 pr-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button onClick={onOpenAdmin} className="hidden lg:flex items-center space-x-2 px-4 py-2 text-[10px] font-black text-slate-500 hover:text-indigo-600 uppercase tracking-widest transition-colors">
              <span className="w-2 h-2 bg-slate-200 rounded-full"></span>
              <span>Console</span>
            </button>

            <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block"></div>

            <div className="flex items-center space-x-2">
              {user ? (
                <button onClick={onOpenProfile} className="group relative w-11 h-11 flex items-center justify-center">
                  <div className="absolute inset-0 bg-indigo-100 rounded-2xl scale-0 group-hover:scale-100 transition-transform"></div>
                  <div className="relative w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xs font-black shadow-lg group-hover:-translate-y-1 transition-transform">
                    {user.name.charAt(0)}
                  </div>
                </button>
              ) : (
                <button onClick={onOpenAuth} className="px-5 py-2.5 text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors">Sign In</button>
              )}

              <button onClick={onOpenCart} className="relative p-3 bg-indigo-600 text-white rounded-[20px] hover:bg-slate-900 transition-all hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 active:scale-95 group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-black text-indigo-600 shadow-md border-2 border-indigo-600">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
