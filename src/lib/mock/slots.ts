import type { Slot, SlotDetail, Comment, Poll, FlavorProfile } from "@/types/slot";
import type { FundingStatus, Reward } from "@/types/funding";

// Mock 슬롯 UUID (POC용)
const SLOT_IDS = {
  SLOT_1: "01960001-0000-7000-8000-000000000001",
  SLOT_2: "01960002-0000-7000-8000-000000000002",
  SLOT_3: "01960003-0000-7000-8000-000000000003",
  SLOT_4: "01960004-0000-7000-8000-000000000004",
} as const;

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
      { id: SLOT_IDS.SLOT_1, title: "에티오피아 아나에어로빅 네추럴", thumbnailColor: "#2d1f1a", accentColor: "#c4824a", percent: 127 },
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
      { id: SLOT_IDS.SLOT_2, title: "케냐 AA 게이샤 : 아프리카의 보석", thumbnailColor: "#1a2533", accentColor: "#6a9fc8", percent: 85 },
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
      { id: SLOT_IDS.SLOT_3, title: "파나마 게이샤 워시드 : 꽃향기의 정점", thumbnailColor: "#1f1a2a", accentColor: "#9a7ac0", percent: 85 },
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
      { id: SLOT_IDS.SLOT_4, title: "콜롬비아 핑크 버번 : 달콤한 반란", thumbnailColor: "#1f1a0f", accentColor: "#d4a84b", percent: 78 },
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
    id: SLOT_IDS.SLOT_1,
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
    id: SLOT_IDS.SLOT_2,
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
    id: SLOT_IDS.SLOT_3,
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
    id: SLOT_IDS.SLOT_4,
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
  [SLOT_IDS.SLOT_1]: {
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
  [SLOT_IDS.SLOT_2]: {
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
  [SLOT_IDS.SLOT_3]: {
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
  [SLOT_IDS.SLOT_4]: {
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
};

export const mockSlotDetails: Record<string, SlotDetail> = Object.fromEntries(
  mockSlots.map((s) => [s.id, { ...s, ...slotDetailExtensions[s.id]! }])
);

// ── Per-slot funding data ─────────────────────────────────────────────────

// DB 시드 데이터의 실제 product_variant UUID
const VARIANT_IDS: Record<string, { v200g: string; v600g: string }> = {
  [SLOT_IDS.SLOT_1]: { v200g: "01960001-0000-7000-8000-000000010000", v600g: "01960001-0000-7000-8000-000000020000" },
  [SLOT_IDS.SLOT_2]: { v200g: "01960002-0000-7000-8000-000000010000", v600g: "01960002-0000-7000-8000-000000020000" },
  [SLOT_IDS.SLOT_3]: { v200g: "01960003-0000-7000-8000-000000010000", v600g: "01960003-0000-7000-8000-000000020000" },
  [SLOT_IDS.SLOT_4]: { v200g: "01960004-0000-7000-8000-000000010000", v600g: "01960004-0000-7000-8000-000000020000" },
};

function makeRewards(slotId: string, price200g: number, price600g: number): Reward[] {
  const ids = VARIANT_IDS[slotId]!;
  return [
    {
      id: `${slotId}_r1`,
      label: "200g",
      price: price200g,
      description: "200g 단일 원두 + 디지털 브루잉 가이드",
      variantId: ids.v200g,
      optionValues: [{ optionType: "용량", value: "200g" }],
    },
    {
      id: `${slotId}_r2`,
      label: "600g",
      price: price600g,
      description: "600g 단일 원두 + 핸드라이팅 테이스팅 노트",
      variantId: ids.v600g,
      optionValues: [{ optionType: "용량", value: "600g" }],
    },
  ];
}

export const mockSlotFundingData: Record<string, { funding: FundingStatus; rewards: Reward[] }> = {
  [SLOT_IDS.SLOT_1]: { funding: { percent: 127, daysLeft: 14, supporters: 842, targetAmount: 5000000, currentAmount: 6350000 }, rewards: makeRewards(SLOT_IDS.SLOT_1, 19000, 49000) },
  [SLOT_IDS.SLOT_2]: { funding: { percent: 85, daysLeft: 22, supporters: 423, targetAmount: 3000000, currentAmount: 2550000 }, rewards: makeRewards(SLOT_IDS.SLOT_2, 22000, 58000) },
  [SLOT_IDS.SLOT_3]: { funding: { percent: 85, daysLeft: 18, supporters: 678, targetAmount: 6000000, currentAmount: 5100000 }, rewards: makeRewards(SLOT_IDS.SLOT_3, 35000, 89000) },
  [SLOT_IDS.SLOT_4]: { funding: { percent: 78, daysLeft: 30, supporters: 312, targetAmount: 2500000, currentAmount: 1950000 }, rewards: makeRewards(SLOT_IDS.SLOT_4, 20000, 52000) },
};
