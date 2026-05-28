import type { Slot, SlotDetail, Comment, Poll, FlavorProfile } from "@/types/slot";
import type { FundingStatus, Reward } from "@/types/funding";

export interface MasterProfile {
  id: string;
  name: string;
  role: string;
  profileColor: string;
  profileImage: string;
  bio: string;
  followers: number;
  slotCount: number;
  totalFunding: number;
  isFollowing: boolean;
  recentSlots: { id: string; title: string; thumbnailColor: string; accentColor: string; percent: number }[];
}

export const mockMasterProfiles: Record<string, MasterProfile> = {
  m1: {
    id: "m1",
    name: "한지우",
    role: "World Barista Champion 2022",
    profileColor: "#75584d",
    profileImage: "https://picsum.photos/seed/master1/200/200",
    bio: "2022 월드 바리스타 챔피언. 에티오피아와 예멘 원두의 스페셜리스트로, 발효 프로세싱의 가능성을 국내에 소개한 선구자입니다. 현재 서울 성수동에서 자신의 카페 '소마'를 운영 중입니다.",
    followers: 999848,
    slotCount: 8,
    totalFunding: 127,
    isFollowing: false,
    recentSlots: [
      { id: "1", title: "에티오피아 아나에어로빅 네추럴", thumbnailColor: "#2d1f1a", accentColor: "#c4824a", percent: 127 },
      { id: "5", title: "과테말라 어니언 발효 : 대지의 달콤함", thumbnailColor: "#1f1a0f", accentColor: "#b87050", percent: 63 },
    ],
  },
  m2: {
    id: "m2",
    name: "박연우",
    role: "Q-Grader / Cup of Excellence Judge",
    profileColor: "#3a6a8a",
    profileImage: "https://picsum.photos/seed/master2/200/200",
    bio: "국제 Q-Grader이자 Cup of Excellence 심사위원. 파나마와 콜롬비아 고지대 원두를 주로 큐레이션하며, 플로럴 계열 원두의 매력을 알리는 데 집중합니다.",
    followers: 82300,
    slotCount: 5,
    totalFunding: 85,
    isFollowing: false,
    recentSlots: [
      { id: "2", title: "케냐 AA 게이샤 : 아프리카의 보석", thumbnailColor: "#1a2533", accentColor: "#6a9fc8", percent: 85 },
    ],
  },
  m3: {
    id: "m3",
    name: "정하진",
    role: "Head Roaster @ Opal Coffee",
    profileColor: "#8a6a20",
    profileImage: "https://picsum.photos/seed/master3/200/200",
    bio: "오팔 커피의 헤드 로스터. 허니 프로세싱과 중배전의 균형을 탐구합니다. 로스팅 커브 설계에 있어 국내 최고 수준의 기술력을 보유하고 있습니다.",
    followers: 241000,
    slotCount: 4,
    totalFunding: 92,
    isFollowing: false,
    recentSlots: [
      { id: "3", title: "파나마 게이샤 워시드 : 꽃향기의 정점", thumbnailColor: "#1f1a2a", accentColor: "#9a7ac0", percent: 85 },
    ],
  },
  m4: {
    id: "m4",
    name: "강은수",
    role: "SCA Certified Trainer",
    profileColor: "#3a7a4a",
    profileImage: "https://picsum.photos/seed/master4/200/200",
    bio: "SCA 공인 트레이너이자 스페셜티 커피 교육자. 아프리카 테루아르 원두의 다양성을 국내 소비자에게 알리는 것을 사명으로 삼고 있습니다.",
    followers: 158700,
    slotCount: 3,
    totalFunding: 78,
    isFollowing: false,
    recentSlots: [
      { id: "4", title: "콜롬비아 핑크 버번 : 달콤한 반란", thumbnailColor: "#1f1a0f", accentColor: "#d4a84b", percent: 78 },
    ],
  },
  m5: {
    id: "m5",
    name: "윤서진",
    role: "Barista & Coffee Educator",
    profileColor: "#6a50a0",
    profileImage: "https://picsum.photos/seed/master5/200/200",
    bio: "바리스타이자 커피 에듀케이터. 중미 화산 지대 원두에 깊은 조예를 가지고 있으며, 테루아르와 프로세싱이 맛에 미치는 영향을 연구합니다.",
    followers: 67400,
    slotCount: 2,
    totalFunding: 63,
    isFollowing: false,
    recentSlots: [
      { id: "5", title: "과테말라 어니언 발효 : 대지의 달콤함", thumbnailColor: "#1a1f10", accentColor: "#6a9a50", percent: 63 },
    ],
  },
  m6: {
    id: "m6",
    name: "송주원",
    role: "Specialty Coffee Consultant",
    profileColor: "#7a5030",
    profileImage: "https://picsum.photos/seed/master6/200/200",
    bio: "스페셜티 커피 컨설턴트로 브라질과 중남미 원두 큐레이션을 전문으로 합니다. 클래식한 프로파일부터 실험적인 프로세싱까지 폭넓은 스펙트럼을 다룹니다.",
    followers: 34900,
    slotCount: 3,
    totalFunding: 55,
    isFollowing: false,
    recentSlots: [
      { id: "6", title: "브라질 옐로우 버번 : 너트의 클래식", thumbnailColor: "#1a1510", accentColor: "#a07840", percent: 48 },
    ],
  },
  m7: {
    id: "m7",
    name: "임도현",
    role: "World Brewers Cup Finalist",
    profileColor: "#8a3060",
    profileImage: "https://picsum.photos/seed/master7/200/200",
    bio: "월드 브루어스컵 파이널리스트. 아프리카 고산지 원두의 산미와 플로럴 향을 섬세하게 표현하는 브루잉 기법을 연구합니다.",
    followers: 193200,
    slotCount: 5,
    totalFunding: 77,
    isFollowing: false,
    recentSlots: [
      { id: "7", title: "르완다 버번 풀 워시드 : 레드 베리의 기억", thumbnailColor: "#1a1020", accentColor: "#c07090", percent: 77 },
    ],
  },
  m8: {
    id: "m8",
    name: "권해인",
    role: "Certified Q Grader & Educator",
    profileColor: "#75584d",
    profileImage: "https://picsum.photos/seed/master8/200/200",
    bio: "Q-Grader 인증 트레이너. 허니 프로세싱과 워시드 프로세싱의 비교 연구를 통해 소비자들이 원두 프로세싱을 쉽게 이해할 수 있도록 교육합니다.",
    followers: 412500,
    slotCount: 6,
    totalFunding: 112,
    isFollowing: false,
    recentSlots: [
      { id: "8", title: "코스타리카 허니 프로세스 : 꿀빛 여운", thumbnailColor: "#1a1510", accentColor: "#c4824a", percent: 85 },
    ],
  },
};

