export interface Master {
  id: string;
  name: string;
  bio: string;
  profileImage: string;
  followers: number;
  slots: number;
  funding: number;
  isFollowing?: boolean;
  role?: string;
  profileColor?: string;
}

export interface FlavorProfile {
  acidity: number    // 산미 0-5
  sweetness: number  // 단맛 0-5
  bitterness: number // 쓴맛 0-5
  saltiness: number  // 짠맛 0-5
  nutty: number      // 고소한맛 0-5
  roastLevel: number // 배전도 1-5
}

export interface Slot {
  id: string;
  title: string;
  series: string;
  category: string;
  thumbnailUrl: string;
  videoUrl?: string;
  duration: string;
  master: Pick<Master, "id" | "name" | "profileImage" | "followers" | "role" | "profileColor">;
  likes: number;
  views: number;
  isLiked?: boolean;
  excerpt?: string;
  createdAt?: string;
  supporters?: number;
  capacity?: number;
  accentColor?: string;
  thumbnailColor?: string;
  hasMembership?: boolean;
}

export interface Comment {
  id: string;
  author: Pick<Master, "id" | "name" | "profileImage">;
  content: string;
  createdAt: string;
  userColor?: string;
  time?: string;
  likes?: number;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  myVote?: string;
}

export interface SlotDetail extends Slot {
  description: string;
  hashtags: string[];
  flavor: FlavorProfile;
  imageUrls?: string[];
  deadline?: string;
  status?: string;
  comments: Comment[];
  poll?: Poll;
}
