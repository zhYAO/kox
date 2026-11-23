import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState, type Key } from 'react';
import AiAnalysisDrawer from '@/components/AiAnalysisDrawer';
import {
  BRAND_OPTIONS,
  ISSUE_STATUS_OPTIONS,
  LEDGER_AI_STEPS,
  MATCH_OPTIONS,
  MOCK_KOX_SUMMARY,
  MOCK_POINTS_LEDGER,
  OFFICE_OPTIONS,
  PLATFORM_OPTIONS,
  POINTS_TYPE_OPTIONS,
  SOURCE_OPTIONS,
  formatLedgerPoints,
  issueStatusColor,
  type KoxPointsSummary,
  type PointsLedgerRecord,
} from '@/mock/pointsLedger';

const { RangePicker } = DatePicker;
const { Paragraph, Text, Title, Link } = Typography;

type StreamFilter = {
  koxIdMode?: string;
  koxId?: string;
  koxNameMode?: string;
  koxName?: string;
  phone?: string;
  office?: string;
  modelTag?: string;
  brand?: string;
  series?: string;
  model?: string;
  source?: string;
  pointsType?: string;
  pointsCodeMode?: string;
  pointsCode?: string;
  issueStatus?: string;
  taskName?: string;
  issueTime?: [dayjs.Dayjs, dayjs.Dayjs];
};

type SummaryFilter = {
  koxIdMode?: string;
  koxId?: string;
  nickname?: string;
  phone?: string;
  office?: string;
  platform?: string;
};

function matchText(value: string, keyword?: string, mode?: string) {
  if (!keyword?.trim()) return true;
  const kw = keyword.trim();
  if (mode === '精确') return value === kw;
  return value.includes(kw);
}

function inRange(value: string, range?: [dayjs.Dayjs, dayjs.Dayjs]) {
  if (!range?.[0] || !range?.[1]) return true;
  const current = dayjs(value);
  return !current.isBefore(range[0].startOf('day')) && !current.isAfter(range[1].endOf('day'));
}

