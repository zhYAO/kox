export type SystemUserStatus = '启用' | '停用';

export type SystemUser = {
  key: string;
  account: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  enabled: boolean;
  createdAt: string;
};

export const SYSTEM_ROLE_OPTIONS = [
  { label: '超级管理员', value: '超级管理员' },
  { label: '租户管理员', value: '租户管理员' },
  { label: '运营人员', value: '运营人员' },
  { label: '数据分析师', value: '数据分析师' },
  { label: '客服专员', value: '客服专员' },
];

export const MOCK_SYSTEM_USERS: SystemUser[] = [
  {
    key: '1',
    account: 'QBxyuyinggang',
    name: '租户管理员',
    phone: '18611268116',
    email: 'admin@kox.com',
    role: '租户管理员',
    enabled: true,
    createdAt: '2025-11-02 10:18',
  },
  {
    key: '2',
    account: 'test111',
    name: '测试账号',
    phone: '13800138000',
    email: 'test111@kox.com',
    role: '运营人员',
    enabled: true,
    createdAt: '2025-12-15 14:22',
  },
  {
    key: '3',
    account: 'kox_admin',
    name: '系统管理员',
    phone: '13900001111',
    email: 'admin@kox.com',
    role: '超级管理员',
    enabled: true,
    createdAt: '2025-08-01 09:00',
  },
  {
    key: '4',
    account: 'ops_chen',
    name: '陈思远',
    phone: '13812342108',
    email: 'chen@kox.com',
    role: '运营人员',
    enabled: true,
    createdAt: '2026-01-08 11:36',
  },
  {
    key: '5',
    account: 'ops_lin',
    name: '林婉清',
    phone: '13988666331',
    email: 'lin@kox.com',
    role: '运营人员',
    enabled: true,
    createdAt: '2026-01-12 16:05',
  },
  {
    key: '6',
    account: 'data_zhao',
    name: '赵启明',
    phone: '13699009082',
    email: 'zhao@kox.com',
    role: '数据分析师',
    enabled: true,
    createdAt: '2026-02-20 09:48',
  },
  {
    key: '7',
    account: 'cs_zhou',
    name: '周雨桐',
    phone: '13744154415',
    email: 'zhou@kox.com',
    role: '客服专员',
    enabled: true,
    createdAt: '2026-03-04 13:20',
  },
  {
    key: '8',
    account: 'ops_wu',
    name: '吴佳宁',
    phone: '13577207720',
    email: 'wu@kox.com',
    role: '运营人员',
    enabled: false,
    createdAt: '2026-03-18 10:11',
  },
  {
    key: '9',
    account: 'viewer_ma',
    name: '马俊杰',
    phone: '13122882288',
    email: 'ma@kox.com',
    role: '数据分析师',
    enabled: true,
    createdAt: '2026-04-02 15:40',
  },
  {
    key: '10',
    account: 'cs_sun',
    name: '孙悦',
    phone: '18699019901',
    email: 'sun@kox.com',
    role: '客服专员',
    enabled: true,
    createdAt: '2026-05-16 08:55',
  },
];
