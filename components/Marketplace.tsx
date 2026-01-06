
import React, { useState, useMemo, memo, useCallback } from 'react';
import { Course, UserData, Review, AppTab } from '../types';

interface Props {
  courses: Course[];
  userData: UserData;
  onPurchase: (courseId: string) => void;
  onAddReview: (courseId: string, review: Review) => void;
  onNavigate: (tab: AppTab) => void;
  theme: any;
  language: string;
}

const StarRating = memo(({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <i key={i} className={`fas fa-star text-[8px] ${i < Math.floor(rating) ? 'text-blue-500' : 'text-slate-700'}`}></i>
    ))}
  </div>
));

const Marketplace: React.FC<Props> = ({ courses, userData, onPurchase, onAddReview, onNavigate, theme, language }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOwnershipWarning, setShowOwnershipWarning] = useState(false);

  const isPurchased = useCallback((courseId: string) => userData.purchasedCourseIds.includes(courseId), [userData.purchasedCourseIds]);
  const isGuest = userData.rank === 'Guest';
  const isEn = language.toLowerCase().includes('english');

  const t = (key: string) => {
    const s: any = {
      'title_1': isEn ? 'SKILL' : 'BECERİ',
      'title_2': isEn ? 'MARKET' : 'MARKETİ',
      'subtitle': isEn ? 'Empower your digital mind with new skills.' : 'Dijital zihninizi yeni becerilerle güçlendirin.',
      'search_placeholder': isEn ? 'Search skill or topic...' : 'Beceri veya konu ara...',
      'level_label': isEn ? 'Level' : 'Seviye',
      'matrix': isEn ? 'Skill Matrix' : 'Beceri Matrisi',
      'enrolled': isEn ? 'Neural Integration Complete' : 'Neural Entegrasyon Tamamlandı',
      'activate': isEn ? 'Activate Skill Package' : 'Beceri Paketini Aktifleştir',
      'need_auth': isEn ? 'Membership Required' : 'Üyelik Gerekli',
      'need_auth_desc': isEn ? 'You must acquire an Ownership Package to add this skill to your digital mind.' : 'Bu beceriyi dijital zihnine eklemek için bir Sahiplik Paketi edinmelisin.',
      'browse_packages': isEn ? 'Browse Packages' : 'Paketleri İncele',
      'cancel': isEn ? 'Cancel' : 'Vazgeç'
    };
    return s[key] || key;
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(c => 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{t('title_1')} <span style={{ color: theme.primary }}>{t('title_2')}</span></h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] mt-2 italic">{t('subtitle')}</p>
        </div>
        <div className="w-full max-w-xl relative group">
          <input 
            type="text" 
            placeholder={t('search_placeholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full glass-card border-white/5 px-8 py-5 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all"
          />
          <i className="fas fa-search absolute right-8 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredCourses.map(course => (
          <div 
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className="group relative glass-card rounded-[2.5rem] p-4 cursor-pointer shadow-sm hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden ring-1 ring-white/5"
          >
            {isGuest && (
              <div className="absolute top-6 right-6 z-10 w-9 h-9 bg-slate-900/60 backdrop-blur-md rounded-2xl flex items-center justify-center text-white/80 border border-white/10">
                <i className="fas fa-lock text-[11px]"></i>
              </div>
            )}
            <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-5">
              <img src={course.imageUrl} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" alt={course.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <div className="absolute top-4 left-4">
                <span className="glass-card px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest">ID: {course.id.slice(0,5)}</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                   <p className="text-[7px] font-black text-white/50 uppercase tracking-widest mb-1">{t('level_label')}</p>
                   <p className="text-[10px] font-black text-white uppercase">{course.level === 'All' ? (isEn ? 'ALL' : 'TÜMÜ') : course.level}</p>
                </div>
                <div className="text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg" style={{ backgroundColor: theme.primary }}>
                  {course.price} TL
                </div>
              </div>
            </div>

            <div className="px-2">
              <h3 className="text-sm font-black text-white uppercase tracking-tight mb-2 truncate group-hover:text-blue-500 transition-colors">{course.title}</h3>
              <div className="flex items-center justify-between opacity-60">
                <StarRating rating={5} />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{isEn ? 'Course' : 'Kurs'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in" onClick={() => setSelectedCourse(null)}></div>
          
          <div className="relative w-full max-w-5xl glass-card rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-500 ring-1 ring-white/10">
            <div className="md:w-5/12 relative bg-slate-900 aspect-video md:aspect-auto">
              <img src={selectedCourse.imageUrl} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 p-10 flex flex-col justify-end">
                <h2 className="text-white text-4xl font-black uppercase tracking-tighter leading-tight mb-4">{selectedCourse.title}</h2>
                <div className="flex gap-4">
                  <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: theme.primary }}>{selectedCourse.price} TL</span>
                  <span className="bg-white/10 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 text-white">{selectedCourse.level}</span>
                </div>
              </div>
            </div>

            <div className="md:w-7/12 p-8 md:p-14 flex flex-col justify-between">
              <button onClick={() => setSelectedCourse(null)} className="absolute top-8 right-8 w-11 h-11 glass-card rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10">
                <i className="fas fa-times"></i>
              </button>

              <div className="space-y-10">
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }}></div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: theme.primary }}>{t('matrix')}</h4>
                  </div>
                  <p className="text-slate-300 text-sm font-bold leading-relaxed">{selectedCourse.description}</p>
                </section>

                <div className="grid grid-cols-2 gap-4">
                  {selectedCourse.features.slice(0,4).map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <i className="fas fa-shield-check text-xs" style={{ color: theme.primary }}></i>
                      <span className="text-[10px] font-black uppercase text-slate-400">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                {isPurchased(selectedCourse.id) ? (
                  <button className="w-full bg-emerald-500/10 text-emerald-500 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs border border-emerald-500/20 shadow-xl">
                    <i className="fas fa-check-circle mr-2"></i> {t('enrolled')}
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                       if (isGuest) setShowOwnershipWarning(true);
                       else onPurchase(selectedCourse.id);
                       setSelectedCourse(null);
                    }}
                    className="w-full text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:opacity-90 transition-all active:scale-95"
                    style={{ backgroundColor: theme.primary, boxShadow: `0 20px 40px ${theme.primary}33` }}
                  >
                    {t('activate')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ownership Warning */}
      {showOwnershipWarning && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in" onClick={() => setShowOwnershipWarning(false)}></div>
          <div className="relative w-full max-w-md glass-card rounded-[3.5rem] p-12 text-center shadow-2xl animate-in zoom-in duration-300 ring-1 ring-white/10">
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner" style={{ color: theme.primary }}>
               <i className="fas fa-id-badge text-4xl"></i>
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{t('need_auth')}</h3>
            <p className="text-[12px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider mb-10">
              {t('need_auth_desc')}
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => {
                  setShowOwnershipWarning(false);
                  onNavigate(AppTab.PACKAGES);
                }}
                className="w-full py-5 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all"
                style={{ backgroundColor: theme.primary }}
              >
                {t('browse_packages')}
              </button>
              <button onClick={() => setShowOwnershipWarning(false)} className="w-full py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">{t('cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Marketplace);
