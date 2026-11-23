import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  MOCK_AUDIT_BATCHES,
  type AuditBatch,
  type AuditBatchItem,
  type AuditStatus,
} from '@/mock/kocAudit';

const { Link, Text } = Typography;
const { TextArea } = Input;

export default function KocAuditPage() {
  const [tab, setTab] = useState<'待审核' | '已通过' | '已驳回'>('待审核');
  const [keyword, setKeyword] = useState('');
  const [batches, setBatches] = useState<AuditBatch[]>(() =>
    structuredClone(MOCK_AUDIT_BATCHES),
  );
  const [detailBatch, setDetailBatch] = useState<AuditBatch | null>(null);
  const [detailItem, setDetailItem] = useState<AuditBatchItem | null>(null);
  const [rejectBatch, setRejectBatch] = useState<AuditBatch | null>(null);
  const [rejectForm] = Form.useForm<{ reason: string }>();

  const counts = useMemo(() => {
    return {
      pending: batches.filter((item) => item.status === '待审核').length,
      passed: batches.filter((item) => item.status === '已通过').reduce((sum, item) => sum + item.count, 0),
      rejected: batches.filter((item) => item.status === '已驳回').reduce((sum, item) => sum + item.count, 0),
      pendingCount: batches
        .filter((item) => item.status === '待审核')
        .reduce((sum, item) => sum + item.count, 0),
    };
  }, [batches]);

  const dataSource = useMemo(() => {
    const text = keyword.trim();
    return batches.filter((item) => {
      if (item.status !== tab) return false;
      if (!text) return true;
      return (
        item.source.includes(text) ||
        item.fileName.includes(text) ||
        item.office.includes(text) ||
        item.uploader.includes(text) ||
        item.batchName.includes(text)
      );
    });
  }, [batches, keyword, tab]);

  const approveBatch = (batch: AuditBatch) => {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setBatches((prev) =>
      prev.map((item) =>
        item.key === batch.key
          ? {
              ...item,
              status: '已通过',
              pending: 0,
              items: item.items.map((row) => ({
                ...row,
                status: '已通过',
                passTime: now,
                reviewer: 'kox_admin',
              })),
            }
          : item,
      ),
    );
    message.success('批次已通过（mock）');
  };

  const confirmReject = async () => {
    const values = await rejectForm.validateFields();
    if (!rejectBatch) return;
    setBatches((prev) =>
      prev.map((item) =>
        item.key === rejectBatch.key
          ? {
              ...item,
              status: '已驳回',
              pending: 0,
              items: item.items.map((row) => ({
                ...row,
                status: '已驳回',
                reviewer: 'kox_admin',
                rejectReason: values.reason,
              })),
            }
          : item,
      ),
    );
    message.success('批次已驳回（mock）');
    setRejectBatch(null);
    rejectForm.resetFields();
  };

  const columns: ColumnsType<AuditBatch> = [
    {
      title: '提报来源',
      dataIndex: 'source',
      width: 120,
      render: (value: string) => (
        <Tag color={value === '手动导入' ? 'success' : 'processing'}>{value}</Tag>
      ),
    },
    { title: '代表处', dataIndex: 'office', width: 100 },
    { title: '文件名', dataIndex: 'fileName', ellipsis: true },
    { title: '提报条数', dataIndex: 'count', width: 100 },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      width: 180,
      sorter: (a, b) => a.uploadTime.localeCompare(b.uploadTime),
    },
    {
      title: '上传人',
      dataIndex: 'uploader',
      width: 120,
      sorter: (a, b) => a.uploader.localeCompare(b.uploader),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value: AuditStatus) => (
        <Tag color={value === '待审核' ? 'warning' : value === '已通过' ? 'success' : 'error'}>
          {value}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space wrap>
          <Link onClick={() => setDetailBatch(record)}>
            <EyeOutlined /> 查看
          </Link>
          {record.status === '待审核' && (
            <>
              <Popconfirm
                title="确认通过该批次的所有待审核记录？"
                description={`批次共${record.count}条记录`}
                okText="确认"
                cancelText="取消"
                onConfirm={() => approveBatch(record)}
              >
                <Link style={{ color: '#52c41a' }}>
                  <CheckOutlined /> 通过
                </Link>
              </Popconfirm>
              <Link
                type="danger"
                onClick={() => {
                  setRejectBatch(record);
                  rejectForm.resetFields();
                }}
              >
                <CloseOutlined /> 驳回
              </Link>
            </>
          )}
        </Space>
      ),
    },
  ];

  const itemColumns: ColumnsType<AuditBatchItem> = [
    { title: 'Excel行号', dataIndex: 'excelRow', width: 100 },
    { title: '提报来源', dataIndex: 'source', width: 110 },
    { title: '手机号', dataIndex: 'phone', width: 130 },
    { title: '代表处', dataIndex: 'office', width: 90 },
    { title: '平台', dataIndex: 'platform', width: 90 },
    { title: '主页链接', dataIndex: 'homeUrl', ellipsis: true },
    {
      title: '车型标签',
      dataIndex: 'modelTag',
      width: 120,
      render: (value: string) => (
        <Space>
          <span>{value}</span>
          <Link>转换长ID</Link>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 90,
      render: (_, record) => (
        <Link onClick={() => setDetailItem(record)}>
          <EyeOutlined /> 详情
        </Link>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="提报待审核" value={counts.pendingCount} suffix="条" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="审核通过" value={counts.passed} suffix="条" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="审核驳回" value={counts.rejected} suffix="条" />
          </Card>
        </Col>
      </Row>

      <Card size="small">
        <Tabs
          activeKey={tab}
          onChange={(key) => setTab(key as typeof tab)}
          items={[
            { key: '待审核', label: '待审核' },
            { key: '已通过', label: '审核通过名单' },
            { key: '已驳回', label: '审核驳回名单' },
          ]}
        />

        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="搜索来源、文件名、代表处、上传人..."
            style={{ width: 360 }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Text type="secondary">提报名单审核</Text>
        </Space>

        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1100 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={detailBatch ? `批次明细 - ${detailBatch.batchName}` : '批次明细'}
        open={!!detailBatch}
        onCancel={() => setDetailBatch(null)}
        width={1000}
        footer={<Button onClick={() => setDetailBatch(null)}>关闭</Button>}
        destroyOnClose
      >
        {detailBatch && (
          <Space direction="vertical" size={16} style={{ display: 'flex' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic title="总数量" value={detailBatch.total} />
              </Col>
              <Col span={6}>
                <Statistic title="成功" value={detailBatch.success} />
              </Col>
              <Col span={6}>
                <Statistic title="失败" value={detailBatch.fail} />
              </Col>
              <Col span={6}>
                <Statistic title="待审核" value={detailBatch.pending} />
              </Col>
            </Row>
            <Table
              rowKey="key"
              size="small"
              columns={itemColumns}
              dataSource={detailBatch.items}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 900 }}
            />
          </Space>
        )}
      </Modal>

      <Modal
        title="记录详情"
        open={!!detailItem}
        onCancel={() => setDetailItem(null)}
        footer={<Button onClick={() => setDetailItem(null)}>关闭</Button>}
        width={720}
        destroyOnClose
      >
        {detailItem && (
          <Space direction="vertical" size={16} style={{ display: 'flex' }}>
            <Card size="small">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="昵称" value={detailItem.nickname || '-'} />
                </Col>
                <Col span={8}>
                  <Statistic title="手机号" value={detailItem.phone} />
                </Col>
                <Col span={8}>
                  <Statistic title="状态" value={detailItem.status} />
                </Col>
              </Row>
            </Card>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="来源">{detailItem.source}</Descriptions.Item>
              <Descriptions.Item label="主页链接">{detailItem.homeUrl}</Descriptions.Item>
              <Descriptions.Item label="平台">{detailItem.platform}</Descriptions.Item>
              <Descriptions.Item label="平台账号ID">{detailItem.platformId}</Descriptions.Item>
              <Descriptions.Item label="代表处">{detailItem.office}</Descriptions.Item>
              <Descriptions.Item label="文件名">{detailItem.fileName}</Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>
                {detailItem.createTime}
              </Descriptions.Item>
              <Descriptions.Item label="通过时间" span={2}>
                {detailItem.passTime || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="审核人" span={2}>
                {detailItem.reviewer || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="车型标签" span={2}>
                {detailItem.modelTag}
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>
                {detailItem.remark || '-'}
              </Descriptions.Item>
              {detailItem.rejectReason && (
                <Descriptions.Item label="驳回原因" span={2}>
                  {detailItem.rejectReason}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Space>
        )}
      </Modal>

      <Modal
        title="确认驳回"
        open={!!rejectBatch}
        onCancel={() => {
          setRejectBatch(null);
          rejectForm.resetFields();
        }}
        onOk={confirmReject}
        okText="确认"
        cancelText="取消"
        destroyOnClose
      >
        {rejectBatch && (
          <Space direction="vertical" style={{ display: 'flex', marginBottom: 12 }}>
            <Text>批次名称：{rejectBatch.batchName}</Text>
            <Text>文件名：{rejectBatch.fileName}</Text>
            <Text>总条数：{rejectBatch.count}</Text>
          </Space>
        )}
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="reason"
            label={<span style={{ color: '#ff4d4f' }}>驳回原因：</span>}
            rules={[{ required: true, message: '请输入驳回原因' }]}
          >
            <TextArea rows={4} maxLength={500} showCount placeholder="请输入驳回原因（必填）" />
          </Form.Item>
        </Form>
        <Text type="secondary">
          确认驳回该批次的所有待审核记录吗？批次共{rejectBatch?.count || 0}条记录。
        </Text>
      </Modal>
    </Space>
  );
}
