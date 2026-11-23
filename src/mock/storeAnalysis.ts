export type StoreOfficeRank = {
  key: string;
  office: string;
  activeRate: number;
  completeRate: number;
  postCount: number;
  interactions: number;
  likes: number;
  collects: number;
  comments: number;
  positiveRate: number;
};

export type StoreRadarScores = {
  office: string;
  activeRate: number;
  completeRate: number;
  postVolume: number;
  voice: number;
  reputation: number;
};

export type StoreTrendPoint = {
  date: string;
  interactions: number;
  posts: number;
};

export type StoreSentiment = {
  name: string;
  value: number;
};

export type StoreKocDetail = {
  key: string;
  name: string;
  office: string;
  platform: string;
  tasks: number;
  posts: number;
  interactions: number;
  positiveRate: number;
  lastActive: string;
};

export const STORE_OFFICE_OPTIONS = [
  { label: '全部代表处', value: '' },
  { label: '总部1', value: '总部1' },
  { label: '华东代表处', value: '华东代表处' },
  { label: '华南代表处', value: '华南代表处' },
  { label: '华北代表处', value: '华北代表处' },
  { label: '西南代表处', value: '西南代表处' },
];

export const MOCK_STORE_RANKS: StoreOfficeRank[] = [
  {
    key: '1',
    office: '华东代表处',
    activeRate: 86.4,
    completeRate: 92.1,
    postCount: 428,
    interactions: 186200,
    likes: 112000,
    collects: 28600,
    comments: 45600,
    positiveRate: 78.6,
  },
  {
    key: '2',
    office: '总部1',
    activeRate: 81.2,
    completeRate: 88.5,
    postCount: 396,
    interactions: 162400,
    likes: 98000,
    collects: 24400,
    comments: 40000,
    positiveRate: 74.2,
  },
  {
    key: '3',
    office: '华南代表处',
    activeRate: 79.8,
    completeRate: 85.3,
    postCount: 352,
    interactions: 141800,
    likes: 86000,
    collects: 21800,
    comments: 34000,
    positiveRate: 76.9,
  },
  {
    key: '4',
    office: '华北代表处',
    activeRate: 74.5,
    completeRate: 81.6,
    postCount: 298,
    interactions: 118600,
    likes: 72000,
    collects: 18600,
    comments: 28000,
    positiveRate: 71.4,
  },
  {
    key: '5',
    office: '西南代表处',
    activeRate: 68.9,
    completeRate: 76.2,
    postCount: 246,
    interactions: 92400,
    likes: 56000,
    collects: 14200,
    comments: 22200,
    positiveRate: 69.8,
  },
];

export const MOCK_STORE_RADAR: StoreRadarScores[] = [
  { office: '总部1', activeRate: 81, completeRate: 88, postVolume: 79, voice: 84, reputation: 74 },
  { office: '华东代表处', activeRate: 86, completeRate: 92, postVolume: 86, voice: 90, reputation: 79 },
  { office: '华南代表处', activeRate: 80, completeRate: 85, postVolume: 74, voice: 78, reputation: 77 },
  { office: '华北代表处', activeRate: 75, completeRate: 82, postVolume: 68, voice: 70, reputation: 71 },
  { office: '西南代表处', activeRate: 69, completeRate: 76, postVolume: 60, voice: 62, reputation: 70 },
];

export const MOCK_STORE_TREND: StoreTrendPoint[] = [
  { date: '07-03', interactions: 4200, posts: 12 },
  { date: '07-07', interactions: 5100, posts: 15 },
  { date: '07-11', interactions: 4800, posts: 14 },
  { date: '07-15', interactions: 6200, posts: 18 },
  { date: '07-19', interactions: 7100, posts: 21 },
  { date: '07-23', interactions: 6800, posts: 19 },
  { date: '07-27', interactions: 7600, posts: 23 },
  { date: '08-01', interactions: 8200, posts: 25 },
];

export const MOCK_STORE_SENTIMENT: StoreSentiment[] = [
  { name: '正向', value: 62 },
  { name: '中性', value: 27 },
  { name: '负向', value: 11 },
];

export const MOCK_STORE_KOC: StoreKocDetail[] = [
  {
    key: 'k1',
    name: '周末出逃计划',
    office: '华东代表处',
    platform: '小红书',
    tasks: 8,
    posts: 12,
    interactions: 18600,
    positiveRate: 82.4,
    lastActive: '2026-07-30',
  },
  {
    key: 'k2',
    name: '智驾新手村',
    office: '总部1',
    platform: '抖音',
    tasks: 11,
    posts: 16,
    interactions: 32400,
    positiveRate: 79.1,
    lastActive: '2026-07-31',
  },
  {
    key: 'k3',
    name: '车生活阿凯',
    office: '华南代表处',
    platform: '懂车帝',
    tasks: 6,
    posts: 9,
    interactions: 12800,
    positiveRate: 75.6,
    lastActive: '2026-07-28',
  },
  {
    key: 'k4',
    name: '通州看房日记',
    office: '华北代表处',
    platform: '视频号',
    tasks: 5,
    posts: 7,
    interactions: 8600,
    positiveRate: 71.2,
    lastActive: '2026-07-26',
  },
  {
    key: 'k5',
    name: '小城晚风记',
    office: '西南代表处',
    platform: '小红书',
    tasks: 7,
    posts: 10,
    interactions: 14200,
    positiveRate: 77.8,
    lastActive: '2026-07-29',
  },
  {
    key: 'k6',
    name: '尚界车主说',
    office: '华东代表处',
    platform: '小红书',
    tasks: 9,
    posts: 14,
    interactions: 21600,
    positiveRate: 80.5,
    lastActive: '2026-08-01',
  },
];

export function formatStoreNumber(n: number) {
  if (n >= 10000) {
    const v = n / 10000;
    return `${v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')}万`;
  }
  return n.toLocaleString('zh-CN');
}

export const STORE_AI_STEPS = [
  '正在读取代表处运营数据...',
  '正在对比活跃率、完成率与互动声量...',
  '正在识别高表现代表处特征...',
  '正在生成门店运营建议...',
];
