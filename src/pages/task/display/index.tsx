import {
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState, type Key } from 'react';
import {
  DISPLAY_AUDIENCE_OPTIONS,
  DISPLAY_PLATFORM_OPTIONS,
  DISPLAY_STATUS_OPTIONS,
  DISPLAY_TOPIC_OPTIONS,
  MOCK_DISPLAY_TASKS,
  displayStatusColor,
  genDisplayTaskId,
  type DisplayTask,
  type DisplayTaskPlatform,
  type DisplayTaskStatus,
} from '@/mock/displayTask';
import './index.css';

const { RangePicker } = DatePicker;
const { Title, Text, Paragraph, Link } = Typography;
const { TextArea } = Input;

type FilterValues = {
  keyword?: string;
  platform?: string;
  status?: string;
  publishTime?: [dayjs.Dayjs, dayjs.Dayjs];
  endTime?: [dayjs.Dayjs, dayjs.Dayjs];
};

type WizardValues = {
  name: string;
  remark?: string;
  collectCycle: number;
  topic: string;
  platform: DisplayTaskPlatform;
  timeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  coverColor?: string;
  requiredTopic: string;
  moduleTitle: string;
  ruleDesc: string;
  steps: string[];
  statementTitle?: string;
  statementDesc?: string;
  audience: string;
};

function inRange(value: string, range?: [dayjs.Dayjs, dayjs.Dayjs]) {
  if (!range?.[0] || !range?.[1] || !value) return true;
  const current = dayjs(value);
  return (
    !current.isBefore(range[0].startOf('day')) && !current.isAfter(range[1].endOf('day'))
  );
}

