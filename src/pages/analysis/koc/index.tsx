import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState, type Key } from 'react';
import AiAnalysisDrawer from '@/components/AiAnalysisDrawer';
import {
  AI_ANALYSIS_STEPS,
  KOC_PLATFORM_OPTIONS,
  MOCK_KOC_ANALYSIS,
  formatNumber,
  platformTagColor,
  type KocAnalysisRecord,
} from '@/mock/kocAnalysis';

const { Paragraph, Text } = Typography;

type FilterValues = {
  name?: string;
  platform?: string;
  viralMin?: number | null;
  viralMax?: number | null;
  consultMin?: number | null;
  consultMax?: number | null;
};

export default function KocAnalysisPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [aiOpen, setAiOpen] = useState(false);

  const dataSource = useMemo(() => {
    return MOCK_KOC_ANALYSIS.filter((item) => {
      if (filters.name && !item.name.includes(filters.name.trim())) return false;
      if (filters.platform && item.platform !== filters.platform) return false;
      if (filters.viralMin != null && item.viralRate < filters.viralMin) return false;
      if (filters.viralMax != null && item.viralRate > filters.viralMax) return false;
      if (filters.consultMin != null && item.consultRate < filters.consultMin) return false;
      if (filters.consultMax != null && item.consultRate > filters.consultMax) return false;
      return true;
    });
  }, [filters]);

  const selectedRows = useMemo(
    () => MOCK_KOC_ANALYSIS.filter((item) => selectedKeys.includes(item.key)),
    [selectedKeys],
  );

  const openAi = () => {
    if (!selectedKeys.length) {
      message.warning('请先勾选需要分析的 KOC');
      return;
    }
    setAiOpen(true);
  };

  const columns: ColumnsType<KocAnalysisRecord> = [
    {
      title: 'KOC名称',
      dataIndex: 'name',
      fixed: 'left',
      width: 180,
      render: (_, record) => (
        <Space>
          <Avatar style={{ background: record.avatarColor }}>{record.name.slice(0, 1)}</Avatar>
          <Text>{record.name}</Text>
        </Space>
      ),
    },
    {
      title: '平台',
      dataIndex: 'platform',
      width: 100,
      render: (platform: KocAnalysisRecord['platform']) => (
        <Tag color={platformTagColor(platform)}>{platform}</Tag>
      ),
    },
    {
      title: '总粉丝数',
      dataIndex: 'followers',
      width: 110,
      sorter: (a, b) => a.followers - b.followers,
      render: (v: number) => formatNumber(v),
    },
    {
      title: '参加总任务数',
      dataIndex: 'taskCount',
      width: 120,
      sorter: (a, b) => a.taskCount - b.taskCount,
    },
    {
      title: '已发布内容数',
      dataIndex: 'contentCount',
      width: 120,
      sorter: (a, b) => a.contentCount - b.contentCount,
    },
    {
      title: '爆文数',
      dataIndex: 'viralCount',
      width: 90,
      sorter: (a, b) => a.viralCount - b.viralCount,
    },
    {
      title: '爆文率',
      dataIndex: 'viralRate',
      width: 100,
      sorter: (a, b) => a.viralRate - b.viralRate,
      render: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      title: '预估曝光量',
      dataIndex: 'exposure',
      width: 120,
      sorter: (a, b) => a.exposure - b.exposure,
      render: (v: number) => formatNumber(v),
    },
    {
      title: '预估阅读量',
      dataIndex: 'reads',
      width: 120,
      sorter: (a, b) => a.reads - b.reads,
      render: (v: number) => formatNumber(v),
    },
    {
      title: '总评论数',
      dataIndex: 'comments',
      width: 110,
      sorter: (a, b) => a.comments - b.comments,
      render: (v: number) => formatNumber(v),
    },
    {
      title: '总有效咨询数',
      dataIndex: 'consults',
      width: 130,
      sorter: (a, b) => a.consults - b.consults,
    },
    {
      title: '有效咨询率',
      dataIndex: 'consultRate',
      width: 120,
      sorter: (a, b) => a.consultRate - b.consultRate,
      render: (v: number) => `${v.toFixed(1)}%`,
    },
  ];

  const avgFollowers = selectedRows.length
    ? Math.round(selectedRows.reduce((s, i) => s + i.followers, 0) / selectedRows.length)
    : 0;
  const avgViral = selectedRows.length
    ? selectedRows.reduce((s, i) => s + i.viralRate, 0) / selectedRows.length
    : 0;
  const avgConsult = selectedRows.length
    ? selectedRows.reduce((s, i) => s + i.consultRate, 0) / selectedRows.length
    : 0;
  const topByFollowers = [...selectedRows].sort((a, b) => b.followers - a.followers)[0];
  const topByViral = [...selectedRows].sort((a, b) => b.viralRate - a.viralRate)[0];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Form
          form={form}
          layout="inline"
          style={{ rowGap: 12 }}
          initialValues={{ platform: '' }}
          onFinish={(values) => setFilters(values)}
        >
          <Form.Item name="name" label="KOC名称">
            <Input allowClear placeholder="支持关键词模糊查询" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item name="platform" label="平台">
            <Select options={KOC_PLATFORM_OPTIONS} style={{ width: 120 }} />
          </Form.Item>
          <Form.Item label="爆文率(%)">
            <Space>
              <Form.Item name="viralMin" noStyle>
                <InputNumber min={0} max={100} placeholder="最小" style={{ width: 90 }} />
              </Form.Item>
              <span>-</span>
              <Form.Item name="viralMax" noStyle>
                <InputNumber min={0} max={100} placeholder="最大" style={{ width: 90 }} />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="有效咨询率(%)">
            <Space>
              <Form.Item name="consultMin" noStyle>
                <InputNumber min={0} max={100} placeholder="最小" style={{ width: 90 }} />
              </Form.Item>
              <span>-</span>
              <Form.Item name="consultMax" noStyle>
                <InputNumber min={0} max={100} placeholder="最大" style={{ width: 90 }} />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item>
            <Space wrap>
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
                onClick={() => message.success(`已导出当前 ${dataSource.length} 条（mock）`)}
              >
                下载表格
              </Button>
              <Button type="primary" icon={<ThunderboltOutlined />} onClick={openAi}>
                AI 智能分析
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
          scroll={{ x: 1500 }}
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
        summaryTitle={`KOC价值分析总结 ${selectedRows.length}位KOC`}
        steps={AI_ANALYSIS_STEPS}
        summary={
          <>
            <Paragraph>
              通过对当前已选 {selectedRows.length} 位 KOC
              的深度数据分析，总结出以下高价值 KOC 的核心规律：
            </Paragraph>
            <Paragraph>
              <Text strong>1. 粉丝与互动表现：</Text>
              平均粉丝约 {formatNumber(avgFollowers)}，平均爆文率 {avgViral.toFixed(1)}%，平均有效咨询率{' '}
              {avgConsult.toFixed(1)}%。
              {topByFollowers
                ? `粉丝表现最佳为「${topByFollowers.name}」（${formatNumber(topByFollowers.followers)}）。`
                : ''}
            </Paragraph>
            <Paragraph>
              <Text strong>2. 爆文与转化：</Text>
              {topByViral ? `爆文率最高为「${topByViral.name}」（${topByViral.viralRate.toFixed(1)}%），` : ''}
              建议优先投放爆文率与咨询率双高的账号，并复用其内容结构做规模化种草。
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text strong>3. 运营建议：</Text>
              对高互动账号提高任务频次，对高咨询率账号加强门店/线索承接；低爆文账号可先做素材共创再放量。
            </Paragraph>
          </>
        }
        selectedRows={selectedRows}
        rowKey="key"
        selectedColumns={[
          { title: 'KOC', dataIndex: 'name', ellipsis: true },
          { title: '平台', dataIndex: 'platform', width: 80 },
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
        downloadText={`下载已选KOC数据（${selectedRows.length}位）`}
        onDownload={() => message.success(`已下载已选 ${selectedRows.length} 位 KOC 数据（mock）`)}
      />
    </Space>
  );
}
