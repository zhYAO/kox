import {
  BarChartOutlined,
  CloseOutlined,
  FilterOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ReloadOutlined,
  TableOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Modal,
  Segmented,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  DEFAULT_DIMENSIONS,
  DEFAULT_METRICS,
  MOCK_REALTIME_REPORT,
  REPORT_DIMENSIONS,
  REPORT_METRICS,
  REPORT_TABS,
  formatMetric,
  type ReportDimensionKey,
  type ReportMetricKey,
  type ReportRow,
  type ReportTabKey,
} from '@/mock/trafficReport';
import './index.css';

const { RangePicker } = DatePicker;
const { Title, Link, Text } = Typography;

type ViewMode = 'table' | 'line' | 'bar' | 'pie';

const DIM_FIELD: Record<ReportDimensionKey, keyof ReportRow> = {
  date: 'date',
  agent: 'agent',
  account: 'account',
  campaign: 'campaign',
  creative: 'creative',
};

export default function TrafficReportPage() {
  const [tab, setTab] = useState<ReportTabKey>('realtime');
  const [dimensions, setDimensions] = useState<ReportDimensionKey[]>([...DEFAULT_DIMENSIONS]);
  const [metrics, setMetrics] = useState<ReportMetricKey[]>([...DEFAULT_METRICS]);
  const [rightAxis, setRightAxis] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs('2024-01-22'),
    dayjs('2024-02-28'),
  ]);
  const [dimModal, setDimModal] = useState(false);
  const [metricModal, setMetricModal] = useState(false);
  const [tempDims, setTempDims] = useState<ReportDimensionKey[]>([]);
  const [tempMetrics, setTempMetrics] = useState<ReportMetricKey[]>([]);

  const dataSource = useMemo(() => {
    const [start, end] = dateRange;
    return MOCK_REALTIME_REPORT.filter((item) => {
      const d = dayjs(item.date, 'YYYYMMDD');
      return !d.isBefore(start, 'day') && !d.isAfter(end, 'day');
    });
  }, [dateRange]);

  const columns: ColumnsType<ReportRow> = useMemo(() => {
    const dimCols: ColumnsType<ReportRow> = dimensions.map((key) => {
      const meta = REPORT_DIMENSIONS.find((d) => d.key === key)!;
      const field = DIM_FIELD[key];
      return {
        title: meta.label,
        dataIndex: field,
        width: key === 'date' ? 110 : 130,
        sorter: (a, b) => String(a[field]).localeCompare(String(b[field]), 'zh-CN'),
      };
    });
    const metricCols: ColumnsType<ReportRow> = metrics.map((key) => {
      const meta = REPORT_METRICS.find((m) => m.key === key)!;
      return {
        title: meta.label,
        dataIndex: key,
        width: 100,
        align: 'right' as const,
        sorter: (a, b) => Number(a[key]) - Number(b[key]),
        render: (v: number) => formatMetric(key, v),
      };
    });
    return [...dimCols, ...metricCols];
  }, [dimensions, metrics]);

  const reportTitle =
    tab === 'realtime'
      ? '聚光-实时账户报表'
      : REPORT_TABS.find((t) => t.key === tab)?.label || '报表';

  return (
    <div className="traffic-report-page">
      <Card styles={{ body: { paddingBottom: 0 } }}>
        <Tabs
          activeKey={tab}
          onChange={(k) => {
            setTab(k as ReportTabKey);
            message.info(`已切换到${REPORT_TABS.find((t) => t.key === k)?.label}`);
          }}
          items={REPORT_TABS.map((t) => ({ key: t.key, label: t.label }))}
        />
      </Card>

      <div className="traffic-report-body">
        <aside className="traffic-report-sider">
          <div>
            <div className="traffic-report-sider-block-title">维度</div>
            <div className="traffic-report-chip-list">
              {dimensions.map((key) => {
                const label = REPORT_DIMENSIONS.find((d) => d.key === key)?.label || key;
                return (
                  <div className="traffic-report-chip" key={key}>
                    <span>{label}</span>
                    <CloseOutlined
                      style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}
                      onClick={() => setDimensions((prev) => prev.filter((k) => k !== key))}
                    />
                  </div>
                );
              })}
            </div>
            <Button
              type="dashed"
              block
              style={{ marginTop: 10 }}
              onClick={() => {
                setTempDims(dimensions);
                setDimModal(true);
              }}
            >
              + 选择维度
            </Button>
          </div>

          <div>
            <div
              className="traffic-report-sider-block-title"
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <span>指标</span>
              <Space size={6}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  开启右轴
                </Text>
                <Switch size="small" checked={rightAxis} onChange={setRightAxis} />
              </Space>
            </div>
            <div className="traffic-report-chip-list">
              {metrics.map((key) => {
                const label = REPORT_METRICS.find((m) => m.key === key)?.label || key;
                return (
                  <div className="traffic-report-chip" key={key}>
                    <span>{label}</span>
                    <CloseOutlined
                      style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}
                      onClick={() => setMetrics((prev) => prev.filter((k) => k !== key))}
                    />
                  </div>
                );
              })}
            </div>
            <Button
              type="dashed"
              block
              style={{ marginTop: 10 }}
              onClick={() => {
                setTempMetrics(metrics);
                setMetricModal(true);
              }}
            >
              + 选择指标
            </Button>
          </div>
        </aside>

        <section className="traffic-report-main">
          <div className="traffic-report-toolbar">
            <div className="traffic-report-toolbar-left">
              <Title level={5} className="traffic-report-title">
                {reportTitle}
              </Title>
              <Link onClick={() => message.info('筛选条件已打开（mock）')}>
                <FilterOutlined /> 设置筛选条件
              </Link>
              <RangePicker
                value={dateRange}
                onChange={(v) => {
                  if (v?.[0] && v?.[1]) setDateRange([v[0], v[1]]);
                }}
              />
            </div>
            <div className="traffic-report-toolbar-right">
              <Segmented
                value={viewMode}
                onChange={(v) => setViewMode(v as ViewMode)}
                options={[
                  { value: 'table', icon: <TableOutlined /> },
                  { value: 'line', icon: <LineChartOutlined /> },
                  { value: 'bar', icon: <BarChartOutlined /> },
                  { value: 'pie', icon: <PieChartOutlined /> },
                ]}
              />
              <Select
                defaultValue="standard"
                style={{ width: 120 }}
                options={[{ label: '标准配色', value: 'standard' }]}
              />
              <Button onClick={() => message.success('已另存为新报表（mock）')}>另存为</Button>
              <Button type="primary" onClick={() => message.info(`分析模式${rightAxis ? '（含右轴）' : ''}（mock）`)}>
                分析
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => message.success('数据已刷新')}
              />
            </div>
          </div>

          {viewMode === 'table' ? (
            <Table
              rowKey="key"
              size="middle"
              columns={columns}
              dataSource={dataSource}
              scroll={{ x: Math.max(900, columns.length * 110) }}
              pagination={{
                pageSize: 10,
                showTotal: (t, range) => `第 ${range[0]}-${range[1]} 条 / 总共 ${t} 条`,
              }}
            />
          ) : (
            <Card>
              <Space direction="vertical" style={{ width: '100%', textAlign: 'center', padding: 40 }}>
                <Text type="secondary">
                  当前为{viewMode === 'line' ? '折线' : viewMode === 'bar' ? '柱状' : '饼图'}视图占位（mock）
                </Text>
                <Text>
                  已选指标：{metrics.map((k) => REPORT_METRICS.find((m) => m.key === k)?.label).join('、')}
                </Text>
                {rightAxis && <Tag color="blue">已开启右轴</Tag>}
                <Button type="link" onClick={() => setViewMode('table')}>
                  返回表格
                </Button>
              </Space>
            </Card>
          )}
        </section>
      </div>

      <Modal
        title="选择维度"
        open={dimModal}
        onCancel={() => setDimModal(false)}
        onOk={() => {
          if (!tempDims.length) {
            message.warning('请至少选择一个维度');
            return;
          }
          setDimensions(tempDims);
          setDimModal(false);
        }}
      >
        <Checkbox.Group
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          value={tempDims}
          onChange={(v) => setTempDims(v as ReportDimensionKey[])}
          options={REPORT_DIMENSIONS.map((d) => ({ label: d.label, value: d.key }))}
        />
      </Modal>

      <Modal
        title="选择指标"
        open={metricModal}
        onCancel={() => setMetricModal(false)}
        onOk={() => {
          if (!tempMetrics.length) {
            message.warning('请至少选择一个指标');
            return;
          }
          setMetrics(tempMetrics);
          setMetricModal(false);
        }}
        width={480}
      >
        <Checkbox.Group
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          value={tempMetrics}
          onChange={(v) => setTempMetrics(v as ReportMetricKey[])}
          options={REPORT_METRICS.map((m) => ({ label: m.label, value: m.key }))}
        />
      </Modal>
    </div>
  );
}
