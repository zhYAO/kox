import {
  DownloadOutlined,
  EyeOutlined,
  ReloadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  MOCK_SCREEN_LOGS,
  type ScreenLogAction,
  type ScreenLogRecord,
} from '@/mock/systemScreenLog';

const { RangePicker } = DatePicker;

type FilterValues = {
  nickname?: string;
  account?: string;
  operatedAt?: [dayjs.Dayjs, dayjs.Dayjs];
};

export default function SystemScreenLogPage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({});
  const [list] = useState<ScreenLogRecord[]>(() => [...MOCK_SCREEN_LOGS]);

  const dataSource = useMemo(() => {
    return list.filter((item) => {
      if (filters.nickname && !item.nickname.includes(filters.nickname.trim())) return false;
      if (filters.account && !item.account.includes(filters.account.trim())) return false;
      if (filters.operatedAt?.[0] && filters.operatedAt?.[1]) {
        const t = dayjs(item.operatedAt);
        if (
          t.isBefore(filters.operatedAt[0].startOf('day')) ||
          t.isAfter(filters.operatedAt[1].endOf('day'))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [list, filters]);

  const columns: ColumnsType<ScreenLogRecord> = [
    { title: '用户昵称', dataIndex: 'nickname', width: 140 },
    { title: '用户账号', dataIndex: 'account', width: 160 },
    {
      title: '操作时间',
      dataIndex: 'operatedAt',
      width: 200,
      sorter: (a, b) => dayjs(a.operatedAt).valueOf() - dayjs(b.operatedAt).valueOf(),
      defaultSortOrder: 'descend',
    },
    {
      title: '执行操作',
      dataIndex: 'action',
      width: 140,
      render: (action: ScreenLogAction) =>
        action === '截屏' ? (
          <Tag color="blue" icon={<EyeOutlined />}>
            截屏
          </Tag>
        ) : (
          <Tag color="orange" icon={<VideoCameraOutlined />}>
            录屏
          </Tag>
        ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Form form={form} layout="vertical" onFinish={(values) => setFilters(values)}>
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="用户昵称" name="nickname">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="用户账号" name="account">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={10} lg={8}>
              <Form.Item label="操作时间" name="operatedAt">
                <RangePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item label=" ">
                <Space>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setFilters({});
                    }}
                  >
                    重置
                  </Button>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, gap: 8 }}>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => message.success(`已导出 ${dataSource.length} 条日志（mock）`)}
          >
            导出
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              form.resetFields();
              setFilters({});
              message.success('已刷新');
            }}
          />
        </div>
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (t, range) => `第 ${range[0]}-${range[1]} 条/总共 ${t} 条`,
          }}
        />
      </Card>
    </Space>
  );
}
