
import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { AppTab, Source, Course, UserData, UserPersona, MemoryLog } from './types';
import SourceManager from './components/SourceManager';
import VoiceChat from './components/VoiceChat';
import ContentGenerator from './components/ContentGenerator';
import Marketplace from './components/Marketplace';
import CourseManager from './components/CourseManager';
import ProfileManager from './components/ProfileManager';
import Auth from './components/Auth';
import AdminUserManagement from './components/AdminUserManagement';
import Packages from './components/Packages';
import DevelopmentReport from './components/DevelopmentReport';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const FREE_LIMIT = 3;

const GUEST_INITIAL_STATE: UserData = {
  id: 'guest',
  profile: { fullName: '', username: '', tcNo: '', email: '', phone: '', address: '' },
  persona: {
    communicationStyle: 'analytical',
    learningStyle: 'step-by-step',
    motivationType: 'explorer',
    interestKeywords: [],
    personalizationEnabled: true,
    affinityScore: 10,
    trackCommunicationStyle: true,
    trackLearningStyle: true,
    trackMood: true,
    retainMemory: true,
    proactiveSocraticMode: true
  },
  memoryLogs: [],
  badges: ['Erişim Onaylandı'],
  purchasedCourseIds: [],
  role: 'student',
  xp: 0,
  rank: 'Guest',
  isLoggedIn: false,
  usageCount: 0,
  voiceCallUsed: false
};

