import {
  ExportOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState, type Key } from 'react';
import AiAnalysisDrawer from '@/components/AiAnalysisDrawer';
import {
  MOCK_STORE_KOC,
  MOCK_STORE_RADAR,
  MOCK_STORE_RANKS,
  MOCK_STORE_SENTIMENT,
  MOCK_STORE_TREND,
  STORE_AI_STEPS,
  STORE_OFFICE_OPTIONS,
  formatStoreNumber,
  type StoreKocDetail,
  type StoreOfficeRank,
} from '@/mock/storeAnalysis';
import './index.css';

const { RangePicker } = DatePicker;
const { Paragraph, Text, Title } = Typography;

type TabKey = 'rank' | 'radar' | 'trend' | 'sentiment' | 'koc';

function tip(label: string, desc: string) {
  return (
    <Space size={4}>
      {label}
      <Tooltip title={desc}>
        <InfoCircleOutlined />
      </Tooltip>
    </Space>
  );
}

export default function StoreAnalysisPage() {
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs('2026-07-03'),
    dayjs('2026-08-01'),
  ]);
  const [officeFilter, setOfficeFilter] = useState('');
  const [tab, setTab] = useState<TabKey>('rank');
  const [radarOffice, setRadarOffice] = useState('总部1');
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [aiOpen, setAiOpen] = useState(false);

  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartIns = useRef<EChartsType | null>(null);

  const ranks = useMemo(() => {
    if (!officeFilter) return MOCK_STORE_RANKS;
    return MOCK_STORE_RANKS.filter((item) => item.office === officeFilter);
  }, [officeFilter]);

  const kocList = useMemo(() => {
    if (!officeFilter) return MOCK_STORE_KOC;
    return MOCK_STORE_KOC.filter((item) => item.office === officeFilter);
  }, [officeFilter]);

  const selectedRows = useMemo(
    () => MOCK_STORE_RANKS.filter((item) => selectedKeys.includes(item.key)),
    [selectedKeys],
  );

  useEffect(() => {
    if (chartIns.current) {
      chartIns.current.dispose();
      chartIns.current = null;
    }
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chartIns.current = chart;

    if (tab === 'radar') {
      const data =
        MOCK_STORE_RADAR.find((item) => item.office === radarOffice) || MOCK_STORE_RADAR[0];
      chart.setOption({
        color: ['#1677ff'],
        tooltip: {},
        radar: {
          indicator: [
            { name: 'KOC活跃率', max: 100 },
            { name: '任务完成率', max: 100 },
            { name: '发文量', max: 100 },
            { name: '互动声量', max: 100 },
            { name: '正向口碑', max: 100 },
          ],
        },
        series: [
          {
            type: 'radar',
            areaStyle: { opacity: 0.2 },
            data: [
              {
                name: data.office,
                value: [data.activeRate, data.completeRate, data.postVolume, data.voice, data.reputation],
              },
            ],
          },
        ],
      });
    }

    if (tab === 'trend') {
      chart.setOption({
        color: ['#1677ff', '#13c2c2'],
        tooltip: { trigger: 'axis' },
        legend: { data: ['互动量', '发文量'] },
        grid: { left: 48, right: 24, top: 40, bottom: 28 },
        xAxis: { type: 'category', data: MOCK_STORE_TREND.map((d) => d.date) },
        yAxis: [
          { type: 'value', name: '互动' },
          { type: 'value', name: '发文', splitLine: { show: false } },
        ],
        series: [
          {
            name: '互动量',
            type: 'line',
            smooth: true,
            data: MOCK_STORE_TREND.map((d) => d.interactions),
          },
          {
            name: '发文量',
            type: 'bar',
            yAxisIndex: 1,
            barWidth: 18,
            data: MOCK_STORE_TREND.map((d) => d.posts),
          },
        ],
      });
    }

    if (tab === 'sentiment') {
      chart.setOption({
        color: ['#52c41a', '#1677ff', '#ff4d4f'],
        tooltip: { trigger: 'item' },
        legend: { bottom: 0 },
        series: [
          {
            type: 'pie',
            radius: ['42%', '68%'],
            data: MOCK_STORE_SENTIMENT,
            label: { formatter: '{b}\n{d}%' },
          },
        ],
      });
    }

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
      chartIns.current = null;
    };
  }, [tab, radarOffice]);

  const rankColumns: ColumnsType<StoreOfficeRank> = [
    {
      title: tip('代表处', '按代表处维度汇总运营表现'),
      dataIndex: 'office',
      fixed: 'left',
      width: 140,
    },
    {
      title: tip('KOC活跃率', '周期内有发文/参与任务的 KOC 占比'),
      dataIndex: 'activeRate',
      width: 130,
      sorter: (a, b) => a.activeRate - b.activeRate,
      render: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      title: tip('任务完成率', '已完成任务数 / 下发任务数'),
      dataIndex: 'completeRate',
      width: 130,
      sorter: (a, b) => a.completeRate - b.completeRate,
      render: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      title: tip('发文篇数', '周期内发布内容总量'),
      dataIndex: 'postCount',
      width: 120,
      sorter: (a, b) => a.postCount - b.postCount,
    },
    {
      title: tip('互动总量', '点赞 + 收藏 + 评论'),
      dataIndex: 'interactions',
      width: 120,
      sorter: (a, b) => a.interactions - b.interactions,
      render: (v: number) => formatStoreNumber(v),
    },
    {
      title: tip('互动明细', '点赞 / 收藏 / 评论拆解'),
      key: 'detail',
      width: 200,
      render: (_, record) => (
        <Text type="secondary">
          赞 {formatStoreNumber(record.likes)} / 藏 {formatStoreNumber(record.collects)} / 评{' '}
          {formatStoreNumber(record.comments)}
        </Text>
      ),
    },
    {
      title: tip('正向评论占比', '正向情感评论占比'),
      dataIndex: 'positiveRate',
      width: 150,
      sorter: (a, b) => a.positiveRate - b.positiveRate,
      render: (v: number) => `${v.toFixed(1)}%`,
    },
  ];

  const kocColumns: ColumnsType<StoreKocDetail> = [
    { title: 'KOC昵称', dataIndex: 'name', width: 140 },
    { title: '代表处', dataIndex: 'office', width: 120 },
    {
      title: '平台',
      dataIndex: 'platform',
      width: 100,
      render: (v: string) => <Tag color="blue">{v}</Tag>,
    },
    { title: '参与任务数', dataIndex: 'tasks', width: 110, sorter: (a, b) => a.tasks - b.tasks },
    { title: '发文数', dataIndex: 'posts', width: 90, sorter: (a, b) => a.posts - b.posts },
    {
      title: '互动量',
      dataIndex: 'interactions',
      width: 110,
      sorter: (a, b) => a.interactions - b.interactions,
      render: (v: number) => formatStoreNumber(v),
    },
    {
      title: '正向评论占比',
      dataIndex: 'positiveRate',
      width: 130,
      sorter: (a, b) => a.positiveRate - b.positiveRate,
      render: (v: number) => `${v.toFixed(1)}%`,
    },
    { title: '最近活跃', dataIndex: 'lastActive', width: 120 },
  ];

  const topOffice = [...ranks].sort((a, b) => b.interactions - a.interactions)[0];

  return (
    <div className="store-analysis">
      <div className="store-header">
        <Title level={4} style={{ margin: 0 }}>
          门店运营分析
        </Title>
        <Space wrap>
          <Text type="secondary">活动时间周期</Text>
          <RangePicker value={range} onChange={(v) => v && setRange(v as [dayjs.Dayjs, dayjs.Dayjs])} />
          <Select
            value={officeFilter}
            onChange={setOfficeFilter}
            options={STORE_OFFICE_OPTIONS}
            style={{ width: 160 }}
          />
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={() => {
              if (!ranks.length) {
                message.warning('暂无代表处数据');
                return;
              }
              setSelectedKeys(ranks.map((item) => item.key));
              setAiOpen(true);
            }}
          >
            AI 智能分析
          </Button>
        </Space>
      </div>

      <Card className="store-main-card">
        <Tabs
          activeKey={tab}
          onChange={(key) => setTab(key as TabKey)}
          items={[
            { key: 'rank', label: '排名' },
            { key: 'radar', label: '代表处雷达' },
            { key: 'trend', label: '代表处互动趋势' },
            { key: 'sentiment', label: '情感分析' },
            { key: 'koc', label: 'KOC 明细' },
          ]}
        />

        {tab === 'rank' && (
          <>
            <div className="store-tab-actions">
              <Button
                icon={<ExportOutlined />}
                onClick={() => message.success(`已导出 ${ranks.length} 条排名（mock）`)}
              >
                导出
              </Button>
            </div>
            <Table
              rowKey="key"
              columns={rankColumns}
              dataSource={ranks}
              scroll={{ x: 1100 }}
              rowSelection={{
                selectedRowKeys: selectedKeys,
                onChange: setSelectedKeys,
              }}
              pagination={false}
            />
          </>
        )}

        {tab === 'radar' && (
          <div>
            <Space wrap style={{ marginBottom: 12 }}>
              <Select
                value={radarOffice}
                onChange={setRadarOffice}
                options={STORE_OFFICE_OPTIONS.filter((o) => o.value)}
                style={{ width: 160 }}
              />
              <Text type="secondary">
                5 维度综合运营能力（KOC活跃率 / 任务完成率 / 发文量 / 互动声量 / 正向口碑）
              </Text>
            </Space>
            <div ref={chartRef} style={{ width: '100%', height: 420 }} />
          </div>
        )}

        {(tab === 'trend' || tab === 'sentiment') && (
          <div ref={chartRef} style={{ width: '100%', height: 420 }} />
        )}

        {tab === 'koc' && (
          <Table
            rowKey="key"
            columns={kocColumns}
            dataSource={kocList}
            pagination={{
              showTotal: (total) => `共 ${total} 条`,
              defaultPageSize: 10,
            }}
          />
        )}
      </Card>

      <AiAnalysisDrawer
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        summaryTitle={`门店运营分析总结 ${selectedRows.length || ranks.length}个代表处`}
        steps={STORE_AI_STEPS}
        summary={
          <>
            <Paragraph>
              周期 {range[0].format('YYYY-MM-DD')} ~ {range[1].format('YYYY-MM-DD')} 内，
              {topOffice
                ? `互动表现最佳为「${topOffice.office}」（${formatStoreNumber(topOffice.interactions)}），任务完成率 ${topOffice.completeRate.toFixed(1)}%。`
                : '暂无代表处数据。'}
            </Paragraph>
            <Paragraph>
              <Text strong>1. 活跃与完成：</Text>
              高完成率代表处通常伴随更高发文量，建议将华东/总部的任务节奏复制到偏低代表处。
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text strong>2. 口碑与互动：</Text>
              正向评论占比较高的代表处可优先投流加热；偏低代表处先做内容共创与话术规范。
            </Paragraph>
          </>
        }
        selectedRows={selectedRows.length ? selectedRows : ranks}
        rowKey="key"
        selectedColumns={[
          { title: '代表处', dataIndex: 'office', ellipsis: true },
          {
            title: '活跃率',
            dataIndex: 'activeRate',
            width: 80,
            render: (v: number) => `${v.toFixed(1)}%`,
          },
          {
            title: '完成率',
            dataIndex: 'completeRate',
            width: 80,
            render: (v: number) => `${v.toFixed(1)}%`,
          },
          {
            title: '互动',
            dataIndex: 'interactions',
            width: 80,
            render: (v: number) => formatStoreNumber(v),
          },
        ]}
        downloadText={`下载代表处数据（${(selectedRows.length ? selectedRows : ranks).length}个）`}
        onDownload={() =>
          message.success(
            `已下载 ${(selectedRows.length ? selectedRows : ranks).length} 个代表处数据（mock）`,
          )
        }
      />
    </div>
  );
}
