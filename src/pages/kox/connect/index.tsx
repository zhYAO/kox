import { DownloadOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Key } from 'react';
import { useMemo, useState } from 'react';
import {
  CONNECT_STATUS_OPTIONS,
  EXPORT_STATUS_OPTIONS,
  IP_OPTIONS,
  MOCK_CONNECT_LIST,
  PLATFORM_OPTIONS,
  type ConnectRecord,
} from '@/mock/connectManage';

const { Link, Title } = Typography;

type FilterValues = {
  nickname?: string;
  platform?: string;
  ip?: string;
  connectStatus?: string;
  exportStatus?: string;
};

export default function ConnectManagePage() {
  const [form] = Form.useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [records, setRecords] = useState<ConnectRecord[]>(() => [...MOCK_CONNECT_LIST]);

  const dataSource = useMemo(() => {
    return records.filter((item) => {
      if (filters.nickname && !item.nickname.includes(filters.nickname.trim())) return false;
      if (filters.platform && item.platform !== filters.platform) return false;
      if (filters.ip && item.ip !== filters.ip) return false;
      if (filters.connectStatus && item.connectStatus !== filters.connectStatus) return false;
      if (filters.exportStatus && item.exportStatus !== filters.exportStatus) return false;
      return true;
    });
  }, [filters, records]);

  const columns: ColumnsType<ConnectRecord> = [
    { title: '账号昵称', dataIndex: 'nickname', width: 120 },
    { title: '平台', dataIndex: 'platform', width: 100 },
    { title: 'userId', dataIndex: 'userId', width: 200, ellipsis: true },
    { title: 'IP', dataIndex: 'ip', width: 100 },
    {
      title: '主页链接',
      dataIndex: 'homeUrl',
      width: 220,
      ellipsis: true,
      render: (value: string) => (
        <Link href={value} target="_blank" rel="noreferrer">
          {value}
        </Link>
      ),
    },
    {
      title: '建联状态',
      dataIndex: 'connectStatus',
      width: 100,
      render: (value: ConnectRecord['connectStatus']) =>
        value === '已建联' ? <Tag color="success">{value}</Tag> : <span>{value}</span>,
    },
    {
      title: '导出状态',
      dataIndex: 'exportStatus',
      width: 100,
      render: (value: ConnectRecord['exportStatus']) =>
        value === '已导出' ? <Tag color="processing">{value}</Tag> : <span>{value}</span>,
    },
    { title: '导出人', dataIndex: 'exporter', width: 110 },
    { title: '导出时间', dataIndex: 'exportTime', width: 180 },
  ];

  const handleBatchExport = () => {
    if (!selectedRowKeys.length) {
      message.warning('请先勾选要导出的账号');
      return;
    }
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setRecords((prev) =>
      prev.map((item) =>
        selectedRowKeys.includes(item.key)
          ? {
              ...item,
              exportStatus: '已导出',
              exporter: 'kox_admin',
              exportTime: now,
              connectStatus: '已建联',
            }
          : item,
      ),
    );
    message.success(`已批量导出 ${selectedRowKeys.length} 条（mock）`);
    setSelectedRowKeys([]);
  };

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Title level={4} style={{ margin: 0 }}>
        建联管理
      </Title>

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
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="nickname" label="账号昵称">
                <Input allowClear placeholder="账号昵称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="platform" label="平台">
                <Select allowClear options={PLATFORM_OPTIONS} placeholder="平台" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="ip" label="IP属地">
                <Select allowClear options={IP_OPTIONS} placeholder="IP属地" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="connectStatus" label="建联状态">
                <Select allowClear options={CONNECT_STATUS_OPTIONS} placeholder="建联状态" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="exportStatus" label="导出状态">
                <Select allowClear options={EXPORT_STATUS_OPTIONS} placeholder="导出状态" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item label=" ">
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
                  <Button icon={<DownloadOutlined />} onClick={handleBatchExport}>
                    批量导出
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card size="small">
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          scroll={{ x: 1300 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </Space>
  );
}
