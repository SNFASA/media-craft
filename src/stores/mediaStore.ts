import { MediaFile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

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
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mediafile')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedMedia: MediaFile[] = data.map(file => ({
        id: file.id,
        filename: file.filename,
        originalName: file.original_name,
        url: file.url,
        type: file.type as MediaFile['type'],
        size: file.size,
        createdAt: new Date(file.created_at),
      }));

      setMedia(formattedMedia);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMediaFile = async (fileData: Omit<MediaFile, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('mediafile')
        .insert([{
          filename: fileData.filename,
          original_name: fileData.originalName,
          url: fileData.url,
          type: fileData.type,
          size: fileData.size,
        }])
        .select()
        .single();

      if (error) throw error;

      const newFile: MediaFile = {
        id: data.id,
        filename: data.filename,
        originalName: data.original_name,
        url: data.url,
        type: data.type as MediaFile['type'],
        size: data.size,
        createdAt: new Date(data.created_at),
      };

      setMedia(prev => [newFile, ...prev]);
      return newFile;
    } catch (error) {
      console.error('Error adding media file:', error);
      throw error;
    }
  };

  const deleteMediaFile = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mediafile')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMedia(prev => prev.filter(file => file.id !== id));
    } catch (error) {
      console.error('Error deleting media file:', error);
      throw error;
    }
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
    loading,
    addMediaFile,
    deleteMediaFile,
    getMediaFile,
    searchMedia,
    formatFileSize,
    fetchMedia,
  };
}