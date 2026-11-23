import {
  CarOutlined,
  FileTextOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  LEAD_PLATFORM_OPTIONS,
  MOCK_LEAD_RECORDS,
  summarizeLeads,
  type LeadPlatform,
  type LeadRecord,
} from '@/mock/leadAnalysis';
import './index.css';

const { RangePicker } = DatePicker;
const { Link, Text, Title, Paragraph } = Typography;

type FilterValues = {
  taskName?: string;
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
  platform?: string;
};

export default function LeadDataPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({ platform: '' });
  const [current, setCurrent] = useState<LeadRecord | null>(null);
  const [open, setOpen] = useState(false);

  const dataSource = useMemo(() => {
    return MOCK_LEAD_RECORDS.filter((item) => {
      if (filters.taskName && !item.taskName.includes(filters.taskName.trim())) return false;
      if (filters.platform && item.platform !== filters.platform) return false;
      if (filters.dateRange?.[0] && filters.dateRange?.[1]) {
        const t = dayjs(item.createdAt);
        if (
          t.isBefore(filters.dateRange[0].startOf('day')) ||
          t.isAfter(filters.dateRange[1].endOf('day'))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  const summary = useMemo(() => summarizeLeads(dataSource), [dataSource]);

  const columns: ColumnsType<LeadRecord> = [
    {
      title: '#',
      width: 60,
      render: (_v, _r, index) => index + 1,
    },
    { title: '任务名称', dataIndex: 'taskName', width: 220, ellipsis: true },
    {
      title: '来源平台',
      dataIndex: 'platform',
      width: 100,
      render: (v: LeadPlatform) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: 'KOC',
      dataIndex: 'koc',
      width: 100,
      render: (v: string) => v || '-',
    },
    {
      title: '笔记标题',
      dataIndex: 'noteTitle',
      width: 220,
      ellipsis: true,
      render: (v: string) => <Link>{v}</Link>,
    },
    { title: '意向客户', dataIndex: 'customer', width: 160, ellipsis: true },
    {
      title: '意向车型',
      dataIndex: 'model',
      width: 120,
      render: (v: string) => <Tag color="processing">{v}</Tag>,
    },
    {
      title: '地区',
      dataIndex: 'region',
      width: 90,
      render: (v: string) => v || '-',
    },
    { title: '线索内容', dataIndex: 'content', ellipsis: true },
    { title: '产生时间', dataIndex: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, row) => (
        <Link
          onClick={() => {
            setCurrent(row);
            setOpen(true);
          }}
        >
          详情
        </Link>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ platform: '' }}
          onFinish={(values) => setFilters(values)}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="任务名称" name="taskName">
                <Input placeholder="输入任务名称模糊搜索" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="时间范围" name="dateRange">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={5}>
              <Form.Item label="来源平台" name="platform">
                <Select options={LEAD_PLATFORM_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={5}>
              <Form.Item label=" ">
                <Space>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setFilters({ platform: '' });
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <div className="lead-kpi-grid">
        <div className="lead-kpi-card">
          <span className="lead-kpi-icon is-blue">
            <FileTextOutlined />
          </span>
          <div>
            <div className="lead-kpi-label">总线索数</div>
            <div className="lead-kpi-value">{summary.totalLeads}</div>
          </div>
        </div>
        <div className="lead-kpi-card">
          <span className="lead-kpi-icon is-green">
            <StarOutlined />
          </span>
          <div>
            <div className="lead-kpi-label">涉及任务数</div>
            <div className="lead-kpi-value">{summary.taskCount}</div>
          </div>
        </div>
        <div className="lead-kpi-card">
          <span className="lead-kpi-icon is-orange">
            <UserOutlined />
          </span>
          <div>
            <div className="lead-kpi-label">来源 KOC 数</div>
            <div className="lead-kpi-value">{summary.kocCount}</div>
          </div>
        </div>
        <div className="lead-kpi-card">
          <span className="lead-kpi-icon is-gray">
            <CarOutlined />
          </span>
          <div>
            <div className="lead-kpi-label">意向车型覆盖</div>
            <div className="lead-kpi-value" style={{ fontSize: 18 }}>
              {summary.modelsText}
            </div>
          </div>
        </div>
      </div>

      <Card>
        <Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>
          线索来源明细
          <Text type="secondary" style={{ marginLeft: 8, fontSize: 13, fontWeight: 400 }}>
            共 {dataSource.length} 条
          </Text>
        </Title>
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1500 }}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        />
      </Card>

      <Drawer
        title="线索详情"
        open={open}
        onClose={() => setOpen(false)}
        width={480}
        destroyOnClose
      >
        {current && (
          <Space direction="vertical" size={12} style={{ display: 'flex' }}>
            <Title level={5} style={{ margin: 0 }}>
              {current.noteTitle}
            </Title>
            <Text type="secondary">任务：{current.taskName}</Text>
            <Space wrap>
              <Tag color="blue">{current.platform}</Tag>
              <Tag color="processing">{current.model}</Tag>
            </Space>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text type="secondary">KOC：</Text>
              {current.koc || '-'}
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text type="secondary">意向客户：</Text>
              {current.customer}
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text type="secondary">地区：</Text>
              {current.region || '-'}
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text type="secondary">产生时间：</Text>
              {current.createdAt}
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text type="secondary">线索内容：</Text>
              {current.content}
            </Paragraph>
            {current.detail && (
              <Paragraph style={{ marginBottom: 0 }}>
                <Text type="secondary">补充说明：</Text>
                {current.detail}
              </Paragraph>
            )}
          </Space>
        )}
      </Drawer>
    </Space>
  );
}
