
import React, { useState } from 'react';
import { Source, Course } from '../types';

interface Props {
  sources: Source[];
  courses: Course[];
  onAddSource: (source: Source) => void;
  onRemoveSource: (id: string) => void;
}

const SourceManager: React.FC<Props> = ({ sources, courses, onAddSource, onRemoveSource }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<Source['type']>('text');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content || !selectedCourseId) {
      alert("Lütfen kurs seçin ve içerik girin!");
      return;
    }
    onAddSource({
      id: Math.random().toString(36).substr(2, 9),
      name,
      content,
      type,
      courseId: selectedCourseId,
      addedAt: new Date()
    });
    setName('');
    setContent('');
  };

  const handleAddDriveVideo = (driveUrl: string, fileName: string) => {
    if (!selectedCourseId) {
        alert("Lütfen önce kurs seçin!");
        return;
    }
    onAddSource({
      id: Math.random().toString(36).substr(2, 9),
      name: fileName || 'Google Drive Videosu',
      content: `Drive Video Linki: ${driveUrl}`,
      type: 'drive_video',
      courseId: selectedCourseId,
      addedAt: new Date()
    });
    setIsDriveModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-plus-circle text-blue-600"></i> Yeni Kaynak Yükle
          </h2>
          <button 
            onClick={() => setIsDriveModalOpen(true)}
            className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors border border-green-200"
          >
            <i className="fab fa-google-drive"></i> Drive'dan Seç
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <select 
              value={selectedCourseId} 
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full p-3 bg-blue-50 border border-blue-100 text-blue-800 font-bold rounded-lg outline-none"
            >
              <option value="">-- Hedef Kurs Seçin --</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <input
              type="text"
              placeholder="Kaynak Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Source['type'])}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"
            >
              <option value="text">Metin Belgesi</option>
              <option value="video">Normal Video Linki</option>
              <option value="link">Web Kaynağı</option>
              <option value="drive_video">Google Drive Videosu</option>
            </select>
          </div>
          <textarea
            placeholder="Kaynak İçeriği..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg h-32 outline-none"
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg">Kaynağı Kursa Ata</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map(source => {
          const course = courses.find(c => c.id === source.courseId);
          return (
            <div key={source.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group">
               <button onClick={() => onRemoveSource(source.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><i className="fas fa-times-circle"></i></button>
               <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <i className="fas fa-file"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{source.name}</h3>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">{course?.title}</span>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{source.content}</p>
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      {isDriveModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><i className="fab fa-google-drive"></i> Drive Dosyası Ekle</h3>
            <div className="space-y-4">
              <input id="dr-name" placeholder="Dosya Başlığı" className="w-full p-3 border rounded-lg" />
              <input id="dr-url" placeholder="Drive URL" className="w-full p-3 border rounded-lg" />
              <button onClick={() => handleAddDriveVideo((document.getElementById('dr-url') as any).value, (document.getElementById('dr-name') as any).value)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Bağla</button>
              <button onClick={() => setIsDriveModalOpen(false)} className="w-full py-2 text-gray-500 text-sm">İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceManager;
