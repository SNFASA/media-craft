export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  category: NewsCategory;
  slug: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export type NewsCategory = 
  | 'general'
  | 'academic'
  | 'research' 
  | 'events'
  | 'announcements'
  | 'student-life';

export interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: Date;
  time: string;
  location: string;
  eligibility: EventEligibility;
  registrationRequired: boolean;
  capacity?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export type EventEligibility = 
  | 'all-students'
  | 'undergraduates'
  | 'graduates'
  | 'faculty'
  | 'staff'
  | 'public';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  mainImage: string;
  additionalImages: string[];
  tags: string[];
  category: GalleryCategory;
  size: 'small' | 'medium' | 'large';
  date: Date;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type GalleryCategory = 
  | 'events'
  | 'campus'
  | 'academic'
  | 'sports'
  | 'cultural'
  | 'graduation';

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'image' | 'document' | 'video';
  size: number;
  createdAt: Date;
}

export interface ExcoMember {
  id: string;
  name: string;
  position: string;
  image?: string;
  category: string;
  isHead: boolean;
  order: number;
}

export interface ExcoSection {
  id: string;
  category: string;
  head?: ExcoMember;
  members: ExcoMember[];
  organizationType: 'dean' | 'itc';
}