
import React, { useState } from 'react';
import { UserData, Course } from '../types';

interface Props {
  users: UserData[];
  courses: Course[];
  onUpdateUser: (userId: string, updates: Partial<UserData>) => void;
  onSwitchToCourses: () => void;
  onSwitchToSources: () => void;
  theme: any;
}

const AdminUserManagement: React.FC<Props> = ({ users, courses, onUpdateUser, onSwitchToCourses, onSwitchToSources, theme }) => {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Admin İstatistikleri
  const totalUsers = users.length;
  const eliteUsers = users.filter(u => u.rank === 'Elite').length;
  const starterUsers = users.filter(u => u.rank === 'Starter' || u.rank === 'Pro' || u.rank === 'Pro Plus').length;
  const guestUsers = users.filter(u => u.rank === 'Guest').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4 md:px-0">
      {/* Admin Kontrol Başlığı */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl ring-1 ring-white/5">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Neural <span className="text-amber-500">Kayıt Terminali</span>
          </h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Sistemdeki Tüm Kursiyerlerin Matrisi</p>
        </div>
        <div className="flex flex-wrap gap-3">
           <button onClick={onSwitchToCourses} className="px-6 py-3 bg-amber-500 text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-900/20">
             <i className="fas fa-plus-circle mr-2"></i> Kurs Oluştur / Yönet
           </button>
           <button onClick={onSwitchToSources} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 hover:border-blue-500/50 transition-all">
             <i className="fas fa-cloud-upload mr-2"></i> Kaynakları AI'a Yükle
           </button>
        </div>
      </div>

      {/* Hızlı Bakış Paneli */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-slate-900/60 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Toplam Kursiyer</p>
            <p className="text-3xl font-black text-white">{totalUsers}</p>
            <div className="absolute right-4 bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <i className="fas fa-users text-3xl"></i>
            </div>
         </div>
         <div className="bg-slate-900/60 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Elite Sahipler</p>
            <p className="text-3xl font-black text-amber-500">{eliteUsers}</p>
            <div className="absolute right-4 bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <i className="fas fa-crown text-3xl"></i>
            </div>
         </div>
         <div className="bg-slate-900/60 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Starter/Pro Seviye</p>
            <p className="text-3xl font-black text-blue-400">{starterUsers}</p>
            <div className="absolute right-4 bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <i className="fas fa-graduation-cap text-3xl"></i>
            </div>
         </div>
         <div className="bg-slate-900/60 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Paketsiz (Misafir)</p>
            <p className="text-3xl font-black text-slate-400">{guestUsers}</p>
            <div className="absolute right-4 bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <i className="fas fa-user-clock text-3xl"></i>
            </div>
         </div>
      </div>

      {/* Ana Kullanıcı Tablosu */}
      <div className="bg-slate-950/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0 opacity-30"></div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                     <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kullanıcı Bilgisi</th>
                     <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">İletişim (E-posta)</th>
                     <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Neural Seviye</th>
                     <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aksiyon</th>
                  </tr>
               </thead>
               <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-10 py-24 text-center">
                        <i className="fas fa-users-slash text-5xl text-white/5 mb-6 block"></i>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Henüz kayıtlı bir kursiyer bulunmuyor.</p>
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-5">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-2xl transition-all group-hover:scale-110 ${
                                 user.rank === 'Elite' ? 'bg-gradient-to-br from-amber-400 to-orange-600 text-slate-900 shadow-amber-900/20' : 
                                 user.rank === 'Guest' ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 text-white shadow-blue-900/20'
                               }`}>
                                  {user.profile.fullName ? user.profile.fullName.charAt(0).toUpperCase() : (user.profile.username ? user.profile.username.charAt(0).toUpperCase() : '?')}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1.5">{user.profile.fullName || user.profile.username || 'Tanımsız Kursiyer'}</p>
                                  <div className="flex items-center gap-2">
                                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">UID: {user.id.slice(0,8).toUpperCase()}</span>
                                     {user.role === 'admin' && <span className="bg-amber-500/10 text-amber-500 text-[7px] font-black px-1.5 py-0.5 rounded border border-amber-500/20 uppercase">Operator</span>}
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <p className="text-[11px] font-bold text-white/70 tracking-wide">{user.profile.email}</p>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Sistem Kaydı Onaylı</p>
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-3">
                               <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                 user.rank === 'Elite' ? 'border-amber-500/50 text-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 
                                 user.rank === 'Guest' ? 'border-slate-500/30 text-slate-500 bg-slate-500/5' :
                                 'border-blue-500/50 text-blue-400 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                               }`}>
                                 {user.rank}
                               </span>
                               {user.xp > 0 && <span className="text-[9px] font-black text-white/20">{user.xp} XP</span>}
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <button 
                              onClick={() => setSelectedUser(user)}
                              className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all flex items-center justify-center"
                              title="Kullanıcıyı Yönet"
                            >
                               <i className="fas fa-sliders-h"></i>
                            </button>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Kullanıcı Detay ve Manuel Yetkilendirme Modalı */}
      {selectedUser && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in" onClick={() => setSelectedUser(null)}></div>
           <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 p-10 md:p-14 rounded-[4rem] shadow-2xl animate-in zoom-in duration-300 ring-1 ring-white/10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600 opacity-50"></div>
              
              <div className="text-center mb-10">
                 <div className={`w-24 h-24 rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-4xl font-black ${
                   selectedUser.rank === 'Elite' ? 'bg-amber-500 text-slate-900' : 
                   selectedUser.rank === 'Guest' ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 text-white'
                 }`}>
                    {selectedUser.profile.fullName ? selectedUser.profile.fullName.charAt(0) : '?'}
                 </div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedUser.profile.fullName || selectedUser.profile.username}</h3>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{selectedUser.profile.email}</p>
                 <div className="mt-4 inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest">
                    Mevcut Rütbe: {selectedUser.rank}
                 </div>
              </div>

              <div className="space-y-8">
                 {/* Kurs Yetkilendirme */}
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <i className="fas fa-key text-[10px]"></i> Manuel Kurs Atama
                    </p>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                       {courses.length === 0 ? (
                         <p className="text-[9px] text-slate-600 uppercase text-center py-4">Sistemde henüz kurs tanımlı değil.</p>
                       ) : (
                         courses.map(course => (
                            <button 
                              key={course.id} 
                              onClick={() => {
                                 const owned = selectedUser.purchasedCourseIds.includes(course.id);
                                 const newIds = owned 
                                    ? selectedUser.purchasedCourseIds.filter(id => id !== course.id)
                                    : [...selectedUser.purchasedCourseIds, course.id];
                                 
                                 onUpdateUser(selectedUser.id, { purchasedCourseIds: newIds });
                                 setSelectedUser(prev => prev ? ({ ...prev, purchasedCourseIds: newIds }) : null);
                              }}
                              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedUser.purchasedCourseIds.includes(course.id) ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                            >
                               <span className="text-[9px] font-black uppercase tracking-widest truncate w-40 text-left">{course.title}</span>
                               <i className={`fas ${selectedUser.purchasedCourseIds.includes(course.id) ? 'fa-check-circle' : 'fa-circle-plus'}`}></i>
                            </button>
                         ))
                       )}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <button 
                       onClick={() => onUpdateUser(selectedUser.id, { xp: selectedUser.xp + 1000 })} 
                       className="py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
                    >
                       +1000 XP Hediye Et
                    </button>
                    <button 
                       onClick={() => { 
                          const newRank = selectedUser.rank === 'Elite' ? 'Starter' : 'Elite';
                          onUpdateUser(selectedUser.id, { rank: newRank }); 
                          setSelectedUser(prev => prev ? {...prev, rank: newRank} : null); 
                       }} 
                       className={`py-4 border rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${
                          selectedUser.rank === 'Elite' ? 'bg-slate-800 border-white/10 text-white' : 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20'
                       }`}
                    >
                       {selectedUser.rank === 'Elite' ? 'RÜTBE DÜŞÜR' : 'ELITE YETKİSİ VER'}
                    </button>
                 </div>
              </div>

              <button 
                onClick={() => setSelectedUser(null)} 
                className="w-full mt-10 py-5 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] hover:text-white hover:bg-white/10 transition-all rounded-3xl"
              >
                Değişiklikleri Onayla ve Kapat
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
