import {
  DownloadOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
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
import { useMemo, useState } from 'react';
import {
  INTERACTION_BUCKETS,
  KOS_NOTE_DISPLAY_DAYS,
  KOS_NOTE_GROUP_OPTIONS,
  MOCK_KOS_NOTE_ANALYSIS,
  formatKosNoteNumber,
  matchInteractionBucket,
  type InteractionBucket,
  type KosNoteAnalysisRecord,
} from '@/mock/kosNoteAnalysis';
import './index.css';

const { RangePicker } = DatePicker;
const { Text, Link } = Typography;
const { CheckableTag } = Tag;

type FilterValues = {
  displayDays?: string;
  taskName?: string;
  phone?: string;
  employee?: string;
  group?: string;
  title?: string;
  publishTime?: [dayjs.Dayjs, dayjs.Dayjs];
};

function tipTitle(text: string, tip: string) {
  return (
    <Space size={4}>
      {text}
      <Tooltip title={tip}>
        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
      </Tooltip>
    </Space>
  );
}

function inRange(value: string, range?: [dayjs.Dayjs, dayjs.Dayjs]) {
  if (!range?.[0] || !range?.[1]) return true;
  const current = dayjs(value);
  return (
    !current.isBefore(range[0].startOf('day')) && !current.isAfter(range[1].endOf('day'))
  );
}

export default function KosNoteAnalysisPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({ displayDays: '30' });
  const [bucket, setBucket] = useState<InteractionBucket>('all');
  const [customMin, setCustomMin] = useState<number | null>(null);
  const [customMax, setCustomMax] = useState<number | null>(null);

  const dataSource = useMemo(() => {
    return MOCK_KOS_NOTE_ANALYSIS.filter((item) => {
      if (filters.taskName && !item.taskName.includes(filters.taskName.trim())) return false;
      if (filters.phone && !item.phone.includes(filters.phone.trim())) return false;
      if (filters.employee && !item.employee.includes(filters.employee.trim())) return false;
      if (filters.group && item.group !== filters.group) return false;
      if (filters.title && !item.title.includes(filters.title.trim())) return false;
      if (!inRange(item.publishTime, filters.publishTime)) return false;
      if (bucket === 'custom') {
        if (customMin != null && item.reads < customMin) return false;
        if (customMax != null && item.reads > customMax) return false;
      } else if (!matchInteractionBucket(item.reads, bucket)) {
        return false;
      }
      return true;
    });
  }, [filters, bucket, customMin, customMax]);

  const columns: ColumnsType<KosNoteAnalysisRecord> = [
    {
      title: '笔记标题',
      dataIndex: 'title',
      fixed: 'left',
      width: 220,
      ellipsis: true,
      render: (v: string) => <Text strong>{v}</Text>,
    },
    { title: '素材类型', dataIndex: 'materialType', width: 90 },
    {
      title: '封面图',
      dataIndex: 'coverColor',
      width: 80,
      render: (color: string) => (
        <span className="kos-note-cover" style={{ background: color }}>
          封面
        </span>
      ),
    },
    {
      title: '笔记链接',
      dataIndex: 'noteLink',
      width: 100,
      render: (v: string) => (
        <Link href={v} target="_blank" onClick={(e) => e.preventDefault()}>
          查看
        </Link>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      width: 150,
      sorter: (a, b) => dayjs(a.publishTime).valueOf() - dayjs(b.publishTime).valueOf(),
    },
    {
      title: '头像&昵称',
      dataIndex: 'nickname',
      width: 150,
      render: (_, row) => (
        <div className="kos-note-user">
          <Avatar size={28} style={{ background: row.avatarColor }}>
            {row.nickname.slice(0, 1)}
          </Avatar>
          <Text ellipsis>{row.nickname}</Text>
        </div>
      ),
    },
    { title: '员工姓名', dataIndex: 'employee', width: 100 },
    { title: '手机号', dataIndex: 'phone', width: 120 },
    {
      title: tipTitle('粉丝数', '账号当前粉丝总量'),
      dataIndex: 'followers',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.followers - b.followers,
      render: (v: number) => formatKosNoteNumber(v),
    },
    { title: '三方账号', dataIndex: 'thirdAccount', width: 130, ellipsis: true },
    {
      title: '主页链接',
      dataIndex: 'homepage',
      width: 100,
      render: (v: string) => (
        <Link href={v} target="_blank" onClick={(e) => e.preventDefault()}>
          打开
        </Link>
      ),
    },
    {
      title: tipTitle('阅读数', '笔记累计阅读量'),
      dataIndex: 'reads',
      width: 110,
      align: 'right',
      sorter: (a, b) => a.reads - b.reads,
      render: (v: number) => formatKosNoteNumber(v),
    },
    {
      title: tipTitle('点赞数', '笔记累计点赞量'),
      dataIndex: 'likes',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.likes - b.likes,
      render: (v: number) => formatKosNoteNumber(v),
    },
    {
      title: tipTitle('收藏数', '笔记累计收藏量'),
      dataIndex: 'collects',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.collects - b.collects,
      render: (v: number) => formatKosNoteNumber(v),
    },
    {
      title: tipTitle('评论数', '笔记累计评论量'),
      dataIndex: 'comments',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.comments - b.comments,
      render: (v: number) => formatKosNoteNumber(v),
    },
  ];

  return (
    <div className="kos-note-page">
      <Card styles={{ body: { paddingBottom: 8 } }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ displayDays: '30' }}
          onFinish={(values) => setFilters(values)}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="展示天数" name="displayDays">
                <Select options={KOS_NOTE_DISPLAY_DAYS} placeholder="请选择展示天数" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="任务名称" name="taskName">
                <Input placeholder="请输入任务名称" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="手机号" name="phone">
                <Input placeholder="请输入手机号" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="员工姓名" name="employee">
                <Input placeholder="请输入员工姓名" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="分组" name="group">
                <Select
                  allowClear
                  placeholder="请选择分组"
                  options={KOS_NOTE_GROUP_OPTIONS}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="笔记标题" name="title">
                <Input placeholder="请输入笔记标题" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="发布日期" name="publishTime">
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label=" ">
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      form.resetFields();
                      setFilters({ displayDays: '30' });
                      setBucket('all');
                      setCustomMin(null);
                      setCustomMax(null);
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <div className="kos-note-interaction">
          <span className="kos-note-interaction-label">互动量：</span>
          <div className="kos-note-interaction-tags">
            {INTERACTION_BUCKETS.map((item) => (
              <CheckableTag
                key={item.key}
                checked={bucket === item.key}
                onChange={(checked) => {
                  if (checked) setBucket(item.key);
                }}
              >
                {item.label}
              </CheckableTag>
            ))}
            {bucket === 'custom' && (
              <Space size={8}>
                <InputNumber
                  min={0}
                  placeholder="最小阅读"
                  value={customMin ?? undefined}
                  onChange={(v) => setCustomMin(typeof v === 'number' ? v : null)}
                  style={{ width: 120 }}
                />
                <span>-</span>
                <InputNumber
                  min={0}
                  placeholder="最大阅读"
                  value={customMax ?? undefined}
                  onChange={(v) => setCustomMax(typeof v === 'number' ? v : null)}
                  style={{ width: 120 }}
                />
              </Space>
            )}
          </div>
        </div>
      </Card>

      <Card className="kos-note-table-card" styles={{ body: { paddingTop: 12 } }}>
        <div className="kos-note-table-toolbar">
          <Button
            icon={<DownloadOutlined />}
            onClick={() => message.success(`已导出 ${dataSource.length} 条笔记分析数据（mock）`)}
          >
            下载表格
          </Button>
        </div>
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1900 }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
        />
      </Card>
    </div>
  );
}
