import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
  StarOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
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
import { useMemo, useState, type Key } from 'react';
import AiAnalysisDrawer from '@/components/AiAnalysisDrawer';
import {
  MOCK_NOTE_ANALYSIS,
  NOTE_ACTIVITY_STATUS_OPTIONS,
  NOTE_AI_STEPS,
  NOTE_CONTENT_FORM_OPTIONS,
  NOTE_EXEC_STATUS_OPTIONS,
  NOTE_PLATFORM_OPTIONS,
  NOTE_TASK_TYPE_OPTIONS,
  formatNoteNumber,
  notePlatformColor,
  type NoteAnalysisRecord,
} from '@/mock/noteAnalysis';

const { RangePicker } = DatePicker;
const { Paragraph, Text } = Typography;

type FilterValues = {
  keyword?: string;
  exclude?: string;
  taskName?: string;
  contentForm?: string;
  taskType?: string;
  platform?: string;
  publishTime?: [dayjs.Dayjs, dayjs.Dayjs];
  endTime?: [dayjs.Dayjs, dayjs.Dayjs];
  phone?: string;
  koxId?: string;
  koxName?: string;
  userTag?: string;
  office?: string;
  track?: string;
  activityStatus?: string;
  execStatus?: string;
  linkSubmitTime?: [dayjs.Dayjs, dayjs.Dayjs];
};

function inRange(value: string, range?: [dayjs.Dayjs, dayjs.Dayjs]) {
  if (!range?.[0] || !range?.[1]) return true;
  const current = dayjs(value);
  return !current.isBefore(range[0].startOf('day')) && !current.isAfter(range[1].endOf('day'));
}

