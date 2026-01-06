
import React from 'react';
import { UserData, UserRank, UserPersona } from '../types';

interface Props {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
  onLogout: () => void;
}

const ProfileManager: React.FC<Props> = ({ userData, updateUserData, onLogout }) => {
  const { profile, persona, memoryLogs } = userData;

  const handleOverride = (style: string) => {
    updateUserData({ persona: { ...persona, manualStyleOverride: persona.manualStyleOverride === style ? undefined : style } });
  };

  const toggleSetting = (key: keyof UserPersona) => {
    updateUserData({ persona: { ...persona, [key]: !persona[key] } });
  };

  const isElite = userData.rank === 'Elite';
  const isGuest = userData.rank === 'Guest';

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard icon="fa-bolt-lightning" label="Senkron Gücü" value={userData.xp.toString()} color="blue" />
         <StatCard icon="fa-link" label="Yakınlık (Affinity)" value={`%${persona.affinityScore}`} color="indigo" />
         <StatCard icon="fa-shield-halved" label="Rütbe" value={userData.rank} color={isGuest ? 'slate' : 'amber'} />
         <StatCard icon="fa-microchip" label="Aktif Beceriler" value={userData.purchasedCourseIds.length.toString()} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           {/* NEURAL ŞEFFAFLIK & KİŞİSELLEŞTİRME PANELİ */}
           <div className={`bg-slate-950/40 backdrop-blur-3xl p-10 rounded-[3rem] border shadow-2xl relative overflow-hidden ring-1 ring-white/5 ${isElite ? 'border-amber-500/20' : 'border-white/10'}`}>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <i className="fas fa-eye text-9xl"></i>
              </div>
              
              <div className="mb-10 relative z-10">
                <div className="flex items-center gap-4 mb-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                   <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">Neural Şeffaflık Paneli</h2>
                </div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-relaxed max-w-md">
                   REMKODai'ın sizi nasıl tanıdığını ve hangi verileri işlediğini buradan kontrol edebilirsiniz. Güvenlik ve gizlilik neural bağımızın temelidir.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <TransparencyToggle 
                  label="İletişim Analizi" 
                  desc="AI, konuşma tonunuzu ve kelime seçimlerinizi takip ederek size en uygun üslubu belirler."
                  statusText={persona.trackCommunicationStyle ? "İletişim stilini analiz ediyorum..." : "Analiz duraklatıldı."}
                  active={!isGuest && persona.trackCommunicationStyle} 
                  onToggle={() => !isGuest && toggleSetting('trackCommunicationStyle')}
                  icon="fa-comment-dots"
                />
                <TransparencyToggle 
                  label="Kullanım Alışkanlıkları" 
                  desc="Hangi saatlerde aktif olduğunuzu ve hangi konulara odaklandığınızı gözlemler."
                  statusText={persona.trackLearningStyle ? "Kullanım alışkanlıklarını takip ediyorum..." : "Takip kapalı."}
                  active={!isGuest && persona.trackLearningStyle} 
                  onToggle={() => !isGuest && toggleSetting('trackLearningStyle')}
                  icon="fa-chart-line"
                />
                <TransparencyToggle 
                  label="Duygusal Rezonans" 
                  desc="Ses frekansınızdan ve yazım hızınızdan anlık ruh halinizi tahmin eder."
                  statusText={persona.trackMood ? "Duygusal durumu senkronize ediyorum..." : "Duygu takibi inaktif."}
                  active={!isGuest && persona.trackMood} 
                  onToggle={() => !isGuest && toggleSetting('trackMood')}
                  icon="fa-heart-pulse"
                />
                <TransparencyToggle 
                  label="Karar Belleği" 
                  desc="Geçmiş sorularınızı ve verdiğiniz kararları hatırlayarak süreklilik sağlar."
                  statusText={persona.retainMemory ? "Geçmiş verileri zihinde tutuyorum..." : "Bellek yazımı durduruldu."}
                  active={!isGuest && persona.retainMemory} 
                  onToggle={() => !isGuest && toggleSetting('retainMemory')}
                  icon="fa-brain"
                />
              </div>

              <div className="mt-10 p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-center gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <i className="fas fa-user-shield"></i>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Neural Veri Politikası</p>
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">Verileriniz sadece sizin dijital zihninizde işlenir ve üçüncü taraflarla asla paylaşılmaz.</p>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900/60 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/5 shadow-xl">
              <h2 className="text-xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-widest">
                <i className="fas fa-history text-blue-400"></i> Son Neural Kayıtlar
              </h2>
              <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                 {isGuest ? (
                   <div className="py-12 text-center opacity-20">
                      <i className="fas fa-lock text-4xl mb-4"></i>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white">Bellek kilitli.</p>
                   </div>
                 ) : memoryLogs.length === 0 ? (
                    <div className="py-12 text-center opacity-20">
                       <i className="fas fa-ghost text-4xl mb-4"></i>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white">Arşiv boş.</p>
                    </div>
                 ) : (
                    memoryLogs.map(log => (
                       <div key={log.id} className="flex gap-6 group">
                          <div className="flex flex-col items-center">
                             <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-sm transition-all">
                                <i className={`fas ${log.category === 'decision' ? 'fa-code-branch' : log.category === 'milestone' ? 'fa-flag' : 'fa-lightbulb'} text-xs`}></i>
                             </div>
                             <div className="w-0.5 flex-1 bg-white/5 my-2"></div>
                          </div>
                          <div className="pb-8 flex-1">
                             <p className="text-sm font-bold text-white/80 leading-relaxed">{log.description}</p>
                             <p className="text-[8px] font-black text-slate-500 uppercase mt-2 tracking-widest">{new Date(log.date).toLocaleDateString()}</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-950/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-xl ring-1 ring-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6 px-2">Kişilik Kontrolü</h3>
              <div className="space-y-3">
                 {[
                   { id: 'casual', label: 'Dost Modu', icon: 'fa-user-astronaut' },
                   { id: 'motivational', label: 'Apex Modu', icon: 'fa-bolt-lightning' },
                   { id: 'analytical', label: 'Mantık Modu', icon: 'fa-microchip' },
                   { id: 'concise', label: 'Minimalist Modu', icon: 'fa-mask' }
                 ].map(style => (
                   <button 
                     key={style.id} 
                     disabled={isGuest}
                     onClick={() => handleOverride(style.id)}
                     className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${persona.manualStyleOverride === style.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'}`}
                   >
                     <div className="flex items-center gap-3">
                        <i className={`fas ${style.icon} text-xs`}></i>
                        <span className="text-[10px] font-black uppercase tracking-widest">{style.label}</span>
                     </div>
                   </button>
                 ))}
              </div>
           </div>

           <button 
             onClick={onLogout}
             className="w-full bg-rose-500/5 border border-rose-500/20 p-6 rounded-[2rem] flex items-center justify-center gap-4 group hover:bg-rose-500/10 transition-all shadow-lg"
           >
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                 <i className="fas fa-right-from-bracket text-sm"></i>
              </div>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-left leading-none">Neural Bağlantıyı Kes</p>
           </button>
        </div>
      </div>
    </div>
  );
};

const TransparencyToggle: React.FC<{ label: string; desc: string; statusText: string; active: boolean; onToggle: () => void; icon: string }> = ({ label, desc, statusText, active, onToggle, icon }) => (
  <div className={`p-6 rounded-[2.5rem] border transition-all duration-500 flex flex-col justify-between h-full ${active ? 'bg-white/5 border-white/10 shadow-lg' : 'bg-black/20 border-white/5 opacity-50'}`}>
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${active ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-500'}`}>
             <i className={`fas ${icon} text-xs`}></i>
          </div>
          <span className="text-[11px] font-black text-white uppercase tracking-widest">{label}</span>
        </div>
        <button 
          onClick={onToggle}
          className={`w-10 h-5 rounded-full relative transition-all duration-300 ${active ? 'bg-blue-600' : 'bg-white/10'}`}
        >
          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${active ? 'left-6' : 'left-1'}`}></div>
        </button>
      </div>
      <p className="text-[9px] font-bold text-white/40 leading-relaxed mb-4">{desc}</p>
    </div>
    
    <div className={`mt-auto pt-3 border-t border-white/5 flex items-center gap-2 ${active ? 'text-blue-400' : 'text-slate-600'}`}>
       <i className={`fas ${active ? 'fa-sync-alt fa-spin' : 'fa-minus-circle'} text-[8px]`}></i>
       <span className="text-[8px] font-black uppercase tracking-widest">{statusText}</span>
    </div>
  </div>
);

const StatCard: React.FC<{ icon: string; label: string; value: string; color: string }> = ({ icon, label, value, color }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-600 border-blue-400/20',
    indigo: 'bg-indigo-600 border-indigo-400/20',
    amber: 'bg-amber-600 border-amber-400/20',
    emerald: 'bg-emerald-600 border-emerald-400/20',
    slate: 'bg-slate-600 border-slate-400/20'
  };
  return (
    <div className="bg-slate-950/40 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 shadow-xl flex items-center gap-5 ring-1 ring-white/5">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white border ${colors[color]} shadow-lg`}>
          <i className={`fas ${icon} text-lg`}></i>
       </div>
       <div>
          <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] block mb-1">{label}</span>
          <span className="text-lg font-black text-white tracking-tighter">{value}</span>
       </div>
    </div>
  );
};

export default ProfileManager;
