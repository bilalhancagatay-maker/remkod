
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Source, UserData, UserPersona, MemoryLog, Course, AppTab } from '../types';
import { gemini } from '../services/geminiService';
import { decode, encode, decodeAudioData } from '../utils/audio-utils';

interface Message { role: 'user' | 'model'; text: string; }

interface Props {
  sources: Source[];
  userData: UserData;
  updatePersona: (p: Partial<UserPersona>) => void;
  addMemory: (log: MemoryLog) => void;
  courses: Course[];
  onPurchase: (courseId: string) => void;
  language?: string;
  incrementUsage: () => void;
  onNavigate: (tab: AppTab) => void;
  updateUserData: (updates: Partial<UserData>) => void;
  theme: any;
}

const VoiceChat: React.FC<Props> = ({ sources, userData, updatePersona, addMemory, courses, onPurchase, language = 'Turkish', incrementUsage, onNavigate, updateUserData, theme }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isModelTalking, setIsModelTalking] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Source | null>(null);
  const [showVideoTerminal, setShowVideoTerminal] = useState(false);
  const [neuralSuggestion, setNeuralSuggestion] = useState<{ courseId: string; reason: string } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeSessionRef = useRef<any>(null);
  const frameIntervalRef = useRef<number | null>(null);
  const sourcesSetRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const isAdmin = userData.role === 'admin';
  const hasPackage = (userData.purchasedCourseIds.length > 0 && userData.rank !== 'Guest') || isAdmin;
  const isEn = language.toLowerCase().includes('english');

  const availableVideos = sources.filter(s => s.type === 'drive_video' || s.type === 'video');

  const runNeuralAnalysis = useCallback(async (history: Message[]) => {
    if (history.length < 2) return;
    const analysis = await gemini.analyzeAndLog(history, courses, userData.purchasedCourseIds);
    
    if (analysis.hasInsight && analysis.description) {
      addMemory({
        id: Math.random().toString(36).substr(2, 9),
        date: new Date(),
        description: analysis.description,
        category: analysis.category || 'insight'
      });
    }

    if (analysis.suggestedCourseId && analysis.suggestionReason) {
      setNeuralSuggestion({
        courseId: analysis.suggestedCourseId,
        reason: analysis.suggestionReason
      });
    }

    if (analysis.detectedMood || analysis.affinityChange) {
       updatePersona({
         detectedMood: analysis.detectedMood,
         affinityScore: Math.min(100, Math.max(0, userData.persona.affinityScore + (analysis.affinityChange || 0)))
       });
    }
  }, [courses, userData.purchasedCourseIds, addMemory, updatePersona, userData.persona.affinityScore]);

  const stopVoiceSession = useCallback(() => {
    activeSessionRef.current?.close(); 
    activeSessionRef.current = null;
    setIsActive(false); 
    setIsModelTalking(false); 
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    sourcesSetRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesSetRef.current.clear();
    
    // Bağlantı bittiğinde son analizi yap
    runNeuralAnalysis(messages);
  }, [messages, runNeuralAnalysis]);

  const startVoiceSession = useCallback(async () => {
    try {
      setIsActive(true);
      setNeuralSuggestion(null); // Yeni seansta eski öneriyi temizle
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = gemini.connectLiveVoice(sources, {
        onopen: () => {
          const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          
          processor.onaudioprocess = (e) => {
            const data = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(data.length);
            for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
            sessionPromise.then((session: any) => session.sendRealtimeInput({ 
              media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } 
            }));
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);

          if (videoRef.current && canvasRef.current && showVideoTerminal) {
            frameIntervalRef.current = window.setInterval(() => {
              const video = videoRef.current;
              const canvas = canvasRef.current;
              if (video && !video.paused && !video.ended) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  canvas.width = 320;
                  canvas.height = 180;
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  canvas.toBlob((blob) => {
                    if (blob) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64data = (reader.result as string).split(',')[1];
                        sessionPromise.then((session: any) => session.sendRealtimeInput({
                          media: { data: base64data, mimeType: 'image/jpeg' }
                        }));
                      };
                      reader.readAsDataURL(blob);
                    }
                  }, 'image/jpeg', 0.6);
                }
              }
            }, 2000);
          }
        },
        onmessage: async (msg: any) => {
          const base64 = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          const text = msg.serverContent?.modelTurn?.parts?.[0]?.text || msg.serverContent?.outputTranscription?.text;
          
          if (text) {
             setMessages(prev => [...prev, { role: 'model', text }]);
          }

          if (base64 && outputCtx) {
            setIsModelTalking(true);
            const buffer = await decodeAudioData(decode(base64), outputCtx, 24000, 1);
            const node = outputCtx.createBufferSource();
            node.buffer = buffer; 
            node.connect(outputCtx.destination);
            node.onended = () => { 
                sourcesSetRef.current.delete(node);
                if (sourcesSetRef.current.size === 0) setIsModelTalking(false); 
            };
            node.start();
            sourcesSetRef.current.add(node);
          }
        },
        onerror: () => stopVoiceSession(),
        onclose: () => stopVoiceSession()
      }, userData.persona, userData.memoryLogs, courses, userData.purchasedCourseIds, userData.rank, language);
      activeSessionRef.current = await sessionPromise;
    } catch (e) { stopVoiceSession(); }
  }, [sources, userData, language, stopVoiceSession, showVideoTerminal, courses]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, neuralSuggestion]);

  const suggestedCourse = courses.find(c => c.id === neuralSuggestion?.courseId);

  return (
    <div className="relative flex flex-col lg:flex-row gap-6 p-4 md:p-6 animate-in fade-in duration-1000">
      
      {/* LEFT COLUMN: Neural Hub & Video Vision */}
      <div className="w-full lg:w-[45%] flex flex-col gap-6">
        {/* MAIN NEURAL CORE PANEL */}
        <div className="min-h-[500px] flex-1 bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 flex flex-col items-center justify-center p-8 relative overflow-hidden group">
           <div className="relative mb-12">
              <div className={`absolute -inset-16 rounded-full border border-dashed ${isActive ? 'animate-spin' : ''}`} style={{ borderColor: `${theme.primary}1a` }}></div>
              <div className={`w-44 h-44 rounded-full flex items-center justify-center relative z-10 transition-all duration-700 ${isActive ? 'scale-110' : 'scale-100'}`}>
                 <div className={`w-32 h-32 rounded-full neural-core flex items-center justify-center bg-gradient-to-br shadow-2xl transition-all duration-1000`} style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, boxShadow: `0 0 50px ${theme.primary}80` }}>
                    <i className={`fas ${isActive ? 'fa-dna' : 'fa-brain'} text-4xl text-white ${isActive ? 'animate-pulse' : ''}`}></i>
                 </div>
              </div>
           </div>

           <div className="text-center space-y-4 mb-10">
              <h2 className={`text-2xl font-black uppercase tracking-[0.4em] font-mono transition-colors duration-1000`} style={{ color: theme.primary }}>
                 {isActive ? 'Neural_Linked' : 'Core_Standby'}
              </h2>
           </div>

           <div className="w-full max-w-sm space-y-4">
              <button 
                onClick={isActive ? stopVoiceSession : startVoiceSession}
                className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all relative overflow-hidden group border ${
                  isActive 
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' 
                  : `bg-slate-900 text-white border-white/10 hover:border-cyan-500/50 buddy-btn-glow`
                }`}
                style={!isActive ? { boxShadow: `0 0 30px ${theme.primary}4d` } : {}}
              >
                 <i className={`fas ${isActive ? 'fa-power-off' : 'fa-microphone-lines'} text-lg mr-4`}></i>
                 <span>{isActive ? (isEn ? 'Disconnect' : 'Bağlantıyı Kes') : (isEn ? 'Talk to BUDDY' : 'BUDDY ile Konuş')}</span>
              </button>
           </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Data Flow */}
      <div className="flex-1 min-h-[600px] h-[80vh] bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 flex flex-col shadow-2xl relative overflow-hidden">
         <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Neural Log Stream</h3>
         </div>

         <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar font-mono bg-black/30">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                 <div className={`max-w-[85%] p-5 border relative`} style={msg.role === 'user' ? { backgroundColor: `${theme.primary}0d`, borderColor: `${theme.primary}33`, color: `${theme.primary}cc` } : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
                    <p className="text-[11px] leading-relaxed font-bold tracking-tight">{msg.text}</p>
                 </div>
              </div>
            ))}

            {/* NEURAL SUGGESTION CARD */}
            {neuralSuggestion && suggestedCourse && (
              <div className="animate-in slide-in-from-right-10 duration-700">
                 <div className="glass-card p-6 rounded-[2.5rem] border shadow-2xl relative overflow-hidden" style={{ borderColor: `${theme.primary}4d`, background: `linear-gradient(135deg, rgba(0,0,0,0.8), ${theme.primary}0d)` }}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <i className="fas fa-sparkles text-4xl"></i>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: theme.primary }}>
                          <i className="fas fa-brain-circuit"></i>
                       </div>
                       <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{isEn ? 'Neural Insight' : 'Sinirsel Öngörü'}</p>
                          <h4 className="text-[11px] font-black text-white uppercase">{isEn ? 'Recommended Skill Path' : 'Önerilen Gelişim Rotası'}</h4>
                       </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-300 italic mb-6 leading-relaxed">
                       "{neuralSuggestion.reason}"
                    </p>
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-3">
                          <img src={suggestedCourse.imageUrl} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                             <p className="text-[10px] font-black text-white uppercase truncate w-32">{suggestedCourse.title}</p>
                             <p className="text-[8px] font-black text-blue-400">{suggestedCourse.price} TL</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => onNavigate(AppTab.MARKET)}
                         className="px-4 py-2 rounded-xl text-[9px] font-black uppercase text-white shadow-lg transition-transform active:scale-95"
                         style={{ backgroundColor: theme.primary }}
                       >
                          {isEn ? 'Review' : 'İncele'}
                       </button>
                    </div>
                 </div>
              </div>
            )}
         </div>

         <div className="p-8 bg-black/50 border-t border-white/5">
            <div className="relative group">
               <input 
                 type="text" value={inputText} onChange={e => setInputText(e.target.value)} 
                 placeholder={isActive ? (isEn ? "Vocal Link Active..." : "Bağlantı Aktif...") : (isEn ? "Send manual query..." : "Manuel sorgu gönder...")}
                 className="w-full bg-black/60 border border-white/10 rounded-sm px-8 py-5 outline-none font-bold text-xs text-white placeholder:text-white/10 focus:border-cyan-500/50 transition-all font-mono"
                 disabled={isActive}
                 onKeyDown={e => {
                    if (e.key === 'Enter' && inputText.trim()) {
                       setMessages(prev => [...prev, { role: 'user', text: inputText }]);
                       setInputText('');
                    }
                 }}
               />
               <button 
                 disabled={isActive || !inputText.trim()}
                 onClick={() => {
                    setMessages(prev => [...prev, { role: 'user', text: inputText }]);
                    setInputText('');
                 }}
                 className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-sm flex items-center justify-center text-white text-xs disabled:opacity-20 transition-transform"
                 style={{ backgroundColor: theme.primary }}
               >
                  <i className="fas fa-paper-plane"></i>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default memo(VoiceChat);