const NavItem = memo(({ active, onClick, icon, label, color }: { active: boolean; onClick: () => void; icon: string; label: string; color: string }) => (
  <button 
    onClick={onClick} 
    className={`relative flex flex-col items-center gap-1.5 py-4 px-2 md:px-6 transition-all duration-500 group ${active ? 'text-white' : 'text-slate-500 hover:text-white'}`}
  >
    <div className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-500 ${active ? 'shadow-lg' : 'bg-transparent group-hover:bg-white/5'}`} style={active ? { backgroundColor: color, boxShadow: `0 0 20px ${color}66` } : {}}>
      <i className={`fas ${icon} text-lg`}></i>
    </div>
    <span className={`text-[8px] font-black uppercase tracking-[0.2em] hidden md:block`}>{label}</span>
    {active && (
      <span className="absolute -bottom-1 w-1 h-1 rounded-full" style={{ backgroundColor: color }}></span>
    )}
  </button>
));

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CHAT);
  const [sources, setSources] = useState<Source[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState('Turkish');
  const [isPromoMode, setIsPromoMode] = useState(false);
  const [userData, setUserData] = useState<UserData>(GUEST_INITIAL_STATE);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);

  const theme = useMemo(() => {
    const style = userData.persona.manualStyleOverride || userData.persona.communicationStyle || 'analytical';
    const isElite = userData.rank === 'Elite';
    const courseCount = userData.purchasedCourseIds.length;
    
    const ownedCourses = courses.filter(c => userData.purchasedCourseIds.includes(c.id));
    const allTags = ownedCourses.flatMap(c => c.tags.map(t => t.toLowerCase()));
    
    const hasDesign = allTags.some(t => ['tasarım', 'art', 'creative', 'design', 'ui', 'ux'].includes(t));
    const hasTech = allTags.some(t => ['coding', 'ai', 'teknoloji', 'it', 'science', 'math'].includes(t));

    let primary = '#00f2ff'; 
    let secondary = '#3b82f6'; 
    let bg = '#020617'; 
    let font = "'Plus Jakarta Sans', sans-serif";
    let mono = "'JetBrains Mono', monospace";

    switch (style) {
      case 'analytical':
        primary = '#00f2ff'; secondary = '#0ea5e9'; bg = '#010409'; font = "'Outfit', sans-serif";
        break;
      case 'motivational':
        primary = '#fbbf24'; secondary = '#f59e0b'; bg = '#0c0a09'; font = "'Plus Jakarta Sans', sans-serif";
        break;
      case 'casual':
        primary = '#10b981'; secondary = '#059669'; bg = '#020617'; font = "'Plus Jakarta Sans', sans-serif";
        break;
      case 'concise':
        primary = '#94a3b8'; secondary = '#f8fafc'; bg = '#000000'; font = "'JetBrains Mono', monospace";
        break;
      case 'detailed':
        primary = '#8b5cf6'; secondary = '#d946ef'; bg = '#020617'; font = "'Plus Jakarta Sans', sans-serif";
        break;
    }

    if (hasDesign) secondary = '#ec4899';
    if (hasTech) font = "'JetBrains Mono', monospace";
    if (isElite) primary = '#fbbf24';

    const glowOpacity = Math.min(0.8, 0.2 + (courseCount * 0.1) + (userData.xp / 50000));
    const glow = `${primary}${Math.floor(glowOpacity * 255).toString(16).padStart(2, '0')}`;

    return { primary, secondary, bg, font, mono, glow };
  }, [userData.persona, userData.rank, userData.purchasedCourseIds, courses, userData.xp]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-bg', theme.bg);
    root.style.setProperty('--theme-font-main', theme.font);
    root.style.setProperty('--theme-font-mono', theme.mono);
    root.style.setProperty('--theme-glow', theme.glow);
  }, [theme]);

  const t = useCallback((key: string) => {
    const isEn = detectedLanguage.toLowerCase().includes('english');
    const strings: any = {
      'header_subtitle': isEn ? 'YOUR PERSONAL DIGITAL MIND' : 'KİŞİSEL DİJİTAL ZİHNİN',
      'nav_buddy': isEn ? 'Buddy' : 'Buddy',
      'nav_market': isEn ? 'Market' : 'Market',
      'nav_report': isEn ? 'Growth' : 'Gelişim',
      'nav_atelier': isEn ? 'Atelier' : 'Atölye',
      'nav_packages': isEn ? 'Packages' : 'Paketler',
      'nav_profile': isEn ? 'Profile' : 'Profil',
      'logout_toast': isEn ? 'Neural connection closed securely.' : 'Neural bağlantı güvenli bir şekilde kesildi.',
      'login_welcome': (name: string) => isEn ? `Logged in as ${name}.` : `${name} olarak giriş yapıldı.`,
      'guest': isEn ? 'Guest' : 'Misafir',
      'access_denied': isEn ? 'Access Denied' : 'Erişim Reddedildi',
      'need_package': isEn ? 'You must acquire at least one Skill Package to use Atelier tools.' : 'Atölye araçlarını kullanabilmek için en az bir Beceri Paketi edinmelisin.'
    };
    const val = strings[key];
    return typeof val === 'function' ? val : val || key;
  }, [detectedLanguage]);

  useEffect(() => {
    const lang = localStorage.getItem('rem_lang') || navigator.language || (navigator as any).userLanguage;
    setDetectedLanguage(lang.startsWith('tr') ? 'Turkish' : 'English');

    const savedSources = localStorage.getItem('rem_sources');
    const savedCourses = localStorage.getItem('rem_courses');
    const savedUser = localStorage.getItem('rem_user');
    const savedAllUsers = localStorage.getItem('rem_all_users');

    if (savedSources) setSources(JSON.parse(savedSources).map((s: any) => ({ ...s, addedAt: new Date(s.addedAt) })));
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    
    let initialUsers: UserData[] = savedAllUsers ? JSON.parse(savedAllUsers) : [];
    setAllUsers(initialUsers);
    
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      parsed.memoryLogs = (parsed.memoryLogs || []).map((l: any) => ({ ...l, date: new Date(l.date) }));
      setUserData(parsed);
    }
  }, []);

  useEffect(() => { localStorage.setItem('rem_sources', JSON.stringify(sources)); }, [sources]);
  useEffect(() => { localStorage.setItem('rem_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('rem_user', JSON.stringify(userData)); }, [userData]);
  useEffect(() => { localStorage.setItem('rem_all_users', JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem('rem_lang', detectedLanguage); }, [detectedLanguage]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const updateUserData = useCallback((updates: Partial<UserData>) => {
    setUserData(prev => {
      const newData = { ...prev, ...updates };
      if (newData.isLoggedIn) {
        setAllUsers(users => {
          const exists = users.find(u => u.id === newData.id || u.profile.email === newData.profile.email);
          if (exists) return users.map(u => (u.id === newData.id || u.profile.email === newData.profile.email) ? { ...u, ...newData } : u);
          return [...users, newData];
        });
      }
      return newData;
    });
  }, []);

  const handleAdminUpdateUser = useCallback((userId: string, updates: Partial<UserData>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (userData.id === userId) {
      updateUserData(updates);
    }
  }, [userData.id, updateUserData]);

  const handleAuthSuccess = useCallback((data: UserData) => {
    setUserData({ ...data, isLoggedIn: true });
    showToast(t('login_welcome')(data.profile.fullName || data.profile.username), 'success');
    setIsPromoMode(false);
    setActiveTab(AppTab.CHAT);
  }, [showToast, t]);

  const handleLogout = useCallback(() => {
    setUserData(GUEST_INITIAL_STATE);
    localStorage.removeItem('rem_user');
    showToast(t('logout_toast'), 'info');
    setActiveTab(AppTab.CHAT);
  }, [showToast, t]);

  const handleNavigate = (tab: AppTab) => {
    if ((tab === AppTab.PROFILE || tab === AppTab.REPORT) && !userData.isLoggedIn) {
      setIsPromoMode(true);
      setActiveTab(AppTab.PROFILE);
    } else {
      setActiveTab(tab);
    }
  };

  const isAdmin = userData.isLoggedIn && userData.role === 'admin';

  return (
    <div className="min-h-screen text-slate-100 flex flex-col transition-all duration-1000" style={{ backgroundColor: theme.bg, fontFamily: theme.font }}>
      <div className="fixed top-24 right-6 z-[250] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="glass-card p-5 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 pointer-events-auto ring-1 ring-white/10">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center`} style={{ backgroundColor: theme.primary }}>
               <i className={`fas ${t.type === 'success' ? 'fa-shield-check' : t.type === 'error' ? 'fa-triangle-exclamation' : 'fa-info-circle'} text-white`}></i>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">{t.message}</p>
          </div>
        ))}
      </div>

      <header className="sticky top-0 z-[100] w-full p-4 md:p-6">
        <div className="max-w-7xl mx-auto h-24 glass-card bg-black/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl flex items-center justify-between px-6 md:px-10 ring-1 ring-white/10">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab(AppTab.CHAT)}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
               <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: theme.primary, filter: 'blur(10px)' }}></div>
               <i className="fas fa-brain text-3xl text-white relative z-10"></i>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black tracking-tighter leading-none" style={{ color: '#fff' }}>REMKODai <span style={{ color: theme.primary }}>PRO</span></h1>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse block mt-1" style={{ color: theme.primary, textShadow: `0 0 10px ${theme.primary}66` }}>{t('header_subtitle')}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
               <button onClick={() => setDetectedLanguage('Turkish')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${detectedLanguage === 'Turkish' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40'}`}>TR</button>
               <button onClick={() => setDetectedLanguage('English')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${detectedLanguage === 'English' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40'}`}>EN</button>
            </div>
            <div className="flex items-center gap-4 pl-6 border-l border-white/5">
              {isAdmin && (
                <button 
                  onClick={() => setActiveTab(AppTab.ADMIN_USERS)} 
                  className="hidden md:block px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
                  style={{ borderColor: `${theme.primary}33` }}
                >
                  Terminal
                </button>
              )}
              <div onClick={() => handleNavigate(AppTab.PROFILE)} className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden md:block">
                   <p className="text-[10px] font-black uppercase text-white/80">{userData.profile.fullName || userData.profile.username || t('guest')}</p>
                   <p className="text-[8px] font-bold uppercase" style={{ color: theme.primary }}>{userData.rank}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all ${userData.isLoggedIn ? 'shadow-lg' : 'bg-slate-800'}`} style={userData.isLoggedIn ? { backgroundColor: theme.primary, boxShadow: `0 0 15px ${theme.primary}66` } : {}}>
                  <i className="fas fa-fingerprint text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 md:px-6 pb-24 md:pb-8">
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 md:static md:translate-x-0 w-[92%] md:w-fit md:mx-auto md:mt-4 z-[200]">
          <div className="glass-card bg-black/60 backdrop-blur-2xl p-2 md:px-8 rounded-[3rem] shadow-2xl flex items-center justify-between md:gap-6 border border-white/10 ring-1 ring-white/5">
            <NavItem active={activeTab === AppTab.CHAT} onClick={() => handleNavigate(AppTab.CHAT)} icon="fa-robot" label={t('nav_buddy')} color={theme.primary} />
            <NavItem active={activeTab === AppTab.MARKET} onClick={() => handleNavigate(AppTab.MARKET)} icon="fa-table-cells" label={t('nav_market')} color={theme.primary} />
            <NavItem active={activeTab === AppTab.REPORT} onClick={() => handleNavigate(AppTab.REPORT)} icon="fa-diagram-project" label={t('nav_report')} color={theme.primary} />
            <NavItem active={activeTab === AppTab.GENERATE} onClick={() => handleNavigate(AppTab.GENERATE)} icon="fa-atom" label={t('nav_atelier')} color={theme.primary} />
            <NavItem active={activeTab === AppTab.PACKAGES} onClick={() => handleNavigate(AppTab.PACKAGES)} icon="fa-shield-halved" label={t('nav_packages')} color={theme.primary} />
            <NavItem active={activeTab === AppTab.PROFILE} onClick={() => handleNavigate(AppTab.PROFILE)} icon="fa-user-gear" label={t('nav_profile')} color={theme.primary} />
          </div>
        </nav>

        <main className="mt-8 flex-1">
          {!userData.isLoggedIn && userData.usageCount >= FREE_LIMIT && activeTab !== AppTab.PROFILE && (
            <Auth onAuthSuccess={handleAuthSuccess} />
          )}
          
          {activeTab === AppTab.CHAT && (
            <VoiceChat 
              language={detectedLanguage} 
              sources={sources.filter(s => userData.purchasedCourseIds.includes(s.courseId) || userData.role === 'admin')} 
              userData={userData} 
              updatePersona={p => updateUserData({ persona: { ...userData.persona, ...p } })} 
              addMemory={l => updateUserData({ memoryLogs: [l, ...userData.memoryLogs].slice(0, 50) })} 
              courses={courses} 
              onPurchase={id => updateUserData({ purchasedCourseIds: [...userData.purchasedCourseIds, id], xp: userData.xp + 500 })} 
              incrementUsage={() => updateUserData({ usageCount: userData.usageCount + 1 })} 
              updateUserData={updateUserData}
              onNavigate={handleNavigate}
              theme={theme}
            />
          )}
          {activeTab === AppTab.MARKET && <Marketplace courses={courses} userData={userData} onPurchase={id => updateUserData({ purchasedCourseIds: [...userData.purchasedCourseIds, id], xp: userData.xp + 500 })} onAddReview={() => {}} onNavigate={handleNavigate} theme={theme} language={detectedLanguage} />}
          {activeTab === AppTab.REPORT && <DevelopmentReport userData={userData} courses={courses} />}
          {activeTab === AppTab.GENERATE && (
            userData.purchasedCourseIds.length > 0 || isAdmin ? (
              <ContentGenerator sources={sources.filter(s => userData.purchasedCourseIds.includes(s.courseId) || userData.role === 'admin')} />
            ) : (
               <div className="py-20 text-center space-y-6 animate-in fade-in zoom-in">
                  <i className="fas fa-lock text-7xl text-white/5"></i>
                  <h3 className="text-3xl font-black uppercase tracking-widest text-white/40">{t('access_denied')}</h3>
                  <p className="text-slate-500 font-bold max-w-sm mx-auto">{t('need_package')}</p>
                  <button onClick={() => setActiveTab(AppTab.MARKET)} className="px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl text-white" style={{ backgroundColor: theme.primary }}>Market'e Git</button>
               </div>
            )
          )}
          {activeTab === AppTab.PACKAGES && <Packages userData={userData} onUpgrade={r => updateUserData({ rank: r })} theme={theme} />}
          {activeTab === AppTab.PROFILE && (
            userData.isLoggedIn ? <ProfileManager userData={userData} updateUserData={updateUserData} onLogout={handleLogout} /> : <Auth isPromoMode={isPromoMode} onAuthSuccess={handleAuthSuccess} />
          )}
          
          {isAdmin && (
            <>
              {activeTab === AppTab.ADMIN_USERS && <AdminUserManagement users={allUsers} courses={courses} onUpdateUser={handleAdminUpdateUser} onSwitchToCourses={() => setActiveTab(AppTab.ADMIN_COURSES)} onSwitchToSources={() => setActiveTab(AppTab.ADMIN_SOURCES)} theme={theme} />}
              {activeTab === AppTab.ADMIN_COURSES && <CourseManager courses={courses} onAdd={c => setCourses(p => [...p, c])} onRemove={id => setCourses(p => p.filter(c => c.id !== id))} />}
              {activeTab === AppTab.ADMIN_SOURCES && <SourceManager sources={sources} courses={courses} onAddSource={s => setSources(p => [...p, s])} onRemoveSource={id => setSources(p => p.filter(s => s.id !== id))} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
