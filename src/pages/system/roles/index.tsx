import { PlusOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tree,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  MOCK_SYSTEM_ROLES,
  SYSTEM_PERMISSION_TREE,
  type SystemRole,
} from '@/mock/systemRoles';

const { Link } = Typography;
const { TextArea } = Input;

type FilterValues = {
  name?: string;
  code?: string;
  status?: string;
};

type RoleFormValues = {
  name: string;
  code: string;
  description?: string;
  enabled: boolean;
};

const NAME_PATTERN = /^[\u4e00-\u9fa5A-Za-z0-9\-_()`（）]{2,32}$/;

export default function SystemRolesPage() {
  const [filterForm] = Form.useForm<FilterValues>();
  const [roleForm] = Form.useForm<RoleFormValues>();
  const [filters, setFilters] = useState<FilterValues>({});
  const [roles, setRoles] = useState<SystemRole[]>(() => [...MOCK_SYSTEM_ROLES]);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<SystemRole | null>(null);
  const [permOpen, setPermOpen] = useState(false);
  const [current, setCurrent] = useState<SystemRole | null>(null);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  const dataSource = useMemo(() => {
    return roles.filter((item) => {
      if (filters.name && !item.name.includes(filters.name.trim())) return false;
      if (filters.code && !item.code.toLowerCase().includes(filters.code.trim().toLowerCase())) {
        return false;
      }
      if (filters.status === '启用' && !item.enabled) return false;
      if (filters.status === '停用' && item.enabled) return false;
      return true;
    });
  }, [roles, filters]);

  const treeData = SYSTEM_PERMISSION_TREE as DataNode[];

  const openCreate = () => {
    setEditing(null);
    roleForm.setFieldsValue({
      name: '',
      code: '',
      description: '',
      enabled: true,
    });
    setEditOpen(true);
  };

  const openEdit = (row: SystemRole) => {
    setEditing(row);
    roleForm.setFieldsValue({
      name: row.name,
      code: row.code,
      description: row.description,
      enabled: row.enabled,
    });
    setEditOpen(true);
  };

  const submitRole = async () => {
    const values = await roleForm.validateFields();
    const name = values.name.trim();
    const code = values.code.trim();

    if (editing) {
      setRoles((prev) =>
        prev.map((item) =>
          item.key === editing.key
            ? {
                ...item,
                name,
                description: values.description?.trim() || '',
                enabled: values.enabled,
              }
            : item,
        ),
      );
      message.success('角色已更新');
    } else {
      if (roles.some((r) => r.code === code)) {
        message.error('角色编码已存在');
        return;
      }
      setRoles((prev) => [
        {
          key: `${Date.now()}`,
          name,
          code,
          description: values.description?.trim() || '',
          enabled: values.enabled,
          createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
          permissions: [],
        },
        ...prev,
      ]);
      message.success('角色已创建');
    }
    setEditOpen(false);
  };

  const columns: ColumnsType<SystemRole> = [
    {
      title: '序号',
      width: 70,
      render: (_v, _r, index) => index + 1,
    },
    { title: '角色名称', dataIndex: 'name', width: 140 },
    { title: '角色编码', dataIndex: 'code', width: 160 },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      render: (v: string) => v || '-',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 100,
      render: (enabled: boolean) =>
        enabled ? <Badge status="success" text="启用" /> : <Badge status="default" text="停用" />,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (v: string) => v || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, row) => (
        <Space size={12}>
          <Link onClick={() => openEdit(row)}>编辑</Link>
          <Link
            onClick={() => {
              setCurrent(row);
              setCheckedKeys(row.permissions);
              setPermOpen(true);
            }}
          >
            分配权限
          </Link>
          <Popconfirm
            title="确认删除该角色？"
            onConfirm={() => {
              setRoles((prev) => prev.filter((item) => item.key !== row.key));
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
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Form form={filterForm} layout="vertical" onFinish={(values) => setFilters(values)}>
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="角色名称" name="name">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="角色编码" name="code">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="状态" name="status">
                <Select
                  allowClear
                  placeholder="请选择"
                  options={[
                    { label: '启用', value: '启用' },
                    { label: '停用', value: '停用' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label=" ">
                <Space>
                  <Button
                    onClick={() => {
                      filterForm.resetFields();
                      setFilters({});
                    }}
                  >
                    重置
                  </Button>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新增角色
          </Button>
        </div>
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1100 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (t) => `第 1-${Math.min(10, t)} 条/总共 ${t} 条`,
          }}
        />
      </Card>

      <Modal
        title={editing ? '编辑角色' : '新增角色'}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={submitRole}
        destroyOnClose
        width={560}
      >
        <Form form={roleForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            label="角色名称"
            name="name"
            extra="2~32 个字符，支持中文、英文、数字及 - _ ( ) （ ），首尾不能有空格"
            rules={[
              { required: true, message: '请输入角色名称' },
              {
                validator: async (_, value?: string) => {
                  const v = (value || '').trim();
                  if (!v) return;
                  if (v !== value) throw new Error('首尾不能有空格');
                  if (!NAME_PATTERN.test(v)) throw new Error('角色名称格式不正确');
                },
              },
            ]}
          >
            <Input placeholder="请输入角色名称" maxLength={32} showCount />
          </Form.Item>
          <Form.Item
            label="角色编码"
            name="code"
            extra="2~64 个字符，仅支持小写字母、数字和下划线，必须以字母开头，下划线不能连续或位于首尾；创建后不可修改"
            rules={[
              { required: true, message: '请输入角色编码' },
              {
                validator: async (_, value?: string) => {
                  if (editing) return;
                  const v = (value || '').trim();
                  if (!v) return;
                  if (v.length < 2 || v.length > 64) throw new Error('长度为 2~64');
                  if (!/^[a-z]/.test(v)) throw new Error('必须以字母开头');
                  if (!/^[a-z0-9_]+$/.test(v)) throw new Error('仅支持小写字母、数字和下划线');
                  if (v.endsWith('_') || /__/.test(v)) {
                    throw new Error('下划线不能连续或位于首尾');
                  }
                },
              },
            ]}
          >
            <Input
              placeholder="请输入角色编码，如 content_operator"
              disabled={!!editing}
            />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} placeholder="请输入角色描述" maxLength={200} showCount />
          </Form.Item>
          <Form.Item label="状态" name="enabled" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="停用" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`分配权限${current ? ` - ${current.name}` : ''}`}
        open={permOpen}
        onCancel={() => setPermOpen(false)}
        onOk={() => {
          if (!current) return;
          setRoles((prev) =>
            prev.map((item) =>
              item.key === current.key ? { ...item, permissions: checkedKeys } : item,
            ),
          );
          message.success('权限已更新');
          setPermOpen(false);
        }}
        destroyOnClose
        width={480}
      >
        <Tree
          checkable
          defaultExpandAll
          treeData={treeData}
          checkedKeys={checkedKeys}
          onCheck={(keys) => {
            const next = Array.isArray(keys) ? keys : keys.checked;
            setCheckedKeys(next as string[]);
          }}
        />
      </Modal>
    </Space>
  );
}
