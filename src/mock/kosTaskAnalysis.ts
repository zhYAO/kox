export type KosTaskAnalysisRecord = {
  key: string;
  name: string;
  publishTime: string;
  userGroup: string;
  taskType: string;
  contentType: string;
  publishedNotes: number;
  avgReads: number;
  avgInteractions: number;
  avgValidLeads: number;
  effectivenessIndex: number;
  taskEffectiveRate: number;
  totalReads: number;
  totalInteractions: number;
  totalValidLeads: number;
};

export const DISPLAY_DAYS_OPTIONS = [
  { label: '近7天', value: '7' },
  { label: '近15天', value: '15' },
  { label: '近30天', value: '30' },
  { label: '近90天', value: '90' },
  { label: '全部', value: 'all' },
];

export const GROUP_OPTIONS = [
  { label: '全部', value: '' },
  { label: '华东一区', value: '华东一区' },
  { label: '华南督导组', value: '华南督导组' },
  { label: '华北二区', value: '华北二区' },
  { label: '西南门店', value: '西南门店' },
  { label: '全国门店', value: '全国门店' },
];

export const MOCK_KOS_TASK_ANALYSIS: KosTaskAnalysisRecord[] = [
  {
    key: '1',
    name: '周末试驾邀约冲刺',
    publishTime: '2026-07-28 10:00',
    userGroup: '华东一区',
    taskType: '种草任务',
    contentType: '图文',
    publishedNotes: 186,
    avgReads: 12840,
    avgInteractions: 960,
    avgValidLeads: 18.6,
    effectivenessIndex: 86.2,
    taskEffectiveRate: 72.4,
    totalReads: 2388240,
    totalInteractions: 178560,
    totalValidLeads: 3459,
  },
  {
    key: '2',
    name: '新色到店实拍征集',
    publishTime: '2026-07-25 09:30',
    userGroup: '全国门店',
    taskType: '展示性任务',
    contentType: '视频',
    publishedNotes: 242,
    avgReads: 15620,
    avgInteractions: 1240,
    avgValidLeads: 22.1,
    effectivenessIndex: 91.5,
    taskEffectiveRate: 78.6,
    totalReads: 3780040,
    totalInteractions: 300080,
    totalValidLeads: 5348,
  },
  {
    key: '3',
    name: '家庭出行选车清单',
    publishTime: '2026-07-22 14:20',
    userGroup: '华南督导组',
    taskType: '种草任务',
    contentType: '图文',
    publishedNotes: 154,
    avgReads: 9840,
    avgInteractions: 780,
    avgValidLeads: 14.2,
    effectivenessIndex: 79.8,
    taskEffectiveRate: 65.3,
    totalReads: 1515360,
    totalInteractions: 120120,
    totalValidLeads: 2187,
  },
  {
    key: '4',
    name: '油耗实测一周挑战',
    publishTime: '2026-07-18 11:00',
    userGroup: '华北二区',
    taskType: 'UGC征集',
    contentType: '图文+视频',
    publishedNotes: 128,
    avgReads: 11260,
    avgInteractions: 890,
    avgValidLeads: 16.8,
    effectivenessIndex: 83.4,
    taskEffectiveRate: 69.1,
    totalReads: 1441280,
    totalInteractions: 113920,
    totalValidLeads: 2150,
  },
  {
    key: '5',
    name: '智驾日常体验分享',
    publishTime: '2026-07-15 16:40',
    userGroup: '西南门店',
    taskType: '种草任务',
    contentType: '视频',
    publishedNotes: 96,
    avgReads: 8740,
    avgInteractions: 650,
    avgValidLeads: 11.5,
    effectivenessIndex: 74.6,
    taskEffectiveRate: 58.9,
    totalReads: 839040,
    totalInteractions: 62400,
    totalValidLeads: 1104,
  },
  {
    key: '6',
    name: '后排空间对比测评',
    publishTime: '2026-07-12 10:15',
    userGroup: '华东一区',
    taskType: '展示性任务',
    contentType: '图文',
    publishedNotes: 112,
    avgReads: 10320,
    avgInteractions: 810,
    avgValidLeads: 13.9,
    effectivenessIndex: 81.0,
    taskEffectiveRate: 66.8,
    totalReads: 1155840,
    totalInteractions: 90720,
    totalValidLeads: 1557,
  },
  {
    key: '7',
    name: '门店接待服务种草',
    publishTime: '2026-07-08 09:00',
    userGroup: '全国门店',
    taskType: '种草任务',
    contentType: '图文',
    publishedNotes: 208,
    avgReads: 7620,
    avgInteractions: 540,
    avgValidLeads: 9.8,
    effectivenessIndex: 70.2,
    taskEffectiveRate: 54.5,
    totalReads: 1584960,
    totalInteractions: 112320,
    totalValidLeads: 2038,
  },
  {
    key: '8',
    name: '暑期亲子出行专题',
    publishTime: '2026-07-02 13:30',
    userGroup: '华南督导组',
    taskType: 'UGC征集',
    contentType: '视频',
    publishedNotes: 175,
    avgReads: 13480,
    avgInteractions: 1080,
    avgValidLeads: 19.4,
    effectivenessIndex: 88.7,
    taskEffectiveRate: 74.2,
    totalReads: 2359000,
    totalInteractions: 189000,
    totalValidLeads: 3395,
  },
];

export function formatKosTaskNumber(value: number, digits = 0) {
  if (value >= 10000) return `${(value / 10000).toFixed(digits === 0 ? 1 : digits)}万`;
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
