export interface Article {
  id?: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  category: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  publishedAt?: Date | string;
  createdAt: string;
  authorBio?: string;
  updatedAt?: string;
  status: 'DRAFT' | 'PUBLISHED';
  featured?: boolean;
  editorPick?: boolean;
  likes?: number;
  views?: number;
  tags?: string[];
}
