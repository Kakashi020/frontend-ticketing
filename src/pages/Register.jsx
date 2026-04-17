import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ShieldCheck, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Register() {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '',
    role: 'ROLE_CUSTOMER' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);

      if (response.status === 200 || response.status === 201) {
        // --- AUTO-LOGIN LOGIC ---
        const newUser = response.data;
        
        // Save the new user data (including the auto-generated customerId)
        localStorage.setItem('user', JSON.stringify(newUser));

        // Log the new CID for verification
        console.log("Account Created. Assigned ID:", newUser.customerId);

        // Instant redirect to dashboard
        navigate('/dashboard'); 
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data || "Email already registered or server offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0B0F19] overflow-hidden font-sans">
      
      {/* BACKGROUND IMAGE */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/8867431/pexels-photo-8867431.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          filter: "brightness(0.2) contrast(1.1)" 
        }}
      ></div>

      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[4px] z-10"></div>

      <div className="relative z-20 w-full max-w-md px-4 py-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
        
        {/* LOGO */}
        <div className="mb-6">
           <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl">
             <ShieldCheck className="text-[#FF0033]" size={40} />
           </div>
        </div>

        <h1 className="text-4xl font-black text-[#FF0033] tracking-tighter mb-1 uppercase drop-shadow-lg text-center">
          Smart Helpdesk
        </h1>
        <p className="text-white/40 mb-8 tracking-[0.3em] uppercase text-[9px] font-black">
          System Enrollment Protocol
        </p>

        {/* REGISTER BOX */}
        <div className="w-full bg-[#161B22]/95 border border-white/10 p-8 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
          
          {error && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-500 text-[10px] font-black uppercase text-center animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            
            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Identity</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
                <input 
                  type="text" 
                  name="fullName"
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-[#0D1117] border border-gray-800 rounded-2xl text-white focus:ring-2 focus:ring-[#FF0033] outline-none transition-all placeholder:text-gray-900"
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Communication Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
                <input 
                  type="email" 
                  name="email"
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-[#0D1117] border border-gray-800 rounded-2xl text-white focus:ring-2 focus:ring-[#FF0033] outline-none transition-all placeholder:text-gray-900"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Vault Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
                <input 
                  type="password" 
                  name="password"
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-[#0D1117] border border-gray-800 rounded-2xl text-white focus:ring-2 focus:ring-[#FF0033] outline-none transition-all placeholder:text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 px-4 mt-4 rounded-2xl font-black text-white bg-[#FF0033] hover:bg-[#CC0029] transition-all shadow-lg shadow-rose-950/20 active:scale-[0.97] uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  Establish Identity <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            Already enrolled?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="text-[#FF0033] hover:text-[#CC0029] underline underline-offset-4 ml-1 font-black"
            >
              Access Portal
            </button>
          </div>
        </div>

        <p className="mt-8 text-[9px] text-white/20 font-bold uppercase tracking-[0.4em]">
           Secured by Smart Desk Encryption
        </p>
      </div>
    </div>
  );
}