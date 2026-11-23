export type KocAnalysisPlatform = '小红书' | '抖音' | '视频号' | '懂车帝';

export type KocAnalysisRecord = {
  key: string;
  name: string;
  avatarColor: string;
  platform: KocAnalysisPlatform;
  followers: number;
  taskCount: number;
  contentCount: number;
  viralCount: number;
  viralRate: number;
  exposure: number;
  reads: number;
  comments: number;
  consults: number;
  consultRate: number;
};

export const KOC_PLATFORM_OPTIONS = [
  { label: '全部', value: '' },
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '视频号', value: '视频号' },
  { label: '懂车帝', value: '懂车帝' },
];

export function platformTagColor(platform: KocAnalysisPlatform) {
  if (platform === '小红书') return 'magenta';
  if (platform === '抖音') return 'cyan';
  if (platform === '视频号') return 'green';
  return 'gold';
}

export const MOCK_KOC_ANALYSIS: KocAnalysisRecord[] = [
  {
    key: '1',
    name: '睡着就不困了',
    avatarColor: '#eb2f96',
    platform: '小红书',
    followers: 930,
    taskCount: 6,
    contentCount: 12,
    viralCount: 2,
    viralRate: 16.7,
    exposure: 128000,
    reads: 45600,
    comments: 860,
    consults: 42,
    consultRate: 4.9,
  },
  {
    key: '2',
    name: '小城晚风记',
    avatarColor: '#1677ff',
    platform: '抖音',
    followers: 12800,
    taskCount: 14,
    contentCount: 28,
    viralCount: 5,
    viralRate: 17.9,
    exposure: 860000,
    reads: 320000,
    comments: 4200,
    consults: 186,
    consultRate: 5.8,
  },
  {
    key: '3',
    name: '车生活阿凯',
    avatarColor: '#13c2c2',
    platform: '懂车帝',
    followers: 5600,
    taskCount: 9,
    contentCount: 18,
    viralCount: 3,
    viralRate: 16.7,
    exposure: 245000,
    reads: 98000,
    comments: 1560,
    consults: 72,
    consultRate: 7.3,
  },
  {
    key: '4',
    name: '周末出逃计划',
    avatarColor: '#722ed1',
    platform: '小红书',
    followers: 4200,
    taskCount: 8,
    contentCount: 15,
    viralCount: 4,
    viralRate: 26.7,
    exposure: 310000,
    reads: 142000,
    comments: 2100,
    consults: 95,
    consultRate: 6.7,
  },
  {
    key: '5',
    name: '通州看房日记',
    avatarColor: '#fa8c16',
    platform: '视频号',
    followers: 2100,
    taskCount: 5,
    contentCount: 9,
    viralCount: 1,
    viralRate: 11.1,
    exposure: 86000,
    reads: 32000,
    comments: 410,
    consults: 28,
    consultRate: 8.8,
  },
  {
    key: '6',
    name: '智驾新手村',
    avatarColor: '#52c41a',
    platform: '抖音',
    followers: 9800,
    taskCount: 11,
    contentCount: 22,
    viralCount: 6,
    viralRate: 27.3,
    exposure: 720000,
    reads: 268000,
    comments: 3650,
    consults: 154,
    consultRate: 5.7,
  },
  {
    key: '7',
    name: '尚界车主说',
    avatarColor: '#2f54eb',
    platform: '小红书',
    followers: 3500,
    taskCount: 7,
    contentCount: 13,
    viralCount: 2,
    viralRate: 15.4,
    exposure: 198000,
    reads: 76000,
    comments: 980,
    consults: 61,
    consultRate: 8.0,
  },
  {
    key: '8',
    name: '门店探店阿杰',
    avatarColor: '#eb2f96',
    platform: '视频号',
    followers: 1600,
    taskCount: 4,
    contentCount: 8,
    viralCount: 1,
    viralRate: 12.5,
    exposure: 54000,
    reads: 21000,
    comments: 260,
    consults: 19,
    consultRate: 9.0,
  },
  {
    key: '9',
    name: '奶茶与通勤',
    avatarColor: '#fa541c',
    platform: '小红书',
    followers: 7800,
    taskCount: 10,
    contentCount: 20,
    viralCount: 3,
    viralRate: 15.0,
    exposure: 402000,
    reads: 155000,
    comments: 1880,
    consults: 88,
    consultRate: 5.7,
  },
  {
    key: '10',
    name: '享界商务舱',
    avatarColor: '#13c2c2',
    platform: '抖音',
    followers: 6400,
    taskCount: 6,
    contentCount: 11,
    viralCount: 2,
    viralRate: 18.2,
    exposure: 276000,
    reads: 102000,
    comments: 1320,
    consults: 54,
    consultRate: 5.3,
  },
];

export function formatNumber(n: number) {
  if (n >= 10000) {
    const v = n / 10000;
    return `${v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')}万`;
  }
  return n.toLocaleString('zh-CN');
}

export const AI_ANALYSIS_STEPS = [
  '正在读取 KOC 数据...',
  '正在分析互动与爆文分布...',
  '正在识别高价值 KOC 特征...',
  '正在总结运营规律...',
];
