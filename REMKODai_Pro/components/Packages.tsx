
import React from 'react';
import { UserData, UserRank } from '../types';

interface PackageInfo {
  id: UserRank;
  name: string;
  price: number;
  level: number;
  tag: string;
  description: string;
  features: string[];
  simpleDesc: string;
}

const PACKAGES: PackageInfo[] = [
  {
    id: 'Starter',
    name: 'STARTER',
    price: 1490,
    level: 1,
    tag: 'Zihnini Başlat',
    description: 'İlk kez kullanacak olanlar ve yapay zekâsını başlatmak isteyenler için.',
    features: [
      'Kişisel Dijital Zihin oluşturma',
      'Yazılı + Sesli sohbet (Buddy ile Konuş)',
      'İletişim tarzı tanıma',
      'SLAYT + SESLİ ANLATIM ile öğrenme',
      '1 adet Beceri Paketi (Kurs) seçme hakkı'
    ],
    simpleDesc: 'Bu paketle kendi yapay zekân başlar. Seçtiğin 1 kurs üzerinden seni tanımaya ve desteklemeye başlar.'
  },
  {
    id: 'Pro',
    name: 'PRO',
    price: 4900,
    level: 2,
    tag: 'Zihnini Genişlet',
    description: 'Bir konuda derinleşmek ve AI’ın kendisini daha iyi tanımasını isteyenler için.',
    features: [
      'Starter paketindeki her şey',
      '3 adet Beceri Paketi (Kurs)',
      'Karar ve soru hatırlama (Hafıza)',
      'SLAYT + SESLİ ANLATIM + VİDEO ile öğrenme',
      'AI destekli Beceri Paketi (Kurs) önerileri'
    ],
    simpleDesc: 'Birden fazla kurs alırsın. REMKODai artık seni daha net tanır ve sorularına daha isabetli cevaplar verir.'
  },
  {
    id: 'Pro Plus',
    name: 'PRO PLUS',
    price: 9900,
    level: 3,
    tag: 'Zihnini Derinleştir',
    description: 'Birden fazla alanda kendini geliştiren ve uzun vadeli yol alanlar için.',
    features: [
      'Pro paketindeki her şey',
      '6 adet Beceri Paketi (Kurs)',
      'Karar ve içgörü hafızası',
      'Aylık AI Gelişim Özeti',
      'Hedef belirleme ve takip',
      'Kurslar arası bağlantı kurabilen AI'
    ],
    simpleDesc: 'Aldığın kurslar arttıkça REMKODai senin geçmişini, alışkanlıklarını ve yönünü bilir.'
  },
  {
    id: 'Elite',
    name: 'ELITE',
    price: 24900,
    level: 4,
    tag: 'Zihin Ortağın',
    description: 'En üst deneyimi isteyen profesyoneller ve ileri seviye kullanıcılar için.',
    features: [
      'Tüm Pro Plus özellikleri',
      'SINIRSIZ Beceri Paketi (Kurs)',
      'Sokratik Sorgulama Modu',
      'Derin kişilik ve ruh hali analizi',
      'Tam şeffaflık ve kontrol paneli',
      'Kalıcı neural ortağınız'
    ],
    simpleDesc: 'Bu noktada AI sadece cevap vermez. Seni tanır, seni hatırlar ve gerektiğinde düşünmeni sağlar.'
  }
];

interface Props {
  userData: UserData;
  onUpgrade: (rank: UserRank, price?: number) => void;
  theme: any;
}

const Packages: React.FC<Props> = ({ userData, onUpgrade, theme }) => {
  const currentRankIndex = PACKAGES.findIndex(p => p.id === userData.rank);
  const currentPrice = (userData.isLoggedIn && userData.rank !== 'Guest') ? PACKAGES[currentRankIndex]?.price || 0 : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
          Neural <span className="text-blue-600">Sahiplik Paketleri</span>
        </h2>
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] max-w-2xl mx-auto leading-relaxed">
          Bu bir yazılım aboneliği değil. Bu, sana ait, aldığın kurslarla güçlenen Kişisel Dijital Zihin.
        </p>
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">
           <i className="fas fa-check-circle"></i> Tek Seferlik Ödeme • Kalıcı Sahiplik • Abonelik Yok
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PACKAGES.map((pkg) => {
          const isCurrent = userData.rank === pkg.id;
          const isHigher = (userData.rank === 'Guest') || PACKAGES.findIndex(p => p.id === pkg.id) > currentRankIndex;
          const upgradePrice = Math.max(0, pkg.price - currentPrice);

          return (
            <div key={pkg.id} className={`relative flex flex-col bg-white rounded-[3rem] border p-8 transition-all duration-500 group ${isCurrent ? 'border-blue-500 shadow-2xl ring-4 ring-blue-50' : 'border-slate-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1'}`}>
              {isCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                  Mevcut Zihin Seviyen
                </div>
              )}
              
              <div className="mb-8">
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{pkg.tag}</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{pkg.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">{pkg.description}</p>
              </div>

              <div className="mb-8 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                 <div className="text-3xl font-black text-slate-900 mb-1">
                   {isCurrent ? pkg.price : upgradePrice} <span className="text-xs">TL</span>
                 </div>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                   {(!isCurrent && userData.rank !== 'Guest') ? 'Yükseltme Farkı (Adaletli Model)' : 'Kalıcı Sahiplik Bedeli'}
                 </p>
              </div>

              <ul className="flex-1 space-y-4 mb-10">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <i className="fas fa-circle-check text-blue-500 mt-1 text-[10px]"></i>
                    <span className="text-[11px] font-bold text-slate-600 leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-slate-50 mt-auto">
                <p className="text-[9px] font-bold text-slate-400 italic mb-4 leading-relaxed">
                  "{pkg.simpleDesc}"
                </p>
                <button 
                  disabled={isCurrent || (userData.isLoggedIn && !isHigher && userData.rank !== 'Guest')}
                  onClick={() => onUpgrade(pkg.id, upgradePrice)}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${
                    isCurrent 
                    ? 'bg-slate-100 text-slate-400 cursor-default' 
                    : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-200'
                  }`}
                >
                  {isCurrent ? 'AKTİF SEVİYE' : ((!isCurrent && userData.rank !== 'Guest') ? 'YÜKSELT' : 'HEMEN BAŞLAT')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 opacity-5">
           <i className="fas fa-scale-balanced text-[20rem]"></i>
         </div>
         <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Adaletli Yükseltme Modeli</h3>
         <p className="text-sm text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
           REMKODai PRO'da hiçbir ödemeniz boşa gitmez. Paket yükseltmek istediğinizde, daha önce ödediğiniz ücret düşülür, sadece farkı ödersiniz.
         </p>
         <div className="flex flex-wrap justify-center gap-4 text-[9px] font-black uppercase tracking-widest opacity-60">
            <span>Sahiplik Kalıcıdır</span>
            <span className="w-1 h-1 bg-white rounded-full"></span>
            <span>Aylık Aidat Yoktur</span>
            <span className="w-1 h-1 bg-white rounded-full"></span>
            <span>Kişiye Özel Gelişir</span>
         </div>
      </div>
    </div>
  );
};

export default Packages;
