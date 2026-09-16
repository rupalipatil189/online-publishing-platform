export interface Comment {
  id?: string;
  articleId: string;
  userId: string;
  userName: string;
  userImage?: string;
  userAvatar?: string;
  content: string;
  likedBy?: string[];
  parentId: string | null;
  likes: number;
  createdAt: string;
}