export default function DisplayTaskPage() {
  const [filterForm] = Form.useForm<FilterValues>();
  const [wizardForm] = Form.useForm<WizardValues>();
  const [filters, setFilters] = useState<FilterValues>({ platform: '', status: '' });
  const [tasks, setTasks] = useState<DisplayTask[]>(() => [...MOCK_DISPLAY_TASKS]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [editing, setEditing] = useState<DisplayTask | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTask, setPreviewTask] = useState<DisplayTask | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTask, setDetailTask] = useState<DisplayTask | null>(null);

  const dataSource = useMemo(() => {
    return tasks.filter((item) => {
      if (filters.keyword) {
        const kw = filters.keyword.trim();
        if (!item.taskId.includes(kw) && !item.name.includes(kw)) return false;
      }
      if (filters.platform && item.platform !== filters.platform) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (!inRange(item.publishTime, filters.publishTime)) return false;
      if (!inRange(item.endTime, filters.endTime)) return false;
      return true;
    });
  }, [tasks, filters]);

  const openWizard = (row?: DisplayTask) => {
    setEditing(row || null);
    setWizardStep(0);
    if (row) {
      wizardForm.setFieldsValue({
        name: row.name,
        remark: row.remark,
        collectCycle: row.collectCycle,
        topic: row.topic,
        platform: row.platform,
        timeRange: [dayjs(row.startTime), dayjs(row.endTime)],
        coverColor: row.coverColor,
        requiredTopic: row.requiredTopic,
        moduleTitle: row.moduleTitle,
        ruleDesc: row.ruleDesc,
        steps: row.steps.length ? row.steps : [''],
        statementTitle: row.statementTitle,
        statementDesc: row.statementDesc,
        audience: row.audience,
      });
    } else {
      wizardForm.setFieldsValue({
        name: '',
        remark: '',
        collectCycle: 1,
        topic: undefined,
        platform: undefined,
        timeRange: undefined,
        coverColor: undefined,
        requiredTopic: '',
        moduleTitle: '',
        ruleDesc: '',
        steps: [''],
        statementTitle: '',
        statementDesc: '',
        audience: '全部 KOX',
      });
    }
    setWizardOpen(true);
  };

  const saveWizard = async (asDraft = true) => {
    const values = await wizardForm.validateFields();
    const startTime = values.timeRange?.[0]?.format('YYYY-MM-DD HH:mm') || '';
    const endTime = values.timeRange?.[1]?.format('YYYY-MM-DD HH:mm') || '';
    const payload: DisplayTask = {
      key: editing?.key || `${Date.now()}`,
      taskId: editing?.taskId || genDisplayTaskId(),
      name: values.name,
      remark: values.remark || '',
      status: asDraft ? '草稿' : '已发布',
      platform: values.platform,
      collectCycle: values.collectCycle || 1,
      matchedPosts: editing?.matchedPosts || 0,
      publishTime: editing?.publishTime || dayjs().format('YYYY-MM-DD HH:mm'),
      startTime,
      endTime,
      topic: values.topic,
      requiredTopic: values.requiredTopic,
      coverColor: values.coverColor || '#1677ff',
      moduleTitle: values.moduleTitle,
      ruleDesc: values.ruleDesc,
      steps: (values.steps || []).filter(Boolean),
      statementTitle: values.statementTitle || '',
      statementDesc: values.statementDesc || '',
      audience: values.audience,
    };

    if (editing) {
      setTasks((prev) => prev.map((item) => (item.key === editing.key ? payload : item)));
      message.success(asDraft ? '草稿已保存' : '任务已更新并发布');
    } else {
      setTasks((prev) => [payload, ...prev]);
      message.success(asDraft ? '草稿已创建' : '任务已创建并发布');
    }
    setWizardOpen(false);
  };

  const nextStep = async () => {
    if (wizardStep === 0) {
      await wizardForm.validateFields([
        'name',
        'collectCycle',
        'topic',
        'platform',
        'timeRange',
        'coverColor',
        'requiredTopic',
      ]);
      setWizardStep(1);
      return;
    }
    if (wizardStep === 1) {
      await wizardForm.validateFields(['moduleTitle', 'ruleDesc', 'steps']);
      setWizardStep(2);
    }
  };

  const columns: ColumnsType<DisplayTask> = [
    { title: '任务ID', dataIndex: 'taskId', width: 160 },
    { title: '任务名称', dataIndex: 'name', width: 160 },
    {
      title: '任务备注',
      dataIndex: 'remark',
      width: 120,
      render: (v: string) => v || '-',
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      width: 100,
      render: (v: DisplayTaskStatus) => <Tag color={displayStatusColor(v)}>{v}</Tag>,
    },
    { title: '任务平台', dataIndex: 'platform', width: 90 },
    {
      title: '采集周期',
      dataIndex: 'collectCycle',
      width: 100,
      render: (v: number) => `${v}天`,
    },
    {
      title: '采集匹配帖子数',
      dataIndex: 'matchedPosts',
      width: 130,
      align: 'right',
    },
    { title: '发布时间', dataIndex: 'publishTime', width: 150 },
    {
      title: '起止时间',
      key: 'range',
      width: 200,
      render: (_, row) => (
        <span>
          {row.startTime}
          <br />
          {row.endTime}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, row) => (
        <Space size={8} wrap>
          <Link
            onClick={() => {
              setDetailTask(row);
              setDetailOpen(true);
            }}
          >
            详情
          </Link>
          {row.status === '草稿' && (
            <Link
              onClick={() => {
                setTasks((prev) =>
                  prev.map((item) =>
                    item.key === row.key
                      ? {
                          ...item,
                          status: '已发布',
                          publishTime: dayjs().format('YYYY-MM-DD HH:mm'),
                        }
                      : item,
                  ),
                );
                message.success('任务已发布');
              }}
            >
              发布
            </Link>
          )}
          <Link onClick={() => openWizard(row)}>编辑</Link>
          <Link
            onClick={() => {
              setPreviewTask(row);
              setPreviewOpen(true);
            }}
          >
            预览
          </Link>
          <Link
            onClick={() => {
              const cloned: DisplayTask = {
                ...row,
                key: `${Date.now()}`,
                taskId: genDisplayTaskId(),
                name: `${row.name}-副本`,
                status: '草稿',
                matchedPosts: 0,
                publishTime: dayjs().format('YYYY-MM-DD HH:mm'),
              };
              setTasks((prev) => [cloned, ...prev]);
              message.success('已克隆为草稿');
            }}
          >
            克隆
          </Link>
          <Popconfirm
            title="确认删除该任务？"
            onConfirm={() => {
              setTasks((prev) => prev.filter((i) => i.key !== row.key));
              message.success('已删除');
            }}
          >
            <Link type="danger">删除</Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="display-task-page">
      <Space direction="vertical" size={16} style={{ display: 'flex' }}>
        <Card>
          <Title level={4} style={{ margin: 0 }}>
            展示性任务
          </Title>
          <div className="page-desc">配置无积分展示任务，采集 KOX 社媒内容数据</div>
        </Card>

        <Card>
          <Form
            form={filterForm}
            layout="vertical"
            initialValues={{ platform: '', status: '' }}
            onFinish={(values) => setFilters(values)}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="任务名称/编号" name="keyword">
                  <Input
                    allowClear
                    prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
                    placeholder="任务 ID / 任务名称"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={5}>
                <Form.Item label="任务平台" name="platform">
                  <Select options={DISPLAY_PLATFORM_OPTIONS} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={5}>
                <Form.Item label="任务状态" name="status">
                  <Select options={DISPLAY_STATUS_OPTIONS} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={10} lg={8}>
                <Form.Item label="发布时间" name="publishTime">
                  <RangePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={10} lg={8}>
                <Form.Item label="结束时间" name="endTime">
                  <RangePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label=" ">
                  <Space>
                    <Button
                      onClick={() => {
                        filterForm.resetFields();
                        setFilters({ platform: '', status: '' });
                      }}
                    >
                      重置
                    </Button>
                    <Button type="primary" htmlType="submit">
                      搜索
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card>
          <Space style={{ marginBottom: 12 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openWizard()}>
              新建
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() =>
                message.success(
                  `已导出 ${selectedKeys.length || dataSource.length} 条任务明细（mock）`,
                )
              }
            >
              导出任务明细
            </Button>
          </Space>

          <Table
            rowKey="key"
            size="middle"
            rowSelection={{
              selectedRowKeys: selectedKeys,
              onChange: setSelectedKeys,
            }}
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 1500 }}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (t, range) => `第 ${range[0]}-${range[1]} 条，共 ${t} 条`,
            }}
          />
        </Card>
      </Space>

      <Modal
        title={
          <Space>
            <Button type="text" onClick={() => setWizardOpen(false)}>
              ←
            </Button>
            <span>任务设置</span>
          </Space>
        }
        open={wizardOpen}
        onCancel={() => setWizardOpen(false)}
        width={920}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setWizardOpen(false)}>取消</Button>
            {wizardStep > 0 && (
              <Button onClick={() => setWizardStep((s) => s - 1)}>上一步</Button>
            )}
            {wizardStep < 2 ? (
              <Button type="primary" onClick={nextStep}>
                下一步
              </Button>
            ) : (
              <>
                <Button onClick={() => saveWizard(true)}>保存草稿</Button>
                <Button type="primary" onClick={() => saveWizard(false)}>
                  发布任务
                </Button>
              </>
            )}
          </Space>
        }
      >
        <Steps
          size="small"
          current={wizardStep}
          style={{ marginBottom: 20 }}
          items={[
            { title: '任务信息' },
            { title: '规则与展示' },
            { title: '人群选择' },
          ]}
        />

        <Form form={wizardForm} layout="vertical">
          {wizardStep === 0 && (
            <>
              <Title level={5}>基本信息</Title>
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    label="任务名称"
                    name="name"
                    rules={[{ required: true, message: '请输入任务名称' }]}
                  >
                    <Input placeholder="请输入任务名称" maxLength={50} showCount />
                  </Form.Item>
                  <Form.Item label="任务备注" name="remark">
                    <TextArea placeholder="请输入任务备注" maxLength={500} showCount rows={3} />
                  </Form.Item>
                  <Form.Item
                    label="采集周期"
                    name="collectCycle"
                    rules={[{ required: true, message: '请输入天数' }]}
                  >
                    <InputNumber min={1} addonAfter="天" style={{ width: 200 }} placeholder="请输入天数" />
                  </Form.Item>
                  <Form.Item
                    label="任务主题"
                    name="topic"
                    rules={[{ required: true, message: '请选择' }]}
                  >
                    <Select options={DISPLAY_TOPIC_OPTIONS} placeholder="请选择" />
                  </Form.Item>
                  <Form.Item
                    label="任务平台"
                    name="platform"
                    rules={[{ required: true, message: '请选择' }]}
                  >
                    <Select
                      options={DISPLAY_PLATFORM_OPTIONS.filter((o) => o.value)}
                      placeholder="请选择"
                    />
                  </Form.Item>
                  <Form.Item
                    label="任务开始/结束时间"
                    name="timeRange"
                    rules={[{ required: true, message: '请选择时间' }]}
                  >
                    <RangePicker showTime style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="任务图片"
                    name="coverColor"
                    rules={[{ required: true, message: '请上传图片' }]}
                    extra="建议上传 1:1 比例图片"
                  >
                    <CoverUpload />
                  </Form.Item>
                </Col>
              </Row>
              <Title level={5}>任务素材</Title>
              <Form.Item
                label="必带话题"
                name="requiredTopic"
                rules={[{ required: true, message: '请输入任务文案' }]}
              >
                <TextArea placeholder="请输入任务文案" rows={4} />
              </Form.Item>
            </>
          )}

          {wizardStep === 1 && (
            <>
              <Card size="small" title="任务规则" style={{ marginBottom: 16 }}>
                <Form.Item
                  label="模块标题"
                  name="moduleTitle"
                  rules={[{ required: true, message: '请输入模块标题' }]}
                >
                  <Input placeholder="请输入模块标题" maxLength={100} showCount />
                </Form.Item>
                <Form.Item
                  label="规则描述"
                  name="ruleDesc"
                  rules={[{ required: true, message: '请输入规则描述' }]}
                >
                  <TextArea placeholder="请输入规则描述" rows={3} />
                </Form.Item>
                <Form.List name="steps">
                  {(fields, { add, remove }) => (
                    <>
                      <Text strong>任务执行流程</Text>
                      {fields.map((field, index) => (
                        <Space key={field.key} style={{ display: 'flex', marginTop: 8 }} align="baseline">
                          <Form.Item
                            {...field}
                            label={`步骤${index + 1}`}
                            rules={[{ required: true, message: '请输入步骤描述' }]}
                            style={{ marginBottom: 0, flex: 1 }}
                          >
                            <Input placeholder="请输入步骤描述" style={{ width: 420 }} />
                          </Form.Item>
                          {fields.length > 1 && (
                            <Link type="danger" onClick={() => remove(field.name)}>
                              删除
                            </Link>
                          )}
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => add()} style={{ marginTop: 12 }}>
                        + 新增
                      </Button>
                    </>
                  )}
                </Form.List>
              </Card>
              <Card size="small" title="页面展示设置">
                <Form.Item label="声明标题（选填）" name="statementTitle">
                  <Input placeholder="请输入声明标题（选填）" maxLength={200} showCount />
                </Form.Item>
                <Form.Item label="声明描述（选填）" name="statementDesc">
                  <TextArea placeholder="请输入声明描述内容（选填）" rows={3} />
                </Form.Item>
              </Card>
            </>
          )}

          {wizardStep === 2 && (
            <Form.Item
              label="目标人群"
              name="audience"
              rules={[{ required: true, message: '请选择人群' }]}
            >
              <Select options={DISPLAY_AUDIENCE_OPTIONS} placeholder="请选择人群" />
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        className="display-preview-modal"
        title={
          <div>
            <div>任务预览：{previewTask?.name}</div>
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
              根据任务配置生成，可保存长图
            </Text>
          </div>
        }
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        footer={null}
        width={420}
        destroyOnClose
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => message.success('长图已保存（mock）')}
          >
            保存长图
          </Button>
        </div>
        {previewTask && (
          <div className="display-preview-phone">
            <div
              className="display-preview-cover"
              style={{ background: previewTask.coverColor }}
            >
              任务封面
            </div>
            <div className="display-preview-body">
              <div className="display-preview-title">{previewTask.name}</div>
              <Text type="secondary">{previewTask.remark || previewTask.topic}</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color="purple">{previewTask.platform}</Tag>
              </div>
              <div className="display-preview-section">
                <div className="display-preview-section-title">【{previewTask.moduleTitle}】</div>
                <div>{previewTask.ruleDesc}</div>
                <ol style={{ margin: '8px 0 0', paddingLeft: 18 }}>
                  {previewTask.steps.map((s, i) => (
                    <li key={`${s}-${i}`}>{s}</li>
                  ))}
                </ol>
              </div>
              <div className="display-preview-section">
                <div className="display-preview-section-title">【必带话题】</div>
                <div>{previewTask.requiredTopic}</div>
              </div>
              {(previewTask.statementTitle || previewTask.statementDesc) && (
                <div className="display-preview-section">
                  <div className="display-preview-section-title">
                    【{previewTask.statementTitle || '任务说明'}】
                  </div>
                  <div>{previewTask.statementDesc || '此活动无需手动报名参与'}</div>
                </div>
              )}
            </div>
            <div className="display-preview-cta">此活动无需手动报名参与</div>
          </div>
        )}
      </Modal>

      <Modal
        title="任务详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={<Button onClick={() => setDetailOpen(false)}>关闭</Button>}
      >
        {detailTask && (
          <Space direction="vertical" size={8} style={{ display: 'flex' }}>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text type="secondary">任务ID：</Text>
              {detailTask.taskId}
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text type="secondary">名称：</Text>
              {detailTask.name}
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text type="secondary">状态 / 平台：</Text>
              {detailTask.status} / {detailTask.platform}
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text type="secondary">人群：</Text>
              {detailTask.audience}
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text type="secondary">必带话题：</Text>
              {detailTask.requiredTopic}
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              <Text type="secondary">匹配帖子：</Text>
              {detailTask.matchedPosts}
            </Paragraph>
          </Space>
        )}
      </Modal>
    </div>
  );
}

function CoverUpload() {
  const form = Form.useFormInstance();
  const color = Form.useWatch('coverColor', form) as string | undefined;
  return (
    <div
      className={`display-task-cover ${color ? 'has-image' : ''}`}
      style={color ? { background: color } : undefined}
      onClick={() => {
        const colors = ['#1677ff', '#722ed1', '#13c2c2', '#eb2f96', '#faad14', '#52c41a'];
        form.setFieldValue('coverColor', colors[Math.floor(Math.random() * colors.length)]);
        message.success('已上传封面（mock）');
      }}
    >
      {color ? '已上传' : (
        <>
          <PlusOutlined />
          <span>点击上传</span>
        </>
      )}
    </div>
  );
}
