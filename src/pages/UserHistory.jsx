import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  TicketPlus, 
  History, 
  LogOut, 
  User, 
  Clock, 
  CheckCircle,
  ShieldCheck,
  Search,
  AlertCircle
} from 'lucide-react';

export default function UserHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for live data
  const [allTickets, setAllTickets] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // --- FETCH LIVE HISTORY FROM BACKEND ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/tickets');
        // Sort by ID descending to show the most recent tickets at the top
        const sorted = res.data.sort((a, b) => b.id - a.id);
        setAllTickets(sorted);
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const isActive = (path) => location.pathname === path;

  // --- FILTER & SEARCH LOGIC ---
  const filteredTickets = allTickets.filter(ticket => {
    const matchesFilter = filter === 'All' || ticket.status === filter;
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ticket.id.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-white font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#161B22] border-r border-white/5 flex flex-col p-6 hidden md:flex shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" onClick={() => navigate('/dashboard')}>
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
             <ShieldCheck className="text-white" size={24} />
           </div>
           <span className="font-black uppercase tracking-tighter text-lg">Smart Desk</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { name: 'Raise Ticket', path: '/raise-ticket', icon: TicketPlus },
            { name: 'My History', path: '/history', icon: History },
            { name: 'Profile', path: '/profile', icon: User },
          ].map((item) => (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                isActive(item.path) ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <item.icon size={18} /> {item.name}
            </button>
          ))}
        </nav>

        <button onClick={() => navigate('/login')} className="flex items-center gap-3 px-4 py-3 text-rose-500 font-bold text-sm mt-auto hover:bg-rose-500/10 rounded-2xl transition-all">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          <div className="text-left">
            <h1 className="text-4xl font-black tracking-tight">Ticket History</h1>
            <p className="text-gray-500 font-medium italic">Review and track all your logged requests.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type="text"
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#161B22] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none w-full sm:w-64 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex bg-[#161B22] p-1.5 rounded-2xl border border-white/10 shadow-xl">
              {['All', 'Open', 'Resolved'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilter(s)} 
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* --- TICKET LIST --- */}
        <div className="space-y-4">
          {loading ? (
             <div className="py-20 text-center text-gray-600 font-bold uppercase tracking-[0.3em] animate-pulse">Loading Records...</div>
          ) : filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => (
              <div key={ticket.id} className="bg-[#161B22] border border-white/5 p-7 rounded-[2.5rem] flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:border-indigo-500/30 transition-all shadow-lg hover:shadow-indigo-500/5">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {ticket.status === 'Resolved' ? <CheckCircle size={28}/> : <Clock size={28}/>}
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-xl tracking-tight text-gray-100 group-hover:text-indigo-400 transition-colors">{ticket.subject}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-0.5 rounded-md">#SD-{ticket.id}</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">{ticket.category || 'General'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right mt-4 sm:mt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                  <p className="text-sm font-black text-gray-500">{new Date(ticket.createdDate).toLocaleDateString()}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${ticket.status === 'Resolved' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${ticket.status === 'Resolved' ? 'text-emerald-500' : 'text-amber-400'}`}>{ticket.status}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#161B22] border border-dashed border-white/10 rounded-[3rem] p-20 text-center">
              <AlertCircle className="mx-auto text-gray-800 mb-4" size={48} />
              <p className="text-gray-600 font-black uppercase tracking-widest text-sm">No matching tickets found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}