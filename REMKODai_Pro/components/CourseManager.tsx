
import React, { useState } from 'react';
import { Course } from '../types';

interface Props {
  courses: Course[];
  onAdd: (course: Course) => void;
  onRemove: (id: string) => void;
}

const CourseManager: React.FC<Props> = ({ courses, onAdd, onRemove }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [level, setLevel] = useState<Course['level']>('Starter');
  const [featuresText, setFeaturesText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [aiGains, setAiGains] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
        alert("Lütfen temel bilgileri girin.");
        return;
    }
    const features = featuresText.split('\n').filter(f => f.trim() !== '');
    const tags = tagsText.split(',').map(t => t.trim()).filter(t => t !== '');

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      title,
      description: desc,
      price: Number(price) || 0,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      features: features.length > 0 ? features : ["REMKODai Asistan Erişimi", "Özel Eğitim Materyalleri"],
      tags: tags.length > 0 ? tags : ['Eğitim'],
      level: level,
      aiGains: aiGains // Yeni eklenen gizli alan
    });
    
    setTitle(''); setDesc(''); setPrice(''); setImageUrl(''); setFeaturesText(''); setTagsText(''); setLevel('Starter'); setAiGains('');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Form Alanı */}
        <div className="flex-1 bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl w-full">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
              <span className="w-12 h-12 bg-amber-500 text-slate-900 rounded-2xl flex items-center justify-center shadow-2xl">
                  <i className="fas fa-plus"></i>
              </span>
              Yeni Beceri Paketi (Kurs) Oluştur
            </h2>
            <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Özel Admin Erişimi</span>
            </div>
          </div>
          
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Beceri Adı (Kurs Başlığı)</label>
                <input placeholder="Örn: İleri Düzey Prompt Mühendisliği" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/20 transition-all font-bold text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Fiyatlandırma (TL)</label>
                <input type="number" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/20 transition-all font-black text-amber-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Neural Seviye (Level)</label>
                <select value={level} onChange={e => setLevel(e.target.value as any)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/20 transition-all font-bold text-white appearance-none">
                   <option value="All" className="bg-slate-900">Tüm Seviyeler</option>
                   <option value="Starter" className="bg-slate-900">Starter</option>
                   <option value="Pro" className="bg-slate-900">Pro</option>
                   <option value="Pro Plus" className="bg-slate-900">Pro Plus</option>
                   <option value="Elite" className="bg-slate-900">Elite</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Kapak Görseli (URL)</label>
                <input placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/20 transition-all text-xs text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Kurs Tanımı (Kullanıcı Görür)</label>
              <textarea placeholder="Kurs içeriği hakkında genel bilgi..." value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl h-24 outline-none text-sm font-medium text-white/80" />
            </div>

            {/* AI KAZANIMLARI - SADECE AI GÖRÜR */}
            <div className="space-y-2 p-6 bg-blue-600/10 border border-blue-500/20 rounded-[2rem]">
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                <i className="fas fa-brain-circuit"></i> YAPAY ZEKAYA KAZANDIRILACAK ÖZELLİKLER (GİZLİ)
              </label>
              <textarea 
                placeholder="Bu kurs alındığında AI nasıl davranmalı? (Örn: 'Daha empatik bir dil kullan, kursiyeri her zaman motive et, dokümanlardaki teknik terimleri kullanarak soruları yanıtla.')" 
                value={aiGains} 
                onChange={e => setAiGains(e.target.value)} 
                className="w-full p-4 bg-black/30 border border-white/10 rounded-2xl h-32 outline-none text-sm font-mono text-blue-100 placeholder:text-blue-900/50" 
              />
              <p className="text-[9px] font-black text-blue-900/60 uppercase tracking-widest mt-2 px-2">
                * Bu bölüm sadece AI'ın çekirdek talimatlarına eklenir. Kursiyer buradaki metni asla göremez.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Özellikler (Satır Başına Bir Adet)</label>
                <textarea placeholder="Sertifika&#10;7/24 Destek&#10;Canlı Atölye" value={featuresText} onChange={e => setFeaturesText(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl h-24 outline-none text-xs text-white/60" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Etiketler (Virgülle Ayırın)</label>
                <textarea placeholder="AI, Tasarım, Gelecek" value={tagsText} onChange={e => setTagsText(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl h-24 outline-none text-xs text-white/60" />
              </div>
            </div>

            <button type="submit" className="w-full bg-amber-500 text-slate-950 font-black py-5 rounded-[2.5rem] shadow-2xl hover:bg-amber-400 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs">
              Sisteme Yeni Beceri (Kurs) Entegre Et
            </button>
          </form>
        </div>

        {/* Canlı Önizleme Kartı */}
        <div className="w-full lg:w-80 shrink-0 sticky top-32 space-y-6">
            <div className="text-center">
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em]">Beceri Önizlemesi</span>
            </div>
            <div className="bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden pointer-events-none transform transition-transform group">
                <div className="aspect-[4/3] bg-slate-800 relative">
                    <img src={imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} className="w-full h-full object-cover opacity-60" alt="Preview" />
                    <div className="absolute top-4 right-4 bg-amber-500 text-slate-900 px-3 py-1 rounded-xl text-[10px] font-black shadow-lg">
                      {price || '0'} TL
                    </div>
                    <div className="absolute bottom-4 left-4">
                       <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase border border-white/20">{level === 'All' ? 'TÜM SEVİYELER' : level}</span>
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="font-black text-white text-sm mb-2 uppercase truncate">{title || 'Beceri Başlığı'}</h3>
                    <p className="text-[10px] text-slate-500 line-clamp-2 italic">"{desc || 'Kısa açıklama buraya gelecek...'}"</p>
                </div>
            </div>
            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl">
               <p className="text-[9px] font-bold text-amber-500 leading-relaxed uppercase tracking-wide text-center">
                 Bu kurs oluşturulduğunda sadece sizin Terminalinizde görünür. Kursiyerlere manuel veya Market üzerinden atanabilir.
               </p>
            </div>
        </div>
      </div>

      {/* Mevcut Kurslar Listesi */}
      <div className="space-y-6">
        <h3 className="text-sm font-black text-white uppercase tracking-widest ml-4">Mevcut Beceri Kütüphanesi ({courses.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-slate-900/40 backdrop-blur-xl p-5 rounded-[2rem] border border-white/5 shadow-lg flex items-center justify-between group hover:border-amber-500/30 transition-all">
               <div className="flex items-center gap-4">
                  <img src={course.imageUrl} className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div>
                     <h4 className="font-black text-white text-[11px] uppercase truncate w-32">{course.title}</h4>
                     <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-amber-500">{course.price} TL</span>
                        <span className="text-[7px] text-slate-500 uppercase tracking-widest">{course.level === 'All' ? 'TÜM' : course.level}</span>
                     </div>
                  </div>
               </div>
               <button onClick={() => onRemove(course.id)} className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-xs shadow-inner">
                  <i className="fas fa-trash-alt"></i>
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseManager;
