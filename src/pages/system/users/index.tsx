import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import {
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
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  MOCK_SYSTEM_USERS,
  SYSTEM_ROLE_OPTIONS,
  type SystemUser,
} from '@/mock/systemUsers';

const { Link } = Typography;

type FilterValues = {
  account?: string;
  name?: string;
  keyword?: string;
  status?: string;
};

type UserFormValues = {
  account: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  enabled: boolean;
};

export default function SystemUsersPage() {
  const [filterForm] = Form.useForm<FilterValues>();
  const [userForm] = Form.useForm<UserFormValues>();
  const [roleForm] = Form.useForm<{ role: string }>();
  const [pwdForm] = Form.useForm<{ password: string; confirm: string }>();

  const [filters, setFilters] = useState<FilterValues>({ status: '' });
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState<SystemUser[]>(() => [...MOCK_SYSTEM_USERS]);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<SystemUser | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [current, setCurrent] = useState<SystemUser | null>(null);

  const dataSource = useMemo(() => {
    return users.filter((item) => {
      if (filters.account && !item.account.includes(filters.account.trim())) return false;
      if (filters.name && !item.name.includes(filters.name.trim())) return false;
      if (filters.status === '启用' && !item.enabled) return false;
      if (filters.status === '停用' && item.enabled) return false;
      if (filters.keyword) {
        const kw = filters.keyword.trim();
        const hit =
          item.account.includes(kw) || item.name.includes(kw) || item.phone.includes(kw);
        if (!hit) return false;
      }
      return true;
    });
  }, [users, filters]);

  const openCreate = () => {
    setEditing(null);
    userForm.setFieldsValue({
      account: '',
      name: '',
      email: '',
      phone: '',
      role: undefined,
      enabled: true,
    });
    setEditOpen(true);
  };

  const openEdit = (row: SystemUser) => {
    setEditing(row);
    userForm.setFieldsValue({
      account: row.account,
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: row.role || undefined,
      enabled: row.enabled,
    });
    setEditOpen(true);
  };

  const submitUser = async () => {
    const values = await userForm.validateFields();
    if (editing) {
      setUsers((prev) =>
        prev.map((item) =>
          item.key === editing.key
            ? {
                ...item,
                account: values.account,
                name: values.name,
                email: values.email,
                phone: values.phone || '',
                role: values.role || '',
                enabled: values.enabled,
              }
            : item,
        ),
      );
      message.success('用户已更新');
    } else {
      const exists = users.some((u) => u.account === values.account);
      if (exists) {
        message.error('用户账号已存在');
        return;
      }
      setUsers((prev) => [
        {
          key: `${Date.now()}`,
          account: values.account,
          name: values.name,
          email: values.email,
          phone: values.phone || '',
          role: values.role || '',
          enabled: values.enabled,
          createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
        },
        ...prev,
      ]);
      message.success('用户已创建');
    }
    setEditOpen(false);
  };

  const columns: ColumnsType<SystemUser> = [
    {
      title: '序号',
      width: 70,
      render: (_v, _r, index) => index + 1,
    },
    { title: '用户账号', dataIndex: 'account', width: 150 },
    {
      title: '用户名称',
      dataIndex: 'name',
      width: 120,
      render: (v: string) => v || '-',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
      render: (v: string) => v || '-',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 180,
      render: (v: string) => v || '-',
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 120,
      render: (v: string) => v || '-',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 90,
      render: (enabled: boolean, row) => (
        <Switch
          checked={enabled}
          onChange={(checked) => {
            setUsers((prev) =>
              prev.map((item) =>
                item.key === row.key ? { ...item, enabled: checked } : item,
              ),
            );
            message.success(checked ? '已启用' : '已停用');
          }}
        />
      ),
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
      width: 260,
      fixed: 'right',
      render: (_, row) => (
        <Space size={12} wrap>
          <Link onClick={() => openEdit(row)}>编辑</Link>
          <Popconfirm
            title="确认删除该用户？"
            onConfirm={() => {
              setUsers((prev) => prev.filter((item) => item.key !== row.key));
              message.success('已删除');
            }}
          >
            <Link type="danger">删除</Link>
          </Popconfirm>
          <Link
            onClick={() => {
              setCurrent(row);
              pwdForm.resetFields();
              setPwdOpen(true);
            }}
          >
            重置密码
          </Link>
          <Link
            onClick={() => {
              setCurrent(row);
              roleForm.setFieldsValue({ role: row.role || undefined });
              setRoleOpen(true);
            }}
          >
            分配角色
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Form
          form={filterForm}
          layout="vertical"
          initialValues={{ status: '' }}
          onFinish={(values) => setFilters(values)}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="用户账号" name="account">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            {!collapsed && (
              <>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="用户名称" name="name">
                    <Input placeholder="请输入" allowClear />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="关键词" name="keyword">
                    <Input placeholder="用户名/账号/手机号" allowClear />
                  </Form.Item>
                </Col>
              </>
            )}
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="状态" name="status">
                <Select
                  options={[
                    { label: '全部', value: '' },
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
                      setFilters({ status: '' });
                    }}
                  >
                    重置
                  </Button>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    type="link"
                    onClick={() => setCollapsed((v) => !v)}
                    icon={collapsed ? <DownOutlined /> : <UpOutlined />}
                  >
                    {collapsed ? '展开' : '收起'}
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
            新增用户
          </Button>
        </div>
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (t) => `第 1-${Math.min(10, t)} 条/总共 ${t} 条`,
          }}
        />
      </Card>

      <Modal
        title={editing ? '编辑用户' : '新增用户'}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={submitUser}
        destroyOnClose
        width={520}
      >
        <Form form={userForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            label="用户账号"
            name="account"
            rules={[
              { required: true, message: '请输入用户账号' },
              {
                pattern: /^[A-Za-z0-9_]{1,200}$/,
                message: '1-200位字母、数字或下划线',
              },
            ]}
          >
            <Input
              placeholder="请输入用户账号 (1-200位字母、数字或下划线)"
              disabled={!!editing}
            />
          </Form.Item>
          <Form.Item
            label="用户名称"
            name="name"
            rules={[{ required: true, message: '请输入用户名称' }]}
          >
            <Input placeholder="请输入用户名称" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item label="手机号" name="phone">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="角色" name="role">
            <Select allowClear placeholder="请选择角色" options={SYSTEM_ROLE_OPTIONS} />
          </Form.Item>
          <Form.Item label="状态" name="enabled" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="停用" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="分配角色"
        open={roleOpen}
        onCancel={() => setRoleOpen(false)}
        onOk={async () => {
          const values = await roleForm.validateFields();
          if (!current) return;
          setUsers((prev) =>
            prev.map((item) =>
              item.key === current.key ? { ...item, role: values.role } : item,
            ),
          );
          message.success('角色已更新');
          setRoleOpen(false);
        }}
        destroyOnClose
      >
        <Form form={roleForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            label={`为「${current?.account || ''}」分配角色`}
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select options={SYSTEM_ROLE_OPTIONS} placeholder="请选择角色" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="重置密码"
        open={pwdOpen}
        onCancel={() => setPwdOpen(false)}
        onOk={async () => {
          await pwdForm.validateFields();
          message.success(`已重置「${current?.account || ''}」的密码`);
          setPwdOpen(false);
        }}
        destroyOnClose
      >
        <Form form={pwdForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            label="新密码"
            name="password"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '至少 6 位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: '请再次输入密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('两次输入不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
