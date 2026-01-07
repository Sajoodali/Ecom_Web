
import React, { useState, useEffect } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, email: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  // Reset error when toggling between login and signup
  useEffect(() => {
    setError('');
  }, [isLogin]);

  if (!isOpen) return null;

  const getRegisteredUsers = () => {
    const users = localStorage.getItem('aura-registered-users');
    return users ? JSON.parse(users) : [];
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const users = getRegisteredUsers();

    if (isLogin) {
      // Login Logic
      const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
      if (user) {
        onLogin(user.name, user.email);
        onClose();
        setFormData({ name: '', email: '', password: '' });
      } else {
        setError('Bhai, email ya password ghalat hai. Check karlo!');
      }
    } else {
      // Sign Up Logic
      const userExists = users.find((u: any) => u.email === formData.email);
      if (userExists) {
        setError('Ye email pehle se registered hai! Login karlo.');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password kam az kam 6 characters ka hona chahiye.');
        return;
      }

      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('aura-registered-users', JSON.stringify(updatedUsers));
      
      // Auto-login after signup
      onLogin(newUser.name, newUser.email);
      onClose();
      setFormData({ name: '', email: '', password: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{isLogin ? 'Welcome Back' : 'Join Aura'}</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                {isLogin ? 'Enter your credentials' : 'Create your gear account'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all font-bold text-slate-900"
                  placeholder="Ali Ahmed"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all font-bold text-slate-900"
                placeholder="ali@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all font-bold text-slate-900"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 mt-4 active:scale-95">
              {isLogin ? 'Sign In Now' : 'Complete Registration'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              {isLogin ? "No account yet?" : "Already a member?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-indigo-600 font-black hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
