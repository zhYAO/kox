import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
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
import { useMemo, useState, type Key } from 'react';
import {
  OPS_AUDIT_STATUS_OPTIONS,
  OPS_ISSUE_STATUS_OPTIONS,
  OPS_TYPE_OPTIONS,
  getOpsAuditItems,
  getOpsTasks,
  opsStatusColor,
  setOpsAuditItems,
  setOpsTasks,
  type OpsAuditItem,
  type OpsTask,
} from '@/mock/opsTask';

const { RangePicker } = DatePicker;
const { Text, Title, Paragraph } = Typography;

type TaskFilter = {
  name?: string;
  type?: string;
  issueTime?: [dayjs.Dayjs, dayjs.Dayjs];
  deadline?: [dayjs.Dayjs, dayjs.Dayjs];
  auditTime?: [dayjs.Dayjs, dayjs.Dayjs];
  issueStatus?: string;
  auditStatus?: string;
};

type ItemFilter = {
  staffName?: string;
  taskName?: string;
  keyword?: string;
  status?: string;
};

function inRange(value: string, range?: [dayjs.Dayjs, dayjs.Dayjs]) {
  if (!range?.[0] || !range?.[1] || value === '-') return true;
  const current = dayjs(value);
  return !current.isBefore(range[0].startOf('day')) && !current.isAfter(range[1].endOf('day'));
}

function itemStatusColor(status: OpsAuditItem['status']) {
  if (status === '已通过') return 'success';
  if (status === '已驳回') return 'error';
  return 'processing';
}

