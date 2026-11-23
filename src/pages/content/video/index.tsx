import {
  AppstoreOutlined,
  CheckCircleFilled,
  EllipsisOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Input,
  Modal,
  Progress,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { history } from '@umijs/max';
import { useMemo, useState } from 'react';
import {
  STATUS_FILTER_OPTIONS,
  countByStatus,
  getVideoTasks,
  setVideoTasks,
  statusColor,
  type VideoTask,
  type VideoTaskStatus,
} from '@/mock/videoStudio';
import './index.css';

const { Text, Title } = Typography;

type TabKey = '全部' | VideoTaskStatus;
type ViewMode = 'grid' | 'list';

export default function VideoStudioPage() {
  const [tasks, setTasks] = useState<VideoTask[]>(() => [...getVideoTasks()]);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tab, setTab] = useState<TabKey>('全部');
  const [view, setView] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);

  const counts = useMemo(() => countByStatus(tasks), [tasks]);

  const dataSource = useMemo(() => {
    return tasks.filter((item) => {
      if (tab !== '全部' && item.status !== tab) return false;
      if (statusFilter && item.status !== statusFilter) return false;
      if (keyword.trim() && !item.name.toLowerCase().includes(keyword.trim().toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [tasks, tab, statusFilter, keyword]);

  const sync = (next: VideoTask[]) => {
    setVideoTasks(next);
    setTasks(next);
  };

  const openTask = (task: VideoTask) => {
    history.push(`/content/video/task/${task.key}`);
  };

  const menuFor = (task: VideoTask): MenuProps['items'] => [
    {
      key: 'open',
      label: '进入工作台',
      onClick: () => openTask(task),
    },
    {
      key: 'archive',
      label: '归档',
      disabled: task.status === '已归档',
      onClick: () => {
        sync(tasks.map((item) => (item.key === task.key ? { ...item, status: '已归档' } : item)));
        message.success('已归档（mock）');
      },
    },
    {
      key: 'delete',
      label: '删除',
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: '确认删除该任务？',
          content: task.name,
          okText: '删除',
          okButtonProps: { danger: true },
          cancelText: '取消',
          onOk: () => {
            sync(tasks.filter((item) => item.key !== task.key));
            message.success('已删除（mock）');
          },
        });
      },
    },
  ];

  const columns: ColumnsType<VideoTask> = [
    {
      title: '任务名称',
      dataIndex: 'name',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description || '暂无描述'}
          </Text>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      render: (status: VideoTaskStatus) => <Tag color={statusColor(status)}>{status}</Tag>,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      width: 200,
      render: (progress: number) => (
        <Space>
          <Progress
            percent={progress}
            size="small"
            strokeColor="#722ed1"
            style={{ width: 120, marginBottom: 0 }}
            format={() =>
              progress >= 100 ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : `${progress}%`
            }
          />
        </Space>
      ),
    },
    {
      title: '素材',
      dataIndex: 'materialCount',
      width: 90,
      render: (count: number) => (
        <Space size={4}>
          <VideoCameraOutlined />
          <Text>{count}</Text>
        </Space>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateLabel',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<PlayCircleOutlined />}
            onClick={() => openTask(record)}
          />
          <Dropdown menu={{ items: menuFor(record) }} trigger={['click']}>
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const tabs: Array<{ key: TabKey; label: string; count: number }> = [
    { key: '全部', label: '全部', count: counts.all },
    { key: '草稿', label: '草稿', count: counts.草稿 },
    { key: '处理中', label: '处理中', count: counts.处理中 },
    { key: '已完成', label: '已完成', count: counts.已完成 },
    { key: '已归档', label: '已归档', count: counts.已归档 },
  ];

  return (
    <div className="video-studio">
      <div className="video-toolbar">
        <Space wrap>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="搜索任务..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            style={{ width: 220 }}
          />
          <Select
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
            options={STATUS_FILTER_OPTIONS}
            style={{ width: 140 }}
          />
        </Space>
        <Space>
          <Button.Group>
            <Button
              type={view === 'grid' ? 'primary' : 'default'}
              icon={<AppstoreOutlined />}
              onClick={() => setView('grid')}
            />
            <Button
              type={view === 'list' ? 'primary' : 'default'}
              icon={<UnorderedListOutlined />}
              onClick={() => setView('list')}
            />
          </Button.Group>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => history.push('/content/video/create')}>
            新建任务
          </Button>
        </Space>
      </div>

      <div className="video-tabs">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            className={tab === item.key ? 'is-active' : ''}
            onClick={() => {
              setTab(item.key);
              setPage(1);
            }}
          >
            {item.label} {item.count}
          </button>
        ))}
      </div>

      {view === 'grid' ? (
        <div className="video-grid">
          <div className="video-create-card" onClick={() => history.push('/content/video/create')}>
            <PlusOutlined style={{ fontSize: 28, color: '#1677ff' }} />
            <Text style={{ color: '#1677ff', marginTop: 8 }}>创建新任务</Text>
          </div>
          {dataSource.map((task) => (
            <Card
              key={task.key}
              className="video-task-card"
              hoverable
              onClick={() => openTask(task)}
              styles={{ body: { padding: 16 } }}
            >
              <div className="video-card-top">
                <Tag color={statusColor(task.status)}>{task.status}</Tag>
                <Dropdown menu={{ items: menuFor(task) }} trigger={['click']}>
                  <Button
                    type="text"
                    size="small"
                    icon={<EllipsisOutlined />}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              </div>
              <Title level={5} style={{ margin: '8px 0 4px' }} ellipsis>
                {task.name}
              </Title>
              <Text type="secondary" ellipsis>
                {task.description || '暂无描述'}
              </Text>
              <div style={{ marginTop: 16 }}>
                <Progress
                  percent={task.progress}
                  strokeColor="#722ed1"
                  format={() =>
                    task.progress >= 100 ? (
                      <CheckCircleFilled style={{ color: '#52c41a' }} />
                    ) : (
                      `${task.progress}%`
                    )
                  }
                />
              </div>
              <div className="video-card-foot">
                <Space size={4}>
                  <VideoCameraOutlined />
                  <Text type="secondary">{task.materialCount}</Text>
                </Space>
                <Text type="secondary">{task.updateTime}</Text>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table
            rowKey="key"
            columns={columns}
            dataSource={dataSource}
            pagination={{
              current: page,
              onChange: setPage,
              pageSize: 10,
              showSizeChanger: false,
            }}
          />
        </Card>
      )}
    </div>
  );
}
