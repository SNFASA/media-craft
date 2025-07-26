import { GalleryItem, GalleryCategory } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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
  const [gallery, setGallery] = useLocalStorage<GalleryItem[]>('admin_gallery', mockGallery);

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...itemData,
    };
    setGallery(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateGalleryItem = (id: string, updates: Partial<GalleryItem>) => {
    setGallery(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updates, updatedAt: new Date() }
          : item
      )
    );
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(item => item.id !== id));
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
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    getGalleryItem,
    searchGallery,
  };
}