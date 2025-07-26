import { MediaFile } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const mockMedia: MediaFile[] = [
  {
    id: '1',
    filename: 'university-logo.png',
    originalName: 'University Logo.png',
    url: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400',
    type: 'image',
    size: 245760, // 240KB
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    filename: 'annual-report-2023.pdf',
    originalName: 'Annual Report 2023.pdf',
    url: '/uploads/annual-report-2023.pdf',
    type: 'document',
    size: 2048000, // 2MB
    createdAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    filename: 'campus-tour-video.mp4',
    originalName: 'Campus Tour Video.mp4',
    url: '/uploads/campus-tour-video.mp4',
    type: 'video',
    size: 52428800, // 50MB
    createdAt: new Date('2024-01-15'),
  },
];

export function useMediaStore() {
  const [media, setMedia] = useLocalStorage<MediaFile[]>('admin_media', mockMedia);

  const addMediaFile = (fileData: Omit<MediaFile, 'id' | 'createdAt'>) => {
    const newFile: MediaFile = {
      id: Date.now().toString(),
      createdAt: new Date(),
      ...fileData,
    };
    setMedia(prev => [newFile, ...prev]);
    return newFile;
  };

  const deleteMediaFile = (id: string) => {
    setMedia(prev => prev.filter(file => file.id !== id));
  };

  const getMediaFile = (id: string) => {
    return media.find(file => file.id === id);
  };

  const searchMedia = (query: string, type?: MediaFile['type']) => {
    return media.filter(file => {
      const matchesQuery = query === '' || 
        file.filename.toLowerCase().includes(query.toLowerCase()) ||
        file.originalName.toLowerCase().includes(query.toLowerCase());
      
      const matchesType = !type || file.type === type;
      
      return matchesQuery && matchesType;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    media,
    addMediaFile,
    deleteMediaFile,
    getMediaFile,
    searchMedia,
    formatFileSize,
  };
}