import {
  FilterOutlined,
  FullscreenOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tabs,
  Tree,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { useMemo, useState } from 'react';
import {
  MOCK_CATEGORY_REPORT,
  MOCK_MY_DASHBOARDS,
  MOCK_SHARED_DASHBOARDS,
  type CategoryReportRow,
  type DashboardFolder,
} from '@/mock/trafficBoard';
import './index.css';

const { Title, Link, Text } = Typography;

type SideTab = 'mine' | 'shared';

function toTreeData(folders: DashboardFolder[]): DataNode[] {
  return folders.map((f) => ({
    key: f.key,
    title: (
      <Space size={6}>
        <SettingOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
        <span>{f.title}</span>
      </Space>
    ),
    children: f.children?.map((c) => ({ key: c.key, title: c.title })),
  }));
}

function filterFolders(folders: DashboardFolder[], keyword: string): DashboardFolder[] {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return folders;
  return folders
    .map((f) => {
      const children = (f.children || []).filter((c) => c.title.toLowerCase().includes(kw));
      if (f.title.toLowerCase().includes(kw)) return f;
      if (children.length) return { ...f, children };
      return null;
    })
    .filter(Boolean) as DashboardFolder[];
}

function findBoardTitle(folders: DashboardFolder[], key: string): string {
  for (const f of folders) {
    const hit = f.children?.find((c) => c.key === key);
    if (hit) return hit.title;
  }
  return '未命名看板';
}

export default function TrafficBoardPage() {
  const [sideTab, setSideTab] = useState<SideTab>('mine');
  const [keyword, setKeyword] = useState('');
  const [selectedKey, setSelectedKey] = useState('board-1');
  const [folders, setFolders] = useState(() => [...MOCK_MY_DASHBOARDS]);
  const [shared] = useState(() => [...MOCK_SHARED_DASHBOARDS]);

  const [addBoardOpen, setAddBoardOpen] = useState(false);
  const [addFolderOpen, setAddFolderOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [boardForm] = Form.useForm();
  const [folderForm] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [level1Filter, setLevel1Filter] = useState('');

  const currentFolders = sideTab === 'mine' ? folders : shared;
  const treeData = useMemo(
    () => toTreeData(filterFolders(currentFolders, keyword)),
    [currentFolders, keyword],
  );
  const boardTitle = findBoardTitle(currentFolders, selectedKey);

  const dataSource = useMemo(() => {
    if (!level1Filter) return MOCK_CATEGORY_REPORT;
    return MOCK_CATEGORY_REPORT.filter((r) => r.level1.includes(level1Filter));
  }, [level1Filter]);

  const columns: ColumnsType<CategoryReportRow> = [
    {
      title: '一级商业类目',
      dataIndex: 'level1',
      width: 130,
      sorter: (a, b) => a.level1.localeCompare(b.level1, 'zh-CN'),
    },
    {
      title: '二级商业类目',
      dataIndex: 'level2',
      width: 130,
      sorter: (a, b) => a.level2.localeCompare(b.level2, 'zh-CN'),
    },
    {
      title: '三级商业类目',
      dataIndex: 'level3',
      width: 120,
      sorter: (a, b) => a.level3.localeCompare(b.level3, 'zh-CN'),
    },
    {
      title: '四级商业类目',
      dataIndex: 'level4',
      width: 120,
      sorter: (a, b) => a.level4.localeCompare(b.level4, 'zh-CN'),
    },
    { title: '商业类目', dataIndex: 'categoryPath', ellipsis: true },
    {
      title: '有效账户数',
      dataIndex: 'activeAccounts',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.activeAccounts - b.activeAccounts,
    },
    {
      title: 'CTR',
      key: 'ctr',
      width: 140,
      align: 'right',
      sorter: (a, b) => a.ctrMin - b.ctrMin,
      render: (_, row) => `${row.ctrMin.toFixed(2)}% ~ ${row.ctrMax.toFixed(2)}%`,
    },
  ];

  return (
    <div className="traffic-board-page">
      <aside className="traffic-board-sider">
        <Tabs
          size="small"
          activeKey={sideTab}
          onChange={(k) => {
            setSideTab(k as SideTab);
            setSelectedKey(k === 'mine' ? 'board-1' : 'board-shared-1');
          }}
          items={[
            { key: 'mine', label: '我的看板' },
            { key: 'shared', label: '分享给我的' },
          ]}
        />
        <Input
          allowClear
          prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
          placeholder="请输入"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Tree
          treeData={treeData}
          selectedKeys={[selectedKey]}
          defaultExpandAll
          onSelect={(keys) => {
            const key = String(keys[0] || '');
            if (!key) return;
            const isFolder = currentFolders.some((f) => f.key === key);
            if (!isFolder) setSelectedKey(key);
          }}
        />
        {sideTab === 'mine' && (
          <div className="traffic-board-sider-actions">
            <Button
              block
              icon={<PlusOutlined />}
              onClick={() => {
                boardForm.setFieldsValue({ name: '', folder: folders[0]?.key });
                setAddBoardOpen(true);
              }}
            >
              添加看板
            </Button>
            <Button
              block
              icon={<PlusOutlined />}
              onClick={() => {
                folderForm.resetFields();
                setAddFolderOpen(true);
              }}
            >
              添加文件夹
            </Button>
          </div>
        )}
      </aside>

      <section className="traffic-board-main">
        <div className="traffic-board-header">
          <Title level={5} style={{ margin: 0 }}>
            {boardTitle}
          </Title>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => message.info('可继续添加报表组件（mock）')}
          />
        </div>

        <div className="traffic-board-toolbar">
          <Link onClick={() => setFilterOpen(true)}>
            <FilterOutlined /> 设置筛选条件
          </Link>
          <Space>
            <Link onClick={() => message.success('已添加表格组件（mock）')}>添加组件</Link>
            <Link
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen?.();
                } else {
                  document.exitFullscreen?.();
                }
              }}
            >
              <FullscreenOutlined /> 全屏
            </Link>
          </Space>
        </div>

        <div className="traffic-board-widget">
          <div className="traffic-board-widget-title">报表名称</div>
          <Table
            rowKey="key"
            size="middle"
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 1100 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (t, range) => `第 ${range[0]}-${range[1]} 条/总共 ${t} 条`,
            }}
          />
        </div>
      </section>

      <Modal
        title="添加看板"
        open={addBoardOpen}
        onCancel={() => setAddBoardOpen(false)}
        onOk={async () => {
          const values = await boardForm.validateFields();
          const boardKey = `board-${Date.now()}`;
          setFolders((prev) =>
            prev.map((f) =>
              f.key === values.folder
                ? {
                    ...f,
                    children: [...(f.children || []), { key: boardKey, title: values.name }],
                  }
                : f,
            ),
          );
          setSelectedKey(boardKey);
          message.success('看板已创建');
          setAddBoardOpen(false);
        }}
        destroyOnClose
      >
        <Form form={boardForm} layout="vertical">
          <Form.Item label="看板名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入看板名称" />
          </Form.Item>
          <Form.Item label="所属文件夹" name="folder" rules={[{ required: true, message: '请选择文件夹' }]}>
            <Select options={folders.map((f) => ({ label: f.title, value: f.key }))} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="添加文件夹"
        open={addFolderOpen}
        onCancel={() => setAddFolderOpen(false)}
        onOk={async () => {
          const values = await folderForm.validateFields();
          setFolders((prev) => [
            ...prev,
            { key: `folder-${Date.now()}`, title: values.name, children: [] },
          ]);
          message.success('文件夹已创建');
          setAddFolderOpen(false);
        }}
        destroyOnClose
      >
        <Form form={folderForm} layout="vertical">
          <Form.Item label="文件夹名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入文件夹名称" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="设置筛选条件"
        open={filterOpen}
        onCancel={() => setFilterOpen(false)}
        onOk={async () => {
          const values = await filterForm.validateFields();
          setLevel1Filter((values.level1 || '').trim());
          message.success('筛选条件已应用');
          setFilterOpen(false);
        }}
        destroyOnClose
      >
        <Form form={filterForm} layout="vertical" initialValues={{ level1: level1Filter }}>
          <Form.Item label="一级商业类目" name="level1">
            <Input placeholder="如：教育培训（留空表示全部）" />
          </Form.Item>
          <Text type="secondary">更多维度筛选可按业务继续扩展（mock）</Text>
        </Form>
      </Modal>
    </div>
  );
}
