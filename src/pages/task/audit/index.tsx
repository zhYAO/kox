import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState, type ReactNode } from 'react';
import {
  MOCK_APPEALS,
  MOCK_BASIC_AUDITS,
  MOCK_COLLECT_EXCEPTIONS,
  MOCK_EFFECT_AUDITS,
  TASK_AUDIT_PLATFORM_OPTIONS,
  type AppealItem,
  type AppealStatus,
  type BasicAuditItem,
  type BasicAuditStatus,
  type CollectExceptionItem,
  type EffectAuditItem,
  type EffectAuditStatus,
} from '@/mock/taskAudit';

const { RangePicker } = DatePicker;
const { Link, Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

type TabKey = 'basic' | 'collect' | 'effect' | 'appeal';

type CommonFilter = {
  taskId?: string;
  taskName?: string;
  nickname?: string;
  model?: string;
  platform?: string;
  status?: string;
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
  appealType?: string;
  rule?: string;
};

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}) {
  return (
    <Card styles={{ body: { padding: 16 } }}>
      <Space>
        <span style={{ fontSize: 22, color }}>{icon}</span>
        <div>
          <Text type="secondary">{label}</Text>
          <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.2 }}>{value}</div>
        </div>
      </Space>
    </Card>
  );
}

function inRange(value: string, range?: [dayjs.Dayjs, dayjs.Dayjs]) {
  if (!range?.[0] || !range?.[1] || !value || value === '-') return true;
  const t = dayjs(value);
  return !t.isBefore(range[0].startOf('day')) && !t.isAfter(range[1].endOf('day'));
}