function toSlotMaster(p: MasterProfile): Slot["master"] {
  return {
    id: p.id,
    name: `Master. ${p.name}`,
    profileImage: p.profileImage,
    followers: p.followers,
    role: p.role,
    profileColor: p.profileColor,
  };
}

export const mockMaster = {
  ...mockMasterProfiles.m1,
  name: `Master. ${mockMasterProfiles.m1.name}`,
  slots: mockMasterProfiles.m1.slotCount,
  funding: mockMasterProfiles.m1.totalFunding,
};

export const mockSlots: Slot[] = [
  {
    id: "1",
    title: "에티오피아 아나에어로빅 네추럴 : 산소의 마법",
    series: "Limited Reserve Series",
    category: "BEANS",
    thumbnailUrl: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&h=450&fit=crop&q=80",
    videoUrl: "/mock_video.mp4",
    duration: "12 MIN READ",
    thumbnailColor: "#2d1f1a",
    accentColor: "#c4824a",
    master: toSlotMaster(mockMasterProfiles.m1),
    likes: 2847,
    views: 18420,
    isLiked: false,
    createdAt: "2026-04-23",
    supporters: 842,
    capacity: 1000,
    excerpt:
      "에티오피아 예가체프 지역에서 생산된 아나에어로빅 발효 방식의 네추럴 원두. 산소를 차단한 밀폐 탱크에서 발효되어 독특한 와인 같은 풍미와 복합적인 과일 향이 발달합니다.",
  },
  {
    id: "2",
    title: "케냐 AA 게이샤 : 아프리카의 보석",
    series: "Origin Discovery",
    category: "BREWING",
    thumbnailUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=450&fit=crop&q=80",
    duration: "8 MIN READ",
    thumbnailColor: "#1a2533",
    accentColor: "#6a9fc8",
    master: toSlotMaster(mockMasterProfiles.m2),
    likes: 1923,
    views: 12100,
    isLiked: false,
    createdAt: "2026-04-08",
    supporters: 423,
    capacity: 500,
    excerpt: "케냐 AA 등급 게이샤 품종의 섬세한 플로럴 향과 베리류의 산미가 복합적으로 어우러지는 고산지 원두입니다.",
  },
  {
    id: "3",
    title: "파나마 게이샤 워시드 : 꽃향기의 정점",
    series: "Signature Collection",
    category: "BEANS",
    thumbnailUrl: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&h=450&fit=crop&q=80",
    duration: "15 MIN READ",
    thumbnailColor: "#1f1a2a",
    accentColor: "#9a7ac0",
    master: toSlotMaster(mockMasterProfiles.m3),
    likes: 3412,
    views: 22050,
    isLiked: false,
    createdAt: "2026-04-10",
    supporters: 678,
    capacity: 800,
    excerpt: "파나마 보케테 지역 워시드 게이샤. 재스민, 복숭아, 밀크티 노트가 조화를 이루며 세계 최고가 경매 원두 중 하나로 꼽힙니다.",
  },
  {
    id: "4",
    title: "콜롬비아 핑크 버번 : 달콤한 반란",
    series: "Limited Reserve Series",
    category: "TASTING",
    thumbnailUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=450&fit=crop&q=80",
    duration: "10 MIN READ",
    thumbnailColor: "#1f1a0f",
    accentColor: "#d4a84b",
    master: toSlotMaster(mockMasterProfiles.m4),
    likes: 2156,
    views: 14800,
    isLiked: false,
    createdAt: "2026-04-12",
    supporters: 312,
    capacity: 400,
    excerpt: "콜롬비아 우일라 지역의 핑크 버번 품종. 딸기잼, 캐러멜, 다크 초콜릿이 순서대로 펼쳐지는 풍부한 후미가 특징입니다.",
  },
  {
    id: "5",
    title: "과테말라 어니언 발효 : 대지의 달콤함",
    series: "Fermentation Lab",
    category: "BEANS",
    thumbnailUrl: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=450&fit=crop&q=80",
    duration: "9 MIN READ",
    thumbnailColor: "#1a1f10",
    accentColor: "#6a9a50",
    master: toSlotMaster(mockMasterProfiles.m5),
    likes: 1740,
    views: 10230,
    isLiked: false,
    createdAt: "2026-04-14",
    supporters: 188,
    capacity: 300,
    excerpt: "과테말라 우에우에테낭고 고지대에서 양파 껍질을 이용한 이색 발효를 거친 원두. 카라멜과 피치 노트가 매력적입니다.",
  },
  {
    id: "6",
    title: "브라질 옐로우 버번 : 너트의 클래식",
    series: "Origin Discovery",
    category: "BREWING",
    thumbnailUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=450&fit=crop&q=80",
    duration: "7 MIN READ",
    thumbnailColor: "#1a1510",
    accentColor: "#a07840",
    master: toSlotMaster(mockMasterProfiles.m6),
    likes: 980,
    views: 7450,
    isLiked: false,
    createdAt: "2026-04-16",
    supporters: 97,
    capacity: 200,
    excerpt: "브라질 미나스제라이스 지역의 옐로우 버번. 헤이즐넛, 밀크초콜릿, 부드러운 캐러멜이 어우러진 클래식한 브라질리언 컵 프로파일입니다.",
  },
  {
    id: "7",
    title: "르완다 버번 풀 워시드 : 레드 베리의 기억",
    series: "Signature Collection",
    category: "TASTING",
    thumbnailUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=450&fit=crop&q=80",
    duration: "11 MIN READ",
    thumbnailColor: "#1a1020",
    accentColor: "#c07090",
    master: toSlotMaster(mockMasterProfiles.m7),
    likes: 2230,
    views: 16300,
    isLiked: false,
    createdAt: "2026-04-18",
    supporters: 541,
    capacity: 700,
    excerpt: "르완다 니암바레 지역에서 재배된 부르봉 품종. 체리, 레드커런트의 산뜻한 산미와 흑설탕처럼 달콤한 피니쉬가 인상적입니다.",
  },
  {
    id: "8",
    title: "코스타리카 허니 프로세스 : 꿀빛 여운",
    series: "Fermentation Lab",
    category: "BEANS",
    thumbnailUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=450&fit=crop&q=80",
    duration: "13 MIN READ",
    thumbnailColor: "#1a1510",
    accentColor: "#c4824a",
    master: toSlotMaster(mockMasterProfiles.m8),
    likes: 3100,
    views: 19800,
    isLiked: false,
    createdAt: "2026-04-20",
    supporters: 763,
    capacity: 900,
    excerpt: "코스타리카 타라수 지역 레드 허니 프로세스 원두. 과일 껍질을 일부 남긴 채 건조해 복숭아 넥타르와 꿀처럼 진한 단맛이 층층이 쌓입니다.",
  },
];

