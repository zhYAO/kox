export type LedgerMatchMode = '模糊' | '精确';
export type IssueStatus = '成功' | '失败' | '处理中';

export type PointsLedgerRecord = {
  key: string;
  streamNo: string;
  koxId: string;
  koxName: string;
  phone: string;
  office: string;
  modelTag: string;
  brand: string;
  series: string;
  model: string;
  source: string;
  pointsType: string;
  pointsCode: string;
  issueStatus: IssueStatus;
  taskId: string;
  taskName: string;
  points: number;
  issueTime: string;
  platform: string;
};

export type KoxPointsSummary = {
  key: string;
  koxId: string;
  nickname: string;
  phone: string;
  office: string;
  modelTag: string;
  platform: string;
  totalEarned: number;
  remain: number;
  successCount: number;
  abnormalCount: number;
  lastIssueTime: string;
};

export const OFFICE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '默认分组', value: '默认分组' },
  { label: '华东代表处', value: '华东代表处' },
  { label: '华南代表处', value: '华南代表处' },
  { label: '华北代表处', value: '华北代表处' },
];

export const BRAND_OPTIONS = [
  { label: '全部', value: '' },
  { label: '问界', value: '问界' },
  { label: '尚界', value: '尚界' },
  { label: '享界', value: '享界' },
  { label: '智界', value: '智界' },
];

export const SOURCE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '任务奖励', value: '任务奖励' },
  { label: '手动补发', value: '手动补发' },
  { label: '活动激励', value: '活动激励' },
];

export const POINTS_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '基审积分', value: '基审积分' },
  { label: '二审积分', value: '二审积分' },
  { label: '补发积分', value: '补发积分' },
];

export const ISSUE_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '成功', value: '成功' },
  { label: '失败', value: '失败' },
  { label: '处理中', value: '处理中' },
];

export const PLATFORM_OPTIONS = [
  { label: '全部平台', value: '' },
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '视频号', value: '视频号' },
];

export const MATCH_OPTIONS = [
  { label: '模糊', value: '模糊' },
  { label: '精确', value: '精确' },
];

export function formatLedgerPoints(n: number) {
  return n.toLocaleString('zh-CN');
}

export function issueStatusColor(status: IssueStatus) {
  if (status === '成功') return 'success';
  if (status === '失败') return 'error';
  return 'processing';
}

export const MOCK_POINTS_LEDGER: PointsLedgerRecord[] = [
  {
    key: '1',
    streamNo: 'PL202607280001',
    koxId: '8829101',
    koxName: '晓雨💋',
    phone: '138****6521',
    office: '华东代表处',
    modelTag: '小月龄周期（4-12月）',
    brand: '问界',
    series: 'M系列',
    model: '问界M7',
    source: '任务奖励',
    pointsType: '基审积分',
    pointsCode: 'PT-BASE-01',
    issueStatus: '成功',
    taskId: '142900106792',
    taskName: '问界M7春季体验种草',
    points: 200,
    issueTime: '2026-07-28 15:18:33',
    platform: '小红书',
  },
  {
    key: '2',
    streamNo: 'PL202607280002',
    koxId: '8829101',
    koxName: '晓雨💋',
    phone: '138****6521',
    office: '华东代表处',
    modelTag: '小月龄周期（4-12月）',
    brand: '问界',
    series: 'M系列',
    model: '问界M7',
    source: '任务奖励',
    pointsType: '二审积分',
    pointsCode: 'PT-SEC-01',
    issueStatus: '成功',
    taskId: '142900106792',
    taskName: '问界M7春季体验种草',
    points: 100,
    issueTime: '2026-07-28 16:02:11',
    platform: '小红书',
  },
  {
    key: '3',
    streamNo: 'PL202607250011',
    koxId: '7712044',
    koxName: '智驾新手村',
    phone: '186****9033',
    office: '总部一组',
    modelTag: '高互动',
    brand: '智界',
    series: 'R系列',
    model: '智界R7',
    source: '任务奖励',
    pointsType: '基审积分',
    pointsCode: 'PT-BASE-08',
    issueStatus: '成功',
    taskId: '142900106796',
    taskName: '智界R7智驾体验',
    points: 300,
    issueTime: '2026-07-25 11:40:08',
    platform: '抖音',
  },
  {
    key: '4',
    streamNo: 'PL202607200021',
    koxId: '6633810',
    koxName: '周末出逃计划',
    phone: '159****4412',
    office: '华南代表处',
    modelTag: '认证车主',
    brand: '尚界',
    series: 'H系列',
    model: '尚界H5',
    source: '活动激励',
    pointsType: '基审积分',
    pointsCode: 'PT-BASE-02',
    issueStatus: '成功',
    taskId: '142900106794',
    taskName: '尚界H5家庭出行',
    points: 250,
    issueTime: '2026-07-20 10:01:44',
    platform: '小红书',
  },
  {
    key: '5',
    streamNo: 'PL202607180031',
    koxId: '5521908',
    koxName: '车生活阿凯',
    phone: '177****2288',
    office: '默认分组',
    modelTag: '低互动',
    brand: '享界',
    series: 'S系列',
    model: '享界S9T',
    source: '手动补发',
    pointsType: '补发积分',
    pointsCode: 'PT-MANUAL-03',
    issueStatus: '处理中',
    taskId: '142900106795',
    taskName: '享界S9T商务场景',
    points: 80,
    issueTime: '2026-07-18 14:22:09',
    platform: '懂车帝',
  },
  {
    key: '6',
    streamNo: 'PL202607150041',
    koxId: '4410023',
    koxName: '通州看房日记',
    phone: '135****7780',
    office: '华北代表处',
    modelTag: '潜客',
    brand: '问界',
    series: 'M系列',
    model: '问界M9',
    source: '任务奖励',
    pointsType: '基审积分',
    pointsCode: 'PT-BASE-11',
    issueStatus: '失败',
    taskId: '142900106798',
    taskName: '问界M9外观共创',
    points: 150,
    issueTime: '2026-07-15 09:33:27',
    platform: '视频号',
  },
  {
    key: '7',
    streamNo: 'PL202607120051',
    koxId: '3308811',
    koxName: '小城晚风记',
    phone: '151****3345',
    office: '西南代表处',
    modelTag: '种草',
    brand: '问界',
    series: 'M系列',
    model: '问界M7',
    source: '任务奖励',
    pointsType: '二审积分',
    pointsCode: 'PT-SEC-02',
    issueStatus: '成功',
    taskId: '142900106792',
    taskName: '问界M7春季体验种草',
    points: 120,
    issueTime: '2026-07-12 17:08:55',
    platform: '小红书',
  },
  {
    key: '8',
    streamNo: 'PL202607080061',
    koxId: '7712044',
    koxName: '智驾新手村',
    phone: '186****9033',
    office: '总部一组',
    modelTag: '高互动',
    brand: '智界',
    series: 'R系列',
    model: '智界R7',
    source: '手动补发',
    pointsType: '补发积分',
    pointsCode: 'PT-MANUAL-01',
    issueStatus: '成功',
    taskId: '142900106796',
    taskName: '智界R7智驾体验',
    points: 50,
    issueTime: '2026-07-08 19:45:02',
    platform: '抖音',
  },
];