export default function OpsAuditPage() {
  const [tab, setTab] = useState('byTask');
  const [taskForm] = Form.useForm<TaskFilter>();
  const [itemForm] = Form.useForm<ItemFilter>();
  const [taskFilters, setTaskFilters] = useState<TaskFilter>({});
  const [itemFilters, setItemFilters] = useState<ItemFilter>({ status: '待审核' });
  const [tasks, setTasks] = useState<OpsTask[]>(() => [...getOpsTasks()]);
  const [items, setItems] = useState<OpsAuditItem[]>(() => [...getOpsAuditItems()]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  const syncItems = (next: OpsAuditItem[]) => {
    setOpsAuditItems(next);
    setItems(next);
  };

  const syncTasks = (next: OpsTask[]) => {
    setOpsTasks(next);
    setTasks(next);
  };

  const taskData = useMemo(() => {
    return tasks.filter((item) => {
      if (taskFilters.name && !item.name.includes(taskFilters.name.trim())) return false;
      if (taskFilters.type && item.type !== taskFilters.type) return false;
      if (taskFilters.issueStatus && item.status !== taskFilters.issueStatus) return false;
      if (taskFilters.auditStatus && item.auditStatus !== taskFilters.auditStatus) return false;
      if (!inRange(item.issueTime, taskFilters.issueTime)) return false;
      if (!inRange(item.deadline, taskFilters.deadline)) return false;
      return true;
    });
  }, [tasks, taskFilters]);

  const itemData = useMemo(() => {
    return items.filter((item) => {
      if (itemFilters.staffName && !item.staffName.includes(itemFilters.staffName.trim())) return false;
      if (itemFilters.taskName && !item.taskName.includes(itemFilters.taskName.trim())) return false;
      if (itemFilters.keyword) {
        const kw = itemFilters.keyword.trim();
        if (!item.title.includes(kw) && !item.content.includes(kw)) return false;
      }
      if (itemFilters.status && item.status !== itemFilters.status) return false;
      return true;
    });
  }, [items, itemFilters]);

  const approveItems = (keys: Key[], pass: boolean) => {
    const keySet = new Set(keys);
    const next = items.map((item) =>
      keySet.has(item.key)
        ? {
            ...item,
            status: (pass ? '已通过' : '已驳回') as OpsAuditItem['status'],
            opinion: pass ? '审核通过' : '内容需补充后重提',
          }
        : item,
    );
    syncItems(next);

    // 回写任务待审数
    const nextTasks = tasks.map((task) => {
      const related = next.filter((i) => i.taskKey === task.key);
      const pending = related.filter((i) => i.status === '待审核').length;
      const passed = related.filter((i) => i.status === '已通过').length;
      return {
        ...task,
        pendingAuditCount: pending,
        auditedCount: Math.max(task.auditedCount, passed),
        auditStatus: (pending === 0 ? '已审核' : passed > 0 ? '部分审核' : '待审核') as OpsTask['auditStatus'],
      };
    });
    syncTasks(nextTasks);
    setSelectedKeys((prev) => prev.filter((k) => !keySet.has(k)));
    message.success(pass ? '已通过（mock）' : '已驳回（mock）');
  };

  const taskColumns: ColumnsType<OpsTask> = [
    { title: '任务名称', dataIndex: 'name', fixed: 'left', width: 200, ellipsis: true },
    { title: '任务类型', dataIndex: 'type', width: 100 },
    { title: '素材类型', dataIndex: 'materialType', width: 110 },
    {
      title: '任务状态',
      dataIndex: 'status',
      width: 100,
      render: (status: OpsTask['status']) => <Tag color={opsStatusColor(status)}>{status}</Tag>,
    },
    { title: '派发人数', dataIndex: 'staffCount', width: 100 },
    { title: '成功发布数', dataIndex: 'publishedCount', width: 110 },
    { title: '完成编辑数', dataIndex: 'editedCount', width: 110 },
    { title: '已审核数', dataIndex: 'auditedCount', width: 100 },
    {
      title: '待审核数',
      dataIndex: 'pendingAuditCount',
      width: 100,
      render: (v: number) => <Text type={v > 0 ? 'danger' : undefined}>{v}</Text>,
    },
    { title: '下发时间', dataIndex: 'issueTime', width: 170 },
    { title: '截稿时间', dataIndex: 'deadline', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            setTab('pending');
            itemForm.setFieldsValue({ taskName: record.name, status: '待审核' });
            setItemFilters({ taskName: record.name, status: '待审核' });
          }}
        >
          查看待审
        </Button>
      ),
    },
  ];

  const itemColumns: ColumnsType<OpsAuditItem> = [
    { title: '员工姓名', dataIndex: 'staffName', width: 110, fixed: 'left' },
    { title: '所属任务', dataIndex: 'taskName', width: 180, ellipsis: true },
    { title: '用户分组', dataIndex: 'group', width: 110 },
    {
      title: '审核状态',
      dataIndex: 'status',
      width: 100,
      render: (status: OpsAuditItem['status']) => <Tag color={itemStatusColor(status)}>{status}</Tag>,
    },
    { title: '标题', dataIndex: 'title', width: 200, ellipsis: true },
    { title: '正文', dataIndex: 'content', width: 240, ellipsis: true },
    { title: '审核意见', dataIndex: 'opinion', width: 140, ellipsis: true },
    {
      title: '封面',
      dataIndex: 'cover',
      width: 100,
      render: (src: string) => <Image src={src} width={72} height={48} style={{ objectFit: 'cover', borderRadius: 4 }} />,
    },
    {
      title: '群图/视频',
      key: 'media',
      width: 110,
      render: (_, record) => (
        <Text>
          {record.mediaType} × {record.mediaCount}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            disabled={record.status !== '待审核'}
            onClick={() => approveItems([record.key], true)}
          >
            通过
          </Button>
          <Button
            type="link"
            size="small"
            danger
            disabled={record.status !== '待审核'}
            onClick={() => {
              Modal.confirm({
                title: '确认驳回？',
                content: record.title,
                okText: '驳回',
                okButtonProps: { danger: true },
                onOk: () => approveItems([record.key], false),
              });
            }}
          >
            驳回
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <div>
        <Title level={4} style={{ marginBottom: 4 }}>
          任务审核
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          审核待发布任务的执行情况和内容
        </Paragraph>
      </div>

      <Card>
        <Tabs
          activeKey={tab}
          onChange={(key) => {
            setTab(key);
            setSelectedKeys([]);
          }}
          items={[
            { key: 'byTask', label: '按任务查看' },
            { key: 'pending', label: '待审核总览' },
          ]}
        />

        {tab === 'byTask' ? (
          <>
            <Form
              form={taskForm}
              layout="inline"
              style={{ rowGap: 12, marginBottom: 16 }}
              initialValues={{ type: '', issueStatus: '', auditStatus: '' }}
              onFinish={(values) => setTaskFilters(values)}
            >
              <Form.Item name="name" label="任务名称">
                <Input allowClear placeholder="任务名称" style={{ width: 150 }} />
              </Form.Item>
              <Form.Item name="type" label="任务类型">
                <Select options={OPS_TYPE_OPTIONS} style={{ width: 120 }} />
              </Form.Item>
              <Form.Item name="issueTime" label="下发时间">
                <RangePicker />
              </Form.Item>
              <Form.Item name="deadline" label="截稿时间">
                <RangePicker />
              </Form.Item>
              <Form.Item name="auditTime" label="审核时间">
                <RangePicker />
              </Form.Item>
              <Form.Item name="issueStatus" label="下发状态">
                <Select options={OPS_ISSUE_STATUS_OPTIONS} style={{ width: 120 }} />
              </Form.Item>
              <Form.Item name="auditStatus" label="审核状态">
                <Select options={OPS_AUDIT_STATUS_OPTIONS} style={{ width: 120 }} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      taskForm.resetFields();
                      setTaskFilters({});
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => message.success(`已导出 ${taskData.length} 条（mock）`)}
                  >
                    导出
                  </Button>
                </Space>
              </Form.Item>
            </Form>
            <Table
              rowKey="key"
              columns={taskColumns}
              dataSource={taskData}
              scroll={{ x: 1500 }}
              pagination={{ showTotal: (total) => `共 ${total} 条` }}
            />
          </>
        ) : (
          <>
            <Form
              form={itemForm}
              layout="inline"
              style={{ rowGap: 12, marginBottom: 12 }}
              initialValues={{ status: '待审核' }}
              onFinish={(values) => setItemFilters(values)}
            >
              <Form.Item name="staffName">
                <Input allowClear placeholder="员工姓名" style={{ width: 140 }} />
              </Form.Item>
              <Form.Item name="taskName">
                <Input allowClear placeholder="任务名称" style={{ width: 160 }} />
              </Form.Item>
              <Form.Item name="keyword">
                <Input allowClear placeholder="标题关键词" style={{ width: 160 }} />
              </Form.Item>
              <Form.Item name="status">
                <Select
                  style={{ width: 120 }}
                  options={[
                    { label: '全部', value: '' },
                    { label: '待审核', value: '待审核' },
                    { label: '已通过', value: '已通过' },
                    { label: '已驳回', value: '已驳回' },
                  ]}
                />
              </Form.Item>
              <Form.Item>
                <Space wrap>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      itemForm.setFieldsValue({ staffName: undefined, taskName: undefined, keyword: undefined, status: '待审核' });
                      setItemFilters({ status: '待审核' });
                      setSelectedKeys([]);
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    disabled={!selectedKeys.length}
                    onClick={() => {
                      Modal.confirm({
                        title: `批量审核通过 ${selectedKeys.length} 条？`,
                        okText: '通过',
                        onOk: () => approveItems(selectedKeys, true),
                      });
                    }}
                  >
                    批量审核（{selectedKeys.length}）
                  </Button>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => message.success(`已导出 ${itemData.length} 条（mock）`)}
                  >
                    导出
                  </Button>
                </Space>
              </Form.Item>
            </Form>

            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              共 {itemData.length} 条
            </Text>

            <Table
              rowKey="key"
              columns={itemColumns}
              dataSource={itemData}
              scroll={{ x: 1600 }}
              rowSelection={{
                selectedRowKeys: selectedKeys,
                onChange: setSelectedKeys,
                getCheckboxProps: (record) => ({ disabled: record.status !== '待审核' }),
              }}
              pagination={{ showTotal: (total) => `共 ${total} 条` }}
            />
          </>
        )}
      </Card>
    </Space>
  );
}
