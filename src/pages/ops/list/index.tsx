import {
  CheckCircleOutlined,
  CloudUploadOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { history } from '@umijs/max';
import { useMemo, useState, type ReactNode } from 'react';
import {
  OPS_MATERIAL_OPTIONS,
  OPS_STATUS_OPTIONS,
  OPS_TYPE_OPTIONS,
  calcOpsStats,
  getOpsTasks,
  opsStatusColor,
  setOpsTasks,
  type OpsTask,
} from '@/mock/opsTask';
import './index.css';

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

type FilterValues = {
  type?: string;
  materialType?: string;
  status?: string;
  issueTime?: [dayjs.Dayjs, dayjs.Dayjs];
  deadline?: [dayjs.Dayjs, dayjs.Dayjs];
  name?: string;
};

function inRange(value: string, range?: [dayjs.Dayjs, dayjs.Dayjs]) {
  if (!range?.[0] || !range?.[1] || value === '-') return true;
  const current = dayjs(value);
  return !current.isBefore(range[0].startOf('day')) && !current.isAfter(range[1].endOf('day'));
}

export default function OpsTaskListPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({});
  const [tasks, setTasks] = useState<OpsTask[]>(() => [...getOpsTasks()]);

  const sync = (next: OpsTask[]) => {
    setOpsTasks(next);
    setTasks(next);
  };

  const stats = useMemo(() => calcOpsStats(tasks), [tasks]);

  const dataSource = useMemo(() => {
    return tasks.filter((item) => {
      if (filters.type && item.type !== filters.type) return false;
      if (filters.materialType && item.materialType !== filters.materialType) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.name && !item.name.includes(filters.name.trim())) return false;
      if (!inRange(item.issueTime, filters.issueTime)) return false;
      if (!inRange(item.deadline, filters.deadline)) return false;
      return true;
    });
  }, [tasks, filters]);

  const columns: ColumnsType<OpsTask> = [
    { title: '任务名称', dataIndex: 'name', fixed: 'left', width: 200, ellipsis: true },
    {
      title: '平台',
      dataIndex: 'platform',
      width: 100,
      render: (v: string) => <Tag color="blue">{v}</Tag>,
    },
    { title: '任务说明', dataIndex: 'description', width: 220, ellipsis: true },
    { title: '下发员工数', dataIndex: 'staffCount', width: 110 },
    { title: '完成编辑数', dataIndex: 'editedCount', width: 110 },
    { title: '成功发布数', dataIndex: 'publishedCount', width: 110 },
    { title: '下发时间', dataIndex: 'issueTime', width: 170 },
    { title: '计划下发时间', dataIndex: 'planIssueTime', width: 170 },
    { title: '截稿时间', dataIndex: 'deadline', width: 170 },
    {
      title: '任务状态',
      dataIndex: 'status',
      width: 100,
      render: (status: OpsTask['status']) => <Tag color={opsStatusColor(status)}>{status}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => history.push(`/ops/create?id=${record.key}`)}>
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              Modal.info({
                title: record.name,
                width: 520,
                content: (
                  <Space direction="vertical">
                    <Text>类型：{record.type}</Text>
                    <Text>素材：{record.materialType}</Text>
                    <Text>产品：{record.productName}</Text>
                    <Text>说明：{record.description}</Text>
                    <Text>
                      进度：编辑 {record.editedCount}/{record.staffCount}，发布 {record.publishedCount}
                    </Text>
                  </Space>
                ),
              });
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                title: '确认删除该任务？',
                content: record.name,
                okText: '删除',
                okButtonProps: { danger: true },
                onOk: () => {
                  sync(tasks.filter((item) => item.key !== record.key));
                  message.success('已删除（mock）');
                },
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <div className="ops-page-head">
        <Title level={4} style={{ margin: 0 }}>
          运营任务管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => history.push('/ops/create')}>
          创建任务
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <StatCard label="总任务数" value={stats.total} icon={<FileTextOutlined />} tone="blue" />
        <StatCard label="待下发" value={stats.pendingIssue} icon={<SendOutlined />} tone="cyan" />
        <StatCard label="待发布" value={stats.pendingPublish} icon={<CloudUploadOutlined />} tone="orange" />
        <StatCard label="发布中" value={stats.publishing} icon={<PlayCircleOutlined />} tone="purple" />
        <StatCard label="已完成" value={stats.completed} icon={<CheckCircleOutlined />} tone="green" />
      </div>

      <Card>
        <Form
          form={form}
          layout="inline"
          style={{ rowGap: 12 }}
          initialValues={{ type: '', materialType: '', status: '' }}
          onFinish={(values) => setFilters(values)}
        >
          <Form.Item name="type" label="任务类型">
            <Select options={OPS_TYPE_OPTIONS} style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="materialType" label="内容类型">
            <Select options={OPS_MATERIAL_OPTIONS} style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="status" label="任务状态">
            <Select options={OPS_STATUS_OPTIONS} style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="issueTime" label="下发时间">
            <RangePicker />
          </Form.Item>
          <Form.Item name="deadline" label="截稿时间">
            <RangePicker />
          </Form.Item>
          <Form.Item name="name">
            <Input allowClear placeholder="搜索任务名称" style={{ width: 180 }} />
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
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            defaultPageSize: 10,
          }}
        />
      </Card>
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
  value: number;
  icon: ReactNode;
  tone: string;
}) {
  return (
    <Card className={`ops-stat-card tone-${tone}`} styles={{ body: { padding: 16 } }}>
      <div className="ops-stat-inner">
        <div>
          <Text type="secondary">{label}</Text>
          <div className="ops-stat-value">{value}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            较上月 —
          </Text>
        </div>
        <div className="ops-stat-icon">{icon}</div>
      </div>
    </Card>
  );
}