export const mockSlotDetail: SlotDetail = {
  ...mockSlots[0],
  description:
    "에티오피아 예가체프 지역에서 생산된 아나에어로빅 발효 방식의 네추럴 프로세스 원두입니다. 산소를 차단한 밀폐 탱크에서 발효되어 독특한 와인 같은 풍미와 복합적인 과일 향이 발달합니다. 이 원두는 일반적인 에티오피아 원두보다 훨씬 강렬한 발효 향을 지니며, 딸기잼, 블루베리, 장미 향이 레이어를 이루어 펼쳐집니다.",
  hashtags: ["#에티오피아", "#아나에어로빅", "#네추럴", "#스페셜티", "#예가체프"],
  flavor: {
    radar: [
      { axis: "FRUITY", value: 80 },
      { axis: "FLORAL", value: 60 },
      { axis: "SWEET", value: 75 },
      { axis: "NUTTY", value: 40 },
      { axis: "EARTHY", value: 50 },
    ],
    bars: [
      { name: "Acidity", value: 85 },
      { name: "Sweetness", value: 70 },
      { name: "Body", value: 60 },
      { name: "Bitterness", value: 30 },
    ],
    roastingLevel: 2,
  },
  comments: [
    {
      id: "c1",
      author: { id: "u1", name: "coffee_lover_92", profileImage: "https://picsum.photos/seed/user1/100/100" },
      content: "작년에 비슷한 프로세싱 원두를 마셔봤는데 정말 독특한 경험이었어요. 이번 건 더 기대됩니다!",
      createdAt: "2026-04-25T09:30:00Z",
      userColor: "#a06040",
      time: "2시간 전",
      likes: 14,
    },
    {
      id: "c2",
      author: { id: "u2", name: "brewing_seoul", profileImage: "https://picsum.photos/seed/user2/100/100" },
      content: "72시간 발효... 진짜 궁금하네요. 브루잉 영상도 같이 올려주실 건가요 마스터님?",
      createdAt: "2026-04-25T06:20:00Z",
      userColor: "#4a7a8a",
      time: "5시간 전",
      likes: 9,
    },
    {
      id: "c3",
      author: { id: "u3", name: "단골손님", profileImage: "https://picsum.photos/seed/user3/100/100" },
      content: "슈퍼얼리버드 이미 펀딩했습니다!! 핸드라이팅 테이스팅 노트가 너무 탐나요",
      createdAt: "2026-04-24T11:05:00Z",
      userColor: "#6a5a8a",
      time: "1일 전",
      likes: 22,
    },
    {
      id: "c4",
      author: { id: "u4", name: "espresso_monk", profileImage: "https://picsum.photos/seed/user4/100/100" },
      content: "에티오피아 아나에어로빅은 산미가 강할 것 같은데, 브루잉 온도 추천해주실 수 있나요?",
      createdAt: "2026-04-24T10:00:00Z",
      userColor: "#5a7a4a",
      time: "1일 전",
      likes: 7,
    },
  ],
  poll: {
    id: "p1",
    question: "이 원두, 어떤 방식으로 즐기실 건가요?",
    options: [
      { id: "o1", label: "핸드드립 (V60)", votes: 312 },
      { id: "o2", label: "에어로프레스", votes: 198 },
      { id: "o3", label: "콜드브루", votes: 147 },
      { id: "o4", label: "에스프레소", votes: 85 },
    ],
    totalVotes: 742,
  },
};


