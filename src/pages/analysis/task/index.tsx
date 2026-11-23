import {
  DownloadOutlined,
  DownOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  UpOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Progress,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState, type Key } from 'react';
import AiAnalysisDrawer from '@/components/AiAnalysisDrawer';
import {
  BUDGET_OPTIONS,
  CATEGORY_OPTIONS,
  CONTENT_FORM_OPTIONS,
  MOCK_TASK_ANALYSIS,
  PLATFORM_OPTIONS,
  STATUS_OPTIONS,
  formatNumber,
  platformColor,
  statusColor,
  type TaskAnalysisRecord,
} from '@/mock/taskAnalysis';

const { RangePicker } = DatePicker;
const { Paragraph, Text } = Typography;

type FilterValues = {
  name?: string;
  category?: string;
  status?: string;
  platform?: string;
  model?: string;
  contentForm?: string;
  budgetStatus?: string;
  publishTime?: [dayjs.Dayjs, dayjs.Dayjs];
  startTime?: [dayjs.Dayjs, dayjs.Dayjs];
  endTime?: [dayjs.Dayjs, dayjs.Dayjs];
  statsDeadline?: [dayjs.Dayjs, dayjs.Dayjs];
  signupMin?: number | null;
  signupMax?: number | null;
  viralMin?: number | null;
  viralMax?: number | null;
  consultMin?: number | null;
  consultMax?: number | null;
};

function inRange(value: string, range?: [dayjs.Dayjs, dayjs.Dayjs]) {
  if (!range?.[0] || !range?.[1]) return true;
  const current = dayjs(value);
  return (
    !current.isBefore(range[0].startOf('day')) && !current.isAfter(range[1].endOf('day'))
  );
}

function tipTitle(text: string) {
  return (
    <Space size={4}>
      {text}
      <Tooltip title={`${text}说明（mock）`}>
        <InfoCircleOutlined />
      </Tooltip>
    </Space>
  );
}

