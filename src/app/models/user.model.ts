export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  provider: string;
  role: 'READER' | 'AUTHOR';
}