// ── Per-slot detail data ──────────────────────────────────────────────────

type SlotDetailExtra = {
  description: string;
  hashtags: string[];
  flavor: FlavorProfile;
  comments: Comment[];
  poll?: Poll;
};

function c(
  id: string,
  authorId: string,
  authorName: string,
  content: string,
  color: string,
  time: string,
  likes: number
): Comment {
  return {
    id,
    author: { id: authorId, name: authorName, profileImage: "" },
    content,
    createdAt: "2026-04-25T09:00:00Z",
    userColor: color,
    time,
    likes,
  };
}

const slotDetailExtensions: Record<string, SlotDetailExtra> = {
  "1": {
    description:
      "에티오피아 예가체프 지역에서 생산된 아나에어로빅 발효 방식의 네추럴 프로세스 원두입니다. 산소를 차단한 밀폐 탱크에서 72시간 발효되어 독특한 와인 같은 풍미와 복합적인 과일 향이 발달합니다. 딸기잼, 블루베리, 장미 향이 레이어를 이루어 펼쳐지며, 깔끔한 마무리가 인상적입니다.",
    hashtags: ["#에티오피아", "#아나에어로빅", "#네추럴", "#스페셜티", "#예가체프"],
    flavor: {
      radar: [
        { axis: "FRUITY", value: 85 },
        { axis: "FLORAL", value: 60 },
        { axis: "SWEET", value: 75 },
        { axis: "NUTTY", value: 30 },
        { axis: "EARTHY", value: 45 },
      ],
      bars: [
        { name: "Acidity", value: 85 },
        { name: "Sweetness", value: 70 },
        { name: "Body", value: 60 },
        { name: "Bitterness", value: 30 },
      ],
      roastingLevel: 2,
    },
    comments: [
      c("c1", "u1", "coffee_lover_92", "작년에 비슷한 프로세싱 원두를 마셔봤는데 정말 독특한 경험이었어요. 이번 건 더 기대됩니다!", "#a06040", "2시간 전", 14),
      c("c2", "u2", "brewing_seoul", "72시간 발효... 진짜 궁금하네요. 브루잉 영상도 같이 올려주실 건가요 마스터님?", "#4a7a8a", "5시간 전", 9),
      c("c3", "u3", "단골손님", "슈퍼얼리버드 이미 펀딩했습니다!! 핸드라이팅 테이스팅 노트가 너무 탐나요", "#6a5a8a", "1일 전", 22),
    ],
    poll: {
      id: "p1",
      question: "이 원두, 어떤 방식으로 즐기실 건가요?",
      options: [
        { id: "o1", label: "핸드드립 (V60)", votes: 312 },
        { id: "o2", label: "에어로프레스", votes: 198 },
        { id: "o3", label: "콜드브루", votes: 147 },
        { id: "o4", label: "에스프레소", votes: 85 },
      ],
      totalVotes: 742,
    },
  },
  "2": {
    description:
      "케냐 AA 등급 게이샤 품종은 동아프리카 고산지에서 자란 최상급 원두입니다. 풀 워시드 방식으로 가공되어 투명하고 섬세한 풍미가 극대화되었으며, 블랙커런트, 패션프루트, 자스민 향이 겹겹이 펼쳐집니다. 산미가 밝고 생기 있으며 긴 여운이 특징입니다.",
    hashtags: ["#케냐", "#게이샤", "#워시드", "#AA등급", "#아프리카"],
    flavor: {
      radar: [
        { axis: "FRUITY", value: 70 },
        { axis: "FLORAL", value: 85 },
        { axis: "SWEET", value: 65 },
        { axis: "NUTTY", value: 25 },
        { axis: "EARTHY", value: 30 },
      ],
      bars: [
        { name: "Acidity", value: 90 },
        { name: "Sweetness", value: 60 },
        { name: "Body", value: 45 },
        { name: "Bitterness", value: 20 },
      ],
      roastingLevel: 1,
    },
    comments: [
      c("c1", "u5", "floral_fan", "게이샤 품종 특유의 플로럴 향을 케냐 테루아르가 어떻게 변주할지 너무 궁금합니다!", "#3a6a8a", "3시간 전", 18),
      c("c2", "u6", "q_grader_fan", "Q-Grader 심사위원이 직접 큐레이션한 원두라니 신뢰가 가네요. 기대됩니다.", "#5a8a6a", "1일 전", 11),
    ],
    poll: {
      id: "p2",
      question: "케냐 AA 게이샤, 어떤 추출 방식이 궁금하세요?",
      options: [
        { id: "o1", label: "핸드드립 (케멕스)", votes: 220 },
        { id: "o2", label: "핸드드립 (V60)", votes: 175 },
        { id: "o3", label: "에어로프레스", votes: 89 },
        { id: "o4", label: "이브릭 (터키식)", votes: 34 },
      ],
      totalVotes: 518,
    },
  },
  "3": {
    description:
      "파나마 보케테 에리다 에스테이트에서 재배된 워시드 게이샤입니다. 세계 최고가 경매에서 수차례 낙찰된 이 원두는 재스민, 복숭아, 밀크티 노트가 환상적으로 조화를 이룹니다. 극도로 클린한 컵과 독보적인 플로럴 향이 이 원두를 특별하게 만듭니다.",
    hashtags: ["#파나마", "#게이샤", "#워시드", "#보케테", "#스페셜티"],
    flavor: {
      radar: [
        { axis: "FRUITY", value: 60 },
        { axis: "FLORAL", value: 92 },
        { axis: "SWEET", value: 70 },
        { axis: "NUTTY", value: 20 },
        { axis: "EARTHY", value: 15 },
      ],
      bars: [
        { name: "Acidity", value: 80 },
        { name: "Sweetness", value: 75 },
        { name: "Body", value: 50 },
        { name: "Bitterness", value: 15 },
      ],
      roastingLevel: 1,
    },
    comments: [
      c("c1", "u7", "geisha_hunter", "파나마 게이샤 워시드는 정말 최고의 선택이에요. 매년 챙겨 마시는 원두인데 이번 슬롯 꼭 참여할게요!", "#8a6aa0", "2시간 전", 31),
      c("c2", "u8", "coffee_diary", "케멕스로 추출하면 그 플로럴 향이 더 극대화되더라고요. 추출 팁도 같이 제공해주시나요?", "#6a4a90", "1일 전", 15),
      c("c3", "u9", "beangeek", "400g + 온라인 클래스 패키지 당연히 예약했습니다. 정하진 마스터 강의는 항상 감동이에요.", "#4a6a90", "2일 전", 44),
    ],
    poll: {
      id: "p3",
      question: "파나마 게이샤, 어떤 노트가 가장 기대되시나요?",
      options: [
        { id: "o1", label: "재스민 플로럴", votes: 389 },
        { id: "o2", label: "복숭아 과일", votes: 241 },
        { id: "o3", label: "밀크티 크리미", votes: 178 },
        { id: "o4", label: "시트러스 산미", votes: 97 },
      ],
      totalVotes: 905,
    },
  },
  "4": {
    description:
      "콜롬비아 우일라 고산지에서 재배된 핑크 버번 품종입니다. 허니 프로세싱을 통해 과일의 단맛을 최대로 끌어냈으며, 딸기잼, 캐러멜, 다크 초콜릿이 순서대로 전개됩니다. 중배전으로 로스팅하여 산미와 바디감의 균형이 탁월합니다.",
    hashtags: ["#콜롬비아", "#핑크버번", "#허니", "#우일라", "#중남미"],
    flavor: {
      radar: [
        { axis: "FRUITY", value: 80 },
        { axis: "FLORAL", value: 55 },
        { axis: "SWEET", value: 85 },
        { axis: "NUTTY", value: 45 },
        { axis: "EARTHY", value: 50 },
      ],
      bars: [
        { name: "Acidity", value: 75 },
        { name: "Sweetness", value: 85 },
        { name: "Body", value: 65 },
        { name: "Bitterness", value: 35 },
      ],
      roastingLevel: 2,
    },
    comments: [
      c("c1", "u10", "sweetbean", "핑크 버번은 처음 접해봤는데 딸기잼 같은 단맛이 정말 인상적이었어요. 이 슬롯 너무 기다려집니다!", "#c06080", "4시간 전", 17),
      c("c2", "u11", "sca_fan", "SCA 트레이너가 직접 큐레이션한 원두라니 믿음이 가네요. 펀딩 참여하겠습니다.", "#3a8a4a", "1일 전", 8),
    ],
    poll: {
      id: "p4",
      question: "콜롬비아 핑크 버번, 어떤 방식으로 즐기실 건가요?",
      options: [
        { id: "o1", label: "에스프레소", votes: 198 },
        { id: "o2", label: "핸드드립", votes: 167 },
        { id: "o3", label: "라떼 (우유 추가)", votes: 134 },
        { id: "o4", label: "콜드브루", votes: 52 },
      ],
      totalVotes: 551,
    },
  },
  "5": {
    description:
      "과테말라 우에우에테낭고 고지대 농장에서 양파 껍질을 발효 탱크에 첨가하는 독특한 이색 발효 방식으로 가공한 원두입니다. 예상과 달리 자극적인 향이 아닌, 복잡한 캐러멜과 복숭아 피치 노트가 매력적으로 발현됩니다. 중배전으로 로스팅하여 바디감과 단맛을 강조했습니다.",
    hashtags: ["#과테말라", "#발효", "#이색프로세싱", "#우에우에테낭고", "#중미"],
    flavor: {
      radar: [
        { axis: "FRUITY", value: 65 },
        { axis: "FLORAL", value: 40 },
        { axis: "SWEET", value: 80 },
        { axis: "NUTTY", value: 55 },
        { axis: "EARTHY", value: 65 },
      ],
      bars: [
        { name: "Acidity", value: 60 },
        { name: "Sweetness", value: 80 },
        { name: "Body", value: 70 },
        { name: "Bitterness", value: 45 },
      ],
      roastingLevel: 3,
    },
    comments: [
      c("c1", "u12", "ferment_nerd", "양파 발효라는 발상이 너무 독특해요. 실제로 어떤 맛이 날지 정말 궁금합니다!", "#6a9a50", "3시간 전", 24),
      c("c2", "u13", "homebrewer", "실험적인 프로세싱이 성공하면 정말 게임체인저가 될 것 같아요. 윤서진 마스터 믿습니다.", "#8a7040", "2일 전", 12),
    ],
    poll: {
      id: "p5",
      question: "이 이색 발효 원두에서 가장 기대하는 노트는?",
      options: [
        { id: "o1", label: "캐러멜 달콤함", votes: 145 },
        { id: "o2", label: "피치 과일향", votes: 123 },
        { id: "o3", label: "어스이 복합미", votes: 87 },
        { id: "o4", label: "예상치 못한 놀라움", votes: 201 },
      ],
      totalVotes: 556,
    },
  },
  "6": {
    description:
      "브라질 미나스제라이스 세하도 고원지대의 옐로우 버번 품종입니다. 전통적인 내추럴 건식 방식으로 수확 후 건조하여 헤이즐넛, 밀크초콜릿, 부드러운 캐러멜이 균형 있게 어우러진 클래식 브라질리언 프로파일을 선보입니다. 중강배전으로 진한 바디감이 에스프레소에 특히 잘 맞습니다.",
    hashtags: ["#브라질", "#옐로우버번", "#내추럴", "#에스프레소", "#중강배전"],
    flavor: {
      radar: [
        { axis: "FRUITY", value: 35 },
        { axis: "FLORAL", value: 20 },
        { axis: "SWEET", value: 65 },
        { axis: "NUTTY", value: 90 },
        { axis: "EARTHY", value: 75 },
      ],
      bars: [
        { name: "Acidity", value: 40 },
        { name: "Sweetness", value: 65 },
        { name: "Body", value: 85 },
        { name: "Bitterness", value: 60 },
      ],
      roastingLevel: 4,
    },
    comments: [
      c("c1", "u14", "espresso_daily", "브라질 원두는 에스프레소 블렌딩 베이스로도 훌륭하죠. 싱글 오리진 에스프레소로도 기대됩니다.", "#a07840", "5시간 전", 9),
      c("c2", "u15", "nut_lover", "헤이즐넛 향 하나만으로도 충분히 사고 싶어요. 강배전이 이 원두에 더 잘 맞는 것 같아요.", "#7a5030", "2일 전", 6),
    ],
    poll: {
      id: "p6",
      question: "브라질 옐로우 버번, 어떤 방식으로 즐기실 건가요?",
      options: [
        { id: "o1", label: "에스프레소 (싱글)", votes: 312 },
        { id: "o2", label: "카페라떼", votes: 187 },
        { id: "o3", label: "핸드드립", votes: 94 },
        { id: "o4", label: "모카포트", votes: 71 },
      ],
      totalVotes: 664,
    },
  },
  "7": {
    description:
      "르완다 니암바레 지역의 고산지 협동조합에서 재배된 부르봉 품종입니다. 풀 워시드 방식으로 정제하여 체리, 레드커런트의 산뜻한 산미와 흑설탕처럼 달콤한 피니쉬가 대비를 이룹니다. 임도현 마스터의 섬세한 브루잉 기법으로 이 원두의 진면목을 경험해보세요.",
    hashtags: ["#르완다", "#버번", "#워시드", "#니암바레", "#레드베리"],
    flavor: {
      radar: [
        { axis: "FRUITY", value: 80 },
        { axis: "FLORAL", value: 72 },
        { axis: "SWEET", value: 65 },
        { axis: "NUTTY", value: 40 },
        { axis: "EARTHY", value: 35 },
      ],
      bars: [
        { name: "Acidity", value: 85 },
        { name: "Sweetness", value: 65 },
        { name: "Body", value: 55 },
        { name: "Bitterness", value: 25 },
      ],
      roastingLevel: 2,
    },
    comments: [
      c("c1", "u16", "africanlover", "르완다 커피의 잠재력을 이렇게 잘 표현해주셔서 감사해요. 빨리 마셔보고 싶습니다!", "#c07090", "4시간 전", 19),
      c("c2", "u17", "brewers_cup_fan", "브루어스컵 파이널리스트의 원두 큐레이션이라니! 추출 레시피도 같이 제공해주시나요?", "#8a3060", "1일 전", 27),
      c("c3", "u18", "berry_notes", "레드커런트 산미가 핵심이라 했는데 그 투명한 산미가 너무 기대됩니다.", "#a03070", "2일 전", 13),
    ],
    poll: {
      id: "p7",
      question: "르완다 버번의 가장 매력적인 특징은 뭐라 생각하세요?",
      options: [
        { id: "o1", label: "레드 베리 산미", votes: 287 },
        { id: "o2", label: "플로럴 향기", votes: 194 },
        { id: "o3", label: "달콤한 피니쉬", votes: 156 },
        { id: "o4", label: "클린컵 투명함", votes: 112 },
      ],
      totalVotes: 749,
    },
  },
  "8": {
    description:
      "코스타리카 타라수 지역의 레드 허니 프로세스 원두로, 커피 체리의 껍질을 일부 남긴 채 건조하여 과육의 당분이 원두에 깊이 스며들었습니다. 복숭아 넥타르, 망고, 꿀처럼 진한 단맛이 층층이 쌓이며 긴 여운을 남깁니다. 권해인 마스터가 허니 프로세싱의 과학을 직접 강의합니다.",
    hashtags: ["#코스타리카", "#허니프로세스", "#타라수", "#레드허니", "#달콤함"],
    flavor: {
      radar: [
        { axis: "FRUITY", value: 65 },
        { axis: "FLORAL", value: 50 },
        { axis: "SWEET", value: 90 },
        { axis: "NUTTY", value: 60 },
        { axis: "EARTHY", value: 50 },
      ],
      bars: [
        { name: "Acidity", value: 65 },
        { name: "Sweetness", value: 90 },
        { name: "Body", value: 75 },
        { name: "Bitterness", value: 30 },
      ],
      roastingLevel: 3,
    },
    comments: [
      c("c1", "u19", "honey_process_fan", "허니 프로세스 원두 중에서 레드 허니가 가장 풍부한 맛을 내죠. 권 마스터님의 큐레이션 기대됩니다!", "#c4824a", "1시간 전", 33),
      c("c2", "u20", "sweetcup", "허니 프로세싱 비교 강의도 들을 수 있다니 교육적으로도 너무 좋은 슬롯이에요.", "#75584d", "1일 전", 21),
      c("c3", "u21", "coffee_educator", "Q-Grader 트레이너 직강이라니 프로세싱 이해도가 훨씬 올라갈 것 같습니다.", "#5a7a4a", "2일 전", 16),
    ],
    poll: {
      id: "p8",
      question: "허니 프로세스 중 어느 방식이 가장 궁금하세요?",
      options: [
        { id: "o1", label: "레드 허니 (과육 많이)", votes: 342 },
        { id: "o2", label: "옐로우 허니 (중간)", votes: 198 },
        { id: "o3", label: "화이트 허니 (과육 적게)", votes: 124 },
        { id: "o4", label: "블랙 허니 (가장 많이)", votes: 287 },
      ],
      totalVotes: 951,
    },
  },
};

