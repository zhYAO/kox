import { DownloadOutlined, InfoCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
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
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  DISPLAY_DAYS_OPTIONS,
  GROUP_OPTIONS,
  MOCK_KOS_TASK_ANALYSIS,
  formatKosTaskNumber,
  type KosTaskAnalysisRecord,
} from '@/mock/kosTaskAnalysis';

const { RangePicker } = DatePicker;
const { Text } = Typography;

type FilterValues = {
  displayDays?: string;
  group?: string;
  name?: string;
  contentType?: string;
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

export default function KosTaskAnalysisPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({ displayDays: '30', group: '' });

  const dataSource = useMemo(() => {
    return MOCK_KOS_TASK_ANALYSIS.filter((item) => {
      if (filters.group && item.userGroup !== filters.group) return false;
      if (filters.name && !item.name.includes(filters.name.trim())) return false;
      if (filters.contentType && !item.contentType.includes(filters.contentType.trim())) {
        return false;
      }
      if (!inRange(item.publishTime, filters.publishTime)) return false;
      return true;
    });
  }, [filters]);

  const columns: ColumnsType<KosTaskAnalysisRecord> = [
    {
      title: '任务名称',
      dataIndex: 'name',
      fixed: 'left',
      width: 180,
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: '任务发布时间',
      dataIndex: 'publishTime',
      width: 160,
      sorter: (a, b) => dayjs(a.publishTime).valueOf() - dayjs(b.publishTime).valueOf(),
    },
    { title: '下发用户组', dataIndex: 'userGroup', width: 120 },
    { title: '任务类型', dataIndex: 'taskType', width: 110 },
    { title: '内容类型', dataIndex: 'contentType', width: 110 },
    {
      title: tipTitle('已发布笔记数', '任务周期内已发布的笔记总量'),
      dataIndex: 'publishedNotes',
      width: 140,
      align: 'right',
      sorter: (a, b) => a.publishedNotes - b.publishedNotes,
    },
    {
      title: tipTitle('平均阅读数', '单篇笔记平均阅读量'),
      dataIndex: 'avgReads',
      width: 130,
      align: 'right',
      sorter: (a, b) => a.avgReads - b.avgReads,
      render: (v: number) => formatKosTaskNumber(v),
    },
    {
      title: tipTitle('平均互动数', '单篇笔记平均点赞+收藏+评论'),
      dataIndex: 'avgInteractions',
      width: 130,
      align: 'right',
      sorter: (a, b) => a.avgInteractions - b.avgInteractions,
      render: (v: number) => formatKosTaskNumber(v),
    },
    {
      title: tipTitle('平均有效客资数', '单篇笔记平均有效客资'),
      dataIndex: 'avgValidLeads',
      width: 150,
      align: 'right',
      sorter: (a, b) => a.avgValidLeads - b.avgValidLeads,
      render: (v: number) => v.toFixed(1),
    },
    {
      title: tipTitle('有效性指数', '综合阅读、互动、客资的加权指数'),
      dataIndex: 'effectivenessIndex',
      width: 130,
      align: 'right',
      sorter: (a, b) => a.effectivenessIndex - b.effectivenessIndex,
      render: (v: number) => v.toFixed(1),
    },
    {
      title: tipTitle('任务有效率', '有效笔记数 / 已发布笔记数'),
      dataIndex: 'taskEffectiveRate',
      width: 130,
      align: 'right',
      sorter: (a, b) => a.taskEffectiveRate - b.taskEffectiveRate,
      render: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      title: tipTitle('总阅读数', '任务全部笔记阅读量合计'),
      dataIndex: 'totalReads',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.totalReads - b.totalReads,
      render: (v: number) => formatKosTaskNumber(v),
    },
    {
      title: tipTitle('总互动数', '任务全部笔记互动量合计'),
      dataIndex: 'totalInteractions',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.totalInteractions - b.totalInteractions,
      render: (v: number) => formatKosTaskNumber(v),
    },
    {
      title: tipTitle('总有效客资', '任务全部有效客资合计'),
      dataIndex: 'totalValidLeads',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.totalValidLeads - b.totalValidLeads,
      render: (v: number) => formatKosTaskNumber(v),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card styles={{ body: { paddingBottom: 8 } }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ displayDays: '30', group: '' }}
          onFinish={(values) => setFilters(values)}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item label="展示天数" name="displayDays">
                <Select options={DISPLAY_DAYS_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item label="分组" name="group">
                <Select options={GROUP_OPTIONS} allowClear placeholder="全部" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item label="任务名称" name="name">
                <Input placeholder="请输入任务名称" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item label="内容类型" name="contentType">
                <Input placeholder="请输入内容类型" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
              <Form.Item label="发布日期范围" name="publishTime">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
              <Form.Item label=" ">
                <Space wrap>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      form.resetFields();
                      setFilters({ displayDays: '30', group: '' });
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => message.success(`已导出 ${dataSource.length} 条任务分析数据（mock）`)}
                  >
                    下载表格
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card styles={{ body: { paddingTop: 12 } }}>
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1800 }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
        />
      </Card>
    </Space>
  );
}
