export type SystemRole = {
  key: string;
  name: string;
  code: string;
  description: string;
  enabled: boolean;
  createdAt: string;
  permissions: string[];
};

export const SYSTEM_PERMISSION_TREE = [
  {
    title: 'KOX管理',
    key: 'kox',
    children: [
      { title: 'KOX列表', key: 'kox-list' },
      { title: '人群包', key: 'kox-audience' },
      { title: '审核管理', key: 'kox-audit' },
    ],
  },
  {
    title: '任务中心',
    key: 'task',
    children: [
      { title: '任务列表', key: 'task-list' },
      { title: '任务审核', key: 'task-audit' },
    ],
  },
  {
    title: '内容中心',
    key: 'content',
    children: [
      { title: '素材库', key: 'content-material' },
      { title: '优质内容', key: 'content-quality' },
    ],
  },
  {
    title: '积分中心',
    key: 'points',
    children: [
      { title: '预算管理', key: 'points-budget' },
      { title: '积分台账', key: 'points-ledger' },
    ],
  },
  {
    title: '系统管理',
    key: 'system',
    children: [
      { title: '用户管理', key: 'system-users' },
      { title: '角色管理', key: 'system-roles' },
      { title: '权限管理', key: 'system-permissions' },
    ],
  },
];

export const MOCK_SYSTEM_ROLES: SystemRole[] = [
  {
    key: '1',
    name: '运营管理员',
    code: 'OPERATION_ADMIN',
    description: '运营管理角色，拥有运营相关权限',
    enabled: true,
    createdAt: '2025-09-12 10:20',
    permissions: ['kox', 'kox-list', 'kox-audience', 'task', 'task-list', 'content', 'content-material'],
  },
  {
    key: '2',
    name: '项目管理员',
    code: 'PROJECT_ADMIN',
    description: '项目管理角色，负责任务与内容配置',
    enabled: true,
    createdAt: '2025-09-18 14:05',
    permissions: ['task', 'task-list', 'task-audit', 'content', 'content-material', 'content-quality'],
  },
  {
    key: '3',
    name: '审核员',
    code: 'AUDITOR',
    description: '内容与任务审核权限',
    enabled: true,
    createdAt: '2025-10-02 09:40',
    permissions: ['kox-audit', 'task-audit', 'content-quality'],
  },
  {
    key: '4',
    name: '普通用户',
    code: 'NORMAL_USER',
    description: '基础只读权限',
    enabled: true,
    createdAt: '2025-10-08 11:18',
    permissions: ['kox-list', 'task-list'],
  },
  {
    key: '5',
    name: '管理员',
    code: 'ADMIN',
    description: '租户级管理员，含用户与角色配置',
    enabled: true,
    createdAt: '2025-10-15 16:30',
    permissions: [
      'kox',
      'kox-list',
      'kox-audience',
      'kox-audit',
      'task',
      'task-list',
      'task-audit',
      'content',
      'content-material',
      'content-quality',
      'points',
      'points-budget',
      'points-ledger',
      'system',
      'system-users',
      'system-roles',
    ],
  },
  {
    key: '6',
    name: '超级管理员',
    code: 'SUPER_ADMIN',
    description: '拥有全部系统权限',
    enabled: true,
    createdAt: '2025-08-01 09:00',
    permissions: SYSTEM_PERMISSION_TREE.flatMap((g) => [g.key, ...(g.children?.map((c) => c.key) || [])]),
  },
  {
    key: '7',
    name: '数据分析师',
    code: 'DATA_ANALYST',
    description: '数据分析与报表查看',
    enabled: true,
    createdAt: '2026-01-06 13:22',
    permissions: ['kox-list', 'task-list', 'content-quality', 'points-ledger'],
  },
  {
    key: '8',
    name: '客服专员',
    code: 'CS_AGENT',
    description: '客服留言与用户咨询处理',
    enabled: true,
    createdAt: '2026-01-20 10:08',
    permissions: ['kox-list'],
  },
  {
    key: '9',
    name: '内容运营',
    code: 'content_operator',
    description: '素材与优质内容日常运营',
    enabled: true,
    createdAt: '2026-02-11 15:45',
    permissions: ['content', 'content-material', 'content-quality'],
  },
  {
    key: '10',
    name: '积分管理员',
    code: 'points_admin',
    description: '预算与积分台账管理',
    enabled: false,
    createdAt: '2026-03-03 09:16',
    permissions: ['points', 'points-budget', 'points-ledger'],
  },
];
