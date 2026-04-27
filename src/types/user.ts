export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface Master {
  id: string;
  name: string;
  bio: string;
  profileImage: string;
  followers: number;
  slotsCount: number;
  totalFunding: number;
  isFollowing?: boolean;
  certifications?: string[];
}
