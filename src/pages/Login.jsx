import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });

      if (response.status === 200) {
        const user = response.data;
        
        // --- CRITICAL FIX: Save the full object including customerId ---
        localStorage.setItem('user', JSON.stringify(user));
        
        // Log this to your console (F12) to verify customerId is present
        console.log("Session Started for ID:", user.customerId || user.id);

        if (user.role === 'ROLE_ADMIN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid credentials or server offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0B0F19] overflow-hidden font-sans">
      
      {/* BACKGROUND IMAGE */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/8867431/pexels-photo-8867431.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          filter: "brightness(0.2) contrast(1.1)" 
        }}
      ></div>

      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[5px] z-10"></div>

      {/* STAFF PORTAL BUTTON */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={() => navigate('/admin-login')}
          className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 transition-all shadow-2xl active:scale-95"
        >
          <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></div>
          Staff Portal
        </button>
      </div>

      <div className="relative z-20 w-full max-w-md px-4 flex flex-col items-center">
        {/* LOGO */}
        <div className="mb-6">
           <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
             <ShieldCheck className="text-[#FF0033]" size={40} />
           </div>
        </div>

        <h1 className="text-4xl font-black text-[#FF0033] tracking-tighter mb-1 uppercase drop-shadow-lg">
          Smart Helpdesk
        </h1>
        <p className="text-white/40 mb-8 tracking-[0.3em] uppercase text-[9px] font-black">
          Secure Access Protocol v2.4
        </p>

        {/* LOGIN BOX */}
        <div className="w-full bg-[#161B22]/90 border border-white/10 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
          
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold animate-in fade-in zoom-in duration-300">
              <ShieldAlert size={16} />
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Customer Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-[#0D1117] border border-gray-800 rounded-2xl text-white focus:ring-2 focus:ring-[#FF0033] outline-none transition-all placeholder:text-gray-800"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-[#0D1117] border border-gray-800 rounded-2xl text-white focus:ring-2 focus:ring-[#FF0033] outline-none transition-all placeholder:text-gray-800"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 px-4 rounded-2xl font-black text-white bg-[#FF0033] hover:bg-[#CC0029] transition-all shadow-lg active:scale-[0.97] uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Authorize Session"}
            </button>
          </form>

          <div className="mt-8 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            Identity missing?{' '}
            <button onClick={() => navigate('/register')} className="text-[#FF0033] hover:underline underline-offset-4 ml-1">
              Enroll System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}