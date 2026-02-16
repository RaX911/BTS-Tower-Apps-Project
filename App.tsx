import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, SubscriptionPlan, BTSInfo, CellIntelligence } from './types';
import { CONTACT_INFO, PRICING_PLANS, PROVINCES } from './constants';
import { generateRandomBTS, intelLookup } from './services/mockData';
import { 
  Activity, 
  Database, 
  Map as MapIcon, 
  Key, 
  ShieldCheck, 
  User as UserIcon, 
  LayoutDashboard, 
  Terminal, 
  Search, 
  Globe,
  Radio,
  ExternalLink,
  Lock,
  ShieldAlert,
  Cpu,
  Wifi,
  Zap,
  RefreshCw,
  Users,
  PlusCircle,
  X,
  Trash2,
  CheckCircle2,
  Signal,
  ArrowRightLeft
} from 'lucide-react';

// --- Utility Functions ---
const generateToken = (prefix: string = 'NT') => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = () => Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}-${segment()}-${segment()}-${segment()}`;
};

// --- Sub-components ---
const Badge = ({ children, variant = 'blue' }: any) => {
  const styles: any = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[variant]}`}>
      {children}
    </span>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={18} />
    <span className="font-semibold text-sm">{label}</span>
  </button>
);

const App: React.FC = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [msisdnInput, setMsisdnInput] = useState('');
  const [lookupResult, setLookupResult] = useState<CellIntelligence | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [extractionStep, setExtractionStep] = useState(0);

  // New User Form
  const [newUserForm, setNewUserForm] = useState({ username: '', password: '', plan: SubscriptionPlan.TRIAL });

  // Auth States
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER' | 'ADMIN'>('LOGIN');
  const [formData, setFormData] = useState({ username: '', password: '' });

  // --- Effects ---
  useEffect(() => {
    const saved = localStorage.getItem('nusantara_session');
    if (saved) setCurrentUser(JSON.parse(saved));
    
    const users = JSON.parse(localStorage.getItem('nusantara_users') || '[]');
    setAllUsers(users);

    addLog('System Kernel v3.1.0-STABLE Initialized...');
    addLog('RTL-SDR RF-Link established at 1.8GHz Center Frequency');
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'ADMIN') {
      if (formData.username === 'admin' && formData.password === 'masterkey911') {
        const admin: User = {
          id: 'root-001',
          username: 'System_Admin',
          role: UserRole.ADMIN,
          plan: SubscriptionPlan.VIP,
          apiKey: 'NT-ROOT-MASTER-ACCESS',
          dataUsage: 0,
          registeredAt: new Date().toISOString()
        };
        setCurrentUser(admin);
        localStorage.setItem('nusantara_session', JSON.stringify(admin));
        addLog('ADMIN PRIVILEGE AUTHORIZED');
      } else {
        alert('MASTER KEY INVALID');
      }
    } else if (authMode === 'LOGIN') {
      const user = allUsers.find(u => u.username === formData.username && u.password === formData.password);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('nusantara_session', JSON.stringify(user));
        addLog(`Session started for Node: ${user.username}`);
      } else {
        alert('NODE IDENTITY NOT FOUND');
      }
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: formData.username,
        password: formData.password,
        role: UserRole.USER,
        plan: SubscriptionPlan.TRIAL,
        apiKey: generateToken(),
        dataUsage: 0,
        registeredAt: new Date().toISOString()
      };
      const updated = [...allUsers, newUser];
      setAllUsers(updated);
      localStorage.setItem('nusantara_users', JSON.stringify(updated));
      setCurrentUser(newUser);
      localStorage.setItem('nusantara_session', JSON.stringify(newUser));
      addLog('New Node Provisioned automatically');
    }
  };

  const handleLookup = () => {
    if (!msisdnInput.match(/^62\d+$/)) {
      alert('Format invalid. Use 628xxx');
      return;
    }
    setIsSearching(true);
    setLookupResult(null);
    setExtractionStep(1);
    
    addLog(`INITIATING IMSI CATCHER FOR TARGET: +${msisdnInput}`);
    
    // Simulate "Extraction Steps"
    setTimeout(() => { setExtractionStep(2); addLog('RF SCANNING COMPLETE. FREQUENCY LOCKED.'); }, 1000);
    setTimeout(() => { setExtractionStep(3); addLog('SIGNAL "TEMBAK" SUCCESSFUL. INJECTING UPLINK PACKETS...'); }, 2000);
    
    setTimeout(() => {
      const result = intelLookup(msisdnInput);
      setLookupResult(result);
      setIsSearching(false);
      setExtractionStep(0);
      addLog(`DATA CAPTURED! Linked BTS: ${result.lastCellId} (${result.operator})`);
    }, 3500);
  };

  const handleCreateUser = () => {
    if (!newUserForm.username || !newUserForm.password) return;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: newUserForm.username,
      password: newUserForm.password,
      role: UserRole.USER,
      plan: newUserForm.plan,
      apiKey: generateToken(newUserForm.plan.substring(0, 2).toUpperCase()),
      dataUsage: 0,
      registeredAt: new Date().toISOString()
    };
    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    localStorage.setItem('nusantara_users', JSON.stringify(updated));
    setNewUserForm({ username: '', password: '', plan: SubscriptionPlan.TRIAL });
    setShowAddUserModal(false);
    addLog(`Admin manually provisioned node: ${newUser.username}`);
  };

  const deleteUser = (id: string) => {
    if (confirm('DEAUTHORIZE THIS NODE?')) {
      const updated = allUsers.filter(u => u.id !== id);
      setAllUsers(updated);
      localStorage.setItem('nusantara_users', JSON.stringify(updated));
      addLog(`Node Deauthorized: ${id}`);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#1e1b4b,_#000)]">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-1 shadow-2xl">
          <div className="bg-[#111] p-10 rounded-[2.4rem] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 scanner-line"></div>
            <div className="text-center mb-10">
              <div className="inline-flex p-4 rounded-2xl bg-blue-600/10 text-blue-500 mb-4 border border-blue-500/20">
                {authMode === 'ADMIN' ? <ShieldAlert size={32} /> : <Radio size={32} />}
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">Cell-Intel <span className="text-blue-500">Pro</span></h1>
              <p className="text-[10px] text-gray-500 mt-2 font-mono uppercase tracking-widest">Global Cellular Intelligence v3.1</p>
            </div>

            <div className="flex bg-black p-1 rounded-xl mb-8 border border-white/5">
              <button onClick={() => setAuthMode('LOGIN')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${authMode === 'LOGIN' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>LOGIN</button>
              <button onClick={() => setAuthMode('REGISTER')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${authMode === 'REGISTER' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>REGISTER</button>
              <button onClick={() => setAuthMode('ADMIN')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${authMode === 'ADMIN' ? 'bg-red-600/20 text-red-500' : 'text-gray-500'}`}>ADMIN</button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <input required className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 text-white text-sm" placeholder="Identity UID" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              <input required type="password" className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 text-white text-sm" placeholder="Access Key" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-lg shadow-blue-900/20">Initialize Link</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 p-6 flex flex-col">
        <div className="flex items-center space-x-3 text-blue-500 mb-10">
          <Zap size={24} fill="currentColor" />
          <span className="text-xl font-black tracking-tighter text-white">NUSANTARA</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Activity} label="Intel Catcher" active={activeTab === 'intel'} onClick={() => setActiveTab('intel')} />
          <SidebarItem icon={Database} label="BTS Grid" active={activeTab === 'grid'} onClick={() => setActiveTab('grid')} />
          {currentUser.role === UserRole.ADMIN && (
            <SidebarItem icon={Users} label="Admin Panel" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
          )}
          <SidebarItem icon={Terminal} label="System Logs" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
        </nav>

        <div className="pt-6 border-t border-white/5">
          <div className="bg-white/5 p-4 rounded-2xl mb-4 border border-white/5">
             <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Access Status</p>
             <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{currentUser.plan}</span>
                <Badge variant={currentUser.role === UserRole.ADMIN ? 'red' : 'blue'}>{currentUser.role}</Badge>
             </div>
             <p className="text-[9px] font-mono text-blue-500 mt-2 truncate">{currentUser.apiKey}</p>
          </div>
          <button onClick={() => {localStorage.removeItem('nusantara_session'); setCurrentUser(null);}} className="w-full py-3 bg-red-600/10 text-red-500 rounded-xl text-xs font-bold hover:bg-red-600/20 transition-all">TERMINATE</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
             <span className="text-xs font-mono text-gray-400">STATUS: <span className="text-white">ACTIVE UPLINK</span> | REG: <span className="text-blue-500">IDN-NORTH</span></span>
           </div>
           <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">API KEY STATUS</p>
                 <p className="text-xs font-mono text-blue-500 uppercase">VALIDATED</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg border border-white/10 uppercase">
                {currentUser.username.substring(0,2)}
              </div>
           </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in duration-700">
               {[
                 { label: 'Active Signals', val: '2.4M', icon: Wifi, color: 'blue' },
                 { label: 'Capture Rate', val: '99.8%', icon: Zap, color: 'green' },
                 { label: 'Latency', val: '12ms', icon: Activity, color: 'yellow' },
                 { label: 'Nodes Online', val: '154', icon: Cpu, color: 'purple' }
               ].map((s, i) => (
                 <div key={i} className="bg-[#111] border border-white/5 p-6 rounded-3xl">
                    <div className="flex justify-between items-start mb-4">
                       <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{s.label}</p>
                       <s.icon size={16} className={`text-${s.color}-500`} />
                    </div>
                    <h3 className="text-2xl font-black text-white">{s.val}</h3>
                 </div>
               ))}
               
               <div className="md:col-span-4 bg-[#111] border border-white/5 rounded-[2.5rem] p-8 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-12 text-blue-500/5 pointer-events-none group-hover:text-blue-500/10 transition-all">
                     <Globe size={280} />
                  </div>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                     <MapIcon className="text-blue-500" size={20} /> Nusantara Signal Coverage Map
                  </h3>
                  <div className="aspect-video bg-black/40 rounded-3xl border border-white/10 flex items-center justify-center relative">
                     <div className="text-center">
                        <MapIcon size={48} className="text-gray-800 mb-4 mx-auto animate-pulse" />
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest">INITIALIZING VECTOR GRID...</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'intel' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto">
               <div className="bg-[#111] border border-white/5 rounded-[3rem] p-12 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 scanner-line"></div>
                  <h2 className="text-3xl font-black mb-4">MSISDN Signal Extraction</h2>
                  <p className="text-gray-500 text-sm mb-10 max-w-xl mx-auto">Deteksi 100% akurat menggunakan simulasi RTL-SDR & IMSI Catcher. Tembak SIM Card target langsung ke tower BTS asli melalui injeksi frekuensi.</p>
                  
                  <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                    <div className="relative flex-1 group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" size={20} />
                      <input 
                        value={msisdnInput}
                        onChange={e => setMsisdnInput(e.target.value)}
                        placeholder="628xxxx (No target)" 
                        className="w-full pl-14 pr-8 py-5 bg-black border border-white/10 rounded-[1.5rem] focus:outline-none focus:border-blue-500 text-white font-mono"
                      />
                    </div>
                    <button 
                      onClick={handleLookup}
                      disabled={isSearching}
                      className="px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[1.5rem] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSearching ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
                      EXECUTE TEMBAK
                    </button>
                  </div>
                  
                  {isSearching && (
                    <div className="mt-8 space-y-4 animate-in fade-in">
                       <div className="flex items-center justify-center gap-6">
                          <div className={`p-3 rounded-full border ${extractionStep >= 1 ? 'border-blue-500 text-blue-500 bg-blue-500/10' : 'border-white/5 text-gray-700'}`}><Signal size={24} /></div>
                          <div className="h-[2px] w-12 bg-white/5 overflow-hidden"><div className={`h-full bg-blue-500 transition-all duration-1000 ${extractionStep >= 2 ? 'w-full' : 'w-0'}`}></div></div>
                          <div className={`p-3 rounded-full border ${extractionStep >= 2 ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-white/5 text-gray-700'}`}><Radio size={24} /></div>
                          <div className="h-[2px] w-12 bg-white/5 overflow-hidden"><div className={`h-full bg-green-500 transition-all duration-1000 ${extractionStep >= 3 ? 'w-full' : 'w-0'}`}></div></div>
                          <div className={`p-3 rounded-full border ${extractionStep >= 3 ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-white/5 text-gray-700'}`}><ArrowRightLeft size={24} /></div>
                       </div>
                       <p className="text-[10px] font-mono text-blue-500 animate-pulse uppercase tracking-widest">
                          {extractionStep === 1 && 'Scanning RTL-SDR Range...'}
                          {extractionStep === 2 && 'IMSI Frequency Locked...'}
                          {extractionStep === 3 && 'Injecting Signal to BTS Tower...'}
                       </p>
                    </div>
                  )}
               </div>

               {lookupResult && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-[#111] border border-white/5 rounded-[2rem] p-8">
                       <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Identifier Captured</h4>
                       <div className="space-y-4">
                          {[
                            { label: 'MSISDN', value: `+${lookupResult.msisdn}`, highlight: true },
                            { label: 'Carrier', value: lookupResult.operator },
                            { label: 'IMSI', value: lookupResult.imsi },
                            { label: 'IMEI', value: lookupResult.imei },
                            { label: 'Device', value: lookupResult.device }
                          ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                               <span className="text-gray-500 text-[10px] font-bold uppercase">{item.label}</span>
                               <span className={`text-xs font-mono ${item.highlight ? 'text-blue-500 font-bold' : 'text-white'}`}>{item.value}</span>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-[2rem] p-8">
                       <h4 className="text-xs font-black text-green-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">BTS Uplink Connection</h4>
                       <div className="space-y-4">
                          {[
                            { label: 'Signal Strength', value: `${lookupResult.signalStrength} dBm` },
                            { label: 'Locked BTS ID', value: lookupResult.lastCellId },
                            { label: 'Distance Estimate', value: `${lookupResult.timingAdvance} Meters` },
                            { label: 'Accuracy', value: '100% Validated' },
                            { label: 'Frequency', value: `${lookupResult.frequency.toFixed(1)} MHz` }
                          ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                               <span className="text-gray-500 text-[10px] font-bold uppercase">{item.label}</span>
                               <span className="text-xs font-mono text-green-500">{item.value}</span>
                            </div>
                          ))}
                       </div>
                       <div className="mt-6 pt-6 border-t border-white/5">
                          <button onClick={() => window.open(`https://www.google.com/maps?q=${lookupResult.lastLat},${lookupResult.lastLng}`)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Track Signal Source</button>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'admin' && currentUser.role === UserRole.ADMIN && (
            <div className="space-y-8 animate-in fade-in duration-700">
               <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex justify-between items-center">
                     <h3 className="text-xl font-black">Node Node Management</h3>
                     <button onClick={() => setShowAddUserModal(true)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                        <PlusCircle size={16} /> ADD NEW NODE
                     </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                       <thead className="bg-black/40 text-gray-500 font-bold uppercase tracking-widest border-b border-white/5">
                          <tr>
                             <th className="px-8 py-5">UID</th>
                             <th className="px-8 py-5">Identity</th>
                             <th className="px-8 py-5">Tier Access</th>
                             <th className="px-8 py-5">API Key (Token)</th>
                             <th className="px-8 py-5 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5 font-mono">
                          {allUsers.map(user => (
                            <tr key={user.id} className="hover:bg-white/5">
                               <td className="px-8 py-5 text-gray-600">#{user.id.substring(0,6)}</td>
                               <td className="px-8 py-5 font-bold text-gray-300">{user.username}</td>
                               <td className="px-8 py-5">
                                  <Badge variant={user.plan === 'VIP' ? 'purple' : user.plan === 'PREMIUM' ? 'yellow' : 'blue'}>
                                    {user.plan}
                                  </Badge>
                               </td>
                               <td className="px-8 py-5 text-blue-500/80">{user.apiKey}</td>
                               <td className="px-8 py-5 text-right">
                                  <button onClick={() => deleteUser(user.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                                    <Trash2 size={14} />
                                  </button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 max-w-5xl mx-auto">
               <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Terminal size={22} className="text-blue-500" /> Kernel Console</h3>
               <div className="bg-black/60 rounded-3xl p-8 font-mono text-[11px] text-green-500/80 h-[60vh] overflow-y-auto space-y-1 shadow-inner">
                  {logs.map((l, i) => (
                    <p key={i}><span className="opacity-40">{l.substring(0, 10)}</span> {l.substring(10)}</p>
                  ))}
               </div>
            </div>
          )}

        </div>
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
           <div className="max-w-md w-full bg-[#111] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative">
              <button onClick={() => setShowAddUserModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={24}/></button>
              <h3 className="text-2xl font-black mb-8">Provision New Node</h3>
              
              <div className="space-y-5">
                 <input className="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white text-sm" placeholder="Node Identity" value={newUserForm.username} onChange={e => setNewUserForm({...newUserForm, username: e.target.value})} />
                 <input type="password" className="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white text-sm" placeholder="Access Key" value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} />
                 <select 
                    className="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white text-sm appearance-none"
                    value={newUserForm.plan}
                    onChange={e => setNewUserForm({...newUserForm, plan: e.target.value as SubscriptionPlan})}
                 >
                    {Object.values(SubscriptionPlan).map(p => <option key={p} value={p}>{p}</option>)}
                 </select>
                 <button onClick={handleCreateUser} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">VALIDATE NODE</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;