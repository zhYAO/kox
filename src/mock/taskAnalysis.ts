export type TaskAnalysisStatus = '进行中' | '已结束' | '已取消' | '未开始';
export type TaskAnalysisPlatform = '小红书' | '抖音' | '视频号' | '懂车帝';
export type TaskContentForm = '图文' | '视频' | '图文+视频';
export type BudgetStatus = '充足' | '紧张' | '已用尽' | '未设置';

export type TaskAnalysisRecord = {
  key: string;
  name: string;
  model: string;
  category: string;
  status: TaskAnalysisStatus;
  publishTime: string;
  startTime: string;
  endTime: string;
  statsDeadline: string;
  platforms: TaskAnalysisPlatform[];
  contentForm: TaskContentForm;
  totalPublish: number;
  signupProgress: number;
  viralRate: number;
  consultRate: number;
  budgetStatus: BudgetStatus;
  estimatedReads: number;
  comments: number;
  collects: number;
  consults: number;
  avgConsults: number;
  interactions: number;
  avgInteractions: number;
};

export const CATEGORY_OPTIONS = [
  { label: '全部', value: '' },
  { label: '创作活动', value: '创作活动' },
  { label: '展示性任务', value: '展示性任务' },
  { label: '门店试驾', value: '门店试驾' },
];

export const STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '进行中', value: '进行中' },
  { label: '已结束', value: '已结束' },
  { label: '已取消', value: '已取消' },
  { label: '未开始', value: '未开始' },
];

export const PLATFORM_OPTIONS = [
  { label: '全部', value: '' },
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '视频号', value: '视频号' },
  { label: '懂车帝', value: '懂车帝' },
];

export const CONTENT_FORM_OPTIONS = [
  { label: '全部', value: '' },
  { label: '图文', value: '图文' },
  { label: '视频', value: '视频' },
  { label: '图文+视频', value: '图文+视频' },
];

export const BUDGET_OPTIONS = [
  { label: '全部', value: '' },
  { label: '充足', value: '充足' },
  { label: '紧张', value: '紧张' },
  { label: '已用尽', value: '已用尽' },
  { label: '未设置', value: '未设置' },
];

export function platformColor(p: TaskAnalysisPlatform) {
  if (p === '小红书') return 'magenta';
  if (p === '抖音') return 'cyan';
  if (p === '视频号') return 'green';
  return 'gold';
}

export function statusColor(s: TaskAnalysisStatus) {
  if (s === '进行中') return 'success';
  if (s === '已结束') return 'default';
  if (s === '已取消') return 'warning';
  return 'processing';
}

export function formatNumber(n: number) {
  if (n >= 10000) {
    const v = n / 10000;
    return `${v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')}万`;
  }
  return n.toLocaleString('zh-CN');
}

