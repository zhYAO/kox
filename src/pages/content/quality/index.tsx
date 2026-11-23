import {
  AimOutlined,
  DeleteOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  ReloadOutlined,
  RiseOutlined,
  SearchOutlined,
  StarOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState, type ReactNode } from 'react';
import {
  MOCK_QUALITY_NOTES,
  PLATFORM_OPTIONS,
  QUALITY_STATS,
  STATUS_OPTIONS,
  formatCount,
  statusColor,
  type QualityNote,
} from '@/mock/qualityContent';
import './index.css';

const { Link, Text, Title, Paragraph } = Typography;

type FilterValues = {
  taskName?: string;
  platform?: string;
  status?: string;
  keyword?: string;
};

export default function QualityContentPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({});
  const [tab, setTab] = useState<'t100' | 'excellent'>('t100');
  const [notes, setNotes] = useState<QualityNote[]>(() => [...MOCK_QUALITY_NOTES]);
  const [detail, setDetail] = useState<QualityNote | null>(null);

  const dataSource = useMemo(() => {
    return notes.filter((item) => {
      if (item.pool !== tab) return false;
      if (filters.taskName && !item.taskName.includes(filters.taskName.trim())) return false;
      if (filters.platform && item.platform !== filters.platform) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.keyword) {
        const kw = filters.keyword.trim().toLowerCase();
        const hit =
          item.title.toLowerCase().includes(kw) ||
          item.summary.toLowerCase().includes(kw) ||
          item.taskName.toLowerCase().includes(kw);
        if (!hit) return false;
      }
      return true;
    });
  }, [notes, tab, filters]);

  const removeNote = (record: QualityNote) => {
    Modal.confirm({
      title: '确认删除该笔记？',
      content: record.title,
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () => {
        setNotes((prev) => prev.filter((item) => item.key !== record.key));
        message.success('已删除（mock）');
      },
    });
  };

  const t100Columns: ColumnsType<QualityNote> = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 80,
      render: (rank?: number) => (
        <Text strong style={{ color: rank && rank <= 3 ? '#fa8c16' : undefined }}>
          {rank ?? '-'}
        </Text>
      ),
    },
    {
      title: '内容信息',
      dataIndex: 'title',
      width: 260,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Text strong ellipsis style={{ maxWidth: 240 }}>
            {record.title}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.platform} · {record.form}
          </Text>
        </Space>
      ),
    },
    {
      title: '所属任务',
      dataIndex: 'taskName',
      ellipsis: true,
    },
    {
      title: (
        <Space size={4}>
          互动
          <Tooltip title="点赞 + 收藏 + 评论">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'interactions',
      width: 110,
      sorter: (a, b) => a.interactions - b.interactions,
      render: (v: number) => formatCount(v),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status: QualityNote['status']) => <Tag color={statusColor(status)}>{status}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Link onClick={() => setDetail(record)}>查看</Link>
          <Link href={record.url} target="_blank">
            原文
          </Link>
        </Space>
      ),
    },
  ];

  const excellentColumns: ColumnsType<QualityNote> = [
    {
      title: '内容信息',
      dataIndex: 'title',
      width: 220,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Text strong ellipsis style={{ maxWidth: 200 }}>
            {record.title}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.platform} · {record.form}
          </Text>
        </Space>
      ),
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip
          placement="topLeft"
          overlayStyle={{ maxWidth: 420 }}
          title={<div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>}
        >
          <Text ellipsis style={{ maxWidth: 220, display: 'inline-block' }}>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: '所属任务',
      dataIndex: 'taskName',
      width: 180,
      ellipsis: true,
    },
    {
      title: (
        <Space size={4}>
          点赞
          <Tooltip title="点赞数">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'likes',
      width: 100,
      render: (v: number) => v.toLocaleString('zh-CN'),
    },
    {
      title: (
        <Space size={4}>
          收藏
          <Tooltip title="收藏数">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'collects',
      width: 90,
      render: (v: number) => v.toLocaleString('zh-CN'),
    },
    {
      title: (
        <Space size={4}>
          评论
          <Tooltip title="评论数">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'comments',
      width: 90,
      render: (v: number) => v.toLocaleString('zh-CN'),
    },
    {
      title: (
        <Space size={4}>
          互动
          <Tooltip title="点赞 + 收藏 + 评论">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'interactions',
      width: 100,
      sorter: (a, b) => a.interactions - b.interactions,
      render: (v: number) => formatCount(v),
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      width: 170,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Link onClick={() => setDetail(record)}>查看</Link>
          <Link href={record.url} target="_blank">
            笔记主页 <LinkOutlined />
          </Link>
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => removeNote(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <div>
        <Title level={3} style={{ marginBottom: 4 }}>
          优质内容
        </Title>
        <Text type="secondary">优质内容库与模版管理</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            label="优质内容总数"
            value={String(QUALITY_STATS.total)}
            icon={<StarOutlined />}
            tone="blue"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            label="平均有效咨询数"
            value={QUALITY_STATS.avgConsultRate}
            icon={<RiseOutlined />}
            tone="green"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            label="已投流加热"
            value={String(QUALITY_STATS.boosted)}
            icon={<ThunderboltOutlined />}
            tone="orange"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            label="待投流"
            value={String(QUALITY_STATS.pendingBoost)}
            icon={<AimOutlined />}
            tone="purple"
          />
        </Col>
      </Row>

      <Card styles={{ body: { paddingBottom: 8 } }}>
        <Form
          form={form}
          layout="inline"
          style={{ rowGap: 12 }}
          onFinish={(values) => setFilters(values)}
        >
          <Form.Item name="taskName" label="任务名称">
            <Input allowClear placeholder="输入任务名称" style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="platform" label="平台" initialValue="">
            <Select options={PLATFORM_OPTIONS} style={{ width: 130 }} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="">
            <Select options={STATUS_OPTIONS} style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="keyword" label="关键词">
            <Input allowClear placeholder="标题/标签关键词" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  form.resetFields();
                  setFilters({});
                }}
              >
                重置
              </Button>
              <Button icon={<ExportOutlined />} onClick={() => message.success('已导出（mock）')}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Tabs
          activeKey={tab}
          onChange={(key) => setTab(key as 't100' | 'excellent')}
          items={[
            { key: 't100', label: '优质笔记 T100' },
            { key: 'excellent', label: '优秀笔记' },
          ]}
        />

        <div className="quality-section-head">
          {tab === 't100' ? (
            <>
              <Title level={5} style={{ margin: 0 }}>
                <TrophyOutlined style={{ color: '#faad14', marginRight: 8 }} />
                优质内容 T100
              </Title>
              <Text type="secondary">支持按任务、关键词等筛选后刷新</Text>
            </>
          ) : (
            <>
              <Title level={5} style={{ margin: 0 }}>
                <StarOutlined style={{ color: '#1677ff', marginRight: 8 }} />
                优秀笔记
              </Title>
              <Text type="secondary">从笔记分析中添加的优秀笔记</Text>
            </>
          )}
        </div>

        <Table
          rowKey="key"
          columns={tab === 't100' ? t100Columns : excellentColumns}
          dataSource={dataSource}
          scroll={{ x: tab === 't100' ? 960 : 1200 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            defaultPageSize: 10,
          }}
        />
      </Card>

      <Drawer
        title="内容详情"
        open={!!detail}
        onClose={() => setDetail(null)}
        width={480}
        destroyOnClose
      >
        {detail && (
          <Descriptions column={1} labelStyle={{ width: 96, color: 'rgba(0,0,0,0.45)' }}>
            <Descriptions.Item label="标题">{detail.title}</Descriptions.Item>
            <Descriptions.Item label="所属任务">{detail.taskName}</Descriptions.Item>
            <Descriptions.Item label="互动数">{detail.interactions.toLocaleString('zh-CN')}</Descriptions.Item>
            <Descriptions.Item label="投流状态">
              {detail.status ? <Tag color={statusColor(detail.status)}>{detail.status}</Tag> : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="链接">
              <Link href={detail.url} target="_blank">
                查看原文
              </Link>
            </Descriptions.Item>
            <Descriptions.Item label="内容">
              <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>{detail.summary}</Paragraph>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </Space>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone: 'blue' | 'green' | 'orange' | 'purple';
}) {
  return (
    <Card className={`quality-stat-card tone-${tone}`} styles={{ body: { padding: 20 } }}>
      <div className="quality-stat-inner">
        <div>
          <Text type="secondary">{label}</Text>
          <div className="quality-stat-value">{value}</div>
        </div>
        <div className="quality-stat-icon">{icon}</div>
      </div>
    </Card>
  );
}
