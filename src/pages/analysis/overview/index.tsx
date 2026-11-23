import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  FileTextOutlined,
  FundOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Space, Tabs, Typography } from 'antd';
import * as echarts from 'echarts';
import type { EChartsOption, EChartsType } from 'echarts';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  CAR_ADS,
  CAR_CONTENT,
  CAR_POINTS,
  CAR_VOICE,
  CHART_COLORS,
  OVERVIEW_KPIS,
  PLATFORM_ADS,
  PLATFORM_CONTENT,
  PLATFORM_POINTS,
  PLATFORM_VOICE,
  TASK_MONTHLY_TREND,
  TASK_STATUS_DIST,
  TASK_TYPE_DIST,
  type KpiItem,
  type NamedValue,
} from '@/mock/analysisOverview';
import './index.css';

const { Text } = Typography;

type DimKey = 'task' | 'car' | 'platform';

export default function AnalysisOverviewPage() {
  const [tab, setTab] = useState<DimKey>('task');
  const chartHosts = useRef<Record<string, HTMLDivElement | null>>({});
  const charts = useRef<EChartsType[]>([]);

  const setHost = (key: string) => (el: HTMLDivElement | null) => {
    chartHosts.current[key] = el;
  };

  useEffect(() => {
    charts.current.forEach((c) => c.dispose());
    charts.current = [];

    const mount = (key: string, option: EChartsOption) => {
      const el = chartHosts.current[key];
      if (!el) return;
      const chart = echarts.init(el);
      chart.setOption(option);
      charts.current.push(chart);
    };

    if (tab === 'task') {
      mount('taskType', donutOption('任务类型', TASK_TYPE_DIST));
      mount('taskStatus', donutOption('任务状态', TASK_STATUS_DIST));
      mount('taskTrend', {
        color: ['#1677ff'],
        tooltip: { trigger: 'axis' },
        grid: { left: 40, right: 20, top: 30, bottom: 30 },
        xAxis: { type: 'category', data: TASK_MONTHLY_TREND.months },
        yAxis: { type: 'value', name: '任务数' },
        series: [
          {
            type: 'bar',
            data: TASK_MONTHLY_TREND.values,
            barWidth: 28,
            itemStyle: { borderRadius: [4, 4, 0, 0] },
            label: { show: true, position: 'top' },
          },
        ],
      });
    }

    if (tab === 'car') {
      mount('carContent', barOption(CAR_CONTENT, '内容量', '#1677ff'));
      mount('carVoice', barOption(CAR_VOICE, '声量(万)', '#13c2c2'));
      mount('carPoints', barOption(CAR_POINTS, '积分', '#722ed1'));
      mount('carAds', barOption(CAR_ADS, '投流(万元)', '#fa8c16'));
    }

    if (tab === 'platform') {
      mount('pfContent', donutOption('内容量', PLATFORM_CONTENT));
      mount('pfVoice', donutOption('声量占比', PLATFORM_VOICE));
      mount('pfPoints', donutOption('积分消耗', PLATFORM_POINTS));
      mount('pfAds', donutOption('投流消耗', PLATFORM_ADS));
    }

    const onResize = () => charts.current.forEach((c) => c.resize());
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      charts.current.forEach((c) => c.dispose());
      charts.current = [];
    };
  }, [tab]);

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Row gutter={[16, 16]}>
        {OVERVIEW_KPIS.map((item) => (
          <Col xs={24} sm={12} lg={8} xl={4} key={item.key}>
            <KpiCard item={item} />
          </Col>
        ))}
      </Row>

      <Card>
        <Tabs
          activeKey={tab}
          onChange={(key) => setTab(key as DimKey)}
          items={[
            { key: 'task', label: '任务维度' },
            { key: 'car', label: '车型维度' },
            { key: 'platform', label: '平台维度' },
          ]}
        />

        {tab === 'task' && (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <ChartBox title="任务类型分布" hostRef={setHost('taskType')} />
            </Col>
            <Col xs={24} lg={12}>
              <ChartBox title="任务状态分布" hostRef={setHost('taskStatus')} />
            </Col>
            <Col span={24}>
              <ChartBox title="任务发布月度趋势" hostRef={setHost('taskTrend')} height={320} />
            </Col>
          </Row>
        )}

        {tab === 'car' && (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <ChartBox title="各车型内容量" hostRef={setHost('carContent')} />
            </Col>
            <Col xs={24} lg={12}>
              <ChartBox title="各车型声量" hostRef={setHost('carVoice')} />
            </Col>
            <Col xs={24} lg={12}>
              <ChartBox title="各车型积分消耗" hostRef={setHost('carPoints')} />
            </Col>
            <Col xs={24} lg={12}>
              <ChartBox title="各车型投流消耗" hostRef={setHost('carAds')} />
            </Col>
          </Row>
        )}

        {tab === 'platform' && (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <ChartBox title="各平台内容量" hostRef={setHost('pfContent')} />
            </Col>
            <Col xs={24} lg={12}>
              <ChartBox title="各平台声量" hostRef={setHost('pfVoice')} />
            </Col>
            <Col xs={24} lg={12}>
              <ChartBox title="各平台积分消耗" hostRef={setHost('pfPoints')} />
            </Col>
            <Col xs={24} lg={12}>
              <ChartBox title="各平台投流消耗" hostRef={setHost('pfAds')} />
            </Col>
          </Row>
        )}
      </Card>
    </Space>
  );
}

function KpiCard({ item }: { item: KpiItem }) {
  const up = item.trend >= 0;
  return (
    <Card className="overview-kpi-card" styles={{ body: { padding: 16 } }}>
      <div className="overview-kpi-top">
        <Text type="secondary">{item.label}</Text>
        <span className={`overview-kpi-icon tone-${item.icon}`}>{kpiIcon(item.icon)}</span>
      </div>
      <div className="overview-kpi-value">{item.value}</div>
      <Text style={{ color: up ? '#52c41a' : '#ff4d4f', fontSize: 12 }}>
        {up ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {up ? '+' : ''}
        {item.trend.toFixed(1)}%
      </Text>
    </Card>
  );
}

function ChartBox({
  title,
  hostRef,
  height = 280,
}: {
  title: string;
  hostRef: (el: HTMLDivElement | null) => void;
  height?: number;
}) {
  return (
    <Card size="small" title={title} styles={{ body: { padding: 8 } }}>
      <div ref={hostRef} style={{ width: '100%', height }} />
    </Card>
  );
}

function kpiIcon(icon: KpiItem['icon']): ReactNode {
  if (icon === 'task') return <UnorderedListOutlined />;
  if (icon === 'user') return <UserOutlined />;
  if (icon === 'content') return <FileTextOutlined />;
  if (icon === 'voice') return <BarChartOutlined />;
  if (icon === 'points') return <ThunderboltOutlined />;
  return <FundOutlined />;
}

function donutOption(name: string, data: NamedValue[]): EChartsOption {
  return {
    color: CHART_COLORS,
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, type: 'scroll' },
    series: [
      {
        name,
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '46%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}\n{d}%' },
        data,
      },
    ],
  };
}

function barOption(data: NamedValue[], yName: string, color: string): EChartsOption {
  return {
    color: [color],
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 16, top: 30, bottom: 28 },
    xAxis: { type: 'category', data: data.map((d) => d.name), axisLabel: { interval: 0 } },
    yAxis: { type: 'value', name: yName },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.value),
        barWidth: 28,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top' },
      },
    ],
  };
}
