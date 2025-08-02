import { GalleryItem, GalleryCategory } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

const mockGallery: GalleryItem[] = [
  {
    id: '1',
    title: 'Graduation Ceremony 2024',
    description: 'Celebrating our graduating class of 2024.',
    mainImage: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800'
    ],
    tags: ['graduation', 'ceremony', '2024', 'students'],
    category: 'graduation',
    size: 'large',
    date: new Date('2024-05-15'),
    featured: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'Campus Sports Day',
    description: 'Annual inter-department sports competition.',
    mainImage: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800',
    additionalImages: [],
    tags: ['sports', 'competition', 'athletics'],
    category: 'sports',
    size: 'medium',
    date: new Date('2024-03-20'),
    featured: false,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    title: 'Cultural Festival',
    description: 'Celebrating diversity through art, music, and dance.',
    mainImage: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800'
    ],
    tags: ['culture', 'festival', 'arts', 'music'],
    category: 'cultural',
    size: 'large',
    date: new Date('2024-04-01'),
    featured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

export function useGalleryStore() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('galleryitem')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedGallery: GalleryItem[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        mainImage: item.main_image,
        additionalImages: item.additional_images || [],
        tags: item.tags || [],
        category: item.category as GalleryCategory,
        size: item.size as GalleryItem['size'],
        date: new Date(item.date),
        featured: item.featured || false,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      }));

      setGallery(formattedGallery);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setGallery([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const addGalleryItem = async (itemData: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('galleryitem')
        .insert([{
          title: itemData.title,
          description: itemData.description,
          main_image: itemData.mainImage,
          additional_images: itemData.additionalImages,
          tags: itemData.tags,
          category: itemData.category,
          size: itemData.size,
          date: itemData.date.toISOString().split('T')[0],
          featured: itemData.featured,
        }])
        .select()
        .single();

      if (error) throw error;

      const newItem: GalleryItem = {
        id: data.id,
        title: data.title,
        description: data.description,
        mainImage: data.main_image,
        additionalImages: data.additional_images || [],
        tags: data.tags || [],
        category: data.category as GalleryCategory,
        size: data.size as GalleryItem['size'],
        date: new Date(data.date),
        featured: data.featured || false,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setGallery(prev => [newItem, ...prev]);
      return newItem;
    } catch (error) {
      console.error('Error adding gallery item:', error);
      throw error;
    }
  };

  const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>) => {
    try {
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.mainImage !== undefined) updateData.main_image = updates.mainImage;
      if (updates.additionalImages !== undefined) updateData.additional_images = updates.additionalImages;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.size !== undefined) updateData.size = updates.size;
      if (updates.date !== undefined) updateData.date = updates.date.toISOString().split('T')[0];
      if (updates.featured !== undefined) updateData.featured = updates.featured;

      const { error } = await supabase
        .from('galleryitem')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setGallery(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, ...updates, updatedAt: new Date() }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating gallery item:', error);
      throw error;
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('galleryitem')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGallery(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      throw error;
    }
  };

  const getGalleryItem = (id: string) => {
    return gallery.find(item => item.id === id);
  };

  const searchGallery = (query: string, category?: GalleryCategory, featured?: boolean) => {
    return gallery.filter(item => {
      const matchesQuery = query === '' || 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !category || item.category === category;
      const matchesFeatured = featured === undefined || item.featured === featured;
      
      return matchesQuery && matchesCategory && matchesFeatured;
    });
  };

  return {
    gallery,
    loading,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    getGalleryItem,
    searchGallery,
    fetchGallery,
  };
}