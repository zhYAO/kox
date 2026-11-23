import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
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
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  BRAND_ORG_TYPE_OPTIONS,
  MOCK_BRAND_ORGS,
  MOCK_BRAND_ORG_TREE,
  filterBrandTree,
  type BrandOrgRecord,
  type BrandOrgType,
} from '@/mock/brandStructure';
import './index.css';

const { Title, Link, Text } = Typography;

type FilterValues = {
  name?: string;
  type?: string;
};

type OrgFormValues = {
  shortName: string;
  fullName: string;
  type: BrandOrgType;
  owner?: string;
};

const TYPE_COLOR: Record<BrandOrgType, string> = {
  品牌商: 'purple',
  大区: 'blue',
  门店: 'green',
  部门: 'orange',
};

export default function BrandStructurePage() {
  const [treeKeyword, setTreeKeyword] = useState('');
  const [selectedKey, setSelectedKey] = useState<string>('root');
  const [orgs, setOrgs] = useState<BrandOrgRecord[]>(() => [...MOCK_BRAND_ORGS]);
  const [filters, setFilters] = useState<FilterValues>({ type: '' });
  const [filterForm] = Form.useForm<FilterValues>();
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<BrandOrgRecord | null>(null);
  const [orgForm] = Form.useForm<OrgFormValues>();

  const treeData = useMemo(
    () => filterBrandTree(MOCK_BRAND_ORG_TREE, treeKeyword),
    [treeKeyword],
  );

  const dataSource = useMemo(() => {
    return orgs.filter((item) => {
      if (item.parentKey !== selectedKey) return false;
      if (filters.name) {
        const kw = filters.name.trim();
        if (!item.shortName.includes(kw) && !item.fullName.includes(kw)) return false;
      }
      if (filters.type && item.type !== filters.type) return false;
      return true;
    });
  }, [orgs, selectedKey, filters]);

  const openCreate = () => {
    setEditing(null);
    orgForm.setFieldsValue({
      shortName: '',
      fullName: '',
      type: '大区',
      owner: '',
    });
    setEditOpen(true);
  };

  const openEdit = (row: BrandOrgRecord) => {
    setEditing(row);
    orgForm.setFieldsValue({
      shortName: row.shortName,
      fullName: row.fullName,
      type: row.type,
      owner: row.owner,
    });
    setEditOpen(true);
  };

  const submitOrg = async () => {
    const values = await orgForm.validateFields();
    if (editing) {
      setOrgs((prev) =>
        prev.map((item) =>
          item.key === editing.key
            ? {
                ...item,
                shortName: values.shortName,
                fullName: values.fullName,
                type: values.type,
                owner: values.owner || '',
              }
            : item,
        ),
      );
      message.success('组织已更新');
    } else {
      setOrgs((prev) => [
        {
          key: `${Date.now()}`,
          shortName: values.shortName,
          fullName: values.fullName,
          type: values.type,
          owner: values.owner || '',
          parentKey: selectedKey,
        },
        ...prev,
      ]);
      message.success('组织已创建');
    }
    setEditOpen(false);
  };

  const columns: ColumnsType<BrandOrgRecord> = [
    { title: '简称', dataIndex: 'shortName', width: 140 },
    { title: '全称', dataIndex: 'fullName' },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (v: BrandOrgType) => <Tag color={TYPE_COLOR[v]}>{v}</Tag>,
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      width: 120,
      render: (v: string) => v || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_, row) => (
        <Space size={12}>
          <Link onClick={() => openEdit(row)}>编辑</Link>
          <Popconfirm
            title="确认删除该组织？"
            onConfirm={() => {
              setOrgs((prev) => prev.filter((i) => i.key !== row.key));
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
    <div className="brand-structure-page">
      <aside className="brand-structure-sider">
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

      <section className="brand-structure-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>
            组织列表
          </Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新增组织
          </Button>
        </div>

        <Form
          form={filterForm}
          layout="inline"
          initialValues={{ type: '' }}
          onFinish={(values) => setFilters(values)}
          className="brand-structure-toolbar"
        >
          <Form.Item name="name">
            <Input placeholder="名称" allowClear style={{ width: 180 }} />
          </Form.Item>
          <Form.Item name="type">
            <Select
              placeholder="请选择"
              style={{ width: 140 }}
              options={BRAND_ORG_TYPE_OPTIONS}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  filterForm.resetFields();
                  setFilters({ type: '' });
                }}
              >
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          当前节点：{findTreeTitle(MOCK_BRAND_ORG_TREE, selectedKey) || selectedKey}
        </Text>

        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        />
      </section>

      <Modal
        title={editing ? '编辑组织' : '新增组织'}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={submitOrg}
        destroyOnClose
      >
        <Form form={orgForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            label="简称"
            name="shortName"
            rules={[{ required: true, message: '请输入简称' }]}
          >
            <Input placeholder="请输入简称" />
          </Form.Item>
          <Form.Item
            label="全称"
            name="fullName"
            rules={[{ required: true, message: '请输入全称' }]}
          >
            <Input placeholder="请输入全称" />
          </Form.Item>
          <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
            <Select
              options={BRAND_ORG_TYPE_OPTIONS.filter((o) => o.value)}
              placeholder="请选择"
            />
          </Form.Item>
          <Form.Item label="负责人" name="owner">
            <Input placeholder="请输入负责人" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

function findTreeTitle(nodes: typeof MOCK_BRAND_ORG_TREE, key: string): string | null {
  for (const node of nodes) {
    if (node.key === key) return node.title;
    if (node.children) {
      const found = findTreeTitle(node.children, key);
      if (found) return found;
    }
  }
  return null;
}
