import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from '@ant-design/icons';
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
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  AUTH_PLATFORM_OPTIONS,
  AUTH_STATUS_OPTIONS,
  MOCK_TRAFFIC_AUTH,
  authStatusColor,
  summarizeAuth,
  type AuthPlatform,
  type AuthStatus,
  type TrafficAuthAccount,
} from '@/mock/trafficAuth';

const { Text, Title, Paragraph } = Typography;

type FilterValues = {
  platform?: string;
  status?: string;
  keyword?: string;
};

export default function TrafficAuthPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({ platform: '', status: '' });
  const [list, setList] = useState<TrafficAuthAccount[]>(() => [...MOCK_TRAFFIC_AUTH]);
  const [authOpen, setAuthOpen] = useState(false);
  const [authForm] = Form.useForm();

  const dataSource = useMemo(() => {
    return list.filter((item) => {
      if (filters.platform && item.platform !== filters.platform) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.keyword) {
        const kw = filters.keyword.trim();
        if (!item.accountName.includes(kw) && !item.accountId.includes(kw)) return false;
      }
      return true;
    });
  }, [list, filters]);

  const summary = useMemo(() => summarizeAuth(list), [list]);

  const columns: ColumnsType<TrafficAuthAccount> = [
    { title: '平台', dataIndex: 'platform', width: 130 },
    { title: '账户名称', dataIndex: 'accountName', width: 160 },
    { title: '账户 ID', dataIndex: 'accountId', width: 140 },
    { title: '代理', dataIndex: 'agent', width: 100 },
    {
      title: '授权状态',
      dataIndex: 'status',
      width: 110,
      render: (v: AuthStatus) => <Tag color={authStatusColor(v)}>{v}</Tag>,
    },
    {
      title: '权限范围',
      dataIndex: 'scopes',
      render: (scopes: string[]) =>
        scopes.length ? (
          <Space size={[4, 4]} wrap>
            {scopes.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </Space>
        ) : (
          '-'
        ),
    },
    { title: '授权时间', dataIndex: 'authTime', width: 170 },
    { title: '过期时间', dataIndex: 'expireTime', width: 170 },
    { title: '最近同步', dataIndex: 'lastSyncAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, row) => (
        <Space size={10} wrap>
          {(row.status === '未授权' || row.status === '已失效') && (
            <Typography.Link
              onClick={() => {
                setList((prev) =>
                  prev.map((item) =>
                    item.key === row.key
                      ? {
                          ...item,
                          status: '已授权',
                          authTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                          expireTime: dayjs().add(1, 'year').format('YYYY-MM-DD HH:mm:ss'),
                          lastSyncAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                          scopes: item.scopes.length
                            ? item.scopes
                            : ['账户读取', '计划管理', '报表拉取'],
                        }
                      : item,
                  ),
                );
                message.success(`已完成「${row.accountName}」授权（mock）`);
              }}
            >
              去授权
            </Typography.Link>
          )}
          {row.status === '即将过期' && (
            <Typography.Link
              onClick={() => {
                setList((prev) =>
                  prev.map((item) =>
                    item.key === row.key
                      ? {
                          ...item,
                          status: '已授权',
                          expireTime: dayjs().add(1, 'year').format('YYYY-MM-DD HH:mm:ss'),
                          lastSyncAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        }
                      : item,
                  ),
                );
                message.success('授权已续期一年');
              }}
            >
              续期
            </Typography.Link>
          )}
          {row.status !== '未授权' && (
            <Typography.Link
              onClick={() => {
                setList((prev) =>
                  prev.map((item) =>
                    item.key === row.key
                      ? {
                          ...item,
                          lastSyncAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        }
                      : item,
                  ),
                );
                message.success('账户数据已同步');
              }}
            >
              同步
            </Typography.Link>
          )}
          {row.status === '已授权' || row.status === '即将过期' ? (
            <Popconfirm
              title="确认解除授权？"
              onConfirm={() => {
                setList((prev) =>
                  prev.map((item) =>
                    item.key === row.key
                      ? { ...item, status: '已失效', scopes: [], lastSyncAt: dayjs().format('YYYY-MM-DD HH:mm:ss') }
                      : item,
                  ),
                );
                message.success('已解除授权');
              }}
            >
              <Typography.Link type="danger">解除</Typography.Link>
            </Popconfirm>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>
          账号授权
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          管理投放平台授权关系，支持授权、续期、同步与解除。授权成功后可用于报表拉取与批量创编。
        </Paragraph>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space>
              <SafetyCertificateOutlined style={{ fontSize: 22, color: '#1677ff' }} />
              <div>
                <Text type="secondary">授权账户</Text>
                <div style={{ fontSize: 24, fontWeight: 600 }}>{summary.total}</div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space>
              <CheckCircleOutlined style={{ fontSize: 22, color: '#52c41a' }} />
              <div>
                <Text type="secondary">已授权</Text>
                <div style={{ fontSize: 24, fontWeight: 600 }}>{summary.ok}</div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space>
              <WarningOutlined style={{ fontSize: 22, color: '#faad14' }} />
              <div>
                <Text type="secondary">即将过期</Text>
                <div style={{ fontSize: 24, fontWeight: 600 }}>{summary.expiring}</div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space>
              <ExclamationCircleOutlined style={{ fontSize: 22, color: '#ff4d4f' }} />
              <div>
                <Text type="secondary">失效/未授权</Text>
                <div style={{ fontSize: 24, fontWeight: 600 }}>{summary.invalid}</div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card>
        <Form
          form={form}
          layout="inline"
          initialValues={{ platform: '', status: '' }}
          onFinish={(values) => setFilters(values)}
          style={{ rowGap: 12, marginBottom: 16 }}
        >
          <Form.Item name="platform" label="平台">
            <Select style={{ width: 160 }} options={AUTH_PLATFORM_OPTIONS} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select style={{ width: 140 }} options={AUTH_STATUS_OPTIONS} />
          </Form.Item>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="账户名/ID" allowClear style={{ width: 180 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  form.resetFields();
                  setFilters({ platform: '', status: '' });
                }}
              >
                重置
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  authForm.setFieldsValue({
                    platform: '小红书聚光',
                    accountName: '',
                    accountId: '',
                    agent: '代理001',
                  });
                  setAuthOpen(true);
                }}
              >
                新增授权
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1500 }}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        />
      </Card>

      <Modal
        title="新增授权"
        open={authOpen}
        onCancel={() => setAuthOpen(false)}
        onOk={async () => {
          const values = await authForm.validateFields();
          setList((prev) => [
            {
              key: `${Date.now()}`,
              platform: values.platform as AuthPlatform,
              accountName: values.accountName,
              accountId: values.accountId,
              agent: values.agent,
              status: '已授权',
              authTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              expireTime: dayjs().add(1, 'year').format('YYYY-MM-DD HH:mm:ss'),
              lastSyncAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              scopes: ['账户读取', '计划管理', '报表拉取'],
            },
            ...prev,
          ]);
          message.success('授权成功（mock OAuth）');
          setAuthOpen(false);
        }}
        destroyOnClose
        okText="发起授权"
      >
        <Form form={authForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item label="平台" name="platform" rules={[{ required: true }]}>
            <Select options={AUTH_PLATFORM_OPTIONS.filter((o) => o.value)} />
          </Form.Item>
          <Form.Item
            label="账户名称"
            name="accountName"
            rules={[{ required: true, message: '请输入账户名称' }]}
          >
            <Input placeholder="如：品牌投放主账户" />
          </Form.Item>
          <Form.Item
            label="账户 ID"
            name="accountId"
            rules={[{ required: true, message: '请输入账户 ID' }]}
          >
            <Input placeholder="平台侧账户 ID" prefix={<LinkOutlined />} />
          </Form.Item>
          <Form.Item label="代理" name="agent" rules={[{ required: true }]}>
            <Input placeholder="代理名称" />
          </Form.Item>
          <Text type="secondary">演示环境将模拟 OAuth 跳转并直接返回授权成功。</Text>
        </Form>
      </Modal>
    </Space>
  );
}
