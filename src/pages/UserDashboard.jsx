import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, TicketPlus, LogOut, User, CheckCircle, 
  Clock, AlertCircle, ShieldCheck, Timer, Calendar, 
  Mail, MapPin, Phone, RefreshCcw, RotateCcw, MessageSquare, X, Send
} from 'lucide-react';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [view, setView] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // --- FEEDBACK MODAL STATES ---
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  // --- 1. INITIAL LOAD ---
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try {
            setUserData(JSON.parse(savedUser));
        } catch {
            console.error("Session corrupted");
            navigate('/login');
        }
    } else {
        navigate('/login');
    }
  }, [navigate]);

  // --- 2. LIVE POLLING & FILTERING ---
  const fetchTickets = async () => {
    if (!userData) return;
    setIsSyncing(true);
    try {
      const res = await axios.get('http://localhost:8080/api/tickets');
      const myTickets = res.data
        .filter(t => t.email === userData.email)
        .sort((a, b) => b.id - a.id);
      setTickets(myTickets);
    } catch (err) {
      console.error("Polling sync failed:", err);
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  useEffect(() => {
    if (userData) {
        fetchTickets();
        const pollInterval = setInterval(fetchTickets, 5000);
        return () => clearInterval(pollInterval);
    }
  }, [userData]);

  // --- 3. HANDSHAKE ACTIONS ---
  const handleResolutionHandshake = async (ticketId, action, feedback = "") => {
    try {
      await axios.patch(`http://localhost:8080/api/tickets/${ticketId}/${action}`, {
        feedback: feedback
      });
      setIsFeedbackModalOpen(false);
      setFeedbackText('');
      fetchTickets(); 
    } catch {
      alert("Action failed. Check backend connection.");
    }
  };

  const openRejectModal = (id) => {
    setActiveTicketId(id);
    setIsFeedbackModalOpen(true);
  };

  // Helper to format date strings for rendering
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateERTString = (createdDate, priority) => {
    const created = new Date(createdDate);
    const estimated = new Date(created);
    switch (priority) {
      case "Critical": estimated.setHours(created.getHours() + 4); break;
      case "High": estimated.setHours(created.getHours() + 8); break;
      case "Medium": estimated.setHours(created.getHours() + 12); break;
      default: estimated.setDate(created.getDate() + 1);
    }
    // CRITICAL FIX: Return a string, not a Date object
    return `${estimated.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} | ${estimated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const stats = [
    { label: 'Pending Action', count: tickets.filter(t => t.status === 'PENDING_CONFIRMATION').length, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Fully Resolved', count: tickets.filter(t => t.status === 'RESOLVED').length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  // --- LOADING GUARD ---
  if (!userData) return null;

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-indigo-500/30 relative">
      
      {/* --- REJECTION FEEDBACK MODAL --- */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60 animate-in fade-in duration-300">
          <div className="bg-[#161B22] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-left">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-rose-500">
                <MessageSquare size={20} />
                <h2 className="text-lg font-black uppercase tracking-tighter">Resolution Feedback</h2>
              </div>
              <button onClick={() => setIsFeedbackModalOpen(false)} className="text-gray-500 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            <p className="text-[11px] text-gray-400 font-medium italic mb-4">Please let the admin know why the solution didn't work for you.</p>
            <textarea 
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="e.g. My internet is still slow..."
              rows="4"
              className="w-full bg-[#0D1117] border border-white/5 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none mb-6"
            />
            <button 
              onClick={() => handleResolutionHandshake(activeTicketId, 'reject-resolve', feedbackText)}
              className="w-full bg-rose-600 hover:bg-rose-500 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Send size={14} /> Reopen Ticket
            </button>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#161B22] border-r border-white/5 flex flex-col p-6 hidden md:flex shrink-0 text-left">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" onClick={() => setView('overview')}>
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
             <ShieldCheck className="text-white" size={24} />
           </div>
           <span className="font-black uppercase tracking-tighter text-lg">Smart Desk</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setView('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${view === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:bg-white/5'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => navigate('/raise-ticket')} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-gray-400 hover:bg-white/5 transition-all">
            <TicketPlus size={18} /> Raise Ticket
          </button>
          <button onClick={() => setView('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${view === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:bg-white/5'}`}>
            <User size={18} /> My Profile
          </button>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="flex items-center gap-3 px-4 py-3 text-rose-500 font-bold text-sm mt-auto hover:bg-rose-500/10 rounded-2xl transition-all">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {view === 'overview' ? (
          <div className="animate-in fade-in duration-500 text-left">
            <header className="flex justify-between items-center mb-10">
              <div>
                <div className="flex items-center gap-3 mb-1 text-left">
                  <h1 className="text-4xl font-black tracking-tight uppercase">Dashboard</h1>
                  {isSyncing && <RefreshCcw size={14} className="animate-spin text-indigo-500 opacity-50" />}
                </div>
                <p className="text-gray-500 font-medium italic">Welcome back, {userData?.fullName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Customer ID</p>
                <p className="font-mono text-indigo-400 font-black tracking-tighter">{userData?.customerId || (userData?.id ? `CID-${userData.id}` : 'CID-SYNCING')}</p>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {stats.map((item, index) => (
                <div key={index} className="bg-[#161B22] p-6 rounded-3xl border border-white/5 shadow-xl transition-all text-left">
                  <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-inner`}><item.icon size={24} /></div>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-1">{item.label}</p>
                  <h3 className="text-3xl font-black">{item.count}</h3>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4 text-left ml-2">Request History</h2>
              
              {tickets.length > 0 ? tickets.map((ticket) => {
                const ertString = calculateERTString(ticket.createdDate, ticket.priority);
                
                return (
                  <div key={ticket.id} className={`bg-[#161B22] border border-white/5 p-7 rounded-[2.5rem] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 group hover:border-indigo-500/30 transition-all shadow-lg ${ticket.status === 'RESOLVED' ? 'opacity-60' : ''}`}>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md uppercase">#SD-{ticket.id}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          ticket.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                          ticket.status === 'PENDING_CONFIRMATION' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-gray-100 mb-2">{ticket.subject}</h3>
                      <div className="flex items-center gap-4 text-gray-600 text-[10px] font-black tracking-widest uppercase">
                        <span className="flex items-center gap-1"><Calendar size={12}/> {formatDate(ticket.createdDate)}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {formatTime(ticket.createdDate)}</span>
                      </div>
                    </div>

                    <div className="w-full lg:w-72">
                      {ticket.status === 'RESOLVED' ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-center gap-2 text-emerald-500">
                          <CheckCircle size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Case Closed</span>
                        </div>
                      ) : ticket.status === 'PENDING_CONFIRMATION' ? (
                        <div className="space-y-3 bg-indigo-600/5 p-4 rounded-2xl border border-indigo-500/20 animate-in zoom-in-95 duration-300">
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] text-center mb-1">Satisfied with the fix?</p>
                          <div className="flex gap-2">
                            <button onClick={() => handleResolutionHandshake(ticket.id, 'confirm-resolve')} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"><CheckCircle size={12}/> Yes</button>
                            <button onClick={() => openRejectModal(ticket.id)} className="flex-1 py-2.5 bg-rose-600/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"><RotateCcw size={12}/> No</button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-black/20 border border-white/5 p-4 rounded-2xl">
                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2 justify-center"><Timer size={12}/> ERT Estimate</p>
                          <p className="text-[10px] font-black text-indigo-400 text-center tracking-tighter uppercase">{ertString}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-[2.5rem] opacity-30">
                   <p className="text-xs font-black uppercase tracking-widest">No tickets in system</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 duration-500 text-left max-w-4xl">
             <h1 className="text-4xl font-black tracking-tight uppercase mb-8">My Profile</h1>
             <div className="bg-[#161B22] border border-white/5 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[50px] rounded-full"></div>
                <div className="flex items-center gap-8 mb-16 relative z-10">
                   <div className="w-24 h-24 bg-indigo-600 rounded-[2.2rem] flex items-center justify-center text-3xl font-black shadow-xl border-4 border-[#161B22]">{userData?.fullName?.charAt(0)}</div>
                   <div><h2 className="text-3xl font-black">{userData?.fullName}</h2><p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">{userData?.role?.replace('ROLE_', '')}</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-16 relative z-10">
                   <div className="space-y-1"><label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><Mail size={12}/> Email Address</label><p className="text-lg font-bold text-gray-100">{userData?.email}</p></div>
                   <div className="space-y-1"><label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={12}/> Global ID</label><p className="text-lg font-mono text-indigo-400 font-black tracking-tighter">{userData?.customerId || `CID-${userData?.id}`}</p></div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}