export default function NoteAnalysisPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [aiOpen, setAiOpen] = useState(false);

  const dataSource = useMemo(() => {
    return MOCK_NOTE_ANALYSIS.filter((item) => {
      if (filters.keyword) {
        const kw = filters.keyword.trim();
        const hit =
          item.keywords.includes(kw) ||
          item.taskName.includes(kw) ||
          item.topic.includes(kw) ||
          item.koxName.includes(kw);
        if (!hit) return false;
      }
      if (filters.exclude && (item.taskName.includes(filters.exclude) || item.topic.includes(filters.exclude))) {
        return false;
      }
      if (filters.taskName && !item.taskName.includes(filters.taskName.trim())) return false;
      if (filters.contentForm && item.contentForm !== filters.contentForm) return false;
      if (filters.taskType && item.taskType !== filters.taskType) return false;
      if (filters.platform && item.platform !== filters.platform) return false;
      if (!inRange(item.publishTime, filters.publishTime)) return false;
      if (!inRange(item.endTime, filters.endTime)) return false;
      if (filters.phone && !item.phone.includes(filters.phone.trim())) return false;
      if (filters.koxId && !item.koxId.includes(filters.koxId.trim())) return false;
      if (filters.koxName && !item.koxName.includes(filters.koxName.trim())) return false;
      if (filters.userTag && !item.ownerTags.some((t) => t.includes(filters.userTag!.trim()))) return false;
      if (filters.office && !item.office.includes(filters.office.trim())) return false;
      if (filters.track && !item.track.includes(filters.track.trim())) return false;
      if (filters.activityStatus && item.activityStatus !== filters.activityStatus) return false;
      if (filters.execStatus && item.execStatus !== filters.execStatus) return false;
      if (!inRange(item.linkSubmitTime, filters.linkSubmitTime)) return false;
      return true;
    });
  }, [filters]);

  const selectedRows = useMemo(
    () => MOCK_NOTE_ANALYSIS.filter((item) => selectedKeys.includes(item.key)),
    [selectedKeys],
  );

  const openAi = () => {
    if (!selectedKeys.length) {
      message.warning('请先勾选需要分析的笔记');
      return;
    }
    setAiOpen(true);
  };

  const columns: ColumnsType<NoteAnalysisRecord> = [
    { title: '序号', dataIndex: 'index', width: 70, fixed: 'left' },
    { title: '任务ID', dataIndex: 'taskId', width: 140 },
    { title: '任务名称', dataIndex: 'taskName', width: 180, ellipsis: true },
    { title: 'KOXID', dataIndex: 'koxId', width: 100 },
    { title: '任务类型', dataIndex: 'taskType', width: 110 },
    { title: '任务主题', dataIndex: 'topic', width: 160, ellipsis: true },
    { title: 'KOX昵称', dataIndex: 'koxName', width: 120 },
    { title: '手机号', dataIndex: 'phone', width: 120 },
    { title: '代表处', dataIndex: 'office', width: 120 },
    { title: '赛道', dataIndex: 'track', width: 90 },
    {
      title: '车主标签',
      dataIndex: 'ownerTags',
      width: 200,
      render: (tags: string[]) => (
        <Space size={[4, 4]} wrap>
          {tags.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '任务平台',
      dataIndex: 'platform',
      width: 100,
      render: (p: NoteAnalysisRecord['platform']) => <Tag color={notePlatformColor(p)}>{p}</Tag>,
    },
    {
      title: '投放状态',
      dataIndex: 'boostStatus',
      width: 100,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    { title: '内容形式', dataIndex: 'contentForm', width: 110 },
    { title: '活动状态', dataIndex: 'activityStatus', width: 100 },
    { title: '执行状态', dataIndex: 'execStatus', width: 100 },
    { title: '发布时间', dataIndex: 'publishTime', width: 170 },
    { title: '结束时间', dataIndex: 'endTime', width: 170 },
    { title: '链接提交时间', dataIndex: 'linkSubmitTime', width: 170 },
    {
      title: '点赞',
      dataIndex: 'likes',
      width: 90,
      sorter: (a, b) => a.likes - b.likes,
      render: (v: number) => formatNoteNumber(v),
    },
    {
      title: '收藏',
      dataIndex: 'collects',
      width: 90,
      sorter: (a, b) => a.collects - b.collects,
      render: (v: number) => formatNoteNumber(v),
    },
    {
      title: '评论',
      dataIndex: 'comments',
      width: 90,
      sorter: (a, b) => a.comments - b.comments,
    },
    {
      title: '阅读',
      dataIndex: 'reads',
      width: 100,
      sorter: (a, b) => a.reads - b.reads,
      render: (v: number) => formatNoteNumber(v),
    },
    {
      title: '有效咨询',
      dataIndex: 'consults',
      width: 100,
      sorter: (a, b) => a.consults - b.consults,
    },
    {
      title: '是否爆文',
      dataIndex: 'viral',
      width: 90,
      render: (v: boolean) => (v ? <Tag color="red">爆文</Tag> : <Tag>否</Tag>),
    },
    { title: '申诉次数', dataIndex: 'appealCount', width: 90 },
    { title: '申诉内容', dataIndex: 'appealContent', width: 140, ellipsis: true },
    { title: '申诉结果', dataIndex: 'appealResult', width: 100 },
    { title: '最终状态更新时间', dataIndex: 'finalStatusTime', width: 170 },
    { title: '操作日志', dataIndex: 'opLog', width: 200, ellipsis: true },
    { title: '发放总积分', dataIndex: 'totalPoints', width: 110 },
    { title: '基审发放积分', dataIndex: 'firstReviewPoints', width: 120 },
    { title: '基审对应积分编码', dataIndex: 'firstReviewCode', width: 140 },
    { title: '二审发放积分', dataIndex: 'secondReviewPoints', width: 120 },
    { title: '二审对应积分编码', dataIndex: 'secondReviewCode', width: 140 },
    { title: '手动补发积分', dataIndex: 'manualPoints', width: 120 },
    {
      title: '投递状态',
      dataIndex: 'deliverStatus',
      width: 100,
      render: (v: string) => <Tag color={v === '已投递' ? 'success' : 'default'}>{v}</Tag>,
    },
  ];

  const avgLikes = selectedRows.length
    ? Math.round(selectedRows.reduce((s, i) => s + i.likes, 0) / selectedRows.length)
    : 0;
  const viralCount = selectedRows.filter((i) => i.viral).length;
  const topNote = [...selectedRows].sort((a, b) => b.reads - a.reads)[0];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            contentForm: '',
            taskType: '',
            platform: '',
            activityStatus: '',
            execStatus: '',
          }}
          onFinish={(values) => setFilters(values)}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="keyword" label="关键词">
                <Input allowClear placeholder="关键词" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="exclude" label="排除词">
                <Input allowClear placeholder="排除词" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="taskName" label="任务名称">
                <Input allowClear placeholder="任务名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="contentForm" label="内容形式">
                <Select options={NOTE_CONTENT_FORM_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="taskType" label="任务类型">
                <Select options={NOTE_TASK_TYPE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="platform" label="发布平台">
                <Select options={NOTE_PLATFORM_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="publishTime" label="发布时间">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="endTime" label="结束时间">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="phone" label="用户手机号">
                <Input allowClear placeholder="手机号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="koxId" label="KOXID">
                <Input allowClear placeholder="KOXID" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="koxName" label="KOX昵称">
                <Input allowClear placeholder="KOX昵称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="userTag" label="用户标签">
                <Input allowClear placeholder="用户标签" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="office" label="代表处">
                <Input allowClear placeholder="代表处" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="track" label="赛道">
                <Input allowClear placeholder="赛道" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="activityStatus" label="活动状态">
                <Select options={NOTE_ACTIVITY_STATUS_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="execStatus" label="执行状态">
                <Select options={NOTE_EXEC_STATUS_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="linkSubmitTime" label="链接提交时间">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
            <Button
              icon={<StarOutlined />}
              disabled={!selectedKeys.length}
              onClick={() => message.success(`已加入优秀作品库 ${selectedKeys.length} 条（mock）`)}
            >
              加入优秀作品库
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
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              查询
            </Button>
          </Space>
        </Form>
      </Card>

      <Card>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 4200 }}
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
        summaryTitle={`笔记价值分析总结 ${selectedRows.length}条笔记`}
        steps={NOTE_AI_STEPS}
        summary={
          <>
            <Paragraph>
              通过对已选 {selectedRows.length} 条笔记的数据分析，总结如下：
            </Paragraph>
            <Paragraph>
              <Text strong>1. 互动表现：</Text>
              平均点赞约 {formatNoteNumber(avgLikes)}，其中爆文 {viralCount} 条。
              {topNote ? `阅读表现最佳为「${topNote.koxName}」的《${topNote.taskName}》。` : ''}
            </Paragraph>
            <Paragraph>
              <Text strong>2. 内容建议：</Text>
              优先放大爆文结构与高咨询笔记，沉淀到优秀作品库后可复用于同类任务。
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text strong>3. 运营动作：</Text>
              对已通过未投流笔记可评估加热；申诉中的内容建议优先复核积分发放。
            </Paragraph>
          </>
        }
        selectedRows={selectedRows}
        rowKey="key"
        selectedColumns={[
          { title: 'KOX', dataIndex: 'koxName', ellipsis: true },
          { title: '平台', dataIndex: 'platform', width: 80 },
          {
            title: '阅读',
            dataIndex: 'reads',
            width: 80,
            render: (v: number) => formatNoteNumber(v),
          },
          {
            title: '爆文',
            dataIndex: 'viral',
            width: 70,
            render: (v: boolean) => (v ? '是' : '否'),
          },
        ]}
        downloadText={`下载已选笔记数据（${selectedRows.length}条）`}
        onDownload={() => message.success(`已下载已选 ${selectedRows.length} 条笔记（mock）`)}
      />
    </Space>
  );
}
