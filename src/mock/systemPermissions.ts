export type MenuPermType = '目录' | '菜单' | '按钮';

export type MenuPermission = {
  key: string;
  name: string;
  icon?: string;
  sort: number;
  code?: string;
  path?: string;
  component?: string;
  type: MenuPermType;
  enabled: boolean;
  createdAt?: string;
  description?: string;
  parentId?: string | null;
  children?: MenuPermission[];
};

export const MENU_TYPE_OPTIONS = [
  { label: '目录', value: '目录' },
  { label: '菜单', value: '菜单' },
  { label: '按钮', value: '按钮' },
];

export const MENU_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '启用', value: '启用' },
  { label: '停用', value: '停用' },
];

export function menuTypeColor(type: MenuPermType) {
  if (type === '目录') return 'processing';
  if (type === '菜单') return 'success';
  return 'warning';
}

function dir(
  key: string,
  name: string,
  sort: number,
  path: string,
  children: MenuPermission[],
): MenuPermission {
  return {
    key,
    name,
    sort,
    code: `menu:${key}`,
    path,
    type: '目录',
    enabled: true,
    createdAt: '2025-08-01 10:00:00',
    parentId: null,
    children,
  };
}

function menu(
  key: string,
  name: string,
  sort: number,
  path: string,
  parentId: string,
  buttons: MenuPermission[] = [],
): MenuPermission {
  return {
    key,
    name,
    sort,
    code: `menu:${key}`,
    path,
    component: `@/pages${path}/index`,
    type: '菜单',
    enabled: true,
    createdAt: '2025-08-12 11:20:00',
    parentId,
    children: buttons.length ? buttons : undefined,
  };
}

function btn(key: string, name: string, code: string, parentId: string, sort = 0): MenuPermission {
  return {
    key,
    name,
    sort,
    code,
    type: '按钮',
    enabled: true,
    createdAt: '2025-09-01 09:00:00',
    parentId,
  };
}

export const MOCK_MENU_PERMISSIONS: MenuPermission[] = [
  dir('kox', 'KOX管理', 10, '/kox-management', [
    menu('kox-list', 'KOX列表', 1, '/kox/list', 'kox', [
      btn('kox-list-add', '新增KOX', 'kox:list:add', 'kox-list', 1),
      btn('kox-list-edit', '编辑KOX', 'kox:list:edit', 'kox-list', 2),
      btn('kox-list-export', '导出', 'kox:list:export', 'kox-list', 3),
    ]),
    menu('kox-audience', '人群包', 2, '/kox/audience', 'kox'),
    menu('kox-tags', '标签管理', 3, '/kox/tags', 'kox'),
    menu('kox-audit', 'KOC审核', 4, '/kox/audit', 'kox', [
      btn('kox-audit-pass', '审核通过', 'kox:audit:pass', 'kox-audit', 1),
      btn('kox-audit-reject', '审核驳回', 'kox:audit:reject', 'kox-audit', 2),
    ]),
    menu('kox-connect', '建联管理', 5, '/kox/connect', 'kox'),
    menu('kox-analysis-report', '分析报告', 6, '/kox/analysis-report', 'kox'),
  ]),
  dir('task', '任务中心', 20, '/task-board', [
    menu('task-list', '任务列表', 1, '/task/list', 'task', [
      btn('task-list-create', '创建任务', 'task:list:create', 'task-list', 1),
      btn('task-list-edit', '编辑任务', 'task:list:edit', 'task-list', 2),
      btn('task-list-delete', '删除任务', 'task:list:delete', 'task-list', 3),
    ]),
    menu('task-audit', '任务审核', 2, '/task/audit', 'task'),
    menu('task-display', '展示性任务', 3, '/task/display', 'task'),
  ]),
  dir('content', '内容中心', 30, '/content', [
    menu('content-material', '素材库', 1, '/content/material', 'content'),
    menu('content-quality', '优质内容库', 2, '/content/quality', 'content'),
    menu('content-seed-code', '种草码管理', 3, '/content/seed-code', 'content'),
    menu('content-ai', 'AI创作台', 4, '/content/ai', 'content'),
    menu('content-video', '视频创作台', 5, '/content/video', 'content'),
  ]),
  dir('analysis', '数据分析', 40, '/analysis', [
    menu('analysis-overview', '数据概览', 1, '/analysis/overview', 'analysis'),
    menu('analysis-koc', 'KOC分析', 2, '/analysis/koc', 'analysis'),
    menu('analysis-task', '任务分析', 3, '/analysis/task', 'analysis'),
    menu('analysis-note', '笔记分析', 4, '/analysis/note', 'analysis'),
    menu('analysis-store', '门店运营分析', 5, '/analysis/store', 'analysis'),
  ]),
  dir('ops', '运营任务', 50, '/ops', [
    menu('ops-list', '任务列表', 1, '/ops/list', 'ops'),
    menu('ops-audit', '任务审核', 2, '/ops/audit', 'ops'),
  ]),
  {
    key: 'academy',
    name: '学院管理',
    sort: 55,
    code: 'menu:academy',
    path: '/academy',
    component: '@/pages/academy/index',
    type: '菜单',
    enabled: true,
    createdAt: '2025-08-20 10:00:00',
    parentId: null,
  },
  dir('points', '积分中心', 60, '/points', [
    menu('points-budget', '预算管理', 1, '/points/budget', 'points'),
    menu('points-ledger', '积分台账', 2, '/points/ledger', 'points'),
  ]),
  dir('kos', 'KOS数据分析', 70, '/kos-data', [
    menu('kos-overview', '数据概览', 1, '/kos/overview', 'kos'),
    menu('kos-task', '任务分析', 2, '/kos/task', 'kos'),
    menu('kos-note', '笔记分析', 3, '/kos/note', 'kos'),
  ]),
  dir('cs', '客服管理', 80, '/cs', [
    menu('cs-messages', '客服留言列表', 1, '/cs/messages', 'cs'),
  ]),
  dir('system', '系统管理', 90, '/system', [
    menu('system-users', '用户管理', 1, '/system/users', 'system', [
      btn('system-users-add', '新增用户', 'system:user:add', 'system-users', 1),
      btn('system-users-edit', '编辑用户', 'system:user:edit', 'system-users', 2),
      btn('system-users-reset', '重置密码', 'system:user:reset', 'system-users', 3),
    ]),
    menu('system-roles', '角色管理', 2, '/system/roles', 'system'),
    menu('system-permissions', '权限管理', 3, '/system/permissions', 'system', [
      btn('system-perm-add', '新增菜单', 'system:perm:add', 'system-permissions', 1),
      btn('system-perm-edit', '编辑菜单', 'system:perm:edit', 'system-permissions', 2),
      btn('system-perm-delete', '删除菜单', 'system:perm:delete', 'system-permissions', 3),
    ]),
    menu('system-miniapp', '小程序管理', 4, '/system/miniapp', 'system'),
    menu('system-dict', '数据字典', 5, '/system/dict', 'system'),
    menu('system-notify', '消息通知', 6, '/system/notify', 'system'),
    menu('system-tenant', '租户管理', 7, '/system/tenants', 'system'),
    menu('system-data-permission', '数据权限管理', 8, '/system/data-permission', 'system'),
    menu('system-screen-log', '截屏录屏监控日志', 9, '/system/screen-log', 'system'),
    menu('system-page-analysis', '页面分析', 10, '/system/page-analysis', 'system'),
  ]),
  dir('brand', '品牌商与账户', 100, '/brand', [
    menu('brand-structure', '品牌架构管理', 1, '/brand/structure', 'brand'),
    menu('brand-guides', '导购人员账号管理', 2, '/brand/guides', 'brand'),
  ]),
  dir('lead', '线索管理', 110, '/lead', [
    menu('lead-data', '线索数据分析', 1, '/lead/data', 'lead'),
  ]),
  dir('traffic', '投流管理', 120, '/traffic', [
    menu('traffic-board', '自定义看板', 1, '/traffic/board', 'traffic'),
    menu('traffic-auth', '账号授权', 2, '/traffic/auth', 'traffic'),
    menu('traffic-batch', '批量创编', 3, '/traffic/batch', 'traffic'),
    menu('traffic-report', '报表分析', 4, '/traffic/report', 'traffic'),
    menu('traffic-monitor', '投流盯盘助手', 5, '/traffic/monitor', 'traffic'),
  ]),
  // standalone buttons shown at root in screenshot style
  btn('mini-koc-info', '获取KOC信息', 'mini:koc:info', '', 0),
];

