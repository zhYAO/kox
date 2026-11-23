import {
  AlertOutlined,
  BankOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
  RiseOutlined,
  SearchOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  BUDGET_KPIS,
  MOCK_ACTIVITY_BUDGETS,
  MONTHLY_TREND,
  activityProgress,
  formatPoints,
  getMonthBudgets,
  getRechargeRecords,
  setMonthBudgets,
  setRechargeRecords,
  usageRate,
  type ActivityBudget,
  type MonthBudget,
  type RechargeRecord,
} from '@/mock/budget';
import './index.css';

const { Text, Title, Paragraph, Link } = Typography;

type MainTab = 'overview' | 'recharge';
type ActivityTab = '全部活动' | '进行中' | '预警活动' | '已完成';

export default function BudgetPage() {
  const [mainTab, setMainTab] = useState<MainTab>('overview');
  const [timeFilter, setTimeFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [taskFilter, setTaskFilter] = useState('');
  const [activityTab, setActivityTab] = useState<ActivityTab>('全部活动');
  const [keyword, setKeyword] = useState('');
  const [months, setMonths] = useState<MonthBudget[]>(() => [...getMonthBudgets()]);
  const [recharges, setRecharges] = useState<RechargeRecord[]>(() => [...getRechargeRecords()]);

  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [usageOpen, setUsageOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<MonthBudget | null>(null);
  const [usageValue, setUsageValue] = useState<number | null>(null);

  const [createForm] = Form.useForm();
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartIns = useRef<EChartsType | null>(null);

  const activities = useMemo(() => {
    return MOCK_ACTIVITY_BUDGETS.filter((item) => {
      if (activityTab === '进行中' && item.status !== '进行中') return false;
      if (activityTab === '预警活动' && item.status !== '预警') return false;
      if (activityTab === '已完成' && item.status !== '已完成') return false;
      return true;
    });
  }, [activityTab]);

  const monthData = useMemo(() => {
    if (!keyword.trim()) return months;
    return months.filter((item) => item.name.includes(keyword.trim()) || item.month.includes(keyword.trim()));
  }, [months, keyword]);

  useEffect(() => {
    if (mainTab !== 'overview' || !chartRef.current) return;
    chartIns.current?.dispose();
    const chart = echarts.init(chartRef.current);
    chartIns.current = chart;
    chart.setOption({
      color: ['#1677ff', '#52c41a'],
      tooltip: { trigger: 'axis' },
      legend: { data: ['实际支出', '预算限额'], right: 0 },
      grid: { left: 50, right: 20, top: 40, bottom: 30 },
      xAxis: { type: 'category', data: MONTHLY_TREND.months },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: (v: number) => `${v}.0万` },
      },
      series: [
        { name: '实际支出', type: 'line', smooth: true, data: MONTHLY_TREND.actual },
        { name: '预算限额', type: 'line', smooth: true, data: MONTHLY_TREND.limit },
      ],
    });
    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
      chartIns.current = null;
    };
  }, [mainTab]);

  const syncMonths = (next: MonthBudget[]) => {
    setMonthBudgets(next);
    setMonths(next);
  };

  const syncRecharges = (next: RechargeRecord[]) => {
    setRechargeRecords(next);
    setRecharges(next);
  };

  const openDetail = (record: MonthBudget) => {
    setCurrentMonth(record);
    setDetailOpen(true);
  };

  const openUsage = (record: MonthBudget) => {
    setCurrentMonth(record);
    setUsageValue(record.used);
    setUsageOpen(true);
  };

  const detailRecords = useMemo(() => {
    if (!currentMonth) return [];
    return recharges.filter((item) => item.month === currentMonth.month);
  }, [currentMonth, recharges]);

  const columns: ColumnsType<MonthBudget> = [
    { title: '月份', dataIndex: 'month', width: 110, sorter: (a, b) => a.month.localeCompare(b.month) },
    { title: '预算名称', dataIndex: 'name', ellipsis: true },
    {
      title: '充值积分',
      dataIndex: 'recharged',
      width: 130,
      sorter: (a, b) => a.recharged - b.recharged,
      render: (v: number) => formatPoints(v),
    },
    {
      title: '已使用 (积分)',
      dataIndex: 'used',
      width: 140,
      sorter: (a, b) => a.used - b.used,
      render: (v: number, record) => (
        <Link onClick={() => openUsage(record)}>{formatPoints(v)}</Link>
      ),
    },
    {
      title: '余额 (积分)',
      key: 'balance',
      width: 130,
      sorter: (a, b) => a.recharged - a.used - (b.recharged - b.used),
      render: (_, record) => formatPoints(record.recharged - record.used),
    },
    {
      title: '使用率',
      key: 'rate',
      width: 100,
      sorter: (a, b) => usageRate(a.recharged, a.used) - usageRate(b.recharged, b.used),
      render: (_, record) => `${usageRate(record.recharged, record.used)}%`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      render: (status: MonthBudget['status']) => {
        if (status === '正常') {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              正常
            </Tag>
          );
        }
        if (status === '预警') {
          return (
            <Tag icon={<WarningOutlined />} color="warning">
              预警
            </Tag>
          );
        }
        return (
          <Tag icon={<ExclamationCircleOutlined />} color="error">
            已关停
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space>
          <Link onClick={() => openDetail(record)}>充值明细</Link>
          <Link onClick={() => openUsage(record)}>录入使用</Link>
          <Link
            type="danger"
            onClick={() => {
              Modal.confirm({
                title: '确认删除该月预算？',
                content: record.name,
                okText: '删除',
                okButtonProps: { danger: true },
                onOk: () => {
                  syncMonths(months.filter((item) => item.key !== record.key));
                  message.success('已删除（mock）');
                },
              });
            }}
          >
            删除
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="budget-page">
      <Tabs
        activeKey={mainTab}
        onChange={(key) => setMainTab(key as MainTab)}
        items={[
          { key: 'overview', label: '预算概览' },
          { key: 'recharge', label: '预算充值' },
        ]}
      />

      {mainTab === 'overview' && (
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
          <Space wrap>
            <Select
              value={timeFilter}
              onChange={setTimeFilter}
              style={{ width: 140 }}
              options={[
                { label: '全部时间', value: '' },
                { label: '2026年', value: '2026' },
                { label: '近90天', value: '90' },
              ]}
            />
            <Select
              value={platformFilter}
              onChange={setPlatformFilter}
              style={{ width: 140 }}
              options={[
                { label: '全部平台', value: '' },
                { label: '小红书', value: '小红书' },
                { label: '抖音', value: '抖音' },
              ]}
            />
            <Select
              value={taskFilter}
              onChange={setTaskFilter}
              style={{ width: 140 }}
              options={[
                { label: '全部任务', value: '' },
                { label: '营销任务', value: '营销' },
                { label: '门店任务', value: '门店' },
              ]}
            />
            <Button type="primary" onClick={() => message.success('已按条件查询（mock）')}>
              查询
            </Button>
          </Space>

          <div className="budget-kpi-row">
            <KpiCard
              label="年度总预算"
              value={`${BUDGET_KPIS.annualTotal.toFixed(1)}万 积分`}
              icon={<FileTextOutlined />}
              tone="purple"
            />
            <KpiCard
              label="已使用"
              value={`${BUDGET_KPIS.used.toFixed(1)}万 积分`}
              icon={<RiseOutlined />}
              tone="blue"
            />
            <KpiCard
              label="剩余预算"
              value={`${BUDGET_KPIS.remain.toFixed(1)}万 积分`}
              icon={<BankOutlined />}
              tone="green"
            />
            <KpiCard
              label="预警活动"
              value={`${BUDGET_KPIS.warnCount}个`}
              icon={<AlertOutlined />}
              tone="red"
            />
          </div>

          <Card title={<span className="budget-section-title">月度预算趋势</span>}>
            <div ref={chartRef} style={{ width: '100%', height: 320 }} />
          </Card>

          <Card
            title={<span className="budget-section-title">活动预算进度</span>}
            tabList={[
              { key: '全部活动', tab: '全部活动' },
              { key: '进行中', tab: '进行中' },
              { key: '预警活动', tab: '预警活动' },
              { key: '已完成', tab: '已完成' },
            ]}
            activeTabKey={activityTab}
            onTabChange={(key) => setActivityTab(key as ActivityTab)}
          >
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {activities.map((item) => (
                <ActivityCard key={item.key} item={item} />
              ))}
              {!activities.length && <Text type="secondary">暂无活动</Text>}
            </Space>
          </Card>
        </Space>
      )}

      {mainTab === 'recharge' && (
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
          <div className="budget-recharge-head">
            <div>
              <Title level={4} style={{ margin: 0 }}>
                预算充值
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                月度预算使用与余额一览，可新建预算并充值。
              </Paragraph>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                createForm.resetFields();
                createForm.setFieldsValue({ month: dayjs('2026-08'), warnRate: 90, shutdown: false });
                setCreateOpen(true);
              }}
            >
              新建预算
            </Button>
          </div>

          <Card
            title="月度预算使用与余额"
            extra={
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="搜索预算名称"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ width: 220 }}
              />
            }
          >
            <Paragraph type="secondary">
              各月充值积分、已使用、余额及使用率；超出阈值将标记预警或已关停。操作中可查看充值明细。
            </Paragraph>
            <Table
              rowKey="key"
              columns={columns}
              dataSource={monthData}
              pagination={{ showTotal: (total) => `共 ${total} 条` }}
            />
          </Card>
        </Space>
      )}

      <Drawer
        title="新建预算"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        width={480}
        destroyOnClose
      >
        <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
          <Text type="secondary">
            按以下顺序填写：预算名称 -&gt; 选择预算归属月份 -&gt; 设定预警与关停 -&gt; 填写充值金额后确认充值。
          </Text>
        </Card>
        <Form form={createForm} layout="vertical">
          <Form.Item name="name" label="预算名称（选填）">
            <Input placeholder="如: Q1 营销预算" />
          </Form.Item>
          <Form.Item name="month" label="选择预算归属月份" rules={[{ required: true, message: '请选择月份' }]}>
            <DatePicker picker="month" style={{ width: '100%' }} />
          </Form.Item>
          <Card size="small" title="预算预警与关停设置" style={{ marginBottom: 16 }}>
            <Paragraph type="secondary" style={{ fontSize: 12 }}>
              当某月预算使用超过设定比例时，将进行提醒；若启用关停，则自动关停该月相关任务。
            </Paragraph>
            <Space>
              <Text>预算超</Text>
              <Form.Item name="warnRate" noStyle>
                <InputNumber min={1} max={100} />
              </Form.Item>
              <Text>% 做提醒</Text>
            </Space>
            <div style={{ marginTop: 12 }}>
              <Form.Item name="shutdown" valuePropName="checked" noStyle>
                <Checkbox>超过上述比例时关停当月任务</Checkbox>
              </Form.Item>
            </div>
            <Button style={{ marginTop: 12 }} onClick={() => message.success('预警设置已保存（mock）')}>
              保存设置
            </Button>
          </Card>
          <Form.Item name="points" label="充值积分" rules={[{ required: true, message: '请输入积分数量' }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入积分数量" />
          </Form.Item>
          <Form.Item name="remark" label="备注（可选）">
            <Input placeholder="如: Q1 营销预算" />
          </Form.Item>
          <Button
            type="primary"
            block
            icon={<PlusOutlined />}
            onClick={async () => {
              const values = await createForm.validateFields();
              const month = values.month.format('YYYY-MM');
              const name = values.name || `${Number(month.slice(5))}月营销预算`;
              const points = Number(values.points);
              const next: MonthBudget = {
                key: `m_${Date.now()}`,
                month,
                name,
                recharged: points,
                used: 0,
                warnRate: values.warnRate || 90,
                shutdown: !!values.shutdown,
                status: '正常',
              };
              syncMonths([next, ...months.filter((item) => item.month !== month)]);
              syncRecharges([
                {
                  key: `r_${Date.now()}`,
                  month,
                  time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                  points,
                  remark: values.remark || name,
                },
                ...recharges,
              ]);
              message.success('已确认充值（mock）');
              setCreateOpen(false);
              setMainTab('recharge');
            }}
          >
            确认充值
          </Button>
        </Form>
      </Drawer>

      <Modal
        title="充值明细"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={<Button onClick={() => setDetailOpen(false)}>关闭</Button>}
        width={640}
      >
        {currentMonth && (
          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            <Card size="small">归属月份：{currentMonth.month}</Card>
            <Card size="small">
              充值次数：{detailRecords.length} 次　充值总额：
              {formatPoints(detailRecords.reduce((s, i) => s + i.points, 0))} 积分
            </Card>
            <Table
              size="small"
              rowKey="key"
              pagination={false}
              dataSource={detailRecords}
              columns={[
                { title: '序号', width: 60, render: (_, __, index) => index + 1 },
                { title: '充值时间', dataIndex: 'time', width: 170 },
                {
                  title: '充值积分',
                  dataIndex: 'points',
                  width: 120,
                  render: (v: number) => <Text strong>{formatPoints(v)}</Text>,
                },
                { title: '备注', dataIndex: 'remark' },
              ]}
            />
          </Space>
        )}
      </Modal>

      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            录入使用金额
          </Space>
        }
        open={usageOpen}
        onCancel={() => setUsageOpen(false)}
        onOk={() => {
          if (!currentMonth || usageValue == null) return;
          const rate = usageRate(currentMonth.recharged, usageValue);
          const status: MonthBudget['status'] =
            rate >= (currentMonth.warnRate || 90) ? (currentMonth.shutdown ? '已关停' : '预警') : '正常';
          syncMonths(
            months.map((item) =>
              item.key === currentMonth.key ? { ...item, used: usageValue, status } : item,
            ),
          );
          message.success('已更新使用金额（mock）');
          setUsageOpen(false);
        }}
        okText="确定"
        cancelText="取消"
      >
        {currentMonth && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>月份：{currentMonth.month}</Text>
            <Text>当前已使用：{formatPoints(currentMonth.used)} 积分</Text>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={currentMonth.recharged}
              value={usageValue ?? undefined}
              onChange={(v) => setUsageValue(v)}
            />
          </Space>
        )}
      </Modal>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone: string;
}) {
  return (
    <Card className={`budget-kpi tone-${tone}`} styles={{ body: { padding: 16 } }}>
      <div className="budget-kpi-inner">
        <div>
          <Text type="secondary">{label}</Text>
          <div className="budget-kpi-value">{value}</div>
        </div>
        <div className="budget-kpi-icon">{icon}</div>
      </div>
    </Card>
  );
}

function ActivityCard({ item }: { item: ActivityBudget }) {
  const percent = activityProgress(item);
  return (
    <Card size="small" className="budget-activity-card">
      <div className="budget-activity-head">
        <Text strong>{item.name}</Text>
        <Tag color={item.status === '进行中' ? 'processing' : item.status === '预警' ? 'warning' : 'default'}>
          {item.status === '预警' ? '预警' : item.status}
        </Tag>
      </div>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {item.category}　{item.startDate} 至 {item.endDate}
      </Text>
      <div style={{ marginTop: 10 }}>
        <Progress percent={percent} strokeColor="#1677ff" />
      </div>
      <div className="budget-activity-foot">
        <Text type="secondary">
          总预算 {item.total.toFixed(1)}万　已使用 {item.used.toFixed(1)}万　剩余{' '}
          {(item.total - item.used).toFixed(1)}万
        </Text>
        <Link onClick={() => message.info(`${item.name} 详情（mock）`)}>详情 &gt;</Link>
      </div>
    </Card>
  );
}
