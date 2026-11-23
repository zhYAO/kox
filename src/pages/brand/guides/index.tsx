import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tree,
  Typography,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  GUIDE_PLATFORM_OPTIONS,
  MOCK_GUIDE_ACCOUNT_TREE,
  MOCK_GUIDE_PERSONS,
  collectDescendantKeys,
  filterGuideTree,
  type GuidePerson,
  type GuidePlatform,
} from '@/mock/brandGuides';
import './index.css';

const { Title, Link, Text } = Typography;

type FilterValues = {
  platform?: string;
  name?: string;
  phone?: string;
};

const PLATFORM_COLOR: Record<GuidePlatform, string> = {
  小红书: 'magenta',
  抖音: 'blue',
  视频号: 'green',
};

export default function BrandGuidesPage() {
  const [treeKeyword, setTreeKeyword] = useState('');
  const [selectedKey, setSelectedKey] = useState('all');
  const [persons, setPersons] = useState<GuidePerson[]>(() => [...MOCK_GUIDE_PERSONS]);
  const [filters, setFilters] = useState<FilterValues>({ platform: '' });
  const [filterForm] = Form.useForm<FilterValues>();
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<GuidePerson | null>(null);
  const [editForm] = Form.useForm();

  const treeData = useMemo(
    () => filterGuideTree(MOCK_GUIDE_ACCOUNT_TREE, treeKeyword),
    [treeKeyword],
  );

  const scopeKeys = useMemo(
    () => collectDescendantKeys(MOCK_GUIDE_ACCOUNT_TREE, selectedKey),
    [selectedKey],
  );

  const dataSource = useMemo(() => {
    return persons.filter((item) => {
      if (selectedKey !== 'all' && !scopeKeys.includes(item.treeKey)) return false;
      if (filters.platform && item.platform !== filters.platform) return false;
      if (filters.name && !item.name.includes(filters.name.trim())) return false;
      if (filters.phone && !item.phone.includes(filters.phone.trim())) return false;
      return true;
    });
  }, [persons, selectedKey, scopeKeys, filters]);

  const openEdit = (row?: GuidePerson) => {
    setEditing(row || null);
    editForm.setFieldsValue(
      row || {
        platform: '小红书',
        phone: '',
        group: '',
        name: '',
        region: '',
        province: '',
        store: '',
        supervisor: '',
      },
    );
    setEditOpen(true);
  };

  const submitEdit = async () => {
    const values = await editForm.validateFields();
    if (editing) {
      setPersons((prev) =>
        prev.map((item) => (item.key === editing.key ? { ...item, ...values } : item)),
      );
      message.success('人员已更新');
    } else {
      setPersons((prev) => [
        {
          key: `${Date.now()}`,
          ...values,
          treeKey: selectedKey === 'all' ? 'east-sh' : selectedKey,
        },
        ...prev,
      ]);
      message.success('人员已添加');
    }
    setEditOpen(false);
  };

  const columns: ColumnsType<GuidePerson> = [
    {
      title: '媒体平台',
      dataIndex: 'platform',
      width: 100,
      render: (v: GuidePlatform) => <Tag color={PLATFORM_COLOR[v]}>{v}</Tag>,
    },
    { title: '手机号', dataIndex: 'phone', width: 130 },
    { title: '用户分组', dataIndex: 'group', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 100 },
    { title: '区域', dataIndex: 'region', width: 90 },
    { title: '省区', dataIndex: 'province', width: 90 },
    { title: '门店', dataIndex: 'store', width: 140 },
    { title: '督导', dataIndex: 'supervisor', width: 100 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, row) => (
        <Space size={12}>
          <Link onClick={() => openEdit(row)}>编辑</Link>
          <Popconfirm
            title="确认删除该人员？"
            onConfirm={() => {
              setPersons((prev) => prev.filter((i) => i.key !== row.key));
              message.success('已删除');
            }}
          >
            <Link type="danger">删除</Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="brand-guides-page">
      <aside className="brand-guides-sider">
        <div className="brand-guides-sider-head">
          <Text strong>账户树</Text>
          <Link
            onClick={() => {
              setSelectedKey('all');
              setTreeKeyword('');
            }}
          >
            清空
          </Link>
        </div>
        <Input
          allowClear
          prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
          placeholder="请输入搜索内容"
          value={treeKeyword}
          onChange={(e) => setTreeKeyword(e.target.value)}
        />
        <Tree
          treeData={treeData}
          selectedKeys={[selectedKey]}
          defaultExpandAll
          onSelect={(keys) => {
            if (keys[0]) setSelectedKey(String(keys[0]));
          }}
        />
      </aside>

      <section className="brand-guides-main">
        <Title level={5} style={{ margin: 0 }}>
          所有人员列表
        </Title>

        <Form
          form={filterForm}
          layout="inline"
          initialValues={{ platform: '' }}
          onFinish={(values) => setFilters(values)}
          className="brand-guides-toolbar"
        >
          <Form.Item name="platform" label="媒体平台">
            <Select style={{ width: 140 }} options={GUIDE_PLATFORM_OPTIONS} />
          </Form.Item>
          <Form.Item name="name" label="姓名">
            <Input placeholder="请输入" allowClear style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="phone" label="电话">
            <Input placeholder="请输入" allowClear style={{ width: 150 }} />
          </Form.Item>
          <Form.Item>
            <Space wrap>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  filterForm.resetFields();
                  setFilters({ platform: '' });
                }}
              >
                重置
              </Button>
              <Upload
                showUploadList={false}
                beforeUpload={() => {
                  message.success('已导入人员数据（mock，按手机号覆盖更新）');
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>批量导入</Button>
              </Upload>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => message.success(`已导出 ${dataSource.length} 条人员数据（mock）`)}
              >
                导出
              </Button>
              <Button type="dashed" onClick={() => openEdit()}>
                新增人员
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <div className="brand-guides-hint">
          <span>当前支持 Excel 导入，导入后会按手机号覆盖更新已有数据</span>
          <Link
            onClick={() => message.success('已开始下载导入模板（mock）')}
          >
            下载导入模板
          </Link>
        </div>

        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1100 }}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        />
      </section>

      <Modal
        title={editing ? '编辑人员' : '新增人员'}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={submitEdit}
        destroyOnClose
        width={560}
      >
        <Form form={editForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item label="媒体平台" name="platform" rules={[{ required: true }]}>
            <Select options={GUIDE_PLATFORM_OPTIONS.filter((o) => o.value)} />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="用户分组" name="group">
            <Input />
          </Form.Item>
          <Form.Item label="区域" name="region">
            <Input />
          </Form.Item>
          <Form.Item label="省区" name="province">
            <Input />
          </Form.Item>
          <Form.Item label="门店" name="store">
            <Input />
          </Form.Item>
          <Form.Item label="督导" name="supervisor">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
