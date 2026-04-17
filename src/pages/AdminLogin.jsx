import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // --- REAL BACKEND LOGIN HANDLER ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('${API_BASE_URL}/api/auth/admin/login', {
        email,
        password
      });

      if (response.status === 200) {
        // Save the Admin object to session
        localStorage.setItem('admin', JSON.stringify(response.data));
        navigate('/admin-dashboard');
      }
    } catch (err) {
      console.error("Admin Login Error:", err);
      setError("ACCESS DENIED: INVALID ADMINISTRATIVE CREDENTIALS");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#05070A] overflow-hidden font-sans">
      
      {/* Background with a "Secure" feel */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-20 transition-opacity duration-1000"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      ></div>

      <div className="absolute inset-0 bg-linear-to-b from-rose-950/30 via-[#05070A]/90 to-[#05070A]"></div>

      {/* Back to User Login */}
      <button 
        onClick={() => navigate('/login')}
        className="absolute top-8 left-8 z-50 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-all flex items-center gap-2 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> User Access
      </button>

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center">
        
        {/* Shield Icon */}
        <div className="mb-8">
           <div className="w-20 h-20 bg-rose-600/10 rounded-[2.5rem] flex items-center justify-center border border-rose-500/20 shadow-[0_0_50px_rgba(225,29,72,0.1)] transition-transform hover:scale-110 duration-500">
             <ShieldCheck className="text-rose-500" size={40} />
           </div>
        </div>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
            Admin <span className="text-rose-600">Portal</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-rose-500/30"></span>
            <p className="text-[10px] font-black text-rose-500/60 uppercase tracking-[0.4em]">
              Restricted Area
            </p>
            <span className="h-px w-8 bg-rose-500/30"></span>
          </div>
        </div>

        {/* --- LOGIN BOX --- */}
        <div className="w-full bg-[#0D0F14]/90 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl hover:border-rose-500/20 transition-all">
          <form className="space-y-5" onSubmit={handleAdminLogin}>
            
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Admin Identity</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-rose-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-rose-600 outline-none transition-all placeholder:text-gray-800"
                  placeholder="admin@smartdesk.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-rose-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-rose-600 outline-none transition-all placeholder:text-gray-800"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            <div className="h-4">
              {error && (
                <p className="text-[10px] font-black text-rose-500 text-center animate-pulse tracking-widest">
                  {error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 px-4 mt-2 rounded-2xl font-black text-white bg-rose-700 hover:bg-rose-600 disabled:bg-rose-900/50 transition-all shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 group uppercase tracking-widest text-[10px] active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Establish Connection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-[9px] text-gray-700 font-bold uppercase tracking-[0.2em] text-center max-w-50 leading-relaxed">
          System secured by Smart Desk AI v2.4. Unauthorized access attempts are monitored.
        </p>
      </div>
    </div>
  );
}