import { PlusOutlined, ReloadOutlined, SearchOutlined, ThunderboltOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState, type Key } from 'react';
import {
  BRAND_OPTIONS,
  CERTIFY_OPTIONS,
  FOLLOWER_OPTIONS,
  LOCATION_OPTIONS,
  MOCK_PUBLIC_KOC_LIST,
  MODEL_OPTIONS,
  PERFORMANCE_OPTIONS,
  PERFORMANCE_TYPE_OPTIONS,
  PLATFORM_OPTIONS,
  type PublicKocRecord,
} from '@/mock/publicKoc';

const { RangePicker } = DatePicker;
const { Link, Title } = Typography;

type FilterValues = {
  keyword?: string;
  model?: string;
  brand?: string;
  performanceType?: string;
  performance?: string;
  location?: string;
  certifyType?: string;
  followers?: string;
  platform?: string;
  dateRange?: unknown;
};

function matchFollowers(value: number, range?: string) {
  if (!range) return true;
  if (range === '0-10000') return value < 10000;
  if (range === '10000-100000') return value >= 10000 && value < 100000;
  if (range === '100000-500000') return value >= 100000 && value < 500000;
  if (range === '500000+') return value >= 500000;
  return true;
}

export default function PublicKocFilterPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const dataSource = useMemo(() => {
    if (!filters) return [];
    return MOCK_PUBLIC_KOC_LIST.filter((item) => {
      if (filters.keyword) {
        const text = filters.keyword.trim();
        const hit =
          item.nickname.includes(text) ||
          item.title.includes(text) ||
          item.userId.includes(text);
        if (!hit) return false;
      }
      if (filters.model && item.model !== filters.model) return false;
      if (filters.brand && item.brand !== filters.brand) return false;
      if (filters.location && item.location !== filters.location) return false;
      if (filters.certifyType && item.certifyType !== filters.certifyType) return false;
      if (filters.platform && item.platform !== filters.platform) return false;
      if (!matchFollowers(item.followers, filters.followers)) return false;
      return true;
    });
  }, [filters]);

  const columns: ColumnsType<PublicKocRecord> = [
    { title: '账号昵称', dataIndex: 'nickname', width: 120 },
    { title: '平台', dataIndex: 'platform', width: 90 },
    { title: 'userId', dataIndex: 'userId', width: 120 },
    { title: 'IP', dataIndex: 'ip', width: 90 },
    {
      title: '主页链接',
      dataIndex: 'homeUrl',
      width: 120,
      render: (value: string) => (
        <Link href={value} target="_blank" rel="noreferrer">
          打开
        </Link>
      ),
    },
    {
      title: '粉丝数',
      dataIndex: 'followers',
      width: 110,
      sorter: (a, b) => a.followers - b.followers,
      render: (value: number) => value.toLocaleString(),
    },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    {
      title: '笔记链接',
      dataIndex: 'noteUrl',
      width: 120,
      render: (value: string) => (
        <Link href={value} target="_blank" rel="noreferrer">
          打开
        </Link>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Title level={4} style={{ margin: 0 }}>
        KOC筛选
      </Title>

      <Card title="筛选条件" size="small">
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            setFilters(values);
            message.success('搜索完成（mock）');
          }}
        >
          <Row gutter={12}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="keyword" label="关键词">
                <Input allowClear placeholder="关键词" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="model" label="车型">
                <Select allowClear options={MODEL_OPTIONS} placeholder="车型" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="brand" label="品牌">
                <Select allowClear options={BRAND_OPTIONS} placeholder="品牌" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="performanceType" label="数据表现类型">
                <Select allowClear options={PERFORMANCE_TYPE_OPTIONS} placeholder="数据表现类型" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="performance" label="数据表现">
                <Select allowClear options={PERFORMANCE_OPTIONS} placeholder="数据表现" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="location" label="定位地">
                <Select allowClear options={LOCATION_OPTIONS} placeholder="定位地" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="certifyType" label="认证类型">
                <Select allowClear options={CERTIFY_OPTIONS} placeholder="认证类型" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="followers" label="粉丝量">
                <Select allowClear options={FOLLOWER_OPTIONS} placeholder="粉丝量" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="platform" label="平台">
                <Select allowClear options={PLATFORM_OPTIONS} placeholder="平台" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
              <Form.Item name="dateRange" label="时间范围">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Space wrap>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                form.resetFields();
                setFilters(null);
                setSelectedRowKeys([]);
              }}
            >
              重置
            </Button>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              搜索
            </Button>
            <Button icon={<ThunderboltOutlined />} disabled>
              AI智能分析
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                if (!selectedRowKeys.length) {
                  message.warning('请先勾选要添加的账号');
                  return;
                }
                message.success(`已添加 ${selectedRowKeys.length} 条到 KOX 建联库（mock）`);
              }}
            >
              添加到KOX建联库
            </Button>
          </Space>
        </Form>
      </Card>

      <Card title="搜索结果" size="small">
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          locale={{ emptyText: filters ? '暂无数据' : '请先搜索' }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1100 }}
        />
      </Card>
    </Space>
  );
}
