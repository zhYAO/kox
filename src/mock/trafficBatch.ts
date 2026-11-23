export type BatchJobStatus = '草稿' | '处理中' | '已完成' | '失败';
export type BatchPlatform = '小红书聚光' | '巨量千川';

export type BatchJob = {
  key: string;
  name: string;
  platform: BatchPlatform;
  accountName: string;
  creativeCount: number;
  successCount: number;
  failCount: number;
  status: BatchJobStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  template: string;
};

export const BATCH_PLATFORM_OPTIONS = [
  { label: '全部平台', value: '' },
  { label: '小红书聚光', value: '小红书聚光' },
  { label: '巨量千川', value: '巨量千川' },
];

export const BATCH_STATUS_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '草稿', value: '草稿' },
  { label: '处理中', value: '处理中' },
  { label: '已完成', value: '已完成' },
  { label: '失败', value: '失败' },
];

export const BATCH_TEMPLATE_OPTIONS = [
  { label: '种草图文模板', value: '种草图文模板' },
  { label: '视频带货模板', value: '视频带货模板' },
  { label: '门店引流模板', value: '门店引流模板' },
  { label: '新品曝光模板', value: '新品曝光模板' },
];

export const BATCH_ACCOUNT_OPTIONS = [
  { label: 'pince品策（小红书聚光）', value: 'pince品策', platform: '小红书聚光' as BatchPlatform },
  { label: '问界品牌投放号（小红书聚光）', value: '问界品牌投放号', platform: '小红书聚光' as BatchPlatform },
  { label: '千川-春季种草（巨量千川）', value: '千川-春季种草', platform: '巨量千川' as BatchPlatform },
  { label: '千川-门店引流（巨量千川）', value: '千川-门店引流', platform: '巨量千川' as BatchPlatform },
];

export const MOCK_BATCH_JOBS: BatchJob[] = [
  {
    key: '1',
    name: 'M7春季种草-批量图文',
    platform: '小红书聚光',
    accountName: 'pince品策',
    creativeCount: 48,
    successCount: 48,
    failCount: 0,
    status: '已完成',
    progress: 100,
    createdAt: '2026-07-28 10:12:00',
    updatedAt: '2026-07-28 10:28:00',
    template: '种草图文模板',
  },
  {
    key: '2',
    name: '千川视频带货-周末冲刺',
    platform: '巨量千川',
    accountName: '千川-春季种草',
    creativeCount: 30,
    successCount: 22,
    failCount: 0,
    status: '处理中',
    progress: 73,
    createdAt: '2026-08-01 09:40:00',
    updatedAt: '2026-08-01 10:05:00',
    template: '视频带货模板',
  },
  {
    key: '3',
    name: '门店引流-华南门店包',
    platform: '巨量千川',
    accountName: '千川-门店引流',
    creativeCount: 20,
    successCount: 16,
    failCount: 4,
    status: '失败',
    progress: 100,
    createdAt: '2026-07-25 15:20:00',
    updatedAt: '2026-07-25 15:41:00',
    template: '门店引流模板',
  },
  {
    key: '4',
    name: '新品曝光-方太联投',
    platform: '小红书聚光',
    accountName: '问界品牌投放号',
    creativeCount: 12,
    successCount: 0,
    failCount: 0,
    status: '草稿',
    progress: 0,
    createdAt: '2026-07-30 11:00:00',
    updatedAt: '2026-07-30 11:00:00',
    template: '新品曝光模板',
  },
  {
    key: '5',
    name: '暑期亲子出行素材包',
    platform: '小红书聚光',
    accountName: 'pince品策',
    creativeCount: 36,
    successCount: 36,
    failCount: 0,
    status: '已完成',
    progress: 100,
    createdAt: '2026-07-18 14:08:00',
    updatedAt: '2026-07-18 14:33:00',
    template: '种草图文模板',
  },
  {
    key: '6',
    name: '千川短视频-A/B测试',
    platform: '巨量千川',
    accountName: '千川-春季种草',
    creativeCount: 24,
    successCount: 10,
    failCount: 0,
    status: '处理中',
    progress: 42,
    createdAt: '2026-08-01 08:15:00',
    updatedAt: '2026-08-01 09:50:00',
    template: '视频带货模板',
  },
];

export function batchStatusColor(status: BatchJobStatus) {
  if (status === '已完成') return 'success';
  if (status === '处理中') return 'processing';
  if (status === '失败') return 'error';
  return 'default';
}
