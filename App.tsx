
import React, { useState, useEffect } from 'react';
import { User, UserRole, SubscriptionPlan, BTSInfo, CellIntelligence } from './types.ts';
import { CONTACT_INFO, PRICING_PLANS, PROVINCES } from './constants.tsx';
import { generateRandomBTS, intelLookup } from './services/mockData.ts';
import { 
  Activity, 
  Database, 
  Map as MapIcon, 
  Key, 
  ShieldCheck, 
  User as UserIcon, 
  Menu, 
  X, 
  LayoutDashboard, 
  Terminal, 
  Search, 
  CreditCard,
  MessageSquare,
  Globe,
  Radio,
  ExternalLink,
  Lock,
  UserPlus,
  LogIn,
  ShieldAlert
} from 'lucide-react';

// --- Sub-components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const StatsCard = ({ title, value, subValue, icon: Icon, color }: any) => (
  <div className="bg-[#111] border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-all">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

// --- Auth Components ---

const AuthScreen = ({ onLoginSuccess }: { onLoginSuccess: (user: User) => void }) => {
  const [authMode, setAuthMode] = useState<'USER_LOGIN' | 'USER_REGISTER' | 'ADMIN_LOGIN'>('USER_LOGIN');
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      try {
        if (authMode === 'ADMIN_LOGIN') {
          if (formData.username === 'admin' && formData.password === 'Jakmania12*$') {
            const adminUser: User = {
              id: 'admin-001',
              username: 'System Administrator',
              role: UserRole.ADMIN,
              plan: SubscriptionPlan.VIP,
              apiKey: 'ROOT-INTEL-MASTER-BYPASS',
              dataUsage: 999999
            };
            onLoginSuccess(adminUser);
          } else {
            throw new Error('Invalid Admin Credentials');
          }
        } else if (authMode === 'USER_REGISTER') {
          if (formData.password !== formData.confirmPassword) throw new Error('Passwords do not match');
          if (formData.username.length < 3) throw new Error('Username too short');
          
          const users = JSON.parse(localStorage.getItem('nusantara_users') || '[]');
          if (users.find((u: any) => u.username === formData.username)) throw new Error('Username already exists');
          
          const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            username: formData.username,
            password: formData.password,
            role: UserRole.USER,
            plan: SubscriptionPlan.TRIAL,
            apiKey: 'NT-INTEL-' + Math.random().toString(36).substr(2, 12).toUpperCase(),
            dataUsage: 0,
            registeredAt: new Date().toISOString()
          };
          
          users.push(newUser);
          localStorage.setItem('nusantara_users', JSON.stringify(users));
          onLoginSuccess(newUser);
        } else {
          // USER_LOGIN
          const users = JSON.parse(localStorage.getItem('nusantara_users') || '[]');
          const user = users.find((u: any) => u.username === formData.username && u.password === formData.password);
          
          if (user) {
            onLoginSuccess(user);
          } else {
            throw new Error('Invalid Username or Password');
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black">
      <div className="max-w-md w-full space-y-8 bg-[#0a0a0a] p-1 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="bg-[#111] p-10 rounded-[2.3rem]">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-blue-600/10 text-blue-500 mb-4">
              {authMode === 'ADMIN_LOGIN' ? <ShieldAlert size={40} /> : <Radio size={40} />}
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {authMode === 'ADMIN_LOGIN' ? 'Command Center' : 'Nusantara Cell-Intel'}
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              {authMode === 'ADMIN_LOGIN' ? 'Authorized Personnel Only' : 'Indonesia Advanced Cellular Intelligence'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-black/40 p-1 rounded-xl mb-8 border border-white/5">
            <button 
              onClick={() => { setAuthMode('USER_LOGIN'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMode !== 'ADMIN_LOGIN' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Client Access
            </button>
            <button 
              onClick={() => { setAuthMode('ADMIN_LOGIN'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMode === 'ADMIN_LOGIN' ? 'bg-red-600/20 text-red-500' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Admin Node
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-medium text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Identifier</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="Username" 
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 text-white text-sm"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Secret Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 text-white text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {authMode === 'USER_REGISTER' && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Confirm Secret</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 text-white text-sm"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 mt-4 ${
                authMode === 'ADMIN_LOGIN' 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <Activity className="animate-spin" size={20} />
              ) : (
                <>
                  {authMode === 'USER_REGISTER' ? <UserPlus size={18} /> : <LogIn size={18} />}
                  {authMode === 'USER_REGISTER' ? 'Create Intelligence Account' : 'Initialize Session'}
                </>
              )}
            </button>
          </form>

          {authMode !== 'ADMIN_LOGIN' && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  setAuthMode(authMode === 'USER_LOGIN' ? 'USER_REGISTER' : 'USER_LOGIN');
                  setError('');
                }}
                className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
              >
                {authMode === 'USER_LOGIN' ? "Don't have an account? Register Now" : "Already have an account? Login"}
              </button>
            </div>
          )}
        </div>
        
        <div className="py-6 text-center text-[10px] text-gray-600 uppercase tracking-[0.2em] font-bold bg-black">
          Nusantara Secure Gateway v2.5.0 // (C) XCodedLab
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [msisdnInput, setMsisdnInput] = useState('');
  const [lookupResult, setLookupResult] = useState<CellIntelligence | null>(null);
  const [btsDatabase, setBtsDatabase] = useState<BTSInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Generate large initial data
    setBtsDatabase(generateRandomBTS(120));

    // Restore session
    const savedSession = localStorage.getItem('nusantara_session');
    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('nusantara_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nusantara_session');
  };

  const handleLookup = () => {
    if (!msisdnInput) return;
    setIsSearching(true);
    setTimeout(() => {
      setLookupResult(intelLookup(msisdnInput));
      setIsSearching(false);
    }, 1500);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center space-x-3 text-blue-500 mb-8">
              <Radio size={28} />
              <span className="text-xl font-black tracking-tighter text-white">CELL-INTEL <span className="text-xs bg-blue-600 text-white px-1.5 rounded ml-1">PRO</span></span>
            </div>
            
            <nav className="space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
              <SidebarItem icon={Activity} label="Intelligence" active={activeTab === 'intelligence'} onClick={() => setActiveTab('intelligence')} />
              <SidebarItem icon={Database} label="BTS Database" active={activeTab === 'database'} onClick={() => setActiveTab('database')} />
              <SidebarItem icon={MapIcon} label="Tower Mapping" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
              <SidebarItem icon={Key} label="API Portal" active={activeTab === 'api'} onClick={() => setActiveTab('api')} />
              <SidebarItem icon={Terminal} label="CLI Console" active={activeTab === 'doc'} onClick={() => setActiveTab('doc')} />
            </nav>
          </div>

          <div className="mt-auto p-6 space-y-4">
            <div className={`p-4 rounded-2xl border transition-all ${currentUser.role === UserRole.ADMIN ? 'bg-red-500/5 border-red-500/10' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <ShieldCheck size={16} className={currentUser.role === UserRole.ADMIN ? 'text-red-500' : 'text-green-500'} />
                <span className="text-xs font-bold text-gray-300">{currentUser.role === UserRole.ADMIN ? 'ROOT ADMIN' : 'IDENTITY ACTIVE'}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">Node: <span className="text-gray-300">{currentUser.username}</span></p>
              <p className="text-xs text-gray-500 mt-1">Status: <span className="text-blue-500 font-bold uppercase">{currentUser.plan}</span></p>
            </div>
            <button onClick={handleLogout} className="w-full py-3 bg-red-600/10 text-red-500 rounded-xl text-sm font-bold hover:bg-red-600/20 transition-all">Terminate Session</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <button onClick={toggleSidebar} className="lg:hidden text-gray-400 p-2"><Menu size={24} /></button>
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Session Integrity</span>
                <span className="text-sm font-mono text-blue-500 tracking-tighter">SECURED / TLS 1.3</span>
             </div>
             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${currentUser.role === UserRole.ADMIN ? 'bg-red-600' : 'bg-blue-600'}`}>
               {currentUser.username[0]}
             </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total BTS Nodes" value="1,042,912" subValue="+1,204 last 24h" icon={Radio} color="blue" />
                <StatsCard title="Global Thruput" value="14.2 TB" subValue="Network-wide data flow" icon={Globe} color="purple" />
                <StatsCard title="IMSI Captures" value="482" subValue="Live monitor nodes" icon={Activity} color="green" />
                <StatsCard title="Queries Remaining" value={currentUser.role === UserRole.ADMIN ? "UNLIMITED" : "10/10"} subValue="Based on current plan" icon={Key} color="yellow" />
              </div>

              {currentUser.role === UserRole.ADMIN && (
                <div className="p-6 bg-red-600/5 border border-red-500/20 rounded-3xl flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-600/10 text-red-500 rounded-2xl"><ShieldAlert size={24}/></div>
                      <div>
                         <h4 className="text-red-500 font-bold">Admin Privileges Active</h4>
                         <p className="text-xs text-gray-500">You are browsing in master control mode. All lookups are bypassed and encrypted.</p>
                      </div>
                   </div>
                   <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all">Access Admin Logs</button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-3xl p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <MapIcon className="text-blue-500" /> Infrastructure Density
                  </h3>
                  <div className="space-y-4">
                    {PROVINCES.slice(0, 8).map((prov, i) => (
                      <div key={prov} className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-gray-400 uppercase tracking-tight">{prov}</span>
                          <span className="text-blue-500">{(95 - i*7).toLocaleString()} Sites</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${95 - i*7}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111] border border-white/5 rounded-3xl p-8">
                  <h3 className="text-xl font-bold mb-6">Security & Plan</h3>
                  <div className="space-y-4">
                    {PRICING_PLANS.map(plan => (
                      <div key={plan.name} className={`p-4 rounded-2xl bg-white/5 border transition-all cursor-pointer group ${currentUser.plan === plan.name ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 hover:border-blue-500/50'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-bold ${currentUser.plan === plan.name ? 'text-blue-400' : 'text-gray-400'}`}>{plan.name}</span>
                          <span className="text-xs font-mono text-gray-500">{plan.price}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{plan.duration}</p>
                      </div>
                    ))}
                    <div className="pt-4 mt-4 border-t border-white/5">
                        <p className="text-xs text-gray-400 mb-4 text-center">Need a manual activation?</p>
                        <a href={CONTACT_INFO.TELEGRAM} className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-xl font-bold text-sm gap-2 hover:bg-blue-700 transition-all">
                            <MessageSquare size={16} /> @XCodedLab_Dev
                        </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'intelligence' && (
            <div className="space-y-8 max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#111] border border-white/5 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
                <h3 className="text-2xl font-bold mb-2">Cellular Intel Lookup</h3>
                <p className="text-gray-500 text-sm mb-8">Execute specialized intelligence extraction against targeted MSISDN.</p>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
                      <Search size={20} />
                    </div>
                    <input 
                      value={msisdnInput}
                      onChange={(e) => setMsisdnInput(e.target.value)}
                      type="text" 
                      placeholder="e.g. 628984668800" 
                      className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-white text-lg font-mono shadow-inner"
                    />
                  </div>
                  <button 
                    onClick={handleLookup}
                    disabled={isSearching}
                    className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 min-w-[160px] shadow-lg shadow-blue-900/20"
                  >
                    {isSearching ? <Activity className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                    {isSearching ? 'Analyzing...' : 'Execute Intel'}
                  </button>
                </div>
              </div>

              {lookupResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500 slide-in-from-bottom-2">
                  <div className="bg-[#111] border border-white/5 rounded-3xl p-8 relative">
                    <div className="absolute top-8 right-8 text-blue-500/20"><UserIcon size={40} /></div>
                    <h4 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-6">Device Profile</h4>
                    <div className="space-y-4">
                      {[
                        { label: 'IMEI Hardware', value: lookupResult.imei },
                        { label: 'IMSI Subscriber', value: lookupResult.imsi },
                        { label: 'ICCID Serial', value: lookupResult.iccid },
                        { label: 'Manufacturer', value: lookupResult.brand },
                        { label: 'OS Version', value: lookupResult.os }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-gray-500 text-sm">{item.label}</span>
                          <span className="text-white font-mono text-sm tracking-wider">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#111] border border-white/5 rounded-3xl p-8 relative">
                    <div className="absolute top-8 right-8 text-green-500/20"><MapIcon size={40} /></div>
                    <h4 className="text-sm font-bold text-green-500 uppercase tracking-widest mb-6">Network Geometry</h4>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-gray-500 text-sm">LAC (Area Code)</span>
                        <span className="text-white font-mono text-sm">{lookupResult.lastLac}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-gray-500 text-sm">Cell ID</span>
                        <span className="text-white font-mono text-sm">{lookupResult.lastCellId}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-gray-500 text-sm">Lat/Long Pair</span>
                        <span className="text-white font-mono text-sm">{lookupResult.lastLat.toFixed(6)}, {lookupResult.lastLng.toFixed(6)}</span>
                      </div>
                      <div className="pt-4">
                        <a 
                          href={`https://www.google.com/maps?q=${lookupResult.lastLat},${lookupResult.lastLng}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-2 p-4 bg-green-600/10 text-green-500 rounded-2xl font-bold hover:bg-green-600/20 transition-all border border-green-500/20"
                        >
                          <ExternalLink size={18} /> Visualize Real-time Location
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'database' && (
             <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-500">
               <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                 <div>
                    <h3 className="text-xl font-bold">Indonesia BTS Cell Nodes</h3>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-mono">Status: Connected to Grid 510</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 transition-all text-gray-400">Download CSV</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all">Export API Pack</button>
                 </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-black/50 text-gray-500 uppercase text-[10px] tracking-widest font-bold">
                     <tr>
                       <th className="px-6 py-4">Node ID</th>
                       <th className="px-6 py-4">Province</th>
                       <th className="px-6 py-4">District</th>
                       <th className="px-6 py-4">Operator</th>
                       <th className="px-6 py-4">MCC-MNC</th>
                       <th className="px-6 py-4">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {btsDatabase.map(bts => (
                       <tr key={bts.id} className="hover:bg-blue-500/5 transition-colors group cursor-default">
                         <td className="px-6 py-4 font-mono text-gray-300 group-hover:text-blue-400">{bts.id}</td>
                         <td className="px-6 py-4 text-gray-300">{bts.province}</td>
                         <td className="px-6 py-4 text-gray-500">{bts.district}</td>
                         <td className="px-6 py-4">
                           <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-gray-400 text-[10px] font-bold uppercase group-hover:border-blue-500/30 group-hover:text-blue-400">{bts.operator}</span>
                         </td>
                         <td className="px-6 py-4 font-mono text-xs">{bts.mcc}-{bts.mnc}</td>
                         <td className="px-6 py-4">
                           <button className="p-2 text-gray-500 hover:text-white transition-colors hover:bg-white/5 rounded-lg"><MapIcon size={16} /></button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-8 max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-500">
              <div className="bg-[#111] border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 text-blue-500/5 pointer-events-none">
                   <Key size={180} />
                </div>
                <h3 className="text-xl font-bold mb-2">Security Authorization</h3>
                <p className="text-gray-500 text-sm mb-6">Programmatic access to the Cell-Intel database via RESTful architecture.</p>
                
                <div className="space-y-6">
                   <div className="p-6 bg-black/60 border border-white/10 rounded-2xl flex items-center justify-between shadow-inner">
                     <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Active API Key</span>
                        <p className="font-mono text-xl text-blue-500 tracking-tight">{currentUser.apiKey}</p>
                     </div>
                     <button onClick={() => alert('API Token Rotated Successfully')} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all text-white">Rotate Token</button>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                         <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">Burst Limit</span>
                         <span className="text-2xl font-bold font-mono">15/S</span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                         <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">Status</span>
                         <span className="text-2xl font-bold text-green-500">ACTIVE</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-[#111] border border-white/5 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-xl font-bold mb-6">Upgrade Intelligence Tier</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {PRICING_PLANS.map(plan => (
                      <div key={plan.name} className={`p-6 rounded-3xl border transition-all flex flex-col ${plan.name === currentUser.plan ? 'border-blue-600 bg-blue-600/5' : 'border-white/5 bg-white/5'}`}>
                        <h4 className="font-bold text-lg mb-1">{plan.name}</h4>
                        <p className="text-blue-500 font-bold text-2xl mb-4">{plan.price}</p>
                        <ul className="space-y-3 flex-1 mb-6">
                           {plan.features.map((f, i) => (
                              <li key={i} className="text-[11px] text-gray-400 flex items-center gap-2">
                                <ShieldCheck size={12} className="text-blue-500" /> {f}
                              </li>
                           ))}
                        </ul>
                        <button 
                          disabled={plan.name === currentUser.plan}
                          className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                            plan.name === currentUser.plan 
                              ? 'bg-blue-600/20 text-blue-500 cursor-default' 
                              : 'bg-white/10 hover:bg-white/20 text-white'
                          }`}
                        >
                           {plan.name === currentUser.plan ? 'Current Active' : 'Select Package'}
                        </button>
                      </div>
                   ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doc' && (
            <div className="bg-[#111] border border-white/5 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl animate-in fade-in zoom-in-95 duration-500">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Terminal size={22} className="text-blue-500"/> Integration Console</h3>
              <div className="space-y-8">
                <div>
                   <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-3 text-blue-500/80">0x01: Global Lookup</h4>
                   <div className="bg-black/80 p-6 rounded-2xl border border-white/10 font-mono text-xs text-blue-400 overflow-x-auto shadow-inner">
                    <code>
                      GET /v1/intel?target=628984668800 HTTP/1.1<br />
                      Host: api.cellintel.id<br />
                      X-Auth-Token: {currentUser.apiKey}
                    </code>
                   </div>
                </div>

                <div>
                   <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-3 text-green-500/80">0x02: Infrastructure Query</h4>
                   <div className="bg-black/80 p-6 rounded-2xl border border-white/10 font-mono text-xs text-green-400 overflow-x-auto shadow-inner">
                    <code>
                      GET /v1/bts?region=jawa_barat HTTP/1.1<br />
                      Host: api.cellintel.id<br />
                      X-Auth-Token: {currentUser.apiKey}
                    </code>
                   </div>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-xs text-gray-400 leading-relaxed italic">"Access to the Cell-Intel API is subject to the terms of the subscriber agreement. Unauthorized mass querying may result in terminal revocation without refund."</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
             <div className="h-[70vh] w-full bg-[#111] border border-white/5 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-2xl animate-in fade-in duration-1000">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="relative text-center z-10 p-12">
                   <div className="inline-flex p-8 rounded-full bg-blue-600/10 text-blue-500 mb-8 animate-pulse shadow-lg shadow-blue-900/10">
                      <MapIcon size={80} />
                   </div>
                   <h3 className="text-3xl font-bold mb-4 tracking-tight">Interactive Grid Grid-510</h3>
                   <p className="text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed text-sm">Visualizing 1.04M nodes across the archipelago. High-density signal clustering detected in the Jabodetabek corridor.</p>
                   <div className="flex justify-center gap-4">
                      <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/30">Force Layer Sync</button>
                      <button className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all">Vector Export</button>
                   </div>
                </div>
                {/* Simulated markers */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(30)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-1.5 h-1.5 bg-blue-500/40 rounded-full"
                      style={{ 
                        top: `${10 + Math.random() * 80}%`, 
                        left: `${10 + Math.random() * 80}%`,
                      }}
                    ></div>
                  ))}
                </div>
             </div>
          )}
        </div>

        {/* Floating Contact Support */}
        <div className="fixed bottom-8 right-8 z-50 group">
           <div className="flex flex-col items-end gap-2">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold mb-2 shadow-2xl">
                 Live Support Access
              </div>
              <a href={CONTACT_INFO.TELEGRAM} target="_blank" rel="noreferrer" className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all ring-4 ring-blue-600/20">
                 <MessageSquare size={24} />
              </a>
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