export const MOCK_KOX_SUMMARY: KoxPointsSummary[] = [
  {
    key: 's1',
    koxId: '8829101',
    nickname: '晓雨💋',
    phone: '138****6521',
    office: '华东代表处',
    modelTag: '小月龄周期（4-12月）',
    platform: '小红书',
    totalEarned: 1280,
    remain: 860,
    successCount: 12,
    abnormalCount: 0,
    lastIssueTime: '2026-07-28 16:02:11',
  },
  {
    key: 's2',
    koxId: '7712044',
    nickname: '智驾新手村',
    phone: '186****9033',
    office: '总部一组',
    modelTag: '高互动',
    platform: '抖音',
    totalEarned: 2460,
    remain: 1520,
    successCount: 18,
    abnormalCount: 1,
    lastIssueTime: '2026-07-25 11:40:08',
  },
  {
    key: 's3',
    koxId: '6633810',
    nickname: '周末出逃计划',
    phone: '159****4412',
    office: '华南代表处',
    modelTag: '认证车主',
    platform: '小红书',
    totalEarned: 980,
    remain: 640,
    successCount: 9,
    abnormalCount: 0,
    lastIssueTime: '2026-07-20 10:01:44',
  },
  {
    key: 's4',
    koxId: '5521908',
    nickname: '车生活阿凯',
    phone: '177****2288',
    office: '默认分组',
    modelTag: '低互动',
    platform: '懂车帝',
    totalEarned: 420,
    remain: 180,
    successCount: 4,
    abnormalCount: 2,
    lastIssueTime: '2026-07-18 14:22:09',
  },
  {
    key: 's5',
    koxId: '4410023',
    nickname: '通州看房日记',
    phone: '135****7780',
    office: '华北代表处',
    modelTag: '潜客',
    platform: '视频号',
    totalEarned: 560,
    remain: 320,
    successCount: 5,
    abnormalCount: 1,
    lastIssueTime: '2026-07-15 09:33:27',
  },
  {
    key: 's6',
    koxId: '3308811',
    nickname: '小城晚风记',
    phone: '151****3345',
    office: '西南代表处',
    modelTag: '种草',
    platform: '小红书',
    totalEarned: 760,
    remain: 510,
    successCount: 7,
    abnormalCount: 0,
    lastIssueTime: '2026-07-12 17:08:55',
  },
];

export const LEDGER_AI_STEPS = [
  '正在读取积分流水数据...',
  '正在核对发放状态与异常笔数...',
  '正在汇总 KOX 积分结构...',
  '正在生成台账分析建议...',
];
