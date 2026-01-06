
export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface MemoryLog {
  id: string;
  date: Date;
  description: string;
  category: 'decision' | 'milestone' | 'insight';
}

export interface UserPersona {
  communicationStyle: 'concise' | 'detailed' | 'motivational' | 'analytical' | 'casual';
  learningStyle: 'auditory' | 'reading' | 'example-based' | 'step-by-step';
  motivationType: 'result-oriented' | 'safety-seeking' | 'explorer';
  interestKeywords: string[];
  personalizationEnabled: boolean;
  affinityScore: number;
  currentGoal?: string;
  manualStyleOverride?: string;
  detectedMood?: string;
  adaptiveTonePreference?: string;
  cognitiveLoad?: 'low' | 'medium' | 'high';
  personalityTrait?: string;
  trackCommunicationStyle: boolean;
  trackLearningStyle: boolean;
  trackMood: boolean;
  retainMemory: boolean;
  proactiveSocraticMode: boolean;
}

export interface UserProfile {
  fullName: string;
  username: string;
  tcNo: string;
  email: string;
  phone: string;
  address: string;
}

export type UserRank = 'Guest' | 'Starter' | 'Pro' | 'Pro Plus' | 'Elite';

export interface UserData {
  id: string;
  profile: UserProfile;
  persona: UserPersona;
  memoryLogs: MemoryLog[];
  badges: string[];
  purchasedCourseIds: string[];
  role: 'admin' | 'student';
  xp: number;
  rank: UserRank;
  isLoggedIn: boolean;
  usageCount: number;
  voiceCallUsed: boolean;
}

export interface Source {
  id: string;
  name: string;
  type: 'text' | 'pdf' | 'video' | 'link' | 'drive_video';
  content: string;
  courseId: string;
  addedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  features: string[];
  tags: string[];
  level: 'Starter' | 'Pro' | 'Pro Plus' | 'Elite' | 'All';
  reviews?: Review[];
  aiGains?: string; // Sadece AI'ın göreceği yetenek talimatları
}

export interface Slide {
  title: string;
  content: string[];
}

export interface GenerationState {
  isGenerating: boolean;
  type: 'slides' | 'audio' | 'video' | null;
  progress: number;
  statusMessage: string;
  result?: Slide[] | string;
}

export interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  styleInstruction: string;
}

export enum AppTab {
  MARKET = 'market',
  MY_COURSES = 'my_courses',
  ADMIN_COURSES = 'admin_courses',
  ADMIN_SOURCES = 'admin_sources',
  ADMIN_USERS = 'admin_users',
  CHAT = 'chat',
  GENERATE = 'generate',
  PROFILE = 'profile',
  PACKAGES = 'packages',
  REPORT = 'report'
}
