
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onClick: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div 
      className="group relative flex flex-col h-full bg-white rounded-[40px] p-4 card-hover animate-fade-up"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stock & Category Badge */}
      <div className="absolute top-8 left-8 z-10 flex flex-col gap-2">
        <span className="px-3 py-1 bg-white/90 backdrop-blur text-[9px] font-black uppercase text-indigo-600 rounded-full shadow-sm border border-indigo-50/50 tracking-widest">
          {product.category}
        </span>
        {product.stock <= 5 && product.stock > 0 && (
          <span className="px-3 py-1 bg-rose-500 text-[9px] font-black uppercase text-white rounded-full shadow-lg shadow-rose-200 tracking-widest">
            Rare Find
          </span>
        )}
      </div>

      {/* Image Section */}
      <div 
        className="relative aspect-square overflow-hidden rounded-[32px] cursor-pointer bg-slate-50 mb-6 group-hover:shadow-2xl transition-shadow duration-500"
        onClick={() => onClick(product)}
      >
        {!isImageLoaded && <div className="absolute inset-0 shimmer"></div>}
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${isHovered ? 'scale-110 rotate-1' : 'scale-100'} ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Quick Add Overlay */}
        <div className={`absolute inset-0 bg-indigo-600/10 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            disabled={product.stock <= 0}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="transform transition-all duration-500 translate-y-4 group-hover:translate-y-0 px-8 py-3 bg-white text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-slate-900 hover:text-white active:scale-95 disabled:opacity-50"
          >
            {product.stock > 0 ? 'Collect Item' : 'Sold Out'}
          </button>
        </div>
      </div>
      
      {/* Details Section */}
      <div className="px-4 pb-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="text-lg font-bold text-slate-900 leading-tight line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors"
            onClick={() => onClick(product)}
          >
            {product.name}
          </h3>
          <div className="flex items-center text-amber-400 text-xs font-black ml-4 bg-amber-50 px-2 py-1 rounded-lg">
            ★ {product.rating}
          </div>
        </div>
        
        <p className="text-slate-400 text-xs font-medium line-clamp-2 mb-6 h-8">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</span>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">₨ {product.price.toLocaleString()}</span>
          </div>
          <button 
             onClick={() => onClick(product)}
             className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
