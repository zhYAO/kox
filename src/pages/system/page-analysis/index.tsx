import { EyeOutlined, ReloadOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Select, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  MOCK_PAGE_MODULE_STATS,
  PAGE_MODULE_CATEGORY_OPTIONS,
  calcCtr,
  formatCtr,
  sumPageStats,
  type PageModuleCategory,
  type PageModuleStat,
} from '@/mock/systemPageAnalysis';
import './index.css';

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

type FilterValues = {
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
  category?: string;
};

export default function SystemPageAnalysisPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({ category: '' });

  const dataSource = useMemo(() => {
    return MOCK_PAGE_MODULE_STATS.filter((item) => {
      if (filters.category && item.category !== filters.category) return false;
      return true;
    });
  }, [filters]);

  const summary = useMemo(() => sumPageStats(dataSource), [dataSource]);

  const columns: ColumnsType<PageModuleStat> = [
    { title: '模块名称', dataIndex: 'name', width: 140 },
    { title: '模块编码', dataIndex: 'code', width: 220 },
    {
      title: '模块类别',
      dataIndex: 'category',
      width: 110,
      filters: [
        { text: '小程序', value: '小程序' },
        { text: '后台', value: '后台' },
        { text: 'H5', value: 'H5' },
      ],
      onFilter: (value, record) => record.category === value,
      render: (v: PageModuleCategory) => (
        <Text style={{ color: v === '小程序' ? '#52c41a' : v === 'H5' ? '#1677ff' : '#722ed1' }}>
          {v}
        </Text>
      ),
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      width: 110,
      align: 'right',
      sorter: (a, b) => a.views - b.views,
      render: (v: number) => v.toLocaleString('zh-CN'),
    },
    {
      title: 'UV',
      dataIndex: 'uv',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.uv - b.uv,
      render: (v: number) => v.toLocaleString('zh-CN'),
    },
    {
      title: '点击数',
      dataIndex: 'clicks',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.clicks - b.clicks,
      render: (v: number) => v.toLocaleString('zh-CN'),
    },
    {
      title: '点击率 (%)',
      key: 'ctr',
      width: 120,
      align: 'right',
      sorter: (a, b) => calcCtr(a.views, a.clicks) - calcCtr(b.views, b.clicks),
      render: (_, row) => formatCtr(row.views, row.clicks),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Form
          form={form}
          layout="inline"
          initialValues={{
            category: '',
            dateRange: [dayjs().subtract(29, 'day'), dayjs()],
          }}
          onFinish={(values) => setFilters(values)}
          style={{ rowGap: 12 }}
        >
          <Form.Item label="日期范围" name="dateRange">
            <RangePicker />
          </Form.Item>
          <Form.Item label="模块类别筛选" name="category">
            <Select
              style={{ width: 160 }}
              options={PAGE_MODULE_CATEGORY_OPTIONS}
              placeholder="全部模块"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<ReloadOutlined />}>
              查询
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <div className="page-analysis-kpis">
        <div className="page-analysis-kpi is-views">
          <span className="page-analysis-kpi-icon is-views">
            <EyeOutlined />
          </span>
          <div>
            <div className="page-analysis-kpi-label">总浏览量</div>
            <div className="page-analysis-kpi-value">{summary.views.toLocaleString('zh-CN')}</div>
          </div>
        </div>
        <div className="page-analysis-kpi is-uv">
          <span className="page-analysis-kpi-icon is-uv">
            <UserOutlined />
          </span>
          <div>
            <div className="page-analysis-kpi-label">总UV</div>
            <div className="page-analysis-kpi-value">{summary.uv.toLocaleString('zh-CN')}</div>
          </div>
        </div>
        <div className="page-analysis-kpi is-clicks">
          <span className="page-analysis-kpi-icon is-clicks">
            <ThunderboltOutlined />
          </span>
          <div>
            <div className="page-analysis-kpi-label">总点击数</div>
            <div className="page-analysis-kpi-value">{summary.clicks.toLocaleString('zh-CN')}</div>
          </div>
        </div>
      </div>

      <Card>
        <Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>
          模块详细数据
        </Title>
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Card>
    </Space>
  );
}
