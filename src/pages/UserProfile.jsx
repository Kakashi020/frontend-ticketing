import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, Mail, ShieldCheck, MapPin, LogOut, ChevronLeft, 
  Camera, Calendar, ShieldAlert, CheckCircle2, Fingerprint, 
  Loader2, X, Save 
} from 'lucide-react';
import { API_BASE_URL } from '../config';
export default function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal & Edit States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
      try {
        const parsed = JSON.parse(savedUser);
        setUserData(parsed);
        setEditName(parsed.fullName);
      } catch {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Hits your new @PutMapping("/user/{id}") in AuthController
      const response = await axios.put(`${API_BASE_URL}/api/auth/user/${userData.id}`, {
        ...userData,
        fullName: editName
      });
      
      const updatedUser = response.data;
      setUserData(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditModalOpen(false);
      alert("Profile Updated!");
    } catch (err) {
      console.error("Update failed", err);
      alert("Could not update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <Loader2 className="text-indigo-500 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans p-6 lg:p-12 relative overflow-hidden">
      
      {/* --- EDIT IDENTITY MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60 animate-in fade-in duration-300">
          <div className="bg-[#161B22] border border-white/10 w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase tracking-tighter">Edit Identity</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#0D1117] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  placeholder="Enter new name"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isUpdating}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black text-white uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
              >
                {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEADER NAVIGATION */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-400 transition-all mb-10 group uppercase text-[10px] font-black tracking-widest"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-80 space-y-6 text-left">
          <div className="bg-[#161B22] border border-white/5 rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 opacity-50"></div>
            <div className="relative z-10">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-4xl font-black border-4 border-[#161B22] shadow-2xl">
                  {userData.fullName?.charAt(0) || 'U'}
                </div>
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-1">{userData.fullName}</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                <ShieldCheck size={12} className="text-indigo-400" />
                <p className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em]">
                    {userData.role?.replace('ROLE_', '') || 'CUSTOMER'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#161B22] border border-white/5 rounded-[2.5rem] p-8 shadow-xl text-left">
             <div className="flex justify-between items-center mb-6">
                <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Trust Score</h4>
                <span className="text-indigo-400 text-xs font-black">88%</span>
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center"><CheckCircle2 size={14} className="text-emerald-500" /></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase">Verified ID</p>
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">{userData.customerId}</p>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 space-y-6 text-left">
          <div className="bg-[#161B22] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-10 right-10 opacity-[0.02]"><Fingerprint size={120} /></div>
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-2"><User size={16} /> Personal Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 relative z-10 text-left">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Display Name</label>
                <p className="text-lg font-bold text-gray-100">{userData.fullName}</p>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Communication Email</label>
                <p className="text-lg font-bold text-gray-100">{userData.email}</p>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><MapPin size={12} /> Resident Location</label>
                <p className="text-lg font-bold text-gray-100">Mumbai, India</p>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> Account Created</label>
                <p className="text-lg font-bold text-gray-100">March 2026</p>
              </div>
            </div>
            <hr className="my-12 border-white/5" />
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 py-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Update Profile Info
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
              >
                <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> 
                Terminate Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}