export const mockSlotDetails: Record<string, SlotDetail> = Object.fromEntries(
  mockSlots.map((s) => [s.id, { ...s, ...slotDetailExtensions[s.id]! }])
);

// ── Per-slot funding data ─────────────────────────────────────────────────

function makeRewards(slotId: string, earlyLabel: string, earlyPrice: number, normalPrice: number, classPrice: number, earlyRemaining?: number): Reward[] {
  const base = (parseInt(slotId) - 1) * 3;
  return [
    { id: `${slotId}_r1`, label: earlyLabel, price: earlyPrice, description: "200g 단일 원두 + 핸드라이팅 테이스팅 노트 (한정)", remaining: earlyRemaining, planId: base + 1 },
    { id: `${slotId}_r2`, label: "일반 펀딩", price: normalPrice, description: "200g 단일 원두 + 디지털 브루잉 가이드", planId: base + 2 },
    { id: `${slotId}_r3`, label: "마스터 클래스 패키지", price: classPrice, description: "400g 원두 + 온라인 원데이 클래스 초대권", remaining: 8, planId: base + 3 },
  ];
}

export const mockSlotFundingData: Record<string, { funding: FundingStatus; rewards: Reward[] }> = {
  "1": { funding: { percent: 127, daysLeft: 14, supporters: 842, targetAmount: 5000000, currentAmount: 6350000 }, rewards: makeRewards("1", "슈퍼얼리버드", 15000, 19000, 58000, 23) },
  "2": { funding: { percent: 85, daysLeft: 22, supporters: 423, targetAmount: 3000000, currentAmount: 2550000 }, rewards: makeRewards("2", "얼리버드 한정", 18000, 22000, 65000, 15) },
  "3": { funding: { percent: 85, daysLeft: 18, supporters: 678, targetAmount: 6000000, currentAmount: 5100000 }, rewards: makeRewards("3", "게이샤 얼리버드", 28000, 35000, 98000, 10) },
  "4": { funding: { percent: 78, daysLeft: 30, supporters: 312, targetAmount: 2500000, currentAmount: 1950000 }, rewards: makeRewards("4", "핑크버번 한정", 16000, 20000, 58000, 20) },
  "5": { funding: { percent: 63, daysLeft: 45, supporters: 188, targetAmount: 2000000, currentAmount: 1260000 }, rewards: makeRewards("5", "발효 얼리버드", 14000, 18000, 52000) },
  "6": { funding: { percent: 49, daysLeft: 60, supporters: 97, targetAmount: 1500000, currentAmount: 735000 }, rewards: makeRewards("6", "클래식 얼리버드", 12000, 16000, 48000) },
  "7": { funding: { percent: 77, daysLeft: 25, supporters: 541, targetAmount: 4000000, currentAmount: 3080000 }, rewards: makeRewards("7", "르완다 얼리버드", 17000, 21000, 62000, 12) },
  "8": { funding: { percent: 85, daysLeft: 20, supporters: 763, targetAmount: 5500000, currentAmount: 4675000 }, rewards: makeRewards("8", "허니 얼리버드", 16000, 20000, 60000, 18) },
};
