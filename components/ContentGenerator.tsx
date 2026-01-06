
import React, { useState, useEffect } from 'react';
import { Source, Slide, GenerationState, VideoTemplate } from '../types';
import { gemini } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audio-utils';

interface Props {
  sources: Source[];
}

const VIDEO_TEMPLATES: VideoTemplate[] = [
  {
    id: 'lesson',
    name: 'Ders Anlatımı',
    description: 'Akademik, adım adım ilerleyen detaylı eğitim içeriği.',
    icon: 'fa-chalkboard-teacher',
    styleInstruction: 'Detailed academic lesson explanation with step-by-step whiteboard drawings and formal educational tone.'
  },
  {
    id: 'intro',
    name: 'Tanıtım Videosu',
    description: 'Hızlı tempolu, ilgi çekici ve özetleyici kurs fragmanı.',
    icon: 'fa-film',
    styleInstruction: 'Dynamic and high-energy introductory video trailer. Fast-paced visuals, highlighting key benefits and exciting overview.'
  },
  {
    id: 'concept',
    name: 'Kavramsal Açıklama',
    description: 'Karmaşık konuları metaforlarla basitleştiren görsel anlatım.',
    icon: 'fa-lightbulb',
    styleInstruction: 'Conceptual explainer using powerful visual metaphors and analogies to simplify complex ideas. Minimalist and focused.'
  }
];

