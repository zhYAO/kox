import {
  Button,
  Card,
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
import { history } from '@umijs/max';
import { useMemo, useState } from 'react';
import SeedCodeDrawer, {
  showQrShareModal,
  showSeedLinkModal,
  type SeedCodeFormValues,
} from '@/components/SeedCodeDrawer';
import {
  CODE_TYPE_OPTIONS,
  STATUS_OPTIONS,
  TASK_TYPE_OPTIONS,
  getSeedCodes,
  platformColor,
  setSeedCodes,
  type SeedCodeRecord,
} from '@/mock/seedCode';

const { Title } = Typography;

type FilterValues = {
  taskName?: string;
  taskType?: string;
  codeType?: string;
  status?: string;
};

export default function SeedCodePage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({});
  const [records, setRecords] = useState<SeedCodeRecord[]>(() => [...getSeedCodes()]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<SeedCodeRecord | null>(null);

  const updateRecords = (next: SeedCodeRecord[] | ((prev: SeedCodeRecord[]) => SeedCodeRecord[])) => {
    setRecords((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      setSeedCodes(resolved);
      return resolved;
    });
  };

  const dataSource = useMemo(() => {
    return records.filter((item) => {
      if (filters.taskName && !item.taskName.includes(filters.taskName.trim())) return false;
      if (filters.taskType && item.taskType !== filters.taskType) return false;
      if (filters.codeType && item.codeType !== filters.codeType) return false;
      if (filters.status && item.status !== filters.status) return false;
      return true;
    });
  }, [records, filters]);

  const handleSave = (values: SeedCodeFormValues) => {
    if (editing) {
      updateRecords((prev) =>
        prev.map((item) =>
          item.key === editing.key
            ? {
                ...item,
                ...values,
                generated: values.presetCount,
              }
            : item,
        ),
      );
      return;
    }
    const id = Math.floor(1200 + Math.random() * 800);
    const now = formatNow();
    const next: SeedCodeRecord = {
      key: `s_${Date.now()}`,
      id,
      createTime: now,
      taskName: values.taskName,
      taskType: values.taskType,
      codeType: values.codeType,
      platforms: values.platforms,
      topic: values.topic,
      status: '进行中',
      generated: values.presetCount,
      assigned: 0,
      title: values.title,
      content: values.content,
      shareTarget: values.shareTarget,
      imageCount: values.imageCount,
      contentStyle: values.contentStyle,
      presetCount: values.presetCount,
      link: `https://www.xiaohongshu.com/explore/seed-demo-${id}`,
    };
    updateRecords((prev) => [next, ...prev]);
  };

  const columns: ColumnsType<SeedCodeRecord> = [
    { title: '创建时间', dataIndex: 'createTime', width: 170 },
    { title: '任务名称', dataIndex: 'taskName', width: 160, ellipsis: true },
    { title: '任务类型', dataIndex: 'taskType', width: 110 },
    { title: '码类型', dataIndex: 'codeType', width: 100 },
    {
      title: '平台',
      dataIndex: 'platforms',
      width: 180,
      render: (platforms: SeedCodeRecord['platforms']) => (
        <Space size={[4, 4]} wrap>
          {platforms.map((p) => (
            <Tag key={p} color={platformColor(p)}>
              {p}
            </Tag>
          ))}
        </Space>
      ),
    },
    { title: '话题', dataIndex: 'topic', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: SeedCodeRecord['status']) => {
        const color = status === '已完成' ? 'success' : status === '进行中' ? 'processing' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '已生成/已分配',
      key: 'ratio',
      width: 120,
      render: (_, record) => `${record.generated} / ${record.assigned}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 340,
      fixed: 'right',
      render: (_, record) => (
        <Space wrap size={0}>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setEditing(record);
              setDrawerOpen(true);
            }}
          >
            编辑
          </Button>
          <Button type="link" size="small" onClick={() => showSeedLinkModal(record.link)}>
            种草链接
          </Button>
          <Button type="link" size="small" onClick={() => showQrShareModal(record)}>
            二维码分享
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => history.push(`/content/seed-code/preview/${record.key}`)}
          >
            文章预览
          </Button>
          {record.status !== '已停止' ? (
            <Button
              type="link"
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: '确认停止该种草码？',
                  content: record.taskName,
                  okText: '停止',
                  cancelText: '取消',
                    onOk: () => {
                    updateRecords((prev) =>
                      prev.map((item) =>
                        item.key === record.key ? { ...item, status: '已停止' } : item,
                      ),
                    );
                    message.success('已停止（mock）');
                  },
                });
              }}
            >
              停止
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              onClick={() => {
                updateRecords((prev) =>
                  prev.map((item) =>
                    item.key === record.key ? { ...item, status: '进行中' } : item,
                  ),
                );
                message.success('已重新启用（mock）');
              }}
            >
              启用
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Title level={4} style={{ margin: 0 }}>
        种草码管理
      </Title>

      <Card>
        <Form
          form={form}
          layout="inline"
          style={{ rowGap: 12 }}
          onFinish={(values) => setFilters(values)}
        >
          <Form.Item name="taskName" label="任务名称">
            <Input allowClear placeholder="任务名称" style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="taskType" label="任务类型" initialValue="">
            <Select options={TASK_TYPE_OPTIONS} style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="codeType" label="码类型" initialValue="">
            <Select options={CODE_TYPE_OPTIONS} style={{ width: 130 }} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="">
            <Select options={STATUS_OPTIONS} style={{ width: 120 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setEditing(null);
                  setDrawerOpen(true);
                }}
              >
                新建种草码
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
          scroll={{ x: 1280 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
            defaultPageSize: 10,
          }}
        />
      </Card>

      <SeedCodeDrawer
        open={drawerOpen}
        record={editing}
        onClose={() => {
          setDrawerOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
      />
    </Space>
  );
}

function formatNow() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
