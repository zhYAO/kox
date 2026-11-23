import {
  AppstoreOutlined,
  BarChartOutlined,
  BookOutlined,
  CustomerServiceOutlined,
  FilterOutlined,
  GiftOutlined,
  LineChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  ProjectOutlined,
  RocketOutlined,
  SettingOutlined,
  ClusterOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { history, Outlet, useLocation } from '@umijs/max';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { clearAuth, getAuth } from '@/utils/auth';
import './index.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

type MenuNode = {
  key: string;
  label: string;
  icon?: ReactNode;
  children?: Array<{ key: string; label: string }>;
};

const MENU_TREE: MenuNode[] = [
  {
    key: 'kox',
    label: 'KOX管理',
    icon: <TeamOutlined />,
    children: [
      { key: 'kox-list', label: 'KOX列表' },
      { key: 'kox-audience', label: '人群包管理' },
      { key: 'kox-tags', label: '标签体系' },
      { key: 'kox-public-filter', label: '公域koc筛选' },
      { key: 'kox-import', label: 'KOC导入' },
      { key: 'kox-report-records', label: '报告记录' },
      { key: 'kox-audit', label: 'KOC审核' },
      { key: 'kox-connect', label: '建联管理' },
      { key: 'kox-analysis-report', label: '分析报告' },
    ],
  },
  {
    key: 'task',
    label: '任务中心',
    icon: <ProjectOutlined />,
    children: [
      { key: 'task-list', label: '任务列表' },
      { key: 'task-audit', label: '任务审核' },
      { key: 'task-display', label: '展示性任务' },
    ],
  },
  {
    key: 'content',
    label: '内容中心',
    icon: <AppstoreOutlined />,
    children: [
      { key: 'content-material', label: '素材库' },
      { key: 'content-quality', label: '优质内容库' },
      { key: 'content-seed-code', label: '种草码管理' },
      { key: 'content-ai', label: 'AI创作台' },
      { key: 'content-video', label: '视频创作台' },
    ],
  },
  {
    key: 'analysis',
    label: '数据分析',
    icon: <BarChartOutlined />,
    children: [
      { key: 'analysis-overview', label: '数据概览' },
      { key: 'analysis-koc', label: 'KOC分析' },
      { key: 'analysis-task', label: '任务分析' },
      { key: 'analysis-note', label: '笔记分析' },
      { key: 'analysis-store', label: '门店运营分析' },
    ],
  },
  {
    key: 'ops',
    label: '运营任务',
    icon: <RocketOutlined />,
    children: [
      { key: 'ops-list', label: '任务列表' },
      { key: 'ops-audit', label: '任务审核' },
    ],
  },
  {
    key: 'academy',
    label: '学院管理',
    icon: <BookOutlined />,
  },
  {
    key: 'points',
    label: '积分中心',
    icon: <GiftOutlined />,
    children: [
      { key: 'points-budget', label: '预算管理' },
      { key: 'points-ledger', label: '积分台账' },
    ],
  },
  {
    key: 'kos',
    label: 'KOS数据分析',
    icon: <LineChartOutlined />,
    children: [
      { key: 'kos-overview', label: '数据概览' },
      { key: 'kos-task', label: '任务分析' },
      { key: 'kos-note', label: '笔记分析' },
    ],
  },
  {
    key: 'cs',
    label: '客服管理',
    icon: <CustomerServiceOutlined />,
    children: [{ key: 'cs-messages', label: '客服留言列表' }],
  },
  {
    key: 'system',
    label: '系统管理',
    icon: <SettingOutlined />,
    children: [
      { key: 'system-users', label: '用户管理' },
      { key: 'system-roles', label: '角色管理' },
      { key: 'system-permissions', label: '权限管理' },
      { key: 'system-miniapp', label: '小程序管理' },
      { key: 'system-dict', label: '数据字典' },
      { key: 'system-notify', label: '消息通知' },
      { key: 'system-tenant', label: '租户管理' },
      { key: 'system-data-permission', label: '数据权限管理' },
      { key: 'system-screen-log', label: '截屏录屏监控日志' },
      { key: 'system-page-analysis', label: '页面分析' },
    ],
  },
  {
    key: 'brand',
    label: '品牌商与账户',
    icon: <ClusterOutlined />,
    children: [
      { key: 'brand-structure', label: '品牌架构管理' },
      { key: 'brand-guides', label: '导购人员账号管理' },
    ],
  },
  {
    key: 'traffic',
    label: '投流管理',
    icon: <NotificationOutlined />,
    children: [
      { key: 'traffic-board', label: '自定义看板' },
      { key: 'traffic-auth', label: '账号授权' },
      { key: 'traffic-batch', label: '批量创编' },
      { key: 'traffic-report', label: '报表分析' },
      { key: 'traffic-monitor', label: '投流盯盘助手' },
    ],
  },
  {
    key: 'lead',
    label: '线索分析',
    icon: <FilterOutlined />,
    children: [{ key: 'lead-data', label: '线索数据分析' }],
  },
];

const MENU_ITEMS: MenuItem[] = MENU_TREE.map((item) => ({
  key: item.key,
  icon: item.icon,
  label: item.label,
  children: item.children?.map((child) => ({
    key: child.key,
    label: child.label,
  })),
}));

const LABEL_MAP: Record<string, string> = {};
const PARENT_MAP: Record<string, string> = {};
const PATH_MAP: Record<string, string> = {
  'kox-list': '/kox/list',
};

MENU_TREE.forEach((item) => {
  LABEL_MAP[item.key] = item.label;
  if (!item.children?.length) {
    PATH_MAP[item.key] = `/placeholder/${item.key}`;
  }
  item.children?.forEach((child) => {
    LABEL_MAP[child.key] = child.label;
    PARENT_MAP[child.key] = item.key;
    if (!PATH_MAP[child.key]) {
      PATH_MAP[child.key] = `/placeholder/${child.key}`;
    }
  });
});

PATH_MAP['kox-list'] = '/kox/list';
PATH_MAP['kox-audience'] = '/kox/audience';
PATH_MAP['kox-tags'] = '/kox/tags';
PATH_MAP['kox-public-filter'] = '/kox/public-filter';
PATH_MAP['kox-import'] = '/kox/import';
PATH_MAP['kox-report-records'] = '/kox/report-records';
PATH_MAP['kox-audit'] = '/kox/audit';
PATH_MAP['kox-connect'] = '/kox/connect';
PATH_MAP['kox-analysis-report'] = '/kox/analysis-report';
PATH_MAP['academy'] = '/academy';
PATH_MAP['content-material'] = '/content/material';
PATH_MAP['content-quality'] = '/content/quality';
PATH_MAP['content-seed-code'] = '/content/seed-code';
PATH_MAP['content-ai'] = '/content/ai';
PATH_MAP['content-video'] = '/content/video';
PATH_MAP['analysis-overview'] = '/analysis/overview';
PATH_MAP['analysis-koc'] = '/analysis/koc';
PATH_MAP['analysis-task'] = '/analysis/task';
PATH_MAP['analysis-note'] = '/analysis/note';
PATH_MAP['analysis-store'] = '/analysis/store';
PATH_MAP['ops-list'] = '/ops/list';
PATH_MAP['ops-audit'] = '/ops/audit';
PATH_MAP['points-budget'] = '/points/budget';
PATH_MAP['points-ledger'] = '/points/ledger';
PATH_MAP['kos-overview'] = '/kos/overview';
PATH_MAP['kos-task'] = '/kos/task';
PATH_MAP['kos-note'] = '/kos/note';
PATH_MAP['cs-messages'] = '/cs/messages';
PATH_MAP['system-users'] = '/system/users';
PATH_MAP['system-roles'] = '/system/roles';
PATH_MAP['system-permissions'] = '/system/permissions';
PATH_MAP['system-miniapp'] = '/system/miniapp';
PATH_MAP['system-dict'] = '/system/dict';
PATH_MAP['system-notify'] = '/system/notify';
PATH_MAP['system-tenant'] = '/system/tenants';
PATH_MAP['system-data-permission'] = '/system/data-permission';
PATH_MAP['system-screen-log'] = '/system/screen-log';
PATH_MAP['system-page-analysis'] = '/system/page-analysis';
PATH_MAP['brand-structure'] = '/brand/structure';
PATH_MAP['brand-guides'] = '/brand/guides';
PATH_MAP['lead-data'] = '/lead/data';
PATH_MAP['traffic-board'] = '/traffic/board';
PATH_MAP['traffic-auth'] = '/traffic/auth';
PATH_MAP['traffic-batch'] = '/traffic/batch';
PATH_MAP['traffic-report'] = '/traffic/report';
PATH_MAP['traffic-monitor'] = '/traffic/monitor';
  PATH_MAP['task-display'] = '/task/display';
  PATH_MAP['task-audit'] = '/task/audit';
  PATH_MAP['task-list'] = '/task/list';

function pathToMenuKey(pathname: string) {
  const matched = Object.entries(PATH_MAP).find(([, path]) => path === pathname);
  if (matched) return matched[0];
  if (pathname.startsWith('/placeholder/')) {
    return pathname.replace('/placeholder/', '');
  }
  if (pathname.startsWith('/kox/portrait/')) return 'kox-list';
  if (pathname === '/kox/audience') return 'kox-audience';
  if (pathname === '/kox/tags') return 'kox-tags';
  if (pathname === '/kox/public-filter') return 'kox-public-filter';
  if (pathname === '/kox/import') return 'kox-import';
  if (pathname === '/kox/report-records') return 'kox-report-records';
  if (pathname === '/kox/audit') return 'kox-audit';
  if (pathname === '/kox/connect') return 'kox-connect';
  if (pathname === '/kox/analysis-report') return 'kox-analysis-report';
  if (pathname === '/academy') return 'academy';
  if (pathname === '/content/material') return 'content-material';
  if (pathname === '/content/quality') return 'content-quality';
  if (pathname.startsWith('/content/seed-code')) return 'content-seed-code';
  if (pathname === '/content/ai') return 'content-ai';
  if (pathname.startsWith('/content/video')) return 'content-video';
  if (pathname === '/analysis/overview') return 'analysis-overview';
  if (pathname === '/analysis/koc') return 'analysis-koc';
  if (pathname === '/analysis/task') return 'analysis-task';
  if (pathname === '/analysis/note') return 'analysis-note';
  if (pathname === '/analysis/store') return 'analysis-store';
  if (pathname.startsWith('/ops/')) {
    if (pathname.startsWith('/ops/audit')) return 'ops-audit';
    return 'ops-list';
  }
  if (pathname === '/points/budget') return 'points-budget';
  if (pathname === '/points/ledger') return 'points-ledger';
  if (pathname === '/kos/overview') return 'kos-overview';
  if (pathname === '/kos/task') return 'kos-task';
  if (pathname === '/kos/note') return 'kos-note';
  if (pathname === '/cs/messages') return 'cs-messages';
  if (pathname === '/system/users') return 'system-users';
  if (pathname === '/system/roles') return 'system-roles';
  if (pathname === '/system/permissions') return 'system-permissions';
  if (pathname === '/system/miniapp') return 'system-miniapp';
  if (pathname === '/system/dict') return 'system-dict';
  if (pathname === '/system/notify') return 'system-notify';
  if (pathname === '/system/tenants') return 'system-tenant';
  if (pathname === '/system/data-permission') return 'system-data-permission';
  if (pathname === '/system/screen-log') return 'system-screen-log';
  if (pathname === '/system/page-analysis') return 'system-page-analysis';
  if (pathname === '/brand/structure') return 'brand-structure';
  if (pathname === '/brand/guides') return 'brand-guides';
  if (pathname === '/lead/data') return 'lead-data';
  if (pathname === '/traffic/board') return 'traffic-board';
  if (pathname === '/traffic/auth') return 'traffic-auth';
  if (pathname === '/traffic/batch') return 'traffic-batch';
  if (pathname === '/traffic/report') return 'traffic-report';
  if (pathname === '/traffic/monitor') return 'traffic-monitor';
  if (pathname === '/task/display') return 'task-display';
  if (pathname === '/task/audit') return 'task-audit';
  if (pathname === '/task/list' || pathname.startsWith('/task/form')) return 'task-list';
  if (pathname === '/kox/list' || pathname === '/') return 'kox-list';
  if (pathname.startsWith('/kox/')) return 'kox-list';
  return 'kox-list';
}

export default function BasicLayout() {
  const { pathname } = useLocation();
  const auth = getAuth();
  const [collapsed, setCollapsed] = useState(false);
  const selectedKey = pathToMenuKey(pathname);
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const parent = PARENT_MAP[pathToMenuKey(pathname)];
    return parent ? [parent] : ['kox'];
  });

  useEffect(() => {
    if (pathname === '/login') return;
    if (!getAuth()) {
      history.replace('/login');
    }
  }, [pathname]);

  useEffect(() => {
    const parent = PARENT_MAP[selectedKey];
    if (parent) {
      setOpenKeys((prev) => (prev.includes(parent) ? prev : [...prev, parent]));
    }
  }, [selectedKey]);

  const breadcrumbItems = useMemo(() => {
    const parentKey = PARENT_MAP[selectedKey];
    if (parentKey) {
      return [{ title: LABEL_MAP[parentKey] }, { title: LABEL_MAP[selectedKey] }];
    }
    return [{ title: LABEL_MAP[selectedKey] ?? '未命名' }];
  }, [selectedKey]);

  if (pathname === '/login') {
    return <Outlet />;
  }

  if (!auth) {
    return null;
  }

  return (
    <Layout className="admin-shell">
      <Sider
        width={220}
        collapsedWidth={72}
        theme="light"
        className="admin-sider"
        collapsible
        collapsed={collapsed}
        trigger={null}
        onCollapse={setCollapsed}
      >
        <div className={`admin-brand ${collapsed ? 'is-collapsed' : ''}`}>
          {collapsed ? (
            <span className="admin-brand-mark">K</span>
          ) : (
            <>
              <span className="admin-brand-name">KoxLink</span>
              <span className="admin-brand-badge">AI</span>
            </>
          )}
        </div>
        <div className="admin-menu-scroll">
          <Menu
            mode="inline"
            inlineCollapsed={collapsed}
            selectedKeys={[selectedKey]}
            openKeys={collapsed ? [] : openKeys}
            items={MENU_ITEMS}
            onOpenChange={(keys) => {
              if (!collapsed) {
                setOpenKeys(keys as string[]);
              }
            }}
            onClick={({ key }) => {
              const parent = PARENT_MAP[key];
              if (parent && !collapsed && !openKeys.includes(parent)) {
                setOpenKeys((prev) => [...prev, parent]);
              }
              history.push(PATH_MAP[key] || `/placeholder/${key}`);
            }}
          />
        </div>
      </Sider>

      <Layout className="admin-main">
        <Header className="admin-header">
          <Space size={16}>
            <button
              type="button"
              className="admin-collapse-btn"
              onClick={() => setCollapsed((value) => !value)}
              aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <Breadcrumb items={breadcrumbItems} />
          </Space>
          <Space size={16} className="admin-header-right">
            <CustomerServiceOutlined className="admin-header-icon" />
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: '退出登录',
                    onClick: () => {
                      clearAuth();
                      history.replace('/login');
                    },
                  },
                ],
              }}
              placement="bottomRight"
            >
              <Space size={8} style={{ cursor: 'pointer' }}>
                <Avatar size={28} icon={<UserOutlined />} />
                <Text>{auth.username || 'kox_admin'}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
