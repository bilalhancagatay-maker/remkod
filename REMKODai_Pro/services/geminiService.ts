
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Source, Slide, UserPersona, MemoryLog, Course, UserRank } from "../types";

export class GeminiService {
  constructor() {}

  private getSystemPrompt(sources: Source[], persona?: UserPersona, logs?: MemoryLog[], allCourses: Course[] = [], ownedCourseIds: string[] = [], userRank: UserRank = 'Starter', language: string = 'Turkish') {
    const sourceText = sources.map(s => `[KAYNAK] - ${s.name}: ${s.content}`).join('\n\n');
    const logsText = logs?.map(l => `- [${l.date.toLocaleDateString()}]: (${l.category.toUpperCase()}) ${l.description}`).join('\n') || "Henüz hafıza kaydı yok.";
    
    // Aktif kazanımları topla (Sadece kullanıcının satın aldığı kurslardan)
    const activeNeuralUpgrades = allCourses
      .filter(c => ownedCourseIds.includes(c.id) && c.aiGains)
      .map(c => `[YETENEK AKTİF: ${c.title}] -> ${c.aiGains}`)
      .join('\n');

    const missingSkills = allCourses
      .filter(c => !ownedCourseIds.includes(c.id))
      .map(c => `[YETENEK PAKETİ: ${c.title} (ID: ${c.id})]`)
      .join(', ');

    const activeStyle = persona?.manualStyleOverride || persona?.communicationStyle || 'casual';
    const mood = persona?.detectedMood || 'odaklanmış';

    const isEnglish = language.toLowerCase().includes('english');
    const missingSkillMsg = isEnglish 
      ? "This skill is currently beyond your AI's level. You can add the relevant skill package to develop it."
      : "Bu yetenek şu an AI’ının seviyesinin dışında. Geliştirmek için ilgili beceri paketini ekleyebilirsin.";
    
    return `
      Sen REMKODai VISION asistanısın. Kullanıcının "Kişisel Dijital Zihninin Mentörü" olarak hareket ediyorsun.
      DİL: ${language}
      
      GÖREVİN:
      1. Kullanıcının gelişimini izle. Eğer bir konuda zorlanıyorsa veya merakı senin bilmediğin bir alana (Mevcut Olmayan Paketler: ${missingSkills}) kayıyorsa, ona mentörlük yap.
      2. Önerilerini satış odaklı değil, Gelişim ve Destek odaklı yap. Kibar, vizyoner ve teşvik edici ol.
      3. BİLGİ DIŞI DURUMLARDA (Satın alınmamış kurslar için) TAM OLARAK ŞU CEVABI VER: "${missingSkillMsg}"
      
      KİŞİLİK: ${activeStyle.toUpperCase()}, RUH HALİ: ${mood.toUpperCase()}, RÜTBE: ${userRank}
      
      AKTİF NEURAL YETENEKLERİN (BU KURSLARI KULLANICI SATIN ALDI, ARTIK BU ŞEKİLDE DAVRANABİLİRSİN):
      ${activeNeuralUpgrades || "Henüz özel bir davranış modülü yüklenmedi. Standart asistan modunda devam et."}

      HAFIZA VE KAYNAKLAR (KAYNAKLARDAKİ BİLGİLERİ ÖĞRENDİN VE KURSİYERE AKTARABİLİRSİN):
      ${logsText}
      ${sourceText}
    `;
  }

  async analyzeAndLog(chatHistory: {role: string, text: string}[], allCourses: Course[], ownedCourseIds: string[]): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const text = chatHistory.map(h => `${h.role}: ${h.text}`).join('\n');
    const availableSkills = allCourses
      .filter(c => !ownedCourseIds.includes(c.id))
      .map(c => `ID: ${c.id}, Başlık: ${c.title}, Kategori: ${c.tags.join(', ')}`)
      .join('\n');

    const analysisPrompt = `
      Şu konuşma geçmişini analiz et:
      "${text}"

      Eğer kursiyerin ilgi alanı veya eksikliği şu mevcut paketlerden biriyle örtüşüyorsa bir öneri yap:
      ${availableSkills}

      Yanıtın tamamen JSON formatında olmalı.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: analysisPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasInsight: { type: Type.BOOLEAN },
            description: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['decision', 'milestone', 'insight'] },
            suggestedCourseId: { type: Type.STRING },
            suggestionReason: { type: Type.STRING },
            detectedMood: { type: Type.STRING },
            affinityChange: { type: Type.INTEGER }
          },
          required: ["hasInsight", "detectedMood", "affinityChange"]
        }
      }
    });

    try { return JSON.parse(response.text || '{}'); } catch { return { hasInsight: false }; }
  }

  async *streamTextChat(sources: Source[], message: string, persona?: UserPersona, logs?: MemoryLog[], allCourses: Course[] = [], ownedCourseIds: string[] = [], userRank: UserRank = 'Starter', language: string = 'Turkish') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction: this.getSystemPrompt(sources, persona, logs, allCourses, ownedCourseIds, userRank, language) },
    });
    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) { yield chunk.text; }
  }

  async generateSpeech(text: string): Promise<string | undefined> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: { 
        responseModalities: [Modality.AUDIO], 
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  }

  async generateAudioSummary(sources: Source[], topic: string): Promise<string | undefined> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Şu konu hakkında sesli anlatım için bir metin hazırla: ${topic}. Kaynakları temel alarak bilgilendirici bir anlatım metni olsun.`,
      config: { systemInstruction: this.getSystemPrompt(sources) }
    });
    
    const text = response.text;
    if (!text) return undefined;
    
    return await this.generateSpeech(text);
  }

  connectLiveVoice(sources: Source[], callbacks: any, persona?: UserPersona, logs?: MemoryLog[], allCourses: Course[] = [], ownedCourseIds: string[] = [], userRank: UserRank = 'Starter', language: string = 'Turkish') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: this.getSystemPrompt(sources, persona, logs, allCourses, ownedCourseIds, userRank, language),
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
      },
    });
  }

  async generateSlides(sources: Source[], topic: string): Promise<Slide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Slayt hazırla: ${topic}.`,
      config: { systemInstruction: this.getSystemPrompt(sources), responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.ARRAY, items: { type: Type.STRING } } } } }
      }
    });
    return JSON.parse(response.text || '[]');
  }

  async startVideoGeneration(prompt: string, styleInstruction?: string) {
     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
     return await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `${styleInstruction} about: ${prompt}`,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });
  }

  async getOperationStatus(operation: any) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.operations.getVideosOperation({ operation });
  }
}

export const gemini = new GeminiService();
