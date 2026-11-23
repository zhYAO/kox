import {
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
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
import { history } from 'umi';
import {
  TASK_BUDGET_STATUS_OPTIONS,
  TASK_CATEGORY_OPTIONS,
  TASK_CONTENT_FORM_OPTIONS,
  TASK_PLATFORM_OPTIONS,
  TASK_STATUS_OPTIONS,
  getTaskCenterList,
  removeTask,
  statusColor,
  summarizeTasks,
  upsertTask,
  type TaskCenterRecord,
} from '@/mock/taskCenter';
import './index.css';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

type FilterValues = {
  keyword?: string;
  category?: string;
  status?: string;
  platform?: string;
  contentForm?: string;
  budgetStatus?: string;
  publishTime?: [dayjs.Dayjs, dayjs.Dayjs];
  signupMin?: number;
  signupMax?: number;
};

function inRange(value: string, range?: [dayjs.Dayjs, dayjs.Dayjs]) {
  if (!range?.[0] || !range?.[1] || !value) return true;
  const current = dayjs(value);
  return (
    !current.isBefore(range[0].startOf('day')) && !current.isAfter(range[1].endOf('day'))
  );
}

export default function TaskListPage() {
  const [filterForm] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({
    category: '',
    status: '',
    platform: '',
    contentForm: '',
    budgetStatus: '',
  });
  const [tick, setTick] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTask, setPreviewTask] = useState<TaskCenterRecord | null>(null);

  const list = useMemo(() => getTaskCenterList(), [tick]);

  const dataSource = useMemo(() => {
    return list.filter((item) => {
      if (filters.keyword) {
        const kw = filters.keyword.trim();
        if (!item.name.includes(kw) && !item.taskId.includes(kw)) return false;
      }
      if (filters.category && item.category !== filters.category) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.platform && !item.platforms.includes(filters.platform)) return false;
      if (filters.contentForm && !item.contentForms.includes(filters.contentForm)) {
        return false;
      }
      if (filters.budgetStatus && item.budgetStatus !== filters.budgetStatus) return false;
      if (!inRange(item.publishTime, filters.publishTime)) return false;
      if (filters.signupMin != null && item.signupProgress < filters.signupMin) return false;
      if (filters.signupMax != null && item.signupProgress > filters.signupMax) return false;
      return true;
    });
  }, [list, filters]);

  const summary = useMemo(() => summarizeTasks(list), [list]);

  const refresh = () => setTick((t) => t + 1);

  const openForm = (mode: 'create' | 'edit' | 'detail', id?: string) => {
    const qs = new URLSearchParams({ mode });
    if (id) qs.set('id', id);
    history.push(`/task/form?${qs.toString()}`);
  };

  const onClone = (row: TaskCenterRecord) => {
    const cloned = {
      ...row,
      key: `${Date.now()}`,
      taskId: `15${Date.now().toString().slice(-10)}`,
      name: `${row.name}_副本`,
      status: '待开始' as const,
      publishTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      signupCount: 0,
      submittedCount: 0,
      firstPassCount: 0,
      signupProgress: 0,
    };
    upsertTask(cloned);
    refresh();
    message.success('已克隆任务');
    openForm('edit', cloned.key);
  };

  const onDelete = (key: string) => {
    removeTask(key);
    refresh();
    message.success('已删除');
  };

  const onPause = (row: TaskCenterRecord) => {
    upsertTask({ ...row, status: row.status === '已暂停' ? '进行中' : '已暂停' });
    refresh();
    message.success(row.status === '已暂停' ? '已恢复' : '已暂停');
  };

  const columns: ColumnsType<TaskCenterRecord> = [
    { title: '任务ID', dataIndex: 'taskId', width: 140, fixed: 'left' },
    {
      title: '活动名称',
      dataIndex: 'name',
      width: 220,
      ellipsis: true,
      fixed: 'left',
    },
    { title: '活动类别', dataIndex: 'category', width: 110 },
    {
      title: '活动状态',
      dataIndex: 'status',
      width: 100,
      render: (v: TaskCenterRecord['status']) => <Tag color={statusColor(v)}>{v}</Tag>,
    },
    {
      title: '目标平台',
      dataIndex: 'platforms',
      width: 140,
      render: (v: string[]) => v.join('、'),
    },
    {
      title: '内容形式',
      dataIndex: 'contentForms',
      width: 110,
      render: (v: string[]) => v.join(', '),
    },
    { title: '人群包数量', dataIndex: 'audienceCount', width: 110 },
    { title: '参与人数', dataIndex: 'participantLimit', width: 100 },
    { title: '报名人数', dataIndex: 'signupCount', width: 100 },
    { title: '已提交数', dataIndex: 'submittedCount', width: 100 },
    { title: '初审通过数', dataIndex: 'firstPassCount', width: 110 },
    {
      title: '操作',
      key: 'action',
      width: 320,
      fixed: 'right',
      render: (_, row) => (
        <Space size={0} wrap>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setPreviewTask(row);
              setPreviewOpen(true);
            }}
          >
            预览
          </Button>
          <Button type="link" size="small" onClick={() => openForm('detail', row.key)}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => openForm('edit', row.key)}>
            编辑
          </Button>
          <Button type="link" size="small" onClick={() => onClone(row)}>
            克隆
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => message.success('已触发下发（演示）')}
          >
            下发
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => history.push('/task/audit')}
          >
            审核
          </Button>
          <Button type="link" size="small" onClick={() => onPause(row)}>
            {row.status === '已暂停' ? '恢复' : '暂停'}
          </Button>
          <Popconfirm title="确认删除该任务？" onConfirm={() => onDelete(row.key)}>
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="task-list-page">
      <div className="task-list-header">
        <div>
          <Title level={4} style={{ marginBottom: 0 }}>
            任务列表
          </Title>
          <Text type="secondary">任务中心 CRUD：列表 / 新建 / 编辑 / 详情共用同一套表单</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm('create')}>
          创建任务
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        {[
          { label: '全部任务', value: summary.total, sub: null },
          { label: '待开始', value: summary.pending, sub: `${summary.pendingPct}%` },
          { label: '进行中', value: summary.running, sub: `${summary.runningPct}%` },
          { label: '已结束', value: summary.ended, sub: `${summary.endedPct}%` },
        ].map((item) => (
          <Col xs={12} md={6} key={item.label}>
            <Card size="small" className="task-stat-card">
              <Text type="secondary">{item.label}</Text>
              <div className="task-stat-value">{item.value}</div>
              {item.sub && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  占比 {item.sub}
                </Text>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Form
          form={filterForm}
          layout="inline"
          initialValues={filters}
          onFinish={(v) => setFilters(v)}
          style={{ rowGap: 12 }}
        >
          <Form.Item name="keyword">
            <Input
              allowClear
              placeholder="搜索活动名称"
              prefix={<SearchOutlined />}
              style={{ width: 180 }}
            />
          </Form.Item>
          <Form.Item name="category">
            <Select options={TASK_CATEGORY_OPTIONS} style={{ width: 130 }} />
          </Form.Item>
          <Form.Item name="status">
            <Select options={TASK_STATUS_OPTIONS} style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="platform">
            <Select options={TASK_PLATFORM_OPTIONS} style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="contentForm">
            <Select options={TASK_CONTENT_FORM_OPTIONS} style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="budgetStatus">
            <Select options={TASK_BUDGET_STATUS_OPTIONS} style={{ width: 110 }} />
          </Form.Item>
          <Form.Item name="publishTime">
            <RangePicker placeholder={['发布时间开始', '发布时间结束']} />
          </Form.Item>
          <Form.Item label="报名进度%">
            <Space>
              <Form.Item name="signupMin" noStyle>
                <InputNumber placeholder="最小" min={0} max={100} style={{ width: 80 }} />
              </Form.Item>
              <Form.Item name="signupMax" noStyle>
                <InputNumber placeholder="最大" min={0} max={100} style={{ width: 80 }} />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                onClick={() => {
                  filterForm.resetFields();
                  setFilters({
                    category: '',
                    status: '',
                    platform: '',
                    contentForm: '',
                    budgetStatus: '',
                  });
                }}
              >
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1600 }}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        />
      </Card>

      <Modal
        className="task-preview-modal"
        title={
          previewTask
            ? `任务配置预览：${previewTask.name}`
            : '任务配置预览'
        }
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        width={420}
        footer={null}
        destroyOnClose
      >
        <Paragraph type="secondary" style={{ marginTop: -8 }}>
          根据任务配置生成，可导出长图
        </Paragraph>
        <div style={{ textAlign: 'right', marginBottom: 12 }}>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => message.success('已导出长图（演示）')}
          >
            导出长图
          </Button>
        </div>
        {previewTask && (
          <div className="task-preview-phone">
            <div className="task-preview-nav">
              <span>‹</span>
              <span>活动详情</span>
              <span>···</span>
            </div>
            <div
              className="task-preview-cover"
              style={{ background: previewTask.coverColor }}
            >
              {previewTask.productName}
            </div>
            <div className="task-preview-body">
              <div className="task-preview-title">{previewTask.name}</div>
              <div className="task-preview-section">
                <div className="task-preview-section-title">【活动描述】</div>
                <div>{previewTask.description}</div>
              </div>
              <div className="task-preview-section">
                <div className="task-preview-section-title">【活动时间】</div>
                <div className="task-preview-time">
                  {previewTask.startTime} 至 {previewTask.endTime}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