const ContentGenerator: React.FC<Props> = ({ sources }) => {
  const [topic, setTopic] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('lesson');
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    type: null,
    progress: 0,
    statusMessage: ''
  });

  const selectedTemplate = VIDEO_TEMPLATES.find(t => t.id === selectedTemplateId) || VIDEO_TEMPLATES[0];

  const playNotification = async (text: string) => {
    try {
      const base64Audio = await gemini.generateSpeech(text);
      if (base64Audio) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {
      console.error("Sesli bildirim hatası:", e);
    }
  };

  const handleGenerateSlides = async () => {
    if (!topic || sources.length === 0) return;
    setState({ isGenerating: true, type: 'slides', progress: 10, statusMessage: 'Konu analiz ediliyor...' });
    try {
      setTimeout(() => setState(p => ({ ...p, progress: 40, statusMessage: 'Yazılı Anlatım kurgulanıyor...' })), 1500);
      const slides = await gemini.generateSlides(sources, topic);
      setState({ isGenerating: false, type: 'slides', progress: 100, result: slides, statusMessage: 'İçerik hazır!' });
      playNotification("Yazılı anlatımınız başarıyla hazırlandı.");
    } catch (e) {
      console.error(e);
      // Fixed: Added statusMessage property to satisfy GenerationState interface
      setState({ isGenerating: false, type: null, progress: 0, statusMessage: 'Hata oluştu.' });
    }
  };

  const handleGenerateAudio = async () => {
    if (!topic || sources.length === 0) return;
    setState({ isGenerating: true, type: 'audio', progress: 20, statusMessage: 'SLAYT + SESLİ ANLATIM kurgulanıyor...' });
    try {
      setTimeout(() => setState(p => ({ ...p, progress: 60, statusMessage: 'Ses sentezleniyor...' })), 2000);
      const base64Audio = await gemini.generateAudioSummary(sources, topic);
      setState({ isGenerating: false, type: 'audio', progress: 100, result: base64Audio, statusMessage: 'SLAYT + SESLİ ANLATIM hazır!' });
      if (base64Audio) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {
      console.error(e);
      // Fixed: Added statusMessage property to satisfy GenerationState interface
      setState({ isGenerating: false, type: null, progress: 0, statusMessage: 'Hata oluştu.' });
    }
  };

  const handleGenerateVideo = async () => {
    if (!topic || sources.length === 0) return;
    
    if (!(window as any).aistudio?.hasSelectedApiKey || !(await (window as any).aistudio.hasSelectedApiKey())) {
      if ((window as any).aistudio?.openSelectKey) {
        await (window as any).aistudio.openSelectKey();
      } else {
        alert("Video üretimi için geçerli bir API anahtarı seçilmelidir.");
        return;
      }
    }

    setState({ isGenerating: true, type: 'video', progress: 5, statusMessage: `VİDEO (Slayt + Sesli Anlatım) hazırlanıyor...` });
    
    try {
      let operation = await gemini.startVideoGeneration(topic, selectedTemplate.styleInstruction);
      
      const stages = [
        { threshold: 15, msg: "Senaryo ve slaytlar tasarlanıyor..." },
        { threshold: 35, msg: "Animasyonlar senkronize ediliyor..." },
        { threshold: 55, msg: "Yapay zeka sesli anlatımı işleniyor..." },
        { threshold: 75, msg: "Görsel ve işitsel materyaller birleştiriliyor..." },
        { threshold: 90, msg: "VİDEO (Slayt + Sesli Anlatım) render ediliyor..." }
      ];

      while (!operation.done) {
        await new Promise(r => setTimeout(r, 8000));
        operation = await gemini.getOperationStatus(operation);
        
        setState(prev => {
          const nextProgress = Math.min(prev.progress + 8, 98);
          const currentStage = stages.find((s, idx) => nextProgress >= s.threshold && (stages[idx+1] ? nextProgress < stages[idx+1].threshold : true));
          
          return { 
            ...prev, 
            progress: nextProgress, 
            statusMessage: currentStage?.msg || prev.statusMessage 
          };
        });
      }
      
      const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
      setState({ isGenerating: false, type: 'video', progress: 100, result: uri, statusMessage: 'VİDEO hazır!' });
      playNotification("Tebrikler, eğitim videonuz başarıyla hazırlandı!");
      
    } catch (e) {
      console.error(e);
      setState({ isGenerating: false, type: null, progress: 0, statusMessage: 'Hata oluştu.' });
    }
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8">
        <div>
          <h2 className="text-2xl font-black mb-2 flex items-center gap-2 text-gray-800 tracking-tight">
            <i className="fas fa-magic text-purple-600"></i> Atölye (İçerik Stüdyosu)
          </h2>
          <p className="text-gray-500 text-sm">AI'ınızın bildiği kaynaklardan yeni eğitim materyalleri üretin.</p>
        </div>

        {/* Şablon Seçici Section */}
        <section className="space-y-4">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">İçerik Türünü Seçin</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VIDEO_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplateId(tmpl.id)}
                className={`flex flex-col items-start p-5 rounded-2xl border-2 transition-all text-left group ${
                  selectedTemplateId === tmpl.id 
                  ? 'border-purple-600 bg-purple-50 ring-4 ring-purple-100 shadow-lg' 
                  : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  selectedTemplateId === tmpl.id ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-400 group-hover:text-purple-500'
                }`}>
                  <i className={`fas ${tmpl.icon} text-lg`}></i>
                </div>
                <h4 className={`font-black text-sm mb-1 ${selectedTemplateId === tmpl.id ? 'text-purple-900' : 'text-gray-700'}`}>{tmpl.name}</h4>
                <p className={`text-[10px] leading-relaxed font-bold ${selectedTemplateId === tmpl.id ? 'text-purple-600/70' : 'text-gray-400'}`}>
                  {tmpl.description}
                </p>
              </button>
            ))}
          </div>
        </section>
        
        <div className="space-y-6 pt-4 border-t border-gray-50">
          <div className="relative group">
            <input
              type="text"
              placeholder="Hangi konuda bir anlatım istersiniz? (Örn: Veri Yapıları)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-5 pl-14 bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-purple-100 outline-none transition-all font-bold text-gray-700 group-hover:bg-white group-hover:border-purple-200"
            />
            <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors text-lg"></i>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              disabled={state.isGenerating || !topic}
              onClick={handleGenerateSlides}
              className="group flex flex-col items-center justify-center gap-2 bg-white hover:bg-indigo-50 text-indigo-700 p-6 rounded-[2rem] font-black border-2 border-indigo-100 transition-all disabled:opacity-50 hover:shadow-xl hover:shadow-indigo-100"
            >
              <i className="fas fa-desktop text-2xl group-hover:scale-110 transition-transform"></i>
              <span className="text-xs uppercase tracking-widest">Yazılı Anlatım</span>
            </button>
            <div className="relative group/btn">
              <button
                disabled={state.isGenerating || !topic}
                onClick={handleGenerateAudio}
                className="w-full group flex flex-col items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-700 p-6 rounded-[2rem] font-black border-2 border-blue-100 transition-all disabled:opacity-50 hover:shadow-xl hover:shadow-blue-100"
              >
                <i className="fas fa-microphone-alt text-2xl group-hover:scale-110 transition-transform"></i>
                <span className="text-xs uppercase tracking-widest text-center">SLAYT + SESLİ ANLATIM</span>
              </button>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-4 py-2 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                Bu kurs, konuyu slaytlar üzerinden sesli anlatımla öğretir.
              </div>
            </div>
            <button
              disabled={state.isGenerating || !topic}
              onClick={handleGenerateVideo}
              className="group flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white p-6 rounded-[2rem] font-black shadow-2xl shadow-purple-200 hover:shadow-purple-400 transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <i className="fas fa-play-circle text-3xl group-hover:scale-110 transition-transform"></i>
              <span className="text-xs uppercase tracking-widest">VİDEO Üret</span>
            </button>
          </div>
        </div>
      </div>

      {state.isGenerating && (
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col items-center justify-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-50">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out" style={{ width: `${state.progress}%` }}></div>
          </div>

          <div className="relative">
            <div className="w-28 h-28 border-[10px] border-gray-50 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-16 h-16 bg-white rounded-full shadow-inner flex items-center justify-center">
                  <i className={`fas ${state.type === 'video' ? 'fa-video' : state.type === 'audio' ? 'fa-volume-up' : 'fa-copy'} text-indigo-600 text-3xl animate-pulse`}></i>
               </div>
            </div>
          </div>

          <div className="text-center space-y-3 max-w-md z-10">
            <h3 className="text-2xl font-black text-gray-800 tracking-tight">Üretim Stüdyosu Aktif</h3>
            <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black animate-bounce shadow-sm border border-indigo-100 uppercase tracking-widest">
              {state.statusMessage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;