export default function TaskAuditPage() {
  const [tab, setTab] = useState<TabKey>('basic');
  const [filterForm] = Form.useForm<CommonFilter>();
  const [filters, setFilters] = useState<CommonFilter>({ platform: '' });

  const [basicList, setBasicList] = useState(() => [...MOCK_BASIC_AUDITS]);
  const [collectList, setCollectList] = useState(() => [...MOCK_COLLECT_EXCEPTIONS]);
  const [effectList, setEffectList] = useState(() => [...MOCK_EFFECT_AUDITS]);
  const [appealList, setAppealList] = useState(() => [...MOCK_APPEALS]);

  const [basicOpen, setBasicOpen] = useState(false);
  const [basicCurrent, setBasicCurrent] = useState<BasicAuditItem | null>(null);

  const [collectOpen, setCollectOpen] = useState(false);
  const [collectCurrent, setCollectCurrent] = useState<CollectExceptionItem | null>(null);

  const [effectOpen, setEffectOpen] = useState(false);
  const [effectCurrent, setEffectCurrent] = useState<EffectAuditItem | null>(null);
  const [effectForm] = Form.useForm();

  const [appealOpen, setAppealOpen] = useState(false);
  const [appealCurrent, setAppealCurrent] = useState<AppealItem | null>(null);

  const basicFiltered = useMemo(() => {
    return basicList.filter((item) => {
      if (filters.taskId && !item.taskId.includes(filters.taskId.trim())) return false;
      if (filters.taskName && !item.taskName.includes(filters.taskName.trim())) return false;
      if (filters.nickname && !item.nickname.includes(filters.nickname.trim())) return false;
      if (filters.model && !item.model.includes(filters.model.trim())) return false;
      if (filters.platform && item.platform !== filters.platform) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (!inRange(item.submitTime, filters.dateRange)) return false;
      return true;
    });
  }, [basicList, filters]);

  const collectFiltered = useMemo(() => {
    return collectList.filter((item) => {
      if (filters.taskId && !item.taskId.includes(filters.taskId.trim())) return false;
      if (filters.taskName && !item.taskName.includes(filters.taskName.trim())) return false;
      if (filters.nickname && !item.nickname.includes(filters.nickname.trim())) return false;
      if (filters.model && !item.model.includes(filters.model.trim())) return false;
      if (filters.platform && item.platform !== filters.platform) return false;
      if (!inRange(item.submitTime, filters.dateRange)) return false;
      return true;
    });
  }, [collectList, filters]);

  const effectFiltered = useMemo(() => {
    return effectList.filter((item) => {
      if (filters.taskId && !item.taskId.includes(filters.taskId.trim())) return false;
      if (filters.taskName && !item.taskName.includes(filters.taskName.trim())) return false;
      if (filters.nickname && !item.koc.includes(filters.nickname.trim())) return false;
      if (filters.model && !item.model.includes(filters.model.trim())) return false;
      if (filters.platform && item.platform !== filters.platform) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (!inRange(item.submitTime, filters.dateRange)) return false;
      return true;
    });
  }, [effectList, filters]);

  const appealFiltered = useMemo(() => {
    return appealList.filter((item) => {
      if (filters.taskId && !item.taskId.includes(filters.taskId.trim())) return false;
      if (filters.taskName && !item.taskName.includes(filters.taskName.trim())) return false;
      if (filters.nickname && !item.koc.includes(filters.nickname.trim())) return false;
      if (filters.model && !item.model.includes(filters.model.trim())) return false;
      if (filters.platform && item.platform !== filters.platform) return false;
      if (filters.appealType && item.appealType !== filters.appealType) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (!inRange(item.appealTime, filters.dateRange)) return false;
      return true;
    });
  }, [appealList, filters]);

  const basicStats = useMemo(() => {
    const pending = basicFiltered.filter((i) => i.status === '待审核').length;
    const done = basicFiltered.filter((i) => i.status === '已审核').length;
    const returned = basicFiltered.filter((i) => i.status === '已退回').length;
    return { pending, done, returned, total: basicFiltered.length };
  }, [basicFiltered]);

  const effectStats = useMemo(() => {
    const pending = effectFiltered.filter((i) => i.status === '待审核').length;
    const passed = effectFiltered.filter((i) => i.status === '审核通过').length;
    const rejected = effectFiltered.filter((i) => i.status === '已拒绝').length;
    return { pending, passed, rejected, total: effectFiltered.length };
  }, [effectFiltered]);

  const appealStats = useMemo(() => {
    const pending = appealFiltered.filter((i) => i.status === '待处理').length;
    const passed = appealFiltered.filter((i) => i.status === '审核通过').length;
    const rejected = appealFiltered.filter((i) => i.status === '已拒绝').length;
    return { pending, passed, rejected, total: appealFiltered.length };
  }, [appealFiltered]);

  const basicColumns: ColumnsType<BasicAuditItem> = [
    { title: '任务ID', dataIndex: 'taskId', width: 130 },
    {
      title: '任务',
      dataIndex: 'taskName',
      width: 200,
      ellipsis: true,
      render: (v) => <Link>{v}</Link>,
    },
    { title: '目标平台', dataIndex: 'platform', width: 90 },
    {
      title: '内容标题',
      dataIndex: 'contentTitle',
      width: 140,
      render: (v) => v || '-',
    },
    {
      title: '内容链接',
      dataIndex: 'contentLink',
      width: 180,
      ellipsis: true,
      render: (v: string) => (
        <Link href={v} onClick={(e) => e.preventDefault()}>
          {v}
        </Link>
      ),
    },
    { title: '用户昵称', dataIndex: 'nickname', width: 110 },
    { title: 'KOX ID', dataIndex: 'koxId', width: 90 },
    {
      title: '所属代表处',
      dataIndex: 'office',
      width: 110,
      render: (v) => v || '-',
    },
    { title: '车型', dataIndex: 'model', width: 90 },
    { title: '提交时间', dataIndex: 'submitTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 90,
      fixed: 'right',
      render: (_, row) => (
        <Link
          onClick={() => {
            setBasicCurrent(row);
            setBasicOpen(true);
          }}
        >
          {row.status === '待审核' ? '审核' : '查看'}
        </Link>
      ),
    },
  ];

  const collectColumns: ColumnsType<CollectExceptionItem> = [
    { title: '任务ID', dataIndex: 'taskId', width: 130 },
    { title: '任务', dataIndex: 'taskName', width: 180, ellipsis: true },
    { title: '目标平台', dataIndex: 'platform', width: 90 },
    { title: '内容标题', dataIndex: 'contentTitle', width: 180, ellipsis: true },
    { title: '用户昵称', dataIndex: 'nickname', width: 110 },
    { title: 'KOX ID', dataIndex: 'koxId', width: 90 },
    {
      title: '所属代表处',
      dataIndex: 'office',
      width: 110,
      render: (v) => v || '-',
    },
    { title: '车型', dataIndex: 'model', width: 90 },
    {
      title: '笔记链接',
      dataIndex: 'noteLink',
      width: 180,
      ellipsis: true,
      render: (v: string) => (
        <Link href={v} onClick={(e) => e.preventDefault()}>
          {v}
        </Link>
      ),
    },
    { title: '提交时间', dataIndex: 'submitTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 90,
      fixed: 'right',
      render: (_, row) => (
        <Link
          onClick={() => {
            setCollectCurrent(row);
            setCollectOpen(true);
          }}
        >
          处理
        </Link>
      ),
    },
  ];

  const effectColumns: ColumnsType<EffectAuditItem> = [
    { title: '任务ID', dataIndex: 'taskId', width: 130 },
    { title: '任务', dataIndex: 'taskName', width: 180, ellipsis: true },
    { title: '目标平台', dataIndex: 'platform', width: 90 },
    { title: 'KOC', dataIndex: 'koc', width: 100 },
    { title: 'KOX ID', dataIndex: 'koxId', width: 90 },
    {
      title: '所属代表处',
      dataIndex: 'office',
      width: 110,
      render: (v) => v || '-',
    },
    { title: '车型', dataIndex: 'model', width: 90 },
    {
      title: '作品链接',
      dataIndex: 'workLink',
      width: 180,
      ellipsis: true,
      render: (v: string) => (
        <Link href={v} onClick={(e) => e.preventDefault()}>
          {v}
        </Link>
      ),
    },
    { title: '提交时间', dataIndex: 'submitTime', width: 170 },
    {
      title: '效果积分状态',
      dataIndex: 'status',
      width: 120,
      render: (v: EffectAuditStatus) => (
        <Tag color={v === '审核通过' ? 'success' : v === '已拒绝' ? 'error' : 'processing'}>
          {v}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 90,
      fixed: 'right',
      render: (_, row) => (
        <Link
          onClick={() => {
            setEffectCurrent(row);
            effectForm.setFieldsValue({
              effectPoints: row.effectPoints,
              pointsCode: row.pointsCode,
              rejectReason: '',
            });
            setEffectOpen(true);
          }}
        >
          {row.status === '待审核' ? '审核' : '查看'}
        </Link>
      ),
    },
  ];

  const appealColumns: ColumnsType<AppealItem> = [
    { title: '任务ID', dataIndex: 'taskId', width: 130 },
    { title: '任务', dataIndex: 'taskName', width: 180, ellipsis: true },
    { title: '目标平台', dataIndex: 'platform', width: 90 },
    { title: '申诉类型', dataIndex: 'appealType', width: 130 },
    { title: 'KOC', dataIndex: 'koc', width: 100 },
    { title: 'KOX ID', dataIndex: 'koxId', width: 90 },
    {
      title: '所属代表处',
      dataIndex: 'office',
      width: 110,
      render: (v) => v || '-',
    },
    { title: '车型', dataIndex: 'model', width: 90 },
    { title: '申诉理由', dataIndex: 'reason', ellipsis: true },
    {
      title: '申诉状态',
      dataIndex: 'status',
      width: 110,
      render: (v: AppealStatus) => (
        <Tag color={v === '审核通过' ? 'success' : v === '已拒绝' ? 'error' : 'warning'}>{v}</Tag>
      ),
    },
    { title: '申诉时间', dataIndex: 'appealTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 90,
      fixed: 'right',
      render: (_, row) => (
        <Link
          onClick={() => {
            setAppealCurrent(row);
            setAppealOpen(true);
          }}
        >
          {row.status === '待处理' ? '处理' : '查看'}
        </Link>
      ),
    },
  ];

  const filterBar = (
    <Form
      form={filterForm}
      layout="inline"
      initialValues={{ platform: '' }}
      onFinish={(values) => setFilters(values)}
      style={{ rowGap: 12, marginBottom: 16 }}
    >
      <Form.Item name="taskId">
        <Input placeholder="任务ID" allowClear style={{ width: 140 }} />
      </Form.Item>
      <Form.Item name="taskName">
        <Input placeholder="任务名称" allowClear style={{ width: 160 }} />
      </Form.Item>
      <Form.Item name="nickname">
        <Input placeholder="用户昵称" allowClear style={{ width: 140 }} />
      </Form.Item>
      <Form.Item name="model">
        <Input placeholder="车型" allowClear style={{ width: 120 }} />
      </Form.Item>
      <Form.Item name="platform">
        <Select style={{ width: 130 }} options={TASK_AUDIT_PLATFORM_OPTIONS} placeholder="目标平台" />
      </Form.Item>
      {tab === 'basic' && (
        <Form.Item name="status">
          <Select
            allowClear
            placeholder="审核状态"
            style={{ width: 120 }}
            options={[
              { label: '待审核', value: '待审核' },
              { label: '已审核', value: '已审核' },
              { label: '已退回', value: '已退回' },
            ]}
          />
        </Form.Item>
      )}
      {tab === 'effect' && (
        <Form.Item name="status">
          <Select
            allowClear
            placeholder="审核状态"
            style={{ width: 120 }}
            options={[
              { label: '待审核', value: '待审核' },
              { label: '审核通过', value: '审核通过' },
              { label: '已拒绝', value: '已拒绝' },
            ]}
          />
        </Form.Item>
      )}
      {tab === 'appeal' && (
        <>
          <Form.Item name="appealType">
            <Select
              allowClear
              placeholder="申诉类型"
              style={{ width: 140 }}
              options={[
                { label: '基础积分申诉', value: '基础积分申诉' },
                { label: '效果积分申诉', value: '效果积分申诉' },
                { label: '采集异常申诉', value: '采集异常申诉' },
              ]}
            />
          </Form.Item>
          <Form.Item name="status">
            <Select
              allowClear
              placeholder="申诉状态"
              style={{ width: 120 }}
              options={[
                { label: '待处理', value: '待处理' },
                { label: '审核通过', value: '审核通过' },
                { label: '已拒绝', value: '已拒绝' },
              ]}
            />
          </Form.Item>
        </>
      )}
      <Form.Item name="dateRange">
        <RangePicker />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            搜索
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
          <Button
            icon={<DownloadOutlined />}
            onClick={() => message.success('已导出当前列表（mock）')}
          >
            导出
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <Card>
      <Tabs
        activeKey={tab}
        onChange={(k) => {
          setTab(k as TabKey);
          filterForm.resetFields();
          setFilters({ platform: '' });
        }}
        items={[
          { key: 'basic', label: '基础积分' },
          { key: 'collect', label: '采集异常' },
          { key: 'effect', label: '效果积分' },
          { key: 'appeal', label: '申诉列表' },
        ]}
      />

      {tab === 'basic' && (
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
          <Row gutter={[16, 16]}>
            <Col xs={12} md={6}>
              <StatCard label="待审核" value={basicStats.pending} icon={<ClockCircleOutlined />} color="#fa8c16" />
            </Col>
            <Col xs={12} md={6}>
              <StatCard label="已审核" value={basicStats.done} icon={<CheckCircleOutlined />} color="#52c41a" />
            </Col>
            <Col xs={12} md={6}>
              <StatCard label="今日退回" value={basicStats.returned || '-'} icon={<CloseCircleOutlined />} color="#ff4d4f" />
            </Col>
            <Col xs={12} md={6}>
              <StatCard label="当前列表" value={basicStats.total} icon={<InfoCircleOutlined />} color="#1677ff" />
            </Col>
          </Row>
          {filterBar}
          <Table rowKey="key" size="middle" columns={basicColumns} dataSource={basicFiltered} scroll={{ x: 1500 }} pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }} />
        </Space>
      )}

      {tab === 'collect' && (
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
          <Row gutter={[16, 16]}>
            <Col xs={12} md={6}>
              <StatCard label="待处理异常" value={collectFiltered.length} icon={<ExclamationCircleOutlined />} color="#ff4d4f" />
            </Col>
            <Col xs={12} md={6}>
              <StatCard label="当前列表" value={collectFiltered.length} icon={<ClockCircleOutlined />} color="#faad14" />
            </Col>
          </Row>
          {filterBar}
          <Table rowKey="key" size="middle" columns={collectColumns} dataSource={collectFiltered} scroll={{ x: 1500 }} pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }} />
        </Space>
      )}

      {tab === 'effect' && (
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
          <Row gutter={[16, 16]}>
            <Col xs={12} md={6}>
              <StatCard label="待审核" value={effectStats.pending} icon={<ClockCircleOutlined />} color="#fa8c16" />
            </Col>
            <Col xs={12} md={6}>
              <StatCard label="审核通过" value={effectStats.passed} icon={<CheckCircleOutlined />} color="#52c41a" />
            </Col>
            <Col xs={12} md={6}>
              <StatCard label="已拒绝" value={effectStats.rejected} icon={<CloseCircleOutlined />} color="#ff4d4f" />
            </Col>
            <Col xs={12} md={6}>
              <StatCard label="合计" value={effectStats.total} icon={<InfoCircleOutlined />} color="#1677ff" />
            </Col>
          </Row>
          {filterBar}
          <Table rowKey="key" size="middle" columns={effectColumns} dataSource={effectFiltered} scroll={{ x: 1400 }} pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }} />
        </Space>
      )}

      {tab === 'appeal' && (
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
          <Row gutter={[16, 16]}>
            <Col xs={12} md={6}>
              <StatCard label="待处理" value={appealStats.pending} icon={<ClockCircleOutlined />} color="#fa8c16" />
            </Col>
            <Col xs={12} md={6}>
              <StatCard label="审核通过" value={appealStats.passed} icon={<CheckCircleOutlined />} color="#52c41a" />
            </Col>
            <Col xs={12} md={6}>
              <StatCard label="已拒绝" value={appealStats.rejected} icon={<CloseCircleOutlined />} color="#ff4d4f" />
            </Col>
            <Col xs={12} md={6}>
              <StatCard label="合计" value={appealStats.total} icon={<InfoCircleOutlined />} color="#1677ff" />
            </Col>
          </Row>
          {filterBar}
          <Table rowKey="key" size="middle" columns={appealColumns} dataSource={appealFiltered} scroll={{ x: 1500 }} pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }} />
        </Space>
      )}

      <Drawer
        title="任务审核"
        open={basicOpen}
        onClose={() => setBasicOpen(false)}
        width={480}
        destroyOnClose
        footer={
          basicCurrent?.status === '待审核' ? (
            <Space style={{ float: 'right' }}>
              <Button onClick={() => setBasicOpen(false)}>取消</Button>
              <Button
                danger
                onClick={() => {
                  if (!basicCurrent) return;
                  setBasicList((prev) =>
                    prev.map((i) => (i.key === basicCurrent.key ? { ...i, status: '已退回' } : i)),
                  );
                  message.success('已退回');
                  setBasicOpen(false);
                }}
              >
                退回
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  if (!basicCurrent) return;
                  setBasicList((prev) =>
                    prev.map((i) => (i.key === basicCurrent.key ? { ...i, status: '已审核' } : i)),
                  );
                  message.success('审核通过');
                  setBasicOpen(false);
                }}
              >
                审核通过
              </Button>
            </Space>
          ) : null
        }
      >
        {basicCurrent && (
          <Space direction="vertical" size={12} style={{ display: 'flex' }}>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">任务名称：</Text>{basicCurrent.taskName}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">目标平台：</Text>{basicCurrent.platform}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">所属代表处：</Text>{basicCurrent.office || '-'}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">车型标签：</Text><Tag color="blue">{basicCurrent.carTag}</Tag></Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">用户昵称：</Text>{basicCurrent.nickname}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">提交时间：</Text>{basicCurrent.submitTime}</Paragraph>
            <Space>
              <Tag color="blue">T+1内容审核</Tag>
              <Tag color="purple">人工复核</Tag>
            </Space>
            <Title level={5} style={{ marginBottom: 0 }}>任务审核要求</Title>
            <div>审核关键词：{basicCurrent.keywords.map((k) => <Tag key={k} color="blue">{k}</Tag>)}</div>
            <div>文章字数不少于：{basicCurrent.minWords} 字</div>
            <Title level={5} style={{ marginBottom: 0 }}>AI审核结果</Title>
            <Space wrap>
              <span>敏感词 <Tag color="success">{basicCurrent.aiSensitive}</Tag></span>
              <span>文章字数 <Tag color="success">{basicCurrent.aiWords}</Tag></span>
              <span>必带关键词 <Tag color="success">{basicCurrent.aiKeywords}</Tag></span>
            </Space>
            <div>AI评分：<Text strong>{basicCurrent.aiScore}分</Text> 建议通过</div>
            <Title level={5} style={{ marginBottom: 0 }}>内容预览</Title>
            <div>笔记链接：<Link onClick={(e) => e.preventDefault()}>打开</Link></div>
            <Card size="small" style={{ background: '#fafafa' }}>{basicCurrent.contentBody}</Card>
          </Space>
        )}
      </Drawer>

      <Drawer
        title="采集异常处理"
        open={collectOpen}
        onClose={() => setCollectOpen(false)}
        width={480}
        destroyOnClose
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setCollectOpen(false)}>取消</Button>
            <Button
              type="primary"
              onClick={() => {
                if (!collectCurrent) return;
                setCollectList((prev) => prev.filter((i) => i.key !== collectCurrent.key));
                message.success('已确认打回重新上传');
                setCollectOpen(false);
              }}
            >
              确认打回重新上传
            </Button>
          </Space>
        }
      >
        {collectCurrent && (
          <Space direction="vertical" size={12} style={{ display: 'flex' }}>
            <Alert
              type="warning"
              showIcon
              message="请先核对笔记链接与异常原因。打回后用户将看到「重新上传」，系统会清空当前提交链接、提交时间与采集状态，用户需重新提交正确笔记链接。"
            />
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">任务ID：</Text>{collectCurrent.taskId}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">任务名称：</Text>{collectCurrent.taskName}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">目标平台：</Text>{collectCurrent.platform}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">KOC/用户昵称：</Text>{collectCurrent.nickname}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">内容标题：</Text>{collectCurrent.contentTitle}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text type="secondary">笔记链接：</Text>
              <Link href={collectCurrent.noteLink} onClick={(e) => e.preventDefault()}>{collectCurrent.noteLink}</Link>
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">提交时间：</Text>{collectCurrent.submitTime}</Paragraph>
            <Title level={5} style={{ marginBottom: 0 }}>异常判断</Title>
            <div>采集状态：<Text type="danger">采集异常</Text></div>
            <div>异常原因：{collectCurrent.reason}</div>
            <div>当前用户展示：<Tag color="processing">{collectCurrent.userStatus}</Tag></div>
            <Title level={5} style={{ marginBottom: 0 }}>处理动作</Title>
            <div>打回后用户状态将变为 <Tag color="orange">重新上传</Tag></div>
            <Text type="secondary">异常原因将写入审核备注，供用户查看。</Text>
          </Space>
        )}
      </Drawer>

      <Drawer
        title="效果积分审核"
        open={effectOpen}
        onClose={() => setEffectOpen(false)}
        width={480}
        destroyOnClose
        footer={
          effectCurrent?.status === '待审核' ? (
            <Space style={{ float: 'right' }}>
              <Button onClick={() => setEffectOpen(false)}>取消</Button>
              <Button
                danger
                onClick={async () => {
                  const values = await effectForm.validateFields(['rejectReason']);
                  if (!values.rejectReason?.trim()) {
                    message.warning('拒绝时请填写退回原因');
                    return;
                  }
                  if (!effectCurrent) return;
                  setEffectList((prev) =>
                    prev.map((i) => (i.key === effectCurrent.key ? { ...i, status: '已拒绝' } : i)),
                  );
                  message.success('已拒绝');
                  setEffectOpen(false);
                }}
              >
                拒绝
              </Button>
              <Button
                type="primary"
                onClick={async () => {
                  const values = await effectForm.validateFields(['effectPoints', 'pointsCode']);
                  if (!effectCurrent) return;
                  setEffectList((prev) =>
                    prev.map((i) =>
                      i.key === effectCurrent.key
                        ? {
                            ...i,
                            status: '审核通过',
                            effectPoints: values.effectPoints,
                            pointsCode: values.pointsCode,
                          }
                        : i,
                    ),
                  );
                  message.success('审核通过');
                  setEffectOpen(false);
                }}
              >
                审核通过
              </Button>
            </Space>
          ) : null
        }
      >
        {effectCurrent && (
          <Space direction="vertical" size={12} style={{ display: 'flex' }}>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">目标平台：</Text>{effectCurrent.platform}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">代表处：</Text>{effectCurrent.office || '-'}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">车型标签：</Text>{effectCurrent.model}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">用户昵称：</Text>{effectCurrent.koc}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text type="secondary">作品链接：</Text>
              <Link href={effectCurrent.workLink} onClick={(e) => e.preventDefault()}>{effectCurrent.workLink}</Link>
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">提交时间：</Text>{effectCurrent.submitTime}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">数据采集时间：</Text>{effectCurrent.collectTime}</Paragraph>
            <Space>
              <Tag color="blue">T+1效果审核</Tag>
              <Tag color="purple">人工复核</Tag>
              <Tag color={effectCurrent.status === '待审核' ? 'processing' : 'success'}>{effectCurrent.status}</Tag>
            </Space>
            <Title level={5} style={{ marginBottom: 0 }}>效果指标数据</Title>
            <Row gutter={[12, 12]}>
              <Col span={12}>点赞数：{effectCurrent.likes ?? '-'}</Col>
              <Col span={12}>收藏数：{effectCurrent.collects ?? '-'}</Col>
              <Col span={12}>评论数：{effectCurrent.comments ?? '-'}</Col>
              <Col span={12}>转发数：{effectCurrent.shares ?? '-'}</Col>
              <Col span={12}>有效客资：{effectCurrent.leads ?? '-'}</Col>
            </Row>
            <Form form={effectForm} layout="vertical" disabled={effectCurrent.status !== '待审核'}>
              <Form.Item
                label="效果积分"
                name="effectPoints"
                rules={[{ required: true, message: '请输入效果积分' }]}
                extra="可按系统计算值手动调整"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label="积分编码"
                name="pointsCode"
                rules={[{ required: true, message: '请输入积分编码' }]}
              >
                <Input placeholder="请输入积分编码" />
              </Form.Item>
              <Form.Item label="退回原因" name="rejectReason" extra="仅在点击「拒绝」时必填">
                <TextArea rows={3} maxLength={500} showCount placeholder="请输入退回原因" />
              </Form.Item>
            </Form>
          </Space>
        )}
      </Drawer>

      <Drawer
        title="申诉处理"
        open={appealOpen}
        onClose={() => setAppealOpen(false)}
        width={440}
        destroyOnClose
        footer={
          appealCurrent?.status === '待处理' ? (
            <Space style={{ float: 'right' }}>
              <Button onClick={() => setAppealOpen(false)}>取消</Button>
              <Button
                danger
                onClick={() => {
                  if (!appealCurrent) return;
                  setAppealList((prev) =>
                    prev.map((i) => (i.key === appealCurrent.key ? { ...i, status: '已拒绝' } : i)),
                  );
                  message.success('申诉已拒绝');
                  setAppealOpen(false);
                }}
              >
                拒绝
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  if (!appealCurrent) return;
                  setAppealList((prev) =>
                    prev.map((i) => (i.key === appealCurrent.key ? { ...i, status: '审核通过' } : i)),
                  );
                  message.success('申诉已通过');
                  setAppealOpen(false);
                }}
              >
                通过
              </Button>
            </Space>
          ) : null
        }
      >
        {appealCurrent && (
          <Space direction="vertical" size={10} style={{ display: 'flex' }}>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">任务：</Text>{appealCurrent.taskName}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">申诉类型：</Text>{appealCurrent.appealType}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">KOC：</Text>{appealCurrent.koc}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">申诉理由：</Text>{appealCurrent.reason}</Paragraph>
            <Paragraph style={{ marginBottom: 0 }}><Text type="secondary">申诉时间：</Text>{appealCurrent.appealTime}</Paragraph>
            <Tag color={appealCurrent.status === '待处理' ? 'warning' : appealCurrent.status === '审核通过' ? 'success' : 'error'}>
              {appealCurrent.status}
            </Tag>
          </Space>
        )}
      </Drawer>
    </Card>
  );
}
