export type AuthPlatform = '小红书聚光' | '小红书蒲公英' | '巨量千川' | '巨量引擎';
export type AuthStatus = '已授权' | '即将过期' | '已失效' | '未授权';

export type TrafficAuthAccount = {
  key: string;
  platform: AuthPlatform;
  accountName: string;
  accountId: string;
  agent: string;
  status: AuthStatus;
  authTime: string;
  expireTime: string;
  lastSyncAt: string;
  scopes: string[];
};

export const AUTH_PLATFORM_OPTIONS = [
  { label: '全部平台', value: '' },
  { label: '小红书聚光', value: '小红书聚光' },
  { label: '小红书蒲公英', value: '小红书蒲公英' },
  { label: '巨量千川', value: '巨量千川' },
  { label: '巨量引擎', value: '巨量引擎' },
];

export const AUTH_STATUS_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '已授权', value: '已授权' },
  { label: '即将过期', value: '即将过期' },
  { label: '已失效', value: '已失效' },
  { label: '未授权', value: '未授权' },
];

export const MOCK_TRAFFIC_AUTH: TrafficAuthAccount[] = [
  {
    key: '1',
    platform: '小红书聚光',
    accountName: 'pince品策',
    accountId: 'xhs_jg_10086',
    agent: '代理001',
    status: '已授权',
    authTime: '2026-01-12 10:20:00',
    expireTime: '2027-01-12 10:20:00',
    lastSyncAt: '2026-08-01 09:15:00',
    scopes: ['账户读取', '计划管理', '报表拉取'],
  },
  {
    key: '2',
    platform: '小红书聚光',
    accountName: '问界品牌投放号',
    accountId: 'xhs_jg_22018',
    agent: '代理001',
    status: '即将过期',
    authTime: '2025-08-20 14:00:00',
    expireTime: '2026-08-10 14:00:00',
    lastSyncAt: '2026-07-31 18:40:00',
    scopes: ['账户读取', '报表拉取'],
  },
  {
    key: '3',
    platform: '巨量千川',
    accountName: '千川-春季种草',
    accountId: 'qc_889910',
    agent: '代理002',
    status: '已授权',
    authTime: '2026-03-01 09:00:00',
    expireTime: '2027-03-01 09:00:00',
    lastSyncAt: '2026-08-01 08:50:00',
    scopes: ['账户读取', '计划管理', '素材管理', '报表拉取'],
  },
  {
    key: '4',
    platform: '巨量引擎',
    accountName: 'AD-品牌曝光',
    accountId: 'ad_556677',
    agent: '代理002',
    status: '已失效',
    authTime: '2025-05-08 11:30:00',
    expireTime: '2026-05-08 11:30:00',
    lastSyncAt: '2026-05-08 11:31:00',
    scopes: ['账户读取'],
  },
  {
    key: '5',
    platform: '小红书蒲公英',
    accountName: '蒲公英合作号',
    accountId: 'xhs_pg_33021',
    agent: '代理001',
    status: '已授权',
    authTime: '2026-02-18 16:22:00',
    expireTime: '2027-02-18 16:22:00',
    lastSyncAt: '2026-07-30 12:10:00',
    scopes: ['达人检索', '任务下发', '效果回传'],
  },
  {
    key: '6',
    platform: '巨量千川',
    accountName: '千川-门店引流',
    accountId: 'qc_102938',
    agent: '代理003',
    status: '未授权',
    authTime: '-',
    expireTime: '-',
    lastSyncAt: '-',
    scopes: [],
  },
  {
    key: '7',
    platform: '小红书聚光',
    accountName: '方太联投账户',
    accountId: 'xhs_jg_44120',
    agent: '代理001',
    status: '已授权',
    authTime: '2026-04-02 10:05:00',
    expireTime: '2027-04-02 10:05:00',
    lastSyncAt: '2026-08-01 07:20:00',
    scopes: ['账户读取', '计划管理', '报表拉取'],
  },
  {
    key: '8',
    platform: '巨量引擎',
    accountName: 'AD-线索收集',
    accountId: 'ad_778899',
    agent: '代理003',
    status: '即将过期',
    authTime: '2025-09-01 09:00:00',
    expireTime: '2026-08-15 09:00:00',
    lastSyncAt: '2026-07-29 21:00:00',
    scopes: ['账户读取', '计划管理'],
  },
];

export function authStatusColor(status: AuthStatus) {
  if (status === '已授权') return 'success';
  if (status === '即将过期') return 'warning';
  if (status === '已失效') return 'error';
  return 'default';
}

export function summarizeAuth(list: TrafficAuthAccount[]) {
  return {
    total: list.length,
    ok: list.filter((i) => i.status === '已授权').length,
    expiring: list.filter((i) => i.status === '即将过期').length,
    invalid: list.filter((i) => i.status === '已失效' || i.status === '未授权').length,
  };
}