export default function TaskAnalysisPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({});
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [aiOpen, setAiOpen] = useState(false);

  const dataSource = useMemo(() => {
    return MOCK_TASK_ANALYSIS.filter((item) => {
      if (filters.name && !item.name.includes(filters.name.trim())) return false;
      if (filters.model && !item.model.includes(filters.model.trim())) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.platform && !item.platforms.includes(filters.platform as never)) return false;
      if (filters.contentForm && item.contentForm !== filters.contentForm) return false;
      if (filters.budgetStatus && item.budgetStatus !== filters.budgetStatus) return false;
      if (!inRange(item.publishTime, filters.publishTime)) return false;
      if (!inRange(item.startTime, filters.startTime)) return false;
      if (!inRange(item.endTime, filters.endTime)) return false;
      if (!inRange(item.statsDeadline, filters.statsDeadline)) return false;
      if (filters.signupMin != null && item.signupProgress < filters.signupMin) return false;
      if (filters.signupMax != null && item.signupProgress > filters.signupMax) return false;
      if (filters.viralMin != null && item.viralRate < filters.viralMin) return false;
      if (filters.viralMax != null && item.viralRate > filters.viralMax) return false;
      if (filters.consultMin != null && item.consultRate < filters.consultMin) return false;
      if (filters.consultMax != null && item.consultRate > filters.consultMax) return false;
      return true;
    });
  }, [filters]);

  const selectedRows = useMemo(
    () => MOCK_TASK_ANALYSIS.filter((item) => selectedKeys.includes(item.key)),
    [selectedKeys],
  );

  const openAi = () => {
    if (!selectedKeys.length) {
      message.warning('请先勾选需要分析的任务');
      return;
    }
    setAiOpen(true);
  };

  const columns: ColumnsType<TaskAnalysisRecord> = [
    {
      title: '活动名称',
      dataIndex: 'name',
      fixed: 'left',
      width: 220,
      ellipsis: true,
    },
    { title: '车型', dataIndex: 'model', width: 110 },
    { title: '活动类型', dataIndex: 'category', width: 110 },
    {
      title: '活动状态',
      dataIndex: 'status',
      width: 100,
      render: (status: TaskAnalysisRecord['status']) => (
        <Badge status={statusColor(status) as 'success'} text={status} />
      ),
    },
    { title: '活动发布时间', dataIndex: 'publishTime', width: 170 },
    { title: '活动开始时间', dataIndex: 'startTime', width: 170 },
    { title: '活动结束时间', dataIndex: 'endTime', width: 170 },
    { title: '数据统计截止时间', dataIndex: 'statsDeadline', width: 170 },
    {
      title: '目标平台',
      dataIndex: 'platforms',
      width: 160,
      render: (platforms: TaskAnalysisRecord['platforms']) => (
        <Space size={[4, 4]} wrap>
          {platforms.map((p) => (
            <Tag key={p} color={platformColor(p)}>
              {p}
            </Tag>
          ))}
        </Space>
      ),
    },
    { title: '内容形式', dataIndex: 'contentForm', width: 110 },
    {
      title: '任务总发布量',
      dataIndex: 'totalPublish',
      width: 120,
      sorter: (a, b) => a.totalPublish - b.totalPublish,
    },
    {
      title: '报名进度',
      dataIndex: 'signupProgress',
      width: 140,
      sorter: (a, b) => a.signupProgress - b.signupProgress,
      render: (v: number) => <Progress percent={v} size="small" style={{ marginBottom: 0, width: 100 }} />,
    },
    {
      title: tipTitle('预估阅读量'),
      dataIndex: 'estimatedReads',
      width: 130,
      sorter: (a, b) => a.estimatedReads - b.estimatedReads,
      render: (v: number) => formatNumber(v),
    },
    {
      title: tipTitle('总评论数'),
      dataIndex: 'comments',
      width: 110,
      sorter: (a, b) => a.comments - b.comments,
      render: (v: number) => formatNumber(v),
    },
    {
      title: tipTitle('总收藏量'),
      dataIndex: 'collects',
      width: 110,
      sorter: (a, b) => a.collects - b.collects,
      render: (v: number) => formatNumber(v),
    },
    {
      title: tipTitle('总有效咨询数'),
      dataIndex: 'consults',
      width: 130,
      sorter: (a, b) => a.consults - b.consults,
    },
    {
      title: '有效咨询率',
      dataIndex: 'consultRate',
      width: 110,
      sorter: (a, b) => a.consultRate - b.consultRate,
      render: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      title: tipTitle('平均有效咨询数'),
      dataIndex: 'avgConsults',
      width: 140,
      sorter: (a, b) => a.avgConsults - b.avgConsults,
      render: (v: number) => v.toFixed(1),
    },
    {
      title: tipTitle('总互动数'),
      dataIndex: 'interactions',
      width: 110,
      sorter: (a, b) => a.interactions - b.interactions,
      render: (v: number) => formatNumber(v),
    },
    {
      title: tipTitle('平均互动数'),
      dataIndex: 'avgInteractions',
      width: 120,
      sorter: (a, b) => a.avgInteractions - b.avgInteractions,
    },
    {
      title: '爆文率',
      dataIndex: 'viralRate',
      width: 100,
      sorter: (a, b) => a.viralRate - b.viralRate,
      render: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      title: '预算状态',
      dataIndex: 'budgetStatus',
      width: 100,
      render: (v: string) => <Tag>{v}</Tag>,
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            category: '',
            status: '',
            platform: '',
            contentForm: '',
            budgetStatus: '',
          }}
          onFinish={(values) => setFilters(values)}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="name" label="活动名称">
                <Input allowClear placeholder="请输入活动名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="category" label="活动类别">
                <Select options={CATEGORY_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="status" label="活动状态">
                <Select options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="platform" label="目标平台">
                <Select options={PLATFORM_OPTIONS} />
              </Form.Item>
            </Col>

            {!collapsed && (
              <>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="model" label="车型">
                    <Input allowClear placeholder="请输入车型关键词" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="contentForm" label="内容形式">
                    <Select options={CONTENT_FORM_OPTIONS} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="budgetStatus" label="预算状态">
                    <Select options={BUDGET_OPTIONS} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="publishTime" label="活动发布时间">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="startTime" label="活动开始时间">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="endTime" label="活动结束时间">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="statsDeadline" label="数据统计截止时间">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item label="报名进度(%)">
                    <Space.Compact style={{ width: '100%' }}>
                      <Form.Item name="signupMin" noStyle>
                        <InputNumber min={0} max={100} placeholder="最小" style={{ width: '50%' }} />
                      </Form.Item>
                      <Form.Item name="signupMax" noStyle>
                        <InputNumber min={0} max={100} placeholder="最大" style={{ width: '50%' }} />
                      </Form.Item>
                    </Space.Compact>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item label="爆文率(%)">
                    <Space.Compact style={{ width: '100%' }}>
                      <Form.Item name="viralMin" noStyle>
                        <InputNumber min={0} max={100} placeholder="最小" style={{ width: '50%' }} />
                      </Form.Item>
                      <Form.Item name="viralMax" noStyle>
                        <InputNumber min={0} max={100} placeholder="最大" style={{ width: '50%' }} />
                      </Form.Item>
                    </Space.Compact>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item label="有效咨询率(%)">
                    <Space.Compact style={{ width: '100%' }}>
                      <Form.Item name="consultMin" noStyle>
                        <InputNumber min={0} max={100} placeholder="最小" style={{ width: '50%' }} />
                      </Form.Item>
                      <Form.Item name="consultMax" noStyle>
                        <InputNumber min={0} max={100} placeholder="最大" style={{ width: '50%' }} />
                      </Form.Item>
                    </Space.Compact>
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>

          <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
            <Button type="link" onClick={() => setCollapsed((v) => !v)} style={{ paddingLeft: 0 }}>
              {collapsed ? (
                <>
                  展开 <DownOutlined />
                </>
              ) : (
                <>
                  收起 <UpOutlined />
                </>
              )}
            </Button>
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
              <Button
                icon={<DownloadOutlined />}
                onClick={() => message.success(`已导出 ${dataSource.length} 条（mock）`)}
              >
                下载表格
              </Button>
              <Button type="primary" icon={<ThunderboltOutlined />} onClick={openAi}>
                AI 智能分析
              </Button>
            </Space>
          </Space>
        </Form>
      </Card>

      <Card>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 2800 }}
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
          }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            defaultPageSize: 10,
          }}
        />
      </Card>

      <AiAnalysisDrawer
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        summaryTitle={`任务效果分析总结 ${selectedRows.length}个任务`}
        steps={[
          '正在读取任务数据...',
          '正在分析报名、爆文与咨询表现...',
          '正在识别高效果任务特征...',
          '正在总结投放与运营建议...',
        ]}
        summary={
          <>
            <Paragraph>
              已选 {selectedRows.length} 个任务，平均爆文率{' '}
              {(
                selectedRows.reduce((s, i) => s + i.viralRate, 0) / Math.max(selectedRows.length, 1)
              ).toFixed(1)}
              %，平均有效咨询率{' '}
              {(
                selectedRows.reduce((s, i) => s + i.consultRate, 0) / Math.max(selectedRows.length, 1)
              ).toFixed(1)}
              %。
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text strong>建议：</Text>
              优先放大高咨询率任务的内容结构，对预算紧张但仍有爆文潜力的任务考虑追加投流。
            </Paragraph>
          </>
        }
        selectedRows={selectedRows}
        rowKey="key"
        selectedColumns={[
          { title: '活动', dataIndex: 'name', ellipsis: true },
          { title: '状态', dataIndex: 'status', width: 80 },
          {
            title: '爆文率',
            dataIndex: 'viralRate',
            width: 80,
            render: (v: number) => `${v.toFixed(1)}%`,
          },
          {
            title: '咨询率',
            dataIndex: 'consultRate',
            width: 80,
            render: (v: number) => `${v.toFixed(1)}%`,
          },
        ]}
        downloadText={`下载已选任务数据（${selectedRows.length}个）`}
        onDownload={() => message.success(`已下载已选 ${selectedRows.length} 个任务（mock）`)}
      />
    </Space>
  );
}
