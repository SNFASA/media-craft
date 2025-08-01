import { NewsArticle, NewsCategory } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

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
    author: 'Dr. Sarah Johnson',
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
    author: 'Admin Staff',
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
    author: 'Sports Committee',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
];

export function useNewsStore() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('newsarticle')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedNews: NewsArticle[] = data.map(article => ({
        id: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        category: article.category as NewsCategory,
        slug: article.slug,
        status: article.status as NewsArticle['status'],
        author: article.author,
        image: article.image || undefined,
        createdAt: new Date(article.created_at),
        updatedAt: new Date(article.updated_at),
        publishedAt: article.published_at ? new Date(article.published_at) : undefined,
      }));

      setNews(formattedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNews = async (newsData: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) => {
    try {
      const slug = await generateUniqueSlug(newsData.title);
      const { data, error } = await supabase
        .from('newsarticle')
        .insert([{
          title: newsData.title,
          description: newsData.description,
          content: newsData.content,
          category: newsData.category,
          slug: slug,
          status: newsData.status,
          author: newsData.author,
          image: newsData.image,
          published_at: newsData.publishedAt?.toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;

      const newArticle: NewsArticle = {
        id: data.id,
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category as NewsCategory,
        slug: data.slug,
        status: data.status as NewsArticle['status'],
        author: data.author,
        image: data.image || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        publishedAt: data.published_at ? new Date(data.published_at) : undefined,
      };

      setNews(prev => [newArticle, ...prev]);
      return newArticle;
    } catch (error) {
      console.error('Error adding news:', error);
      throw error;
    }
  };

  const updateNews = async (id: string, updates: Partial<NewsArticle>) => {
    try {
      const updateData: any = {};
      if (updates.title !== undefined) {
        updateData.title = updates.title;
        updateData.slug = await generateUniqueSlug(updates.title, id);
      }
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.author !== undefined) updateData.author = updates.author;
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.publishedAt !== undefined) updateData.published_at = updates.publishedAt?.toISOString();

      const { error } = await supabase
        .from('newsarticle')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setNews(prev => 
        prev.map(article => 
          article.id === id 
            ? { 
                ...article, 
                ...updates, 
                updatedAt: new Date(),
                slug: updates.title ? updateData.slug : article.slug
              }
            : article
        )
      );
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  };

  const deleteNews = async (id: string) => {
    try {
      const { error } = await supabase
        .from('newsarticle')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNews(prev => prev.filter(article => article.id !== id));
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
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
    loading,
    addNews,
    updateNews,
    deleteNews,
    getNews,
    searchNews,
    fetchNews,
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

async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data, error } = await supabase
      .from('newsarticle')
      .select('id')
      .eq('slug', slug)
      .limit(1);

    if (error) {
      console.error('Error checking slug uniqueness:', error);
      return slug;
    }

    // If no existing record found, or found record is the one we're updating
    if (!data || data.length === 0 || (excludeId && data[0]?.id === excludeId)) {
      return slug;
    }

    // Generate new slug with counter
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}