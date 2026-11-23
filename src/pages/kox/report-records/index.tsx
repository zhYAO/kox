import {
  BarChartOutlined,
  BellOutlined,
  DeleteOutlined,
  EyeOutlined,
  AimOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
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
import { useMemo, useState } from 'react';
import {
  MOCK_REPORT_RECORDS,
  REPORT_STATUS_OPTIONS,
  REPORT_TYPE_OPTIONS,
  type ReportRecord,
} from '@/mock/reportRecords';

const { RangePicker } = DatePicker;
const { Link, Paragraph, Title } = Typography;

type FilterValues = {
  type?: string;
  status?: string;
  creator?: string;
  createTime?: [dayjs.Dayjs, dayjs.Dayjs];
};

export default function ReportRecordsPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({});
  const [records, setRecords] = useState<ReportRecord[]>(() => [...MOCK_REPORT_RECORDS]);
  const [viewing, setViewing] = useState<ReportRecord | null>(null);

  const dataSource = useMemo(() => {
    return records.filter((item) => {
      if (filters.type && item.type !== filters.type) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.creator && !item.creator.includes(filters.creator.trim())) return false;
      if (filters.createTime?.length === 2) {
        const [start, end] = filters.createTime;
        const current = dayjs(item.createTime);
        if (current.isBefore(start.startOf('day')) || current.isAfter(end.endOf('day'))) {
          return false;
        }
      }
      return true;
    });
  }, [filters, records]);

  const openDeleteConfirm = (record: ReportRecord) => {
    Modal.confirm({
      title: '确认删除该报告？',
      content: `删除后不可恢复：${record.title}`,
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () => {
        setRecords((prev) => prev.filter((item) => item.key !== record.key));
        message.success('报告已删除（mock）');
      },
    });
  };

  const columns: ColumnsType<ReportRecord> = [
    {
      title: '序号',
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: '报告类型',
      dataIndex: 'type',
      width: 130,
      render: (value: string) => <Tag color="processing">{value}</Tag>,
    },
    {
      title: '报告标题',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value: ReportRecord['status']) => (
        <Tag color={value === '已完成' ? 'success' : value === '处理中' ? 'warning' : 'error'}>
          {value}
        </Tag>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 120,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 180,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 180,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Link onClick={() => setViewing(record)}>
            <EyeOutlined /> 查看结果
          </Link>
          <Link type="danger" onClick={() => openDeleteConfirm(record)}>
            <DeleteOutlined /> 删除
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card size="small">
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            setFilters(values);
            message.success('查询完成（mock）');
          }}
        >
          <Row gutter={12}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="type" label="报告类型">
                <Select allowClear options={REPORT_TYPE_OPTIONS} placeholder="请选择报告类型" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status" label="状态">
                <Select allowClear options={REPORT_STATUS_OPTIONS} placeholder="请选择状态" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="creator" label="创建人">
                <Input allowClear placeholder="请输入创建人" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="createTime" label="创建时间">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Space>
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
          </Space>
        </Form>
      </Card>

      <Card size="small">
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1200 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={viewing ? `查看结果 - ${viewing.title}` : '查看结果'}
        open={!!viewing}
        onCancel={() => setViewing(null)}
        width={860}
        footer={<Button onClick={() => setViewing(null)}>关闭</Button>}
        destroyOnClose
      >
        {viewing && (
          <div style={{ display: 'flex', gap: 16, minHeight: 360 }}>
            <div
              style={{
                width: 36,
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1677ff',
                fontWeight: 600,
                background: '#f5f5f5',
                borderRadius: 6,
              }}
            >
              分析总结
            </div>
            <div
              style={{
                flex: 1,
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                padding: 16,
                background: '#fff',
              }}
            >
              <Space direction="vertical" size={20} style={{ display: 'flex' }}>
                <div>
                  <Space>
                    <BarChartOutlined style={{ color: '#1677ff' }} />
                    <Title level={5} style={{ margin: 0 }}>
                      优质笔记统计
                    </Title>
                  </Space>
                  <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                    {viewing.summary.qualityStats}
                  </Paragraph>
                </div>
                <div>
                  <Space>
                    <AimOutlined style={{ color: '#1677ff' }} />
                    <Title level={5} style={{ margin: 0 }}>
                      优质笔记核心特征
                    </Title>
                  </Space>
                  <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                    {viewing.summary.features}
                  </Paragraph>
                </div>
                <div>
                  <Space>
                    <BellOutlined style={{ color: '#1677ff' }} />
                    <Title level={5} style={{ margin: 0 }}>
                      投流加热结论
                    </Title>
                  </Space>
                  <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                    {viewing.summary.conclusion}
                  </Paragraph>
                </div>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </Space>
  );
}
