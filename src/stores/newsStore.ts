import { NewsArticle, NewsCategory } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock data for initial state
const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'New Research Center Opens at University',
    description: 'The university announces the opening of a state-of-the-art research facility.',
    content: '<p>We are excited to announce the opening of our new research center...</p>',
    category: 'research',
    slug: 'new-research-center-opens',
    status: 'published',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    publishedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Spring Semester Registration Now Open',
    description: 'Students can now register for spring semester courses.',
    content: '<p>Registration for the spring semester is now open...</p>',
    category: 'academic',
    slug: 'spring-semester-registration-open',
    status: 'published',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    publishedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'Annual Sports Festival Announcement',
    description: 'Join us for the annual inter-department sports competition.',
    content: '<p>The annual sports festival will be held...</p>',
    category: 'events',
    slug: 'annual-sports-festival',
    status: 'draft',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
];

export function useNewsStore() {
  const [news, setNews] = useLocalStorage<NewsArticle[]>('admin_news', mockNews);

  const addNews = (newsData: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) => {
    const newArticle: NewsArticle = {
      id: Date.now().toString(),
      slug: generateSlug(newsData.title),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...newsData,
    };
    setNews(prev => [newArticle, ...prev]);
    return newArticle;
  };

  const updateNews = (id: string, updates: Partial<NewsArticle>) => {
    setNews(prev => 
      prev.map(article => 
        article.id === id 
          ? { 
              ...article, 
              ...updates, 
              updatedAt: new Date(),
              slug: updates.title ? generateSlug(updates.title) : article.slug
            }
          : article
      )
    );
  };

  const deleteNews = (id: string) => {
    setNews(prev => prev.filter(article => article.id !== id));
  };

  const getNews = (id: string) => {
    return news.find(article => article.id === id);
  };

  const searchNews = (query: string, category?: NewsCategory) => {
    return news.filter(article => {
      const matchesQuery = query === '' || 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !category || article.category === category;
      
      return matchesQuery && matchesCategory;
    });
  };

  return {
    news,
    addNews,
    updateNews,
    deleteNews,
    getNews,
    searchNews,
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}