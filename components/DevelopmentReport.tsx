
import React from 'react';
import { UserData, Course, MemoryLog } from '../types';

interface Props {
  userData: UserData;
  courses: Course[];
}

const DevelopmentReport: React.FC<Props> = ({ userData, courses }) => {
  const { rank, xp, purchasedCourseIds, persona, memoryLogs } = userData;

  const purchasedCourses = courses.filter(c => purchasedCourseIds.includes(c.id));
  const progressPercent = Math.min(100, (xp % 1000) / 10);
  
  // En çok kullanılan alanları simüle et (Beceri Paketlerine göre)
  const topAreas = purchasedCourses.length > 0 
    ? purchasedCourses.slice(0, 3).map(c => c.title)
    : ["Temel Uyum", "Sinyal Analizi"];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700 pb-20 p-4 md:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
             <i className="fas fa-chart-network text-blue-500"></i> AI Gelişim <span className="text-blue-500">Raporu</span>
          </h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Neural Senkronizasyon ve Beceri Endeksi</p>
        </div>
        <div className="px-6 py-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center gap-4 shadow-xl">
           <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Son Güncelleme:</span>
           <span className="text-xs font-black text-white">{new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Panel: Genel Durum */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* SYNCHRONIZATION DASHBOARD */}
           <div className="bg-slate-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] group-hover:bg-blue-600/20 transition-all duration-1000"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div className="relative flex justify-center">
                    <svg className="w-48 h-48 -rotate-90">
                       <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                       <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552.92} strokeDashoffset={552.92 - (552.92 * (xp / 10000))} className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-4xl font-black text-white tracking-tighter">%{Math.floor((xp / 10000) * 100)}</span>
                       <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Senkron</span>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Mevcut Statü</h4>
                       <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${rank === 'Elite' ? 'bg-amber-500 text-slate-900' : 'bg-blue-600 text-white shadow-xl shadow-blue-900/40'}`}>
                             <i className={`fas ${rank === 'Elite' ? 'fa-crown' : 'fa-shield-halved'}`}></i>
                          </div>
                          <div>
                             <p className="text-2xl font-black text-white tracking-tight leading-none uppercase">{rank}</p>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Sistem Seviyesi</p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-white/60">Bir Üst Seviyeye</span>
                          <span className="text-blue-400">{1000 - (xp % 1000)} XP Kaldı</span>
                       </div>
                       <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${progressPercent}%` }}></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* BECERİ EDİNİM ÇİZELGESİ */}
           <div className="bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/5 shadow-xl">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                 <i className="fas fa-list-check text-blue-500"></i> Yeni Kazanılan Beceriler
              </h3>
              
              <div className="space-y-4">
                 {purchasedCourses.length === 0 ? (
                   <div className="py-12 text-center opacity-30">
                      <i className="fas fa-layer-group text-4xl mb-4"></i>
                      <p className="text-[10px] font-black uppercase tracking-widest">Henüz bir beceri paketi (kurs) tanımlanmadı.</p>
                   </div>
                 ) : (
                    purchasedCourses.map((course, idx) => (
                       <div key={course.id} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                <i className="fas fa-check-circle"></i>
                             </div>
                             <div>
                                <h5 className="text-sm font-black text-white uppercase tracking-tight">{course.title}</h5>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Tamamlanma: %100</p>
                             </div>
                          </div>
                          <span className="text-[9px] font-black text-blue-400/50 uppercase tracking-widest">Neural Link Aktif</span>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>

        {/* Sağ Panel: Analiz & Öneriler */}
        <div className="space-y-8">
           
           {/* EN ÇOK KULLANILAN ALANLAR */}
           <div className="bg-slate-950/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-8 px-2">Kullanım İstatistikleri</h3>
              <div className="space-y-6">
                 {topAreas.map((area, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                         <span className="text-[11px] font-black text-white uppercase truncate w-32">{area}</span>
                         <span className="text-[10px] font-black text-blue-400">%{85 - (i * 15)}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]" style={{ width: `${85 - (i * 15)}%` }}></div>
                      </div>
                   </div>
                 ))}
                 <div className="pt-4 mt-4 border-t border-white/5">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center">Toplam Etkileşim: {userData.usageCount} Sinyal</p>
                 </div>
              </div>
           </div>

           {/* ÖNERİLEN BİR SONRAKİ ADIM */}
           <div className="bg-gradient-to-br from-indigo-600 to-blue-800 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/20">
              <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                 <i className="fas fa-compass text-9xl"></i>
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6">Sıradaki Neural Adım</h3>
              <div className="space-y-4 relative z-10">
                 <p className="text-sm font-black leading-relaxed">
                    {purchasedCourseIds.length === 0 
                      ? "Neural bağını başlatmak için ilk Beceri Paketini (Kurs) seçmelisin. 'Market' sekmesinden bir başlangıç kursu edin."
                      : "Mevcut verilerime göre bir sonraki adımın becerilerini birleştirmek (Multi-Skill Integration) olmalı. Yeni bir kategori keşfetmeye ne dersin?"}
                 </p>
                 <div className="pt-4">
                    <button className="w-full py-4 bg-white text-blue-800 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]">
                       Kılavuza Göz At
                    </button>
                 </div>
              </div>
           </div>

           {/* INSIGHT NOTE */}
           <div className="bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-xl border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3 mb-4">
                 <i className="fas fa-quote-left text-blue-500 text-xs"></i>
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60">Buddy'nin Notu</h3>
              </div>
              <p className="text-[11px] font-bold text-slate-300 leading-relaxed italic">
                 "{persona.detectedMood === 'odaklanmış' ? 'Odak seviyen harika, bu ay zihnimiz %' + (persona.affinityScore + 5) + ' daha uyumlu çalıştı.' : 'Gelişim eğrin istikrarlı bir şekilde yükseliyor. Senkronizasyonu koruyalım.'}"
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentReport;
