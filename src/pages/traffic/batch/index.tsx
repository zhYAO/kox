import { PlusOutlined, ReloadOutlined, RocketOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Progress,
  Select,
  Space,
  Steps,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  BATCH_ACCOUNT_OPTIONS,
  BATCH_PLATFORM_OPTIONS,
  BATCH_STATUS_OPTIONS,
  BATCH_TEMPLATE_OPTIONS,
  MOCK_BATCH_JOBS,
  batchStatusColor,
  type BatchJob,
  type BatchJobStatus,
  type BatchPlatform,
} from '@/mock/trafficBatch';

const { Title, Text, Paragraph, Link } = Typography;
const { TextArea } = Input;

type FilterValues = {
  platform?: string;
  status?: string;
  keyword?: string;
};

export default function TrafficBatchPage() {
  const [filterForm] = Form.useForm<FilterValues>();
  const [createForm] = Form.useForm();
  const [filters, setFilters] = useState<FilterValues>({ platform: '', status: '' });
  const [jobs, setJobs] = useState<BatchJob[]>(() => [...MOCK_BATCH_JOBS]);
  const [createOpen, setCreateOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [materialCount, setMaterialCount] = useState(0);

  const dataSource = useMemo(() => {
    return jobs.filter((item) => {
      if (filters.platform && item.platform !== filters.platform) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.keyword && !item.name.includes(filters.keyword.trim())) return false;
      return true;
    });
  }, [jobs, filters]);

  const columns: ColumnsType<BatchJob> = [
    { title: '任务名称', dataIndex: 'name', width: 200 },
    { title: '平台', dataIndex: 'platform', width: 120 },
    { title: '投放账户', dataIndex: 'accountName', width: 140 },
    { title: '模板', dataIndex: 'template', width: 130 },
    {
      title: '创意数',
      dataIndex: 'creativeCount',
      width: 90,
      align: 'right',
    },
    {
      title: '成功/失败',
      key: 'result',
      width: 110,
      render: (_, row) => `${row.successCount}/${row.failCount}`,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      width: 160,
      render: (v: number, row) => (
        <Progress
          percent={v}
          size="small"
          status={row.status === '失败' ? 'exception' : row.status === '处理中' ? 'active' : undefined}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: BatchJobStatus) => <Tag color={batchStatusColor(v)}>{v}</Tag>,
    },
    { title: '创建时间', dataIndex: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, row) => (
        <Space size={10} wrap>
          {row.status === '草稿' && (
            <Link
              onClick={() => {
                setJobs((prev) =>
                  prev.map((item) =>
                    item.key === row.key
                      ? {
                          ...item,
                          status: '处理中',
                          progress: 15,
                          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        }
                      : item,
                  ),
                );
                message.success('任务已提交处理');
              }}
            >
              提交
            </Link>
          )}
          {row.status === '处理中' && (
            <Link
              onClick={() => {
                setJobs((prev) =>
                  prev.map((item) =>
                    item.key === row.key
                      ? {
                          ...item,
                          status: '已完成',
                          progress: 100,
                          successCount: item.creativeCount,
                          failCount: 0,
                          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        }
                      : item,
                  ),
                );
                message.success('已模拟完成');
              }}
            >
              标记完成
            </Link>
          )}
          {row.status === '失败' && (
            <Link
              onClick={() => {
                setJobs((prev) =>
                  prev.map((item) =>
                    item.key === row.key
                      ? {
                          ...item,
                          status: '处理中',
                          progress: 20,
                          failCount: 0,
                          successCount: Math.floor(item.creativeCount / 3),
                          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        }
                      : item,
                  ),
                );
                message.success('已重新提交');
              }}
            >
              重试
            </Link>
          )}
          <Popconfirm
            title="确认删除该任务？"
            onConfirm={() => {
              setJobs((prev) => prev.filter((i) => i.key !== row.key));
              message.success('已删除');
            }}
          >
            <Link type="danger">删除</Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const nextStep = async () => {
    if (step === 0) {
      await createForm.validateFields(['name', 'platform', 'accountName', 'template']);
      setStep(1);
      return;
    }
    if (step === 1) {
      if (materialCount <= 0) {
        message.warning('请先上传素材（点击上传区域即可）');
        return;
      }
      setStep(2);
    }
  };

  const submitCreate = async () => {
    const values = await createForm.validateFields();
    const count = values.creativeCount || materialCount || 10;
    setJobs((prev) => [
      {
        key: `${Date.now()}`,
        name: values.name,
        platform: values.platform as BatchPlatform,
        accountName: values.accountName,
        template: values.template,
        creativeCount: count,
        successCount: 0,
        failCount: 0,
        status: '处理中',
        progress: 8,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
      ...prev,
    ]);
    message.success('批量创编任务已创建并开始处理');
    setCreateOpen(false);
    setStep(0);
    setMaterialCount(0);
    createForm.resetFields();
  };

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>
          批量创编
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          按模板批量生成投放创意：选择账户与模板、上传素材包，一键提交创编任务并跟踪进度。
        </Paragraph>
      </Card>

      <Card>
        <Form
          form={filterForm}
          layout="inline"
          initialValues={{ platform: '', status: '' }}
          onFinish={(values) => setFilters(values)}
          style={{ rowGap: 12, marginBottom: 16 }}
        >
          <Form.Item name="platform" label="平台">
            <Select style={{ width: 150 }} options={BATCH_PLATFORM_OPTIONS} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select style={{ width: 130 }} options={BATCH_STATUS_OPTIONS} />
          </Form.Item>
          <Form.Item name="keyword" label="任务名称">
            <Input placeholder="模糊搜索" allowClear style={{ width: 180 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  filterForm.resetFields();
                  setFilters({ platform: '', status: '' });
                }}
              >
                重置
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setStep(0);
                  setMaterialCount(0);
                  createForm.setFieldsValue({
                    name: '',
                    platform: '小红书聚光',
                    accountName: 'pince品策',
                    template: '种草图文模板',
                    creativeCount: 20,
                    remark: '',
                  });
                  setCreateOpen(true);
                }}
              >
                新建批量任务
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1300 }}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        />
      </Card>

      <Modal
        title="新建批量创编任务"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        width={640}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setCreateOpen(false)}>取消</Button>
            {step > 0 && <Button onClick={() => setStep((s) => s - 1)}>上一步</Button>}
            {step < 2 ? (
              <Button type="primary" onClick={nextStep}>
                下一步
              </Button>
            ) : (
              <Button type="primary" icon={<RocketOutlined />} onClick={submitCreate}>
                开始创编
              </Button>
            )}
          </Space>
        }
      >
        <Steps
          size="small"
          current={step}
          style={{ marginBottom: 20 }}
          items={[{ title: '任务配置' }, { title: '上传素材' }, { title: '确认提交' }]}
        />

        <Form form={createForm} layout="vertical">
          {step === 0 && (
            <>
              <Form.Item
                label="任务名称"
                name="name"
                rules={[{ required: true, message: '请输入任务名称' }]}
              >
                <Input placeholder="如：M7春季种草-批量图文" />
              </Form.Item>
              <Form.Item label="平台" name="platform" rules={[{ required: true }]}>
                <Select
                  options={BATCH_PLATFORM_OPTIONS.filter((o) => o.value)}
                  onChange={(platform) => {
                    const first = BATCH_ACCOUNT_OPTIONS.find((a) => a.platform === platform);
                    createForm.setFieldValue('accountName', first?.value);
                  }}
                />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev, cur) => prev.platform !== cur.platform}
              >
                {({ getFieldValue }) => {
                  const platform = getFieldValue('platform') as BatchPlatform;
                  return (
                    <Form.Item label="投放账户" name="accountName" rules={[{ required: true }]}>
                      <Select
                        options={BATCH_ACCOUNT_OPTIONS.filter((a) => a.platform === platform).map(
                          (a) => ({ label: a.label, value: a.value }),
                        )}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
              <Form.Item label="创编模板" name="template" rules={[{ required: true }]}>
                <Select options={BATCH_TEMPLATE_OPTIONS} />
              </Form.Item>
              <Form.Item label="计划创意数" name="creativeCount">
                <InputNumber min={1} max={200} style={{ width: '100%' }} />
              </Form.Item>
            </>
          )}

          {step === 1 && (
            <>
              <Upload.Dragger
                multiple
                showUploadList={false}
                beforeUpload={() => {
                  setMaterialCount((n) => n + 1);
                  message.success('已添加素材（mock）');
                  return false;
                }}
              >
                <p className="ant-upload-text">点击或拖拽上传素材包</p>
                <p className="ant-upload-hint">支持图片/视频；演示环境点击即可累加素材数量</p>
              </Upload.Dragger>
              <div style={{ marginTop: 12 }}>
                <Text>
                  已选素材：<Text strong>{materialCount}</Text> 个
                </Text>
              </div>
              <Form.Item label="备注" name="remark" style={{ marginTop: 12 }}>
                <TextArea rows={3} placeholder="选填，说明本次批量创编目的" />
              </Form.Item>
            </>
          )}

          {step === 2 && (
            <Card size="small" title="请确认任务信息">
              <Paragraph>
                <Text type="secondary">任务名称：</Text>
                {createForm.getFieldValue('name')}
              </Paragraph>
              <Paragraph>
                <Text type="secondary">平台 / 账户：</Text>
                {createForm.getFieldValue('platform')} / {createForm.getFieldValue('accountName')}
              </Paragraph>
              <Paragraph>
                <Text type="secondary">模板：</Text>
                {createForm.getFieldValue('template')}
              </Paragraph>
              <Paragraph>
                <Text type="secondary">素材数 / 计划创意数：</Text>
                {materialCount} / {createForm.getFieldValue('creativeCount') || materialCount}
              </Paragraph>
              <Paragraph style={{ marginBottom: 0 }} type="secondary">
                提交后将进入处理队列，可在列表中查看进度。
              </Paragraph>
            </Card>
          )}
        </Form>
      </Modal>
    </Space>
  );
}
