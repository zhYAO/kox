import { DownOutlined, PlusOutlined, SettingOutlined, UpOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Space,
  Switch,
  Table,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { MOCK_SYSTEM_TENANTS, type SystemTenant } from '@/mock/systemTenants';

const { Link } = Typography;

type FilterValues = {
  code?: string;
  name?: string;
  keyword?: string;
};

type TenantFormValues = {
  code: string;
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
  maxUsers: number;
  expireAt?: dayjs.Dayjs | null;
  enabled: boolean;
  remark?: string;
};

export default function SystemTenantsPage() {
  const [filterForm] = Form.useForm<FilterValues>();
  const [tenantForm] = Form.useForm<TenantFormValues>();
  const [configForm] = Form.useForm();

  const [filters, setFilters] = useState<FilterValues>({});
  const [collapsed, setCollapsed] = useState(true);
  const [tenants, setTenants] = useState<SystemTenant[]>(() => [...MOCK_SYSTEM_TENANTS]);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<SystemTenant | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [current, setCurrent] = useState<SystemTenant | null>(null);

  const dataSource = useMemo(() => {
    return tenants.filter((item) => {
      if (filters.code && !item.code.includes(filters.code.trim())) return false;
      if (filters.name && !item.name.includes(filters.name.trim())) return false;
      if (filters.keyword) {
        const kw = filters.keyword.trim();
        if (!item.code.includes(kw) && !item.name.includes(kw)) return false;
      }
      return true;
    });
  }, [tenants, filters]);

  const openCreate = () => {
    setEditing(null);
    tenantForm.setFieldsValue({
      code: '',
      name: '',
      contact: '',
      phone: '',
      email: '',
      maxUsers: 100,
      expireAt: null,
      enabled: true,
      remark: '',
    });
    setEditOpen(true);
  };

  const openEdit = (row: SystemTenant) => {
    setEditing(row);
    tenantForm.setFieldsValue({
      code: row.code,
      name: row.name,
      contact: row.contact,
      phone: row.phone,
      email: row.email,
      maxUsers: row.maxUsers,
      expireAt: row.expireAt ? dayjs(row.expireAt) : null,
      enabled: row.enabled,
      remark: row.remark,
    });
    setEditOpen(true);
  };

  const submitTenant = async () => {
    const values = await tenantForm.validateFields();
    const expireAt = values.expireAt ? values.expireAt.format('YYYY-MM-DD HH:mm:ss') : '';
    if (editing) {
      setTenants((prev) =>
        prev.map((item) =>
          item.key === editing.key
            ? {
                ...item,
                name: values.name,
                contact: values.contact || '',
                phone: values.phone || '',
                email: values.email || '',
                maxUsers: values.maxUsers,
                expireAt,
                enabled: values.enabled,
                remark: values.remark,
              }
            : item,
        ),
      );
      message.success('租户已更新');
    } else {
      if (tenants.some((t) => t.code === values.code)) {
        message.error('租户编码已存在');
        return;
      }
      setTenants((prev) => [
        {
          key: `${Date.now()}`,
          code: values.code,
          name: values.name,
          contact: values.contact || '',
          phone: values.phone || '',
          email: values.email || '',
          maxUsers: values.maxUsers,
          expireAt,
          enabled: values.enabled,
          createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          remark: values.remark,
        },
        ...prev,
      ]);
      message.success('租户已创建');
    }
    setEditOpen(false);
  };

  const columns: ColumnsType<SystemTenant> = [
    {
      title: '序号',
      width: 70,
      render: (_v, _r, index) => index + 1,
    },
    { title: '租户编码', dataIndex: 'code', width: 150 },
    { title: '租户名称', dataIndex: 'name', width: 140 },
    {
      title: '联系人',
      dataIndex: 'contact',
      width: 100,
      render: (v: string) => v || '-',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      width: 130,
      render: (v: string) => v || '-',
    },
    {
      title: '联系邮箱',
      dataIndex: 'email',
      width: 180,
      ellipsis: true,
      render: (v: string) => v || '-',
    },
    { title: '最大用户数', dataIndex: 'maxUsers', width: 110, align: 'right' },
    {
      title: '过期时间',
      dataIndex: 'expireAt',
      width: 170,
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
            setTenants((prev) =>
              prev.map((item) =>
                item.key === row.key ? { ...item, enabled: checked } : item,
              ),
            );
            message.success(checked ? '已启用' : '已停用');
          }}
        />
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, row) => (
        <Space size={12} wrap>
          <Link onClick={() => openEdit(row)}>编辑</Link>
          <Link
            onClick={() => {
              setCurrent(row);
              configForm.setFieldsValue({
                maxUsers: row.maxUsers,
                expireAt: row.expireAt ? dayjs(row.expireAt) : null,
                remark: row.remark || '',
              });
              setConfigOpen(true);
            }}
          >
            <SettingOutlined /> 配置管理
          </Link>
          <Popconfirm
            title="确认删除该租户？"
            onConfirm={() => {
              setTenants((prev) => prev.filter((item) => item.key !== row.key));
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
              <Form.Item label="租户编码" name="code">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            {!collapsed && (
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="租户名称" name="name">
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
            )}
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="关键词" name="keyword">
                <Input placeholder="租户编码/名称" allowClear />
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
                  <Button
                    type="link"
                    icon={collapsed ? <DownOutlined /> : <UpOutlined />}
                    onClick={() => setCollapsed((v) => !v)}
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
            新增租户
          </Button>
        </div>
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t, range) => `第 ${range[0]}-${range[1]} 条/总共 ${t} 条`,
          }}
        />
      </Card>

      <Modal
        title={editing ? '编辑租户' : '新增租户'}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={submitTenant}
        destroyOnClose
        width={560}
      >
        <Form form={tenantForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            label="租户编码"
            name="code"
            rules={[
              { required: true, message: '请输入租户编码' },
              { pattern: /^[A-Za-z0-9_]+$/, message: '仅支持字母、数字、下划线' },
            ]}
          >
            <Input placeholder="请输入租户编码" disabled={!!editing} />
          </Form.Item>
          <Form.Item
            label="租户名称"
            name="name"
            rules={[{ required: true, message: '请输入租户名称' }]}
          >
            <Input placeholder="请输入租户名称" />
          </Form.Item>
          <Form.Item label="联系人" name="contact">
            <Input placeholder="请输入联系人" />
          </Form.Item>
          <Form.Item label="联系电话" name="phone">
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            label="联系邮箱"
            name="email"
            rules={[{ type: 'email', message: '邮箱格式不正确' }]}
          >
            <Input placeholder="请输入联系邮箱" />
          </Form.Item>
          <Form.Item
            label="最大用户数"
            name="maxUsers"
            rules={[{ required: true, message: '请输入最大用户数' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="过期时间" name="expireAt">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="状态" name="enabled" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="停用" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={3} placeholder="选填" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`配置管理${current ? ` · ${current.name}` : ''}`}
        open={configOpen}
        onCancel={() => setConfigOpen(false)}
        onOk={async () => {
          const values = await configForm.validateFields();
          if (!current) return;
          setTenants((prev) =>
            prev.map((item) =>
              item.key === current.key
                ? {
                    ...item,
                    maxUsers: values.maxUsers,
                    expireAt: values.expireAt
                      ? values.expireAt.format('YYYY-MM-DD HH:mm:ss')
                      : '',
                    remark: values.remark,
                  }
                : item,
            ),
          );
          message.success('配置已保存');
          setConfigOpen(false);
        }}
        destroyOnClose
      >
        <Form form={configForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            label="最大用户数"
            name="maxUsers"
            rules={[{ required: true, message: '请输入最大用户数' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="过期时间" name="expireAt">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={3} placeholder="选填" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