/** Flatten tree for parent select / lookup */
export function flattenMenus(nodes: MenuPermission[], result: MenuPermission[] = []) {
  nodes.forEach((n) => {
    result.push(n);
    if (n.children?.length) flattenMenus(n.children, result);
  });
  return result;
}

/** Filter tree by name / status while keeping hierarchy */
export function filterMenuTree(
  nodes: MenuPermission[],
  keyword?: string,
  status?: string,
): MenuPermission[] {
  const kw = keyword?.trim();
  return nodes
    .map((node) => {
      const children = node.children
        ? filterMenuTree(node.children, keyword, status)
        : undefined;
      const nameOk = !kw || node.name.includes(kw);
      const statusOk =
        !status ||
        (status === '启用' && node.enabled) ||
        (status === '停用' && !node.enabled);
      const selfMatch = nameOk && statusOk;
      if (selfMatch || (children && children.length > 0)) {
        return {
          ...node,
          children: children?.length ? children : undefined,
        };
      }
      return null;
    })
    .filter(Boolean) as MenuPermission[];
}

export function insertMenu(
  tree: MenuPermission[],
  item: MenuPermission,
  parentId?: string | null,
): MenuPermission[] {
  if (!parentId) {
    return [...tree, item];
  }
  return tree.map((node) => {
    if (node.key === parentId) {
      return {
        ...node,
        children: [...(node.children || []), item],
      };
    }
    if (node.children?.length) {
      return {
        ...node,
        children: insertMenu(node.children, item, parentId),
      };
    }
    return node;
  });
}

export function updateMenu(
  tree: MenuPermission[],
  key: string,
  patch: Partial<MenuPermission>,
): MenuPermission[] {
  return tree.map((node) => {
    if (node.key === key) {
      return { ...node, ...patch, key: node.key, children: node.children };
    }
    if (node.children?.length) {
      return { ...node, children: updateMenu(node.children, key, patch) };
    }
    return node;
  });
}

export function removeMenu(tree: MenuPermission[], key: string): MenuPermission[] {
  return tree
    .filter((node) => node.key !== key)
    .map((node) => ({
      ...node,
      children: node.children ? removeMenu(node.children, key) : undefined,
    }));
}

/** Parent options: directories and menus only (not buttons) */
export function buildParentOptions(tree: MenuPermission[]) {
  return flattenMenus(tree)
    .filter((n) => n.type !== '按钮')
    .map((n) => ({
      label: `${n.name}（${n.type}）`,
      value: n.key,
    }));
}
