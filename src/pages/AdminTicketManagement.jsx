import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldCheck, Users, Ticket, BarChart3, 
  LogOut, CheckCircle, AlertTriangle, Activity,
  Search, Filter, Loader2, MessageSquare, Cpu, ShieldAlert, X
} from 'lucide-react';

export default function AdminTicketManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- NEW FILTER STATES ---
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterUser, setFilterUser] = useState('All');

  const fetchTickets = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/tickets');
      setTickets(res.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000); 
    return () => clearInterval(interval);
  }, []);

  const handleProposeResolve = async (id) => {
    try {
      await axios.patch(`http://localhost:8080/api/tickets/${id}/resolve`);
      fetchTickets();
    } catch {
      alert("Handshake initiation failed.");
    }
  };

  const stats = [
    { label: 'Total Tickets', count: tickets.length, icon: Ticket, color: 'text-white', bg: 'bg-white/5' },
    { label: 'Critical (AI/Rules)', count: tickets.filter(t => t.priority === 'Critical').length, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Awaiting User', count: tickets.filter(t => t.status === 'PENDING_CONFIRMATION').length, icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  // --- UPDATED FILTER LOGIC ---
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toString().includes(searchTerm);
    const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
    const matchesUser = filterUser === 'All' || t.email === filterUser;

    return matchesSearch && matchesPriority && matchesUser;
  });

  // Get unique list of user emails for the dropdown
  const uniqueUsers = [...new Set(tickets.map(t => t.email))].filter(Boolean);

  return (
    <div className="flex min-h-screen bg-[#05070A] text-white font-sans selection:bg-rose-500/30">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0D0F14] border-r border-white/5 flex flex-col p-6 hidden sm:flex shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/admin-dashboard')}>
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="font-black uppercase tracking-tighter text-lg italic">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-2 text-left">
          {[{ name: 'Command Center', path: '/admin-dashboard', icon: Activity },
            { name: 'User Records', path: '/admin-users', icon: Users },
            { name: 'Weka Reports', path: '/admin-reports', icon: BarChart3 }
          ].map((item) => (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                location.pathname === item.path ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-gray-500 hover:text-white'
              }`}
            >
              <item.icon size={18} /> {item.name}
            </button>
          ))}
        </nav>

        <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="flex items-center gap-3 px-4 py-3 text-rose-500 font-bold text-sm mt-auto hover:bg-rose-500/10 rounded-2xl transition-all">
          <LogOut size={18} /> Exit Portal
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="text-left">
            <h1 className="text-4xl font-black tracking-tight uppercase">System Overview</h1>
            <p className="text-gray-500 font-medium italic">Classification Protocol Active (Hybrid Layered Model)</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input 
              type="text" placeholder="Search ID or Subject..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs w-full text-white outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((item, index) => (
            <div key={index} className="bg-[#0D0F14] p-6 rounded-3xl border border-white/5 text-left transition-transform hover:scale-[1.02]">
              <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-inner`}><item.icon size={24} /></div>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-1">{item.label}</p>
              <h3 className="text-3xl font-black">{loading ? '...' : item.count}</h3>
            </div>
          ))}
        </div>

        {/* --- DYNAMIC FILTER BAR --- */}
        <div className="flex flex-wrap gap-4 mb-8 items-center bg-[#0D0F14]/50 p-4 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 px-2 text-gray-500"><Filter size={14}/> <span className="text-[10px] font-black uppercase tracking-widest">Sort By:</span></div>
          
          <div className="flex bg-[#05070A] p-1 rounded-2xl border border-white/5">
            {['All', 'Critical', 'High', 'Medium', 'Low'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  filterPriority === p ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-gray-500 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <select 
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="bg-[#05070A] border border-white/5 rounded-2xl px-4 py-2 text-[9px] font-black uppercase tracking-widest text-gray-400 outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
          >
            <option value="All">All Customer Emails</option>
            {uniqueUsers.map(email => (
              <option key={email} value={email}>{email}</option>
            ))}
          </select>

          {(filterPriority !== 'All' || filterUser !== 'All') && (
            <button 
              onClick={() => { setFilterPriority('All'); setFilterUser('All'); }}
              className="flex items-center gap-2 px-3 py-2 text-rose-500 text-[9px] font-black uppercase tracking-widest hover:bg-rose-500/10 rounded-xl transition-all"
            >
              <X size={12}/> Reset
            </button>
          )}
        </div>

        {/* TICKET TABLE */}
        <div className="bg-[#0D0F14] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-500 bg-white/5">
                <th className="px-6 py-5 font-black">Ticket & Origin</th>
                <th className="px-6 py-5 font-black">Feedback / Description</th>
                <th className="px-6 py-5 font-black text-rose-500">Intelligence</th>
                <th className="px-6 py-5 font-black">Status</th>
                <th className="px-6 py-5 font-black text-center">Handshake</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-medium">
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-rose-500" /></td></tr>
              ) : filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-6 py-5">
                    <p className="text-gray-600 font-mono text-[9px] font-black uppercase mb-1">#SD-{ticket.id}</p>
                    <p className="text-gray-100 font-black mb-2">{ticket.subject}</p>
                    <span className={`flex items-center gap-1.5 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border w-fit ${
                      ticket.classificationSource === 'Rule Match' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {ticket.classificationSource === 'Rule Match' ? <ShieldAlert size={10}/> : <Cpu size={10}/>}
                      {ticket.classificationSource || 'System'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-5">
                    {ticket.feedback ? (
                      <div className="flex items-start gap-2 text-rose-400 bg-rose-500/5 p-3 rounded-2xl border border-rose-500/10 max-w-xs animate-in slide-in-from-left-2">
                        <MessageSquare size={14} className="shrink-0 mt-1" />
                        <p className="text-[10px] leading-relaxed italic font-bold">"{ticket.feedback}"</p>
                      </div>
                    ) : (
                      <p className="text-gray-700 text-[10px] uppercase font-bold italic line-clamp-2 max-w-xs">{ticket.description}</p>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border w-fit ${
                        ticket.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 
                        ticket.priority === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>{ticket.priority || 'Analyzing'}</span>
                      
                      <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1 opacity-60">
                        Dept: {ticket.category || 'General'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        ticket.status === 'RESOLVED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                        ticket.status === 'PENDING_CONFIRMATION' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse' : 'bg-rose-500'
                      }`}></span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        ticket.status === 'RESOLVED' ? 'text-emerald-500' : 
                        ticket.status === 'PENDING_CONFIRMATION' ? 'text-amber-500' : 'text-gray-500'
                      }`}>{ticket.status?.replace('_', ' ') || 'Open'}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <button 
                      onClick={() => handleProposeResolve(ticket.id)}
                      disabled={ticket.status === 'RESOLVED' || ticket.status === 'PENDING_CONFIRMATION'}
                      className={`p-3 rounded-2xl transition-all ${
                        ticket.status === 'RESOLVED' || ticket.status === 'PENDING_CONFIRMATION'
                          ? 'text-gray-800 bg-white/5 cursor-not-allowed opacity-50' 
                          : 'text-gray-600 hover:text-emerald-500 hover:bg-emerald-500/10 hover:scale-110 active:scale-95 shadow-xl'
                      }`}
                      title={ticket.status === 'PENDING_CONFIRMATION' ? "Waiting for User" : "Initialize Resolution Handshake"}
                    >
                      <CheckCircle size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTickets.length === 0 && !loading && (
            <div className="py-20 text-center text-gray-600 font-bold uppercase tracking-[0.3em] text-[10px]">
              No tickets found matching current filters
            </div>
          )}
        </div>
      </main>
    </div>
  );
}