export type KosAccountOverview = {
  totalAccounts: number;
  totalFollowers: number;
};

export type KosMonthKpi = {
  key: string;
  label: string;
  value: number;
  format?: 'number' | 'wan';
};

export type KosTrendPoint = {
  month: string;
  notes: number;
  exposure: number;
  likes: number;
  collects: number;
};

export type KosEmployeeRank = {
  id: string;
  name: string;
  dept: string;
  avatarColor: string;
  viralCount: number;
};

export type KosNoteRank = {
  id: string;
  title: string;
  coverColor: string;
  employee: string;
  supervisor: string;
  publishTime: string;
  reads: number;
  likes: number;
  collects: number;
  comments: number;
  validComments: number;
};

export const KOS_ACCOUNT_OVERVIEW: KosAccountOverview = {
  totalAccounts: 1286,
  totalFollowers: 3824560,
};

export const KOS_MONTH_KPIS: KosMonthKpi[] = [
  { key: 'notes', label: '本月笔记数', value: 1842 },
  { key: 'exposure', label: '本月曝光数', value: 12856000, format: 'wan' },
  { key: 'likes', label: '本月点赞数', value: 356820 },
  { key: 'collects', label: '本月收藏数', value: 98450 },
  { key: 'comments', label: '本月评论数', value: 42180 },
  { key: 'validComments', label: '本月有效评论', value: 18642 },
];

export const KOS_MONTHLY_TREND: KosTrendPoint[] = [
  { month: '1月', notes: 980, exposure: 620, likes: 18.2, collects: 5.1 },
  { month: '2月', notes: 1120, exposure: 710, likes: 21.4, collects: 6.0 },
  { month: '3月', notes: 1350, exposure: 860, likes: 26.8, collects: 7.4 },
  { month: '4月', notes: 1480, exposure: 940, likes: 29.1, collects: 8.2 },
  { month: '5月', notes: 1620, exposure: 1050, likes: 32.6, collects: 9.1 },
  { month: '6月', notes: 1710, exposure: 1120, likes: 34.8, collects: 9.8 },
  { month: '7月', notes: 1842, exposure: 1286, likes: 35.7, collects: 9.8 },
  { month: '8月', notes: 1760, exposure: 1180, likes: 33.2, collects: 9.3 },
  { month: '9月', notes: 1680, exposure: 1090, likes: 31.5, collects: 8.7 },
  { month: '10月', notes: 1590, exposure: 1020, likes: 29.8, collects: 8.1 },
  { month: '11月', notes: 1720, exposure: 1160, likes: 33.9, collects: 9.5 },
  { month: '12月', notes: 1900, exposure: 1320, likes: 37.2, collects: 10.4 },
];

export const KOS_EMPLOYEE_RANKS: KosEmployeeRank[] = [
  { id: 'e1', name: '陈思远', dept: '华东一区', avatarColor: '#1677ff', viralCount: 28 },
  { id: 'e2', name: '林婉清', dept: '华南督导组', avatarColor: '#13c2c2', viralCount: 24 },
  { id: 'e3', name: '赵启明', dept: '华北二区', avatarColor: '#722ed1', viralCount: 21 },
  { id: 'e4', name: '周雨桐', dept: '西南门店', avatarColor: '#fa8c16', viralCount: 19 },
  { id: 'e5', name: '吴佳宁', dept: '华东二区', avatarColor: '#eb2f96', viralCount: 17 },
  { id: 'e6', name: '郑浩然', dept: '西北督导', avatarColor: '#52c41a', viralCount: 15 },
  { id: 'e7', name: '孙悦', dept: '华南一区', avatarColor: '#2f54eb', viralCount: 14 },
  { id: 'e8', name: '马俊杰', dept: '华北一区', avatarColor: '#fa541c', viralCount: 12 },
];

export const KOS_NOTE_RANKS: KosNoteRank[] = [
  {
    id: 'n1',
    title: '周末试驾体验｜城市通勤也能很从容',
    coverColor: '#1677ff',
    employee: '陈思远',
    supervisor: '王督导',
    publishTime: '2026-07-28 10:22',
    reads: 186520,
    likes: 12480,
    collects: 3560,
    comments: 980,
    validComments: 612,
  },
  {
    id: 'n2',
    title: '家庭出行选车清单，这三点别忽略',
    coverColor: '#13c2c2',
    employee: '林婉清',
    supervisor: '李督导',
    publishTime: '2026-07-26 15:40',
    reads: 152340,
    likes: 9860,
    collects: 4120,
    comments: 760,
    validComments: 504,
  },
  {
    id: 'n3',
    title: '门店实拍｜新色到店第一视角',
    coverColor: '#722ed1',
    employee: '赵启明',
    supervisor: '张督导',
    publishTime: '2026-07-24 09:18',
    reads: 128760,
    likes: 8740,
    collects: 2980,
    comments: 640,
    validComments: 428,
  },
  {
    id: 'n4',
    title: '油耗实测一周，通勤成本算给你看',
    coverColor: '#fa8c16',
    employee: '周雨桐',
    supervisor: '刘督导',
    publishTime: '2026-07-22 19:05',
    reads: 110280,
    likes: 7650,
    collects: 2650,
    comments: 590,
    validComments: 390,
  },
  {
    id: 'n5',
    title: '后排空间对比｜带娃出行更省心',
    coverColor: '#eb2f96',
    employee: '吴佳宁',
    supervisor: '王督导',
    publishTime: '2026-07-20 11:33',
    reads: 98640,
    likes: 6920,
    collects: 2410,
    comments: 520,
    validComments: 346,
  },
  {
    id: 'n6',
    title: '智驾辅助日常体验分享',
    coverColor: '#52c41a',
    employee: '郑浩然',
    supervisor: '陈督导',
    publishTime: '2026-07-18 16:48',
    reads: 87420,
    likes: 5840,
    collects: 1980,
    comments: 430,
    validComments: 288,
  },
];

export function formatKosNumber(value: number, format?: 'number' | 'wan') {
  if (format === 'wan') {
    if (value >= 100000000) return `${(value / 100000000).toFixed(2)}亿`;
    if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  }
  return value.toLocaleString('zh-CN');
}
