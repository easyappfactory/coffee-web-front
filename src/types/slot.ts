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

export interface FlavorRadarPoint {
  axis: "FRUITY" | "FLORAL" | "SWEET" | "NUTTY" | "EARTHY";
  value: number;
}

export interface FlavorBar {
  name: string;
  value: number;
}

export interface FlavorProfile {
  radar: FlavorRadarPoint[];
  bars: FlavorBar[];
  roastingLevel: 1 | 2 | 3 | 4 | 5;
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
  comments: Comment[];
  poll?: Poll;
}
