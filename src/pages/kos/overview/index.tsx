import { QuestionCircleOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, DatePicker, Row, Space, Table, Tabs, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';
import type { Dayjs } from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  KOS_ACCOUNT_OVERVIEW,
  KOS_EMPLOYEE_RANKS,
  KOS_MONTHLY_TREND,
  KOS_MONTH_KPIS,
  KOS_NOTE_RANKS,
  formatKosNumber,
  type KosEmployeeRank,
  type KosNoteRank,
} from '@/mock/kosOverview';
import './index.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type NoteRankTab = 'reads' | 'interaction' | 'validComments';

export default function KosOverviewPage() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartIns = useRef<EChartsType | null>(null);

  const [empRange, setEmpRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [noteRange, setNoteRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [noteTab, setNoteTab] = useState<NoteRankTab>('reads');

  const employees = useMemo(() => {
    if (!empRange) return KOS_EMPLOYEE_RANKS;
    return KOS_EMPLOYEE_RANKS.filter((_, idx) => idx < 6);
  }, [empRange]);

  const notes = useMemo(() => {
    const list = [...KOS_NOTE_RANKS];
    if (noteTab === 'reads') {
      list.sort((a, b) => b.reads - a.reads);
    } else if (noteTab === 'interaction') {
      list.sort((a, b) => b.likes + b.collects + b.comments - (a.likes + a.collects + a.comments));
    } else {
      list.sort((a, b) => b.validComments - a.validComments);
    }
    if (noteRange) return list.slice(0, 5);
    return list;
  }, [noteTab, noteRange]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartIns.current?.dispose();
    const chart = echarts.init(chartRef.current);
    chartIns.current = chart;
    chart.setOption({
      color: ['#1677ff', '#52c41a', '#fa8c16', '#722ed1'],
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['月笔记数', '月曝光数', '月点赞数', '月收藏数'],
        top: 0,
      },
      grid: { left: 48, right: 24, top: 48, bottom: 32 },
      xAxis: {
        type: 'category',
        data: KOS_MONTHLY_TREND.map((d) => d.month),
        boundaryGap: false,
      },
      yAxis: [
        { type: 'value', name: '笔记数', position: 'left' },
        { type: 'value', name: '互动(万)', position: 'right' },
      ],
      series: [
        {
          name: '月笔记数',
          type: 'line',
          symbol: 'diamond',
          symbolSize: 8,
          data: KOS_MONTHLY_TREND.map((d) => d.notes),
        },
        {
          name: '月曝光数',
          type: 'line',
          yAxisIndex: 1,
          symbol: 'diamond',
          symbolSize: 8,
          data: KOS_MONTHLY_TREND.map((d) => d.exposure),
        },
        {
          name: '月点赞数',
          type: 'line',
          yAxisIndex: 1,
          symbol: 'diamond',
          symbolSize: 8,
          data: KOS_MONTHLY_TREND.map((d) => d.likes),
        },
        {
          name: '月收藏数',
          type: 'line',
          yAxisIndex: 1,
          symbol: 'diamond',
          symbolSize: 8,
          data: KOS_MONTHLY_TREND.map((d) => d.collects),
        },
      ],
    });

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
      chartIns.current = null;
    };
  }, []);

  const empColumns: ColumnsType<KosEmployeeRank> = [
    {
      title: '头像',
      dataIndex: 'name',
      width: 72,
      render: (_, row) => (
        <Avatar style={{ background: row.avatarColor }} icon={<UserOutlined />}>
          {row.name.slice(0, 1)}
        </Avatar>
      ),
    },
    {
      title: '用户信息',
      dataIndex: 'name',
      render: (_, row) => (
        <div className="kos-user-cell">
          <Text strong>{row.name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {row.dept}
          </Text>
        </div>
      ),
    },
    {
      title: (
        <Space size={4}>
          爆文数
          <Tooltip title="阅读量达到爆文阈值的笔记数量">
            <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'viralCount',
      width: 110,
      align: 'right',
      sorter: (a, b) => a.viralCount - b.viralCount,
      defaultSortOrder: 'descend',
    },
  ];

  const noteColumns: ColumnsType<KosNoteRank> = [
    {
      title: '封面',
      dataIndex: 'coverColor',
      width: 72,
      render: (color: string, row) => (
        <span className="kos-cover" style={{ background: color }}>
          笔记
        </span>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: (
        <Space size={4}>
          阅读互动数据
          <Tooltip title="阅读、点赞、收藏、评论等互动指标">
            <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
          </Tooltip>
        </Space>
      ),
      key: 'metrics',
      width: 160,
      render: (_, row) => {
        if (noteTab === 'reads') {
          return (
            <div className="kos-metric-stack">
              <span>阅读 {formatKosNumber(row.reads)}</span>
              <span>点赞 {formatKosNumber(row.likes)}</span>
            </div>
          );
        }
        if (noteTab === 'interaction') {
          return (
            <div className="kos-metric-stack">
              <span>点赞 {formatKosNumber(row.likes)}</span>
              <span>收藏 {formatKosNumber(row.collects)}</span>
              <span>评论 {formatKosNumber(row.comments)}</span>
            </div>
          );
        }
        return (
          <div className="kos-metric-stack">
            <span>有效评论 {formatKosNumber(row.validComments)}</span>
            <span>总评论 {formatKosNumber(row.comments)}</span>
          </div>
        );
      },
    },
    { title: '员工', dataIndex: 'employee', width: 90 },
    { title: '督导', dataIndex: 'supervisor', width: 90 },
    { title: '发布时间', dataIndex: 'publishTime', width: 150 },
  ];

  return (
    <div className="kos-overview-page">
      <Card className="kos-section-card" styles={{ body: { padding: 20 } }}>
        <Title level={5} className="kos-section-title">
          账号总览
        </Title>
        <div className="kos-account-grid">
          <div className="kos-account-item">
            <span className="kos-account-icon is-blue">
              <TeamOutlined />
            </span>
            <div>
              <div className="kos-account-label">
                账号总数
                <Tooltip title="已接入平台的 KOS 账号总量">
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>
              <div className="kos-account-value">
                {formatKosNumber(KOS_ACCOUNT_OVERVIEW.totalAccounts)}
              </div>
            </div>
          </div>
          <div className="kos-account-item">
            <span className="kos-account-icon is-orange">
              <UserOutlined />
            </span>
            <div>
              <div className="kos-account-label">
                账号总粉丝数
                <Tooltip title="全部 KOS 账号粉丝数合计">
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>
              <div className="kos-account-value">
                {formatKosNumber(KOS_ACCOUNT_OVERVIEW.totalFollowers, 'wan')}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="kos-section-card" styles={{ body: { padding: 20 } }}>
        <Title level={5} className="kos-section-title">
          笔记阅读互动数据
        </Title>
        <div className="kos-kpi-grid">
          {KOS_MONTH_KPIS.map((item) => (
            <div className="kos-kpi-item" key={item.key}>
              <div className="kos-kpi-label">{item.label}</div>
              <div className="kos-kpi-value">{formatKosNumber(item.value, item.format)}</div>
            </div>
          ))}
        </div>
        <div ref={chartRef} style={{ width: '100%', height: 360 }} />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}>
          <Card className="kos-section-card" styles={{ body: { padding: 20 } }}>
            <Title level={5} className="kos-section-title">
              员工排行榜
            </Title>
            <div className="kos-rank-toolbar">
              <RangePicker
                value={empRange}
                onChange={(v) => setEmpRange(v as [Dayjs, Dayjs] | null)}
                placeholder={['起始日期', '截止日期']}
                style={{ width: 260 }}
              />
              <Button
                onClick={() => {
                  setEmpRange(null);
                }}
              >
                重置
              </Button>
            </div>
            <Table
              rowKey="id"
              size="middle"
              columns={empColumns}
              dataSource={employees}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} xl={14}>
          <Card className="kos-section-card" styles={{ body: { padding: 20 } }}>
            <Title level={5} className="kos-section-title">
              笔记排行榜
            </Title>
            <div className="kos-rank-toolbar">
              <RangePicker
                value={noteRange}
                onChange={(v) => setNoteRange(v as [Dayjs, Dayjs] | null)}
                placeholder={['起始日期', '截止日期']}
                style={{ width: 260 }}
              />
              <Button
                onClick={() => {
                  setNoteRange(null);
                }}
              >
                重置
              </Button>
            </div>
            <Tabs
              activeKey={noteTab}
              onChange={(key) => setNoteTab(key as NoteRankTab)}
              items={[
                { key: 'reads', label: '查看阅读榜' },
                { key: 'interaction', label: '查看互动榜' },
                { key: 'validComments', label: '查看有效评论榜' },
              ]}
            />
            <Table
              rowKey="id"
              size="middle"
              columns={noteColumns}
              dataSource={notes}
              pagination={false}
              scroll={{ x: 720 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