export const MOCK_TASK_ANALYSIS: TaskAnalysisRecord[] = [
  {
    key: 't1',
    name: '华耐家居种草活动_demo',
    model: '华耐家居',
    category: '创作活动',
    status: '进行中',
    publishTime: '2026-07-31 22:41:14',
    startTime: '2026-08-01 00:00:00',
    endTime: '2026-08-31 23:59:59',
    statsDeadline: '2026-09-07 23:59:59',
    platforms: ['小红书', '抖音'],
    contentForm: '图文',
    totalPublish: 100,
    signupProgress: 68,
    viralRate: 18.5,
    consultRate: 6.2,
    budgetStatus: '充足',
    estimatedReads: 286000,
    comments: 3420,
    collects: 5680,
    consults: 186,
    avgConsults: 1.9,
    interactions: 12800,
    avgInteractions: 128,
  },
  {
    key: 't2',
    name: 'DEMO-问界M7春季体验种草',
    model: '问界M7',
    category: '创作活动',
    status: '已结束',
    publishTime: '2026-04-20 10:12:08',
    startTime: '2026-04-23 00:00:00',
    endTime: '2026-05-20 23:59:59',
    statsDeadline: '2026-05-27 23:59:59',
    platforms: ['小红书'],
    contentForm: '图文+视频',
    totalPublish: 80,
    signupProgress: 100,
    viralRate: 22.4,
    consultRate: 7.8,
    budgetStatus: '已用尽',
    estimatedReads: 512000,
    comments: 6200,
    collects: 9400,
    consults: 312,
    avgConsults: 3.9,
    interactions: 24600,
    avgInteractions: 307,
  },
  {
    key: 't3',
    name: 'Gucci 种草活动_demo',
    model: 'Gucci',
    category: '创作活动',
    status: '已取消',
    publishTime: '2026-06-08 15:33:21',
    startTime: '2026-06-10 00:00:00',
    endTime: '2026-07-10 23:59:59',
    statsDeadline: '2026-07-17 23:59:59',
    platforms: ['小红书', '抖音'],
    contentForm: '图文',
    totalPublish: 5,
    signupProgress: 20,
    viralRate: 0,
    consultRate: 0,
    budgetStatus: '未设置',
    estimatedReads: 0,
    comments: 0,
    collects: 0,
    consults: 0,
    avgConsults: 0,
    interactions: 0,
    avgInteractions: 0,
  },
  {
    key: 't4',
    name: '尚界H5家庭出行共创',
    model: '尚界H5',
    category: '创作活动',
    status: '进行中',
    publishTime: '2026-07-15 09:20:44',
    startTime: '2026-07-18 00:00:00',
    endTime: '2026-08-18 23:59:59',
    statsDeadline: '2026-08-25 23:59:59',
    platforms: ['抖音', '视频号'],
    contentForm: '视频',
    totalPublish: 60,
    signupProgress: 55,
    viralRate: 14.2,
    consultRate: 5.1,
    budgetStatus: '紧张',
    estimatedReads: 198000,
    comments: 2100,
    collects: 3600,
    consults: 98,
    avgConsults: 1.6,
    interactions: 9200,
    avgInteractions: 153,
  },
  {
    key: 't5',
    name: '享界S9T商务场景种草',
    model: '享界S9T',
    category: '展示性任务',
    status: '已结束',
    publishTime: '2026-05-02 11:08:30',
    startTime: '2026-05-05 00:00:00',
    endTime: '2026-06-05 23:59:59',
    statsDeadline: '2026-06-12 23:59:59',
    platforms: ['小红书', '懂车帝'],
    contentForm: '图文',
    totalPublish: 40,
    signupProgress: 100,
    viralRate: 16.8,
    consultRate: 4.6,
    budgetStatus: '已用尽',
    estimatedReads: 156000,
    comments: 1680,
    collects: 2450,
    consults: 64,
    avgConsults: 1.6,
    interactions: 6800,
    avgInteractions: 170,
  },
  {
    key: 't6',
    name: '智界R7智驾体验征集',
    model: '智界R7',
    category: '门店试驾',
    status: '进行中',
    publishTime: '2026-07-22 14:55:02',
    startTime: '2026-07-25 00:00:00',
    endTime: '2026-08-25 23:59:59',
    statsDeadline: '2026-09-01 23:59:59',
    platforms: ['抖音', '懂车帝'],
    contentForm: '视频',
    totalPublish: 50,
    signupProgress: 42,
    viralRate: 19.6,
    consultRate: 8.4,
    budgetStatus: '充足',
    estimatedReads: 274000,
    comments: 2980,
    collects: 4120,
    consults: 142,
    avgConsults: 2.8,
    interactions: 11200,
    avgInteractions: 224,
  },
  {
    key: 't7',
    name: '问界M9外观内饰共创',
    model: '问界M9',
    category: '创作活动',
    status: '未开始',
    publishTime: '2026-07-28 16:40:18',
    startTime: '2026-08-10 00:00:00',
    endTime: '2026-09-10 23:59:59',
    statsDeadline: '2026-09-17 23:59:59',
    platforms: ['小红书'],
    contentForm: '图文+视频',
    totalPublish: 70,
    signupProgress: 8,
    viralRate: 0,
    consultRate: 0,
    budgetStatus: '充足',
    estimatedReads: 0,
    comments: 0,
    collects: 0,
    consults: 0,
    avgConsults: 0,
    interactions: 0,
    avgInteractions: 0,
  },
  {
    key: 't8',
    name: '门店周末试驾打卡',
    model: '问界M7',
    category: '门店试驾',
    status: '已结束',
    publishTime: '2026-03-12 08:30:00',
    startTime: '2026-03-15 00:00:00',
    endTime: '2026-04-15 23:59:59',
    statsDeadline: '2026-04-22 23:59:59',
    platforms: ['视频号', '小红书'],
    contentForm: '图文',
    totalPublish: 35,
    signupProgress: 100,
    viralRate: 11.4,
    consultRate: 9.2,
    budgetStatus: '已用尽',
    estimatedReads: 92000,
    comments: 880,
    collects: 1260,
    consults: 76,
    avgConsults: 2.2,
    interactions: 4100,
    avgInteractions: 117,
  },
];
