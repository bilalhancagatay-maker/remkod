
import React, { useState } from 'react';
import { UserData } from '../types';

interface Props {
  onAuthSuccess: (userData: UserData) => void;
  isPromoMode?: boolean;
}

const Auth: React.FC<Props> = ({ onAuthSuccess, isPromoMode = false }) => {
  const [isLogin, setIsLogin] = useState(isPromoMode ? false : true);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const ADMIN_EMAIL = 'bilalcgtay1@gmail.com';
  const ADMIN_PASS = '321987A?sH';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const isAdmin = formData.email === ADMIN_EMAIL;

    if (isLogin) {
      if (isAdmin && formData.password !== ADMIN_PASS) {
        setError('Hatalı Admin şifresi.');
        return;
      }
    }

    const mockUser: UserData = {
      id: isAdmin ? 'admin-id' : Math.random().toString(36).substr(2, 9),
      profile: {
        fullName: formData.fullName || formData.username || formData.email.split('@')[0],
        username: formData.username || formData.email.split('@')[0],
        email: formData.email,
        phone: '',
        tcNo: '',
        address: ''
      },
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
      badges: ['Erişim Başarılı'],
      purchasedCourseIds: isAdmin ? ['all'] : [], // Admin her şeye sahip
      role: isAdmin ? 'admin' : 'student',
      xp: isAdmin ? 99999 : 0,
      rank: isAdmin ? 'Elite' : 'Guest', // Kayıt olan herkes Guest başlar
      isLoggedIn: true,
      usageCount: 0,
      voiceCallUsed: false
    };

    onAuthSuccess(mockUser);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#020617]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl animate-in zoom-in duration-500 ring-1 ring-white/5">
         <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-blue-500/20">
               <i className="fas fa-brain-circuit text-3xl"></i>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
               REMKODai <span className="text-blue-500">{isLogin ? 'GİRİŞ' : 'KAYIT'}</span>
            </h2>
            {(!isLogin || isPromoMode) && (
              <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest mt-3 animate-pulse">
                Kayıt ol, Buddy’yi biraz daha tanı.
              </p>
            )}
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 leading-relaxed">
               {isLogin 
                 ? 'Kişisel Dijital Zihniniz Sizi Bekliyor' 
                 : 'Neural Ağa Katılarak Kişisel Dijital Zihninizi Başlatın'}
            </p>
         </div>

         {error && (
           <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest text-center">
             {error}
           </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest ml-1">Kullanıcı Adı</p>
                <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="zihin_ortagi" />
              </div>
            )}

            <div className="space-y-1">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest ml-1">E-posta</p>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="ornek@mail.com" />
            </div>
            
            <div className="space-y-1">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest ml-1">Şifre</p>
              <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 mt-6 active:scale-95">
               {isLogin ? 'DİJİTAL ZİHNİNE BAĞLAN' : 'SİSTEME ENTEGRE OL'}
            </button>
         </form>

         <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4 text-center">
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
               {isLogin ? 'Hesabınız yok mu? Hemen Kayıt Olun' : 'Zaten bir hesabınız var mı? Giriş Yapın'}
            </button>
         </div>
      </div>
    </div>
  );
};

export default Auth;
