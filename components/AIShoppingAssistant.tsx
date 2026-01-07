
import React, { useState, useRef, useEffect } from 'react';
import { getShoppingAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIShoppingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hey! I'm Aura, your high-performance shopping AI. Need help finding the perfect tech for your workspace?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMessage: ChatMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const aiResponse = await getShoppingAdvice(inputValue);
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse || "Bhai, dimagh chal nahi raha. Dubara pucho!" }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      {isOpen ? (
        <div className="bg-white rounded-[40px] shadow-3xl border-none w-[380px] sm:w-[450px] flex flex-col max-h-[600px] overflow-hidden animate-fade-up">
          <div className="p-8 bg-slate-950 text-white flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">A</div>
                 <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-950 rounded-full"></div>
              </div>
              <div>
                 <span className="font-black text-lg block leading-none">Aura AI</span>
                 <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active System</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-6 min-h-[400px] bg-[#f8fafc] no-scrollbar"
          >
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 text-sm font-semibold leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-[28px] rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-[28px] rounded-tl-none border border-slate-100'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-5 rounded-[28px] rounded-tl-none shadow-sm border border-slate-100">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-slate-50 flex items-center space-x-4">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tell me your workspace goals..."
              className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 disabled:opacity-30 transition-all shadow-xl active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 bg-slate-950 rounded-[30px] shadow-3xl flex items-center justify-center text-white hover:scale-110 hover:-translate-y-2 hover:bg-indigo-600 transition-all duration-500 group relative"
        >
          <div className="absolute inset-0 bg-indigo-600 rounded-[30px] opacity-0 group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 -z-10"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 group-hover:rotate-6 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <div className="absolute -top-3 -right-3 px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full border-[3px] border-white shadow-lg">Aura</div>
        </button>
      )}
    </div>
  );
};

export default AIShoppingAssistant;