export default function PointsLedgerPage() {
  const [tab, setTab] = useState<'stream' | 'summary'>('stream');
  const [streamForm] = Form.useForm<StreamFilter>();
  const [summaryForm] = Form.useForm<SummaryFilter>();
  const [streamFilters, setStreamFilters] = useState<StreamFilter>({});
  const [summaryFilters, setSummaryFilters] = useState<SummaryFilter>({});
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [aiOpen, setAiOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const streamData = useMemo(() => {
    return MOCK_POINTS_LEDGER.filter((item) => {
      if (!matchText(item.koxId, streamFilters.koxId, streamFilters.koxIdMode)) return false;
      if (!matchText(item.koxName, streamFilters.koxName, streamFilters.koxNameMode)) return false;
      if (streamFilters.phone && !item.phone.includes(streamFilters.phone.trim())) return false;
      if (streamFilters.office && item.office !== streamFilters.office) return false;
      if (streamFilters.modelTag && !item.modelTag.includes(streamFilters.modelTag.trim())) return false;
      if (streamFilters.brand && item.brand !== streamFilters.brand) return false;
      if (streamFilters.series && !item.series.includes(streamFilters.series.trim())) return false;
      if (streamFilters.model && !item.model.includes(streamFilters.model.trim())) return false;
      if (streamFilters.source && item.source !== streamFilters.source) return false;
      if (streamFilters.pointsType && item.pointsType !== streamFilters.pointsType) return false;
      if (!matchText(item.pointsCode, streamFilters.pointsCode, streamFilters.pointsCodeMode)) return false;
      if (streamFilters.issueStatus && item.issueStatus !== streamFilters.issueStatus) return false;
      if (streamFilters.taskName && !item.taskName.includes(streamFilters.taskName.trim())) return false;
      if (!inRange(item.issueTime, streamFilters.issueTime)) return false;
      return true;
    });
  }, [streamFilters]);

  const summaryData = useMemo(() => {
    return MOCK_KOX_SUMMARY.filter((item) => {
      if (!matchText(item.koxId, summaryFilters.koxId, summaryFilters.koxIdMode)) return false;
      if (summaryFilters.nickname && !item.nickname.includes(summaryFilters.nickname.trim())) return false;
      if (summaryFilters.phone && !item.phone.includes(summaryFilters.phone.trim())) return false;
      if (summaryFilters.office && item.office !== summaryFilters.office) return false;
      if (summaryFilters.platform && item.platform !== summaryFilters.platform) return false;
      return true;
    });
  }, [summaryFilters]);

  const selectedStream = useMemo(
    () => MOCK_POINTS_LEDGER.filter((item) => selectedKeys.includes(item.key)),
    [selectedKeys],
  );

  const streamColumns: ColumnsType<PointsLedgerRecord> = [
    { title: '积分流水号', dataIndex: 'streamNo', width: 150, fixed: 'left' },
    { title: 'KOX ID', dataIndex: 'koxId', width: 110 },
    { title: 'KOX 名称', dataIndex: 'koxName', width: 120 },
    { title: '手机号', dataIndex: 'phone', width: 120 },
    { title: '代表处', dataIndex: 'office', width: 120 },
    { title: '车型标签', dataIndex: 'modelTag', width: 160, ellipsis: true },
    { title: '品牌', dataIndex: 'brand', width: 90 },
    { title: '车系', dataIndex: 'series', width: 90 },
    { title: '车型', dataIndex: 'model', width: 110 },
    { title: '来源', dataIndex: 'source', width: 100 },
    { title: '积分类型', dataIndex: 'pointsType', width: 100 },
    { title: '积分编码', dataIndex: 'pointsCode', width: 120 },
    {
      title: '发放状态',
      dataIndex: 'issueStatus',
      width: 100,
      render: (status: PointsLedgerRecord['issueStatus']) => (
        <Tag color={issueStatusColor(status)}>{status}</Tag>
      ),
    },
    { title: '任务ID', dataIndex: 'taskId', width: 130 },
    { title: '任务名称', dataIndex: 'taskName', width: 180, ellipsis: true },
    {
      title: '积分',
      dataIndex: 'points',
      width: 90,
      sorter: (a, b) => a.points - b.points,
      render: (v: number) => formatLedgerPoints(v),
    },
    { title: '发放时间', dataIndex: 'issueTime', width: 170 },
    { title: '平台', dataIndex: 'platform', width: 90 },
  ];

  const summaryColumns: ColumnsType<KoxPointsSummary> = [
    { title: 'KOX ID', dataIndex: 'koxId', width: 110, fixed: 'left' },
    { title: '昵称', dataIndex: 'nickname', width: 120 },
    { title: '手机号', dataIndex: 'phone', width: 120 },
    { title: '代表处', dataIndex: 'office', width: 120 },
    { title: '车型标签', dataIndex: 'modelTag', width: 160, ellipsis: true },
    { title: '平台', dataIndex: 'platform', width: 100 },
    {
      title: '总获得积分',
      dataIndex: 'totalEarned',
      width: 120,
      sorter: (a, b) => a.totalEarned - b.totalEarned,
      render: (v: number) => formatLedgerPoints(v),
    },
    {
      title: '剩余积分',
      dataIndex: 'remain',
      width: 110,
      sorter: (a, b) => a.remain - b.remain,
      render: (v: number) => formatLedgerPoints(v),
    },
    {
      title: '成功笔数',
      dataIndex: 'successCount',
      width: 100,
      sorter: (a, b) => a.successCount - b.successCount,
    },
    {
      title: '异常笔数',
      dataIndex: 'abnormalCount',
      width: 100,
      sorter: (a, b) => a.abnormalCount - b.abnormalCount,
      render: (v: number) => <Text type={v > 0 ? 'danger' : undefined}>{v}</Text>,
    },
    { title: '最近发放时间', dataIndex: 'lastIssueTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Link
          onClick={() => {
            setTab('stream');
            streamForm.setFieldsValue({ koxId: record.koxId, koxIdMode: '精确' });
            setStreamFilters({ koxId: record.koxId, koxIdMode: '精确' });
          }}
        >
          查看流水
        </Link>
      ),
    },
  ];

  const avgPoints = selectedStream.length
    ? Math.round(selectedStream.reduce((s, i) => s + i.points, 0) / selectedStream.length)
    : Math.round(streamData.reduce((s, i) => s + i.points, 0) / Math.max(streamData.length, 1));
  const failCount = (selectedStream.length ? selectedStream : streamData).filter(
    (i) => i.issueStatus !== '成功',
  ).length;

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            积分台账
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            积分流水对比与列表汇总，使用统一 KOX ID；支持导入补发与导出。
          </Paragraph>
        </div>
        <Space wrap>
          <Button type="primary" icon={<UploadOutlined />} onClick={() => setImportOpen(true)}>
            导入补发
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() =>
              message.success(
                `已导出 ${tab === 'stream' ? streamData.length : summaryData.length} 条（mock）`,
              )
            }
          >
            导出数据
          </Button>
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={() => {
              if (tab === 'stream' && !selectedKeys.length && !streamData.length) {
                message.warning('暂无流水可分析');
                return;
              }
              if (tab === 'stream' && !selectedKeys.length) {
                setSelectedKeys(streamData.slice(0, 5).map((i) => i.key));
              }
              setAiOpen(true);
            }}
          >
            AI 智能分析
          </Button>
        </Space>
      </div>

      <Card>
        <Tabs
          activeKey={tab}
          onChange={(key) => {
            setTab(key as 'stream' | 'summary');
            setSelectedKeys([]);
          }}
          items={[
            { key: 'stream', label: '积分流水' },
            { key: 'summary', label: 'KOX积分汇总' },
          ]}
        />

        {tab === 'stream' ? (
          <>
            <Alert
              type="warning"
              showIcon
              style={{ marginBottom: 12 }}
              message="筛选说明：同一框内条件为并集，跨框条件为交集。"
            />
            <Form
              form={streamForm}
              layout="vertical"
              initialValues={{
                koxIdMode: '模糊',
                koxNameMode: '模糊',
                pointsCodeMode: '模糊',
                office: '',
                brand: '',
                source: '',
                pointsType: '',
                issueStatus: '',
              }}
              onFinish={(values) => setStreamFilters(values)}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
                <Form.Item label="KOX ID">
                  <Space.Compact style={{ width: '100%' }}>
                    <Form.Item name="koxIdMode" noStyle>
                      <Select options={MATCH_OPTIONS} style={{ width: 90 }} />
                    </Form.Item>
                    <Form.Item name="koxId" noStyle>
                      <Input allowClear placeholder="KOX ID" />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
                <Form.Item label="KOX 名称">
                  <Space.Compact style={{ width: '100%' }}>
                    <Form.Item name="koxNameMode" noStyle>
                      <Select options={MATCH_OPTIONS} style={{ width: 90 }} />
                    </Form.Item>
                    <Form.Item name="koxName" noStyle>
                      <Input allowClear placeholder="KOX 名称" />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
                <Form.Item name="phone" label="手机号">
                  <Input allowClear placeholder="手机号" />
                </Form.Item>
                <Form.Item name="office" label="代表处">
                  <Select options={OFFICE_OPTIONS} />
                </Form.Item>
                <Form.Item name="modelTag" label="车型标签">
                  <Input allowClear placeholder="车型标签" />
                </Form.Item>
                <Form.Item name="brand" label="品牌">
                  <Select options={BRAND_OPTIONS} />
                </Form.Item>
                <Form.Item name="series" label="车系">
                  <Input allowClear placeholder="车系" />
                </Form.Item>
                <Form.Item name="model" label="车型">
                  <Input allowClear placeholder="车型" />
                </Form.Item>
                <Form.Item name="source" label="来源">
                  <Select options={SOURCE_OPTIONS} />
                </Form.Item>
                <Form.Item name="pointsType" label="积分类型">
                  <Select options={POINTS_TYPE_OPTIONS} />
                </Form.Item>
                <Form.Item label="积分编码">
                  <Space.Compact style={{ width: '100%' }}>
                    <Form.Item name="pointsCodeMode" noStyle>
                      <Select options={MATCH_OPTIONS} style={{ width: 90 }} />
                    </Form.Item>
                    <Form.Item name="pointsCode" noStyle>
                      <Input allowClear placeholder="积分编码" />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
                <Form.Item name="issueStatus" label="发放状态">
                  <Select options={ISSUE_STATUS_OPTIONS} />
                </Form.Item>
                <Form.Item name="taskName" label="任务名称">
                  <Input allowClear placeholder="任务名称" />
                </Form.Item>
                <Form.Item name="issueTime" label="发放时间">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </div>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    streamForm.resetFields();
                    setStreamFilters({});
                  }}
                >
                  重置
                </Button>
              </Space>
            </Form>

            <Table
              style={{ marginTop: 16 }}
              rowKey="key"
              columns={streamColumns}
              dataSource={streamData}
              scroll={{ x: 2400 }}
              rowSelection={{
                selectedRowKeys: selectedKeys,
                onChange: setSelectedKeys,
              }}
              pagination={{ showTotal: (total) => `共 ${total} 条` }}
            />
          </>
        ) : (
          <>
            <Form
              form={summaryForm}
              layout="inline"
              style={{ rowGap: 12, marginBottom: 16 }}
              initialValues={{ koxIdMode: '模糊', office: '', platform: '' }}
              onFinish={(values) => setSummaryFilters(values)}
            >
              <Form.Item label="KOX ID">
                <Space.Compact>
                  <Form.Item name="koxIdMode" noStyle>
                    <Select options={MATCH_OPTIONS} style={{ width: 90 }} />
                  </Form.Item>
                  <Form.Item name="koxId" noStyle>
                    <Input allowClear placeholder="KOX ID" style={{ width: 140 }} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
              <Form.Item name="nickname" label="昵称">
                <Input allowClear placeholder="昵称" style={{ width: 140 }} />
              </Form.Item>
              <Form.Item name="phone" label="手机号">
                <Input allowClear placeholder="手机号" style={{ width: 140 }} />
              </Form.Item>
              <Form.Item name="office" label="代表处">
                <Select options={OFFICE_OPTIONS} style={{ width: 140 }} />
              </Form.Item>
              <Form.Item name="platform" label="平台">
                <Select options={PLATFORM_OPTIONS} style={{ width: 140 }} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      summaryForm.resetFields();
                      setSummaryFilters({});
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>

            <Table
              rowKey="key"
              columns={summaryColumns}
              dataSource={summaryData}
              scroll={{ x: 1400 }}
              pagination={{ showTotal: (total) => `共 ${total} 条` }}
            />
          </>
        )}
      </Card>

      <Modal
        title="导入补发"
        open={importOpen}
        onCancel={() => setImportOpen(false)}
        onOk={() => {
          message.success('补发文件已提交（mock）');
          setImportOpen(false);
        }}
        okText="确认导入"
      >
        <Upload.Dragger beforeUpload={() => false} maxCount={1} accept=".xlsx,.xls,.csv">
          <p className="ant-upload-text">点击或拖拽上传补发表格</p>
          <p className="ant-upload-hint">支持 xlsx / csv，按模板填写 KOX ID、积分、备注</p>
        </Upload.Dragger>
      </Modal>

      <AiAnalysisDrawer
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        summaryTitle={`积分台账分析 ${selectedStream.length || streamData.length} 条流水`}
        steps={LEDGER_AI_STEPS}
        summary={
          <>
            <Paragraph>
              当前样本平均单笔积分约 {formatLedgerPoints(avgPoints)}，异常/非成功笔数 {failCount}。
            </Paragraph>
            <Paragraph>
              <Text strong>1. 发放结构：</Text>
              任务奖励与二审积分占比较高，手动补发建议集中复核。
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text strong>2. 运营建议：</Text>
              对异常笔数偏高的 KOX 优先核查账号与任务绑定；汇总页可下钻流水定位问题单。
            </Paragraph>
          </>
        }
        selectedRows={selectedStream.length ? selectedStream : streamData.slice(0, 5)}
        rowKey="key"
        selectedColumns={[
          { title: '流水号', dataIndex: 'streamNo', width: 130, ellipsis: true },
          { title: 'KOX', dataIndex: 'koxName', width: 90, ellipsis: true },
          {
            title: '积分',
            dataIndex: 'points',
            width: 70,
            render: (v: number) => formatLedgerPoints(v),
          },
          { title: '状态', dataIndex: 'issueStatus', width: 70 },
        ]}
        downloadText={`下载分析样本（${(selectedStream.length ? selectedStream : streamData.slice(0, 5)).length}条）`}
        onDownload={() => message.success('已下载分析样本（mock）')}
      />
    </Space>
  );
}
