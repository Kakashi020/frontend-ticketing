import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldCheck, Users, Activity, BarChart3, 
  LogOut, Mail, Phone, Trash2, X, Clock, CheckCircle2, 
  Loader2, Search, UserCheck, History 
} from 'lucide-react';

export default function UserRecords() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. FETCH ALL CUSTOMERS FROM BACKEND ---
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/auth/users');
        // Filter to only show Customers (excludes Admins)
        const customerList = res.data.filter(u => u.role === 'ROLE_CUSTOMER');
        setCustomers(customerList);
      } catch (err) {
        console.error("Database connection error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // --- 2. FETCH HISTORY FOR THE SLIDE-OVER ---
  const handleUserClick = async (user) => {
    setSelectedUser(user);
    try {
      const res = await axios.get('http://localhost:8080/api/tickets');
      // Link tickets to this user by their email
      const filtered = res.data.filter(t => t.email === user.email);
      setUserTickets(filtered.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Error fetching user history:", err);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#05070A] text-white font-sans relative">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0D0F14] border-r border-white/5 flex flex-col p-6 hidden md:flex shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/admin-dashboard')}>
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <span className="font-black uppercase tracking-tighter text-lg">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-2 text-left">
          <button onClick={() => navigate('/admin-dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white font-bold text-sm transition-all">
            <Activity size={18} /> Command Center
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-rose-600 rounded-2xl font-bold text-sm text-white shadow-lg shadow-rose-600/10">
            <Users size={18} /> Customer Records
          </button>
          <button onClick={() => navigate('/admin-reports')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white font-bold text-sm transition-all">
            <BarChart3 size={18} /> Weka Reports
          </button>
        </nav>
        <button onClick={() => navigate('/login')} className="flex items-center gap-3 px-4 py-3 text-rose-500 font-bold text-sm mt-auto hover:bg-rose-500/10 rounded-2xl transition-all">
          <LogOut size={18} /> Exit Portal
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="text-left">
            <h1 className="text-4xl font-black tracking-tight uppercase">Customer Database</h1>
            <p className="text-gray-500 font-medium italic">Click a customer to view their audit trail.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input 
              type="text" 
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0D0F14] border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-rose-600 outline-none transition-all"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
             <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-rose-600" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Accessing Cloud Server...</p>
             </div>
          ) : filteredCustomers.map((u) => (
            <div 
              key={u.id} 
              onClick={() => handleUserClick(u)}
              className="bg-[#0D0F14] border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-rose-500/40 hover:bg-white/[0.02] cursor-pointer transition-all shadow-xl"
            >
              <div className="flex items-center gap-6 text-left">
                <div className="w-14 h-14 bg-rose-600/10 border border-rose-500/20 rounded-2xl flex items-center justify-center font-black text-rose-500 text-xl group-hover:scale-110 transition-transform">
                  {u.fullName[0]}
                </div>
                <div>
                  <h3 className="text-xl font-black">{u.fullName}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md font-black uppercase tracking-tighter">
                       {u.customerId || 'CID-NEW'}
                    </span>
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-1">
                       <UserCheck size={10} className="text-emerald-500"/> Verified Client
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex gap-10 text-gray-400">
                <div className="flex items-center gap-2 text-xs font-bold"><Mail size={14} className="text-rose-500/50"/> {u.email}</div>
                <div className="flex items-center gap-2 text-xs font-bold"><Phone size={14} className="text-rose-500/50"/> {u.profile?.phoneNumber || "Not Set"}</div>
              </div>
              <button className="p-3 text-gray-700 hover:text-rose-500 transition-colors"><Trash2 size={18}/></button>
            </div>
          ))}
        </div>
      </main>

      {/* --- SLIDE-OVER PANEL --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setSelectedUser(null)}></div>
          
          <aside className="relative w-full max-w-lg bg-[#0D0F14] border-l border-white/10 p-10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
            <button onClick={() => setSelectedUser(null)} className="absolute top-8 right-8 p-2 text-gray-500 hover:text-white transition-all"><X size={24} /></button>

            <header className="mb-10 text-left">
              <div className="w-16 h-16 bg-rose-600 rounded-3xl flex items-center justify-center font-black text-2xl mb-4 shadow-xl shadow-rose-600/30">{selectedUser.fullName[0]}</div>
              <h2 className="text-3xl font-black text-white">{selectedUser.fullName}</h2>
              <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Audit Trail & Interactions</p>
            </header>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-left">
              <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><History size={14}/> Recent Interaction Logs</h3>
              
              {userTickets.length > 0 ? userTickets.map(ticket => (
                <div key={ticket.id} className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl hover:border-rose-500/20 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-mono text-gray-600 font-black tracking-tighter">#SD-{ticket.id}</span>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{ticket.status}</div>
                  </div>
                  <h4 className="font-bold text-gray-100 mb-1 group-hover:text-rose-400 transition-colors">{ticket.subject}</h4>
                  <div className="flex items-center gap-3 mt-3 opacity-60 text-[9px] font-black uppercase tracking-widest text-gray-400">
                    <span>{new Date(ticket.createdDate).toLocaleDateString()}</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <span>{new Date(ticket.createdDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem]">
                  <p className="text-gray-700 font-black uppercase tracking-widest text-[10px]">No historical data found</p>
                </div>
              )}
            </div>
            
            <button className="mt-8 w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white">Export Audit Trail</button>
          </aside>
        </div>
      )}
    </div>
  );
}