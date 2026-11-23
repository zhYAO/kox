export type ReportTabKey =
  | 'realtime'
  | 'offline'
  | 'fullchain'
  | 'xhs-freq'
  | 'qianchuan';

export type ReportDimensionKey = 'date' | 'agent' | 'account' | 'campaign' | 'creative';
export type ReportMetricKey =
  | 'spend'
  | 'impressions'
  | 'clicks'
  | 'ctr'
  | 'cpm'
  | 'cpc'
  | 'likes'
  | 'comments'
  | 'collects'
  | 'follows'
  | 'shares';

export type ReportRow = {
  key: string;
  date: string;
  agent: string;
  account: string;
  campaign: string;
  creative: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpm: number;
  cpc: number;
  likes: number;
  comments: number;
  collects: number;
  follows: number;
  shares: number;
};

export const REPORT_TABS: { key: ReportTabKey; label: string }[] = [
  { key: 'realtime', label: '实时报表' },
  { key: 'offline', label: '离线报表' },
  { key: 'fullchain', label: '聚光&蒲公英全链路报表' },
  { key: 'xhs-freq', label: '小红书频次记录报表' },
  { key: 'qianchuan', label: '千川报表' },
];

export const REPORT_DIMENSIONS: { key: ReportDimensionKey; label: string }[] = [
  { key: 'date', label: '日期（天）' },
  { key: 'agent', label: '代理' },
  { key: 'account', label: '推广账户' },
  { key: 'campaign', label: '计划' },
  { key: 'creative', label: '创意' },
];

export const REPORT_METRICS: { key: ReportMetricKey; label: string }[] = [
  { key: 'spend', label: '花费' },
  { key: 'impressions', label: '曝光' },
  { key: 'clicks', label: '点击' },
  { key: 'ctr', label: 'CTR' },
  { key: 'cpm', label: 'CPM' },
  { key: 'cpc', label: 'CPC' },
  { key: 'likes', label: '点赞' },
  { key: 'comments', label: '评论' },
  { key: 'collects', label: '收藏' },
  { key: 'follows', label: '关注' },
  { key: 'shares', label: '分享' },
];

export const DEFAULT_DIMENSIONS: ReportDimensionKey[] = ['date', 'agent', 'account'];
export const DEFAULT_METRICS: ReportMetricKey[] = [
  'spend',
  'impressions',
  'clicks',
  'ctr',
  'cpm',
  'cpc',
  'likes',
  'comments',
  'collects',
  'follows',
  'shares',
];

function row(
  key: string,
  date: string,
  spend: number,
  impressions: number,
  clicks: number,
  likes: number,
  comments: number,
  collects: number,
  follows: number,
  shares: number,
): ReportRow {
  const ctr = impressions ? (clicks / impressions) * 100 : 0;
  const cpm = impressions ? (spend / impressions) * 1000 : 0;
  const cpc = clicks ? spend / clicks : 0;
  return {
    key,
    date,
    agent: '代理001',
    account: 'pince品策',
    campaign: '春季种草计划',
    creative: '图文创意A',
    spend,
    impressions,
    clicks,
    ctr: Number(ctr.toFixed(2)),
    cpm: Number(cpm.toFixed(2)),
    cpc: Number(cpc.toFixed(2)),
    likes,
    comments,
    collects,
    follows,
    shares,
  };
}

export const MOCK_REALTIME_REPORT: ReportRow[] = [
  row('1', '20240122', 109.94, 1199, 42, 18, 6, 9, 3, 2),
  row('2', '20240123', 0, 0, 0, 0, 0, 0, 0, 0),
  row('3', '20240124', 0, 0, 0, 0, 0, 0, 0, 0),
  row('4', '20240125', 86.5, 980, 31, 12, 4, 7, 2, 1),
  row('5', '20240126', 132.2, 1560, 55, 24, 8, 11, 5, 3),
  row('6', '20240127', 74.1, 860, 28, 10, 3, 5, 1, 1),
  row('7', '20240128', 0, 0, 0, 0, 0, 0, 0, 0),
  row('8', '20240129', 158.6, 1820, 61, 29, 9, 14, 6, 4),
  row('9', '20240130', 95.3, 1102, 38, 15, 5, 8, 2, 2),
  row('10', '20240131', 120.8, 1340, 47, 20, 7, 10, 4, 2),
  row('11', '20240201', 68.4, 790, 25, 9, 2, 4, 1, 0),
  row('12', '20240202', 143.7, 1688, 58, 26, 8, 12, 5, 3),
];

export function formatMetric(key: ReportMetricKey, value: number) {
  if (key === 'ctr') return `${value.toFixed(2)}%`;
  if (key === 'spend' || key === 'cpm' || key === 'cpc') return value.toFixed(2);
  return value.toLocaleString('zh-CN');
}
