import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldCheck, LayoutDashboard, TicketPlus, History, User, 
  LogOut, Send, Zap, Sparkles, MessageSquare, AlertCircle,
  Loader2, CheckCircle2, ArrowRight
} from 'lucide-react';

export default function RaiseTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ subject: '', category: 'Hardware', description: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUserData(JSON.parse(savedUser));
  }, []);

  // --- PRE-MADE COMPLAINTS (Weka Training Data) ---
  const quickComplaints = [
    { title: "Refund Request", desc: "I want a refund for my last order as the item was damaged.", cat: "Billing", icon: "💰" },
    { title: "Security Breach", desc: "I suspect someone else has accessed my account unauthorized.", cat: "Security", icon: "🛡️" },
    { title: "Delivery Delayed", desc: "My package is 5 days late and tracking is not updating.", cat: "Shipping", icon: "📦" },
    { title: "Technical Glitch", desc: "The checkout button is not working on the mobile app.", cat: "Technical", icon: "⚙️" },
    { title: "Wrong Item", desc: "I received a different product than what I ordered.", cat: "Returns", icon: "🔄" },
    { title: "Payment Failed", desc: "Money was debited but order status shows pending.", cat: "Billing", icon: "💳" }
  ];

  const handleQuickSelect = (item) => {
    setFormData({ subject: item.title, category: item.cat, description: item.desc });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8080/api/tickets', {
        ...formData,
        fullName: userData?.fullName,
        email: userData?.email
      });
      setShowSuccess(true);
    } catch (err) {
      console.error("Submission failed", err);
      alert("Error connecting to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-indigo-500/30">
      
      {/* --- SUCCESS MODAL --- */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40 animate-in fade-in duration-300">
          <div className="bg-[#161B22] border border-white/10 w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <CheckCircle2 className="text-emerald-500 animate-bounce" size={40} />
            </div>
            <h2 className="text-2xl font-black mb-2 tracking-tight">Ticket Dispatched!</h2>
            <p className="text-gray-500 text-sm mb-8 italic">Weka AI is now routing your request.</p>
            <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 group transition-all shadow-lg shadow-indigo-600/20">
              Back to Hub <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#161B22] border-r border-white/5 flex flex-col p-6 hidden md:flex shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" onClick={() => navigate('/dashboard')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <ShieldCheck size={24} />
          </div>
          <span className="font-black uppercase tracking-tighter text-lg">Smart Desk</span>
        </div>
        <nav className="flex-1 space-y-2 text-left">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-2xl font-bold text-sm transition-all"><LayoutDashboard size={18} /> Dashboard</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all"><TicketPlus size={18} /> Raise Ticket</button>
          <button onClick={() => navigate('/history')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-2xl font-bold text-sm transition-all"><History size={18} /> History</button>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-2xl font-bold text-sm transition-all"><User size={18} /> Profile</button>
        </nav>
        <button onClick={() => navigate('/login')} className="flex items-center gap-3 px-4 py-3 text-rose-500 font-bold text-sm mt-auto hover:bg-rose-500/10 rounded-2xl transition-all"><LogOut size={18} /> Logout</button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col items-center justify-start p-8 lg:p-12 overflow-y-auto">
        
        {/* CENTERED HEADER */}
        <div className="max-w-4xl w-full text-center mb-12">
          <div className="flex justify-center mb-4">
             <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Powered by Naive Bayes AI</span>
             </div>
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-2 uppercase">Create Request</h1>
          <p className="text-gray-500 font-medium italic">Select a template or describe your issue below.</p>
        </div>

        {/* HORIZONTAL SCROLL COMPLAINTS */}
        <div className="max-w-6xl w-full mb-12">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-6 text-left ml-2 flex items-center gap-2">
            <Zap size={14} className="text-amber-500" /> Common Quick Actions
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {quickComplaints.map((item, i) => (
              <button 
                key={i}
                onClick={() => handleQuickSelect(item)}
                className="flex-shrink-0 w-64 bg-[#161B22] border border-white/5 p-6 rounded-[2rem] text-left hover:border-indigo-500/40 transition-all group shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="text-2xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="font-black text-gray-200 mb-1 group-hover:text-indigo-400 transition-colors uppercase text-xs tracking-wider">{item.title}</h3>
                <p className="text-[10px] text-gray-600 line-clamp-2 leading-relaxed font-bold">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CENTERED FORM */}
        <div className="max-w-3xl w-full bg-[#161B22] border border-white/5 p-10 rounded-[3rem] shadow-2xl relative">
          <div className="absolute top-0 right-10 -translate-y-1/2 flex gap-2">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 border-4 border-[#0B0F19]">
                <MessageSquare size={20} />
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                <input 
                  type="text" required value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-[#0D1117] border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-gray-800"
                  placeholder="Summarize the issue..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Department</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#0D1117] border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer appearance-none"
                >
                  <option>Hardware</option><option>Software</option><option>Network</option><option>Billing</option><option>Security</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Description</label>
              <textarea 
                rows="5" required value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-[#0D1117] border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all resize-none placeholder:text-gray-800"
                placeholder="Describe your request in detail for AI classification..."
              ></textarea>
            </div>

            <button 
              type="submit" disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {isSubmitting ? "Processing AI Analysis..." : "DISPATCH TICKET"}
            </button>
          </form>
        </div>

        <p className="mt-10 text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">
          Priority is automatically calculated based on sentiment analysis
        </p>
      </main>
    </div>
  );
}