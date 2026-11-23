import { CheckCircleOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
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
import {
  MOCK_SYSTEM_NOTIFIES,
  NOTIFY_STATUS_OPTIONS,
  NOTIFY_TYPE_OPTIONS,
  notifyTypeColor,
  type NotifyReadStatus,
  type NotifyType,
  type SystemNotify,
} from '@/mock/systemNotify';

const { RangePicker } = DatePicker;
const { Link, Paragraph, Text, Title } = Typography;

type FilterValues = {
  type?: string;
  status?: string;
  createdAt?: [dayjs.Dayjs, dayjs.Dayjs];
};

export default function SystemNotifyPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({});
  const [list, setList] = useState<SystemNotify[]>(() => [...MOCK_SYSTEM_NOTIFIES]);
  const [current, setCurrent] = useState<SystemNotify | null>(null);
  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dataSource = useMemo(() => {
    return list.filter((item) => {
      if (filters.type && item.type !== filters.type) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.createdAt?.[0] && filters.createdAt?.[1]) {
        const t = dayjs(item.createdAt);
        if (
          t.isBefore(filters.createdAt[0].startOf('day')) ||
          t.isAfter(filters.createdAt[1].endOf('day'))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [list, filters]);

  const unreadCount = list.filter((i) => i.status === '未读').length;

  const openDetail = (row: SystemNotify) => {
    setCurrent(row);
    setOpen(true);
    if (row.status === '未读') {
      setList((prev) =>
        prev.map((item) => (item.key === row.key ? { ...item, status: '已读' } : item)),
      );
      setCurrent((prev) => (prev ? { ...prev, status: '已读' } : prev));
    }
  };

  const columns: ColumnsType<SystemNotify> = [
    {
      title: '序号',
      width: 70,
      render: (_v, _r, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: '消息标题',
      dataIndex: 'title',
      width: 220,
      render: (v: string, row) => (
        <Space size={6}>
          {row.status === '未读' && <Badge status="processing" />}
          <Text strong={row.status === '未读'}>{v}</Text>
        </Space>
      ),
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 110,
      render: (v: NotifyType) => <Tag color={notifyTypeColor(v)}>{v}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v: NotifyReadStatus) =>
        v === '已读' ? (
          <Badge status="success" text="已读" />
        ) : (
          <Badge status="processing" text="未读" />
        ),
    },
    { title: '创建时间', dataIndex: 'createdAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 110,
      fixed: 'right',
      render: (_, row) => <Link onClick={() => openDetail(row)}>查看详情</Link>,
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            setFilters(values);
            setPage(1);
          }}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8} lg={5}>
              <Form.Item label="类型" name="type">
                <Select allowClear placeholder="类型" options={NOTIFY_TYPE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={5}>
              <Form.Item label="状态" name="status">
                <Select allowClear placeholder="请选择" options={NOTIFY_STATUS_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={10} lg={8}>
              <Form.Item label="创建时间" name="createdAt">
                <RangePicker style={{ width: '100%' }} showTime={false} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label=" ">
                <Space>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setFilters({});
                    }}
                  >
                    重置
                  </Button>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            disabled={unreadCount === 0}
            onClick={() => {
              setList((prev) => prev.map((item) => ({ ...item, status: '已读' })));
              message.success(`已将 ${unreadCount} 条消息标记为已读`);
            }}
          >
            全部标记已读
          </Button>
        </div>
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1100 }}
          pagination={{
            current: page,
            pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t, range) => `第 ${range[0]}-${range[1]} 条/总共 ${t} 条`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
        />
      </Card>

      <Drawer
        title="消息详情"
        open={open}
        onClose={() => setOpen(false)}
        width={480}
        destroyOnClose
      >
        {current && (
          <Space direction="vertical" size={12} style={{ display: 'flex' }}>
            <Title level={5} style={{ margin: 0 }}>
              {current.title}
            </Title>
            <Space wrap>
              <Tag color={notifyTypeColor(current.type)}>{current.type}</Tag>
              {current.status === '已读' ? (
                <Badge status="success" text="已读" />
              ) : (
                <Badge status="processing" text="未读" />
              )}
            </Space>
            <Text type="secondary">创建时间：{current.createdAt}</Text>
            <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
              {current.detail || current.content}
            </Paragraph>
          </Space>
        )}
      </Drawer>
    </Space>
  );
}
