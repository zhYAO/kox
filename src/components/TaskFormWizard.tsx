import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Steps,
  Switch,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import {
  POINT_TIMING_OPTIONS,
  createEmptyTask,
  getTaskById,
  upsertTask,
  type TaskCenterRecord,
} from '@/mock/taskCenter';
import './TaskFormWizard.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export type TaskFormMode = 'create' | 'edit' | 'detail';

type Props = {
  mode: TaskFormMode;
  taskId?: string;
};

type FormValues = {
  name: string;
  category: string;
  productName: string;
  carModel?: string;
  participantLimit: number;
  description: string;
  timeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  execCycle: number;
  fermentCycle: number;
  appealCycle: number;
  postRequirement: string;
  activityNote: string;
  platforms: string[];
  requiredTopic: string;
  copyTopicEnabled: boolean;
  contentForms: string[];
  contentDescs: { title: string; content: string }[];
  pointTiming: string;
  contentPoints: number;
  accountLimit?: number | null;
  basePointCode: string;
  needGift: boolean;
  totalBudget: number;
  budgetMonth?: dayjs.Dayjs;
  budgetAlert: boolean;
  pushScope: '全部' | 'AI人群';
  needContentGen: boolean;
  aiContentEnabled: boolean;
  contentTemplate: string;
  createRequirement: string;
  needMaterial: boolean;
};

const PLATFORM_CHILDREN = [
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '快手', value: '快手' },
  { label: 'B站', value: 'B站' },
];

function recordToForm(r: TaskCenterRecord): FormValues {
  return {
    name: r.name,
    category: r.category,
    productName: r.productName,
    carModel: undefined,
    participantLimit: r.participantLimit,
    description: r.description,
    timeRange: r.startTime && r.endTime ? [dayjs(r.startTime), dayjs(r.endTime)] : undefined,
    execCycle: r.execCycle,
    fermentCycle: r.fermentCycle,
    appealCycle: r.appealCycle,
    postRequirement: r.postRequirement,
    activityNote: r.activityNote,
    platforms: r.platforms,
    requiredTopic: r.requiredTopic,
    copyTopicEnabled: r.copyTopicEnabled,
    contentForms: r.contentForms,
    contentDescs: r.contentDescs?.length
      ? r.contentDescs
      : [{ title: '', content: '' }],
    pointTiming: r.pointTiming,
    contentPoints: r.contentPoints,
    accountLimit: r.accountLimit,
    basePointCode: r.basePointCode,
    needGift: r.needGift,
    totalBudget: r.totalBudget,
    budgetMonth: r.budgetMonth ? dayjs(`${r.budgetMonth}-01`) : undefined,
    budgetAlert: r.budgetAlert,
    pushScope: r.pushScope,
    needContentGen: r.needContentGen,
    aiContentEnabled: r.aiContentEnabled,
    contentTemplate: r.contentTemplate,
    createRequirement: r.createRequirement,
    needMaterial: r.needMaterial,
  };
}

function formToRecord(
  values: FormValues,
  base: TaskCenterRecord,
  mode: TaskFormMode,
): TaskCenterRecord {
  const start = values.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss') || base.startTime;
  const end = values.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss') || base.endTime;
  return {
    ...base,
    name: values.name,
    category: values.category as TaskCenterRecord['category'],
    productName: values.productName,
    participantLimit: values.participantLimit,
    description: values.description,
    startTime: start,
    endTime: end,
    execCycle: values.execCycle,
    fermentCycle: values.fermentCycle,
    appealCycle: values.appealCycle,
    postRequirement: values.postRequirement,
    activityNote: values.activityNote,
    platforms: values.platforms || [],
    requiredTopic: values.requiredTopic,
    copyTopicEnabled: values.copyTopicEnabled,
    contentForms: values.contentForms || [],
    contentDescs: (values.contentDescs || []).filter((d) => d.title || d.content),
    pointTiming: values.pointTiming,
    contentPoints: values.contentPoints,
    accountLimit: values.accountLimit ?? null,
    basePointCode: values.basePointCode,
    needGift: values.needGift,
    totalBudget: values.totalBudget,
    budgetMonth: values.budgetMonth?.format('YYYY-MM') || base.budgetMonth,
    budgetAlert: values.budgetAlert,
    pushScope: values.pushScope,
    needContentGen: values.needContentGen,
    aiContentEnabled: values.aiContentEnabled,
    contentTemplate: values.contentTemplate,
    createRequirement: values.createRequirement || '',
    needMaterial: values.needMaterial,
    publishTime:
      mode === 'create'
        ? dayjs().format('YYYY-MM-DD HH:mm:ss')
        : base.publishTime || dayjs().format('YYYY-MM-DD HH:mm:ss'),
    status: mode === 'create' ? '待开始' : base.status,
  };
}

const modeTitle: Record<TaskFormMode, string> = {
  create: '新建任务',
  edit: '编辑任务',
  detail: '任务详情',
};

export default function TaskFormWizard({ mode, taskId }: Props) {
  const [form] = Form.useForm<FormValues>();
  const [step, setStep] = useState(0);
  const readonly = mode === 'detail';

  const baseRecord = useMemo(() => {
    if (mode === 'create') return createEmptyTask();
    const found = taskId ? getTaskById(taskId) : undefined;
    return found || createEmptyTask();
  }, [mode, taskId]);

  useEffect(() => {
    if (mode === 'create') {
      form.setFieldsValue(recordToForm(createEmptyTask()));
    } else {
      form.setFieldsValue(recordToForm(baseRecord));
    }
    setStep(0);
  }, [mode, taskId, baseRecord, form]);

  const recommendBudget = Form.useWatch('contentPoints', form);
  const participantLimit = Form.useWatch('participantLimit', form);
  const platforms = Form.useWatch('platforms', form);
  const needContentGen = Form.useWatch('needContentGen', form);
  const needMaterial = Form.useWatch('needMaterial', form);

  const recommended = useMemo(() => {
    const points = Number(recommendBudget) || 0;
    const people = Number(participantLimit) || 0;
    const plat = (platforms || []).length || 1;
    return points * people * plat;
  }, [recommendBudget, participantLimit, platforms]);

  const goBack = () => history.push('/task/list');

  const validateStep0 = async () => {
    await form.validateFields([
      'name',
      'category',
      'productName',
      'participantLimit',
      'description',
      'timeRange',
      'execCycle',
      'fermentCycle',
      'appealCycle',
      'platforms',
      'contentForms',
      'pointTiming',
      'contentPoints',
      'basePointCode',
      'totalBudget',
      'budgetMonth',
    ]);
  };

  const onNext = async () => {
    if (readonly) {
      setStep((s) => Math.min(2, s + 1));
      return;
    }
    if (step === 0) {
      try {
        await validateStep0();
        setStep(1);
      } catch {
        message.warning('请完善任务信息必填项');
      }
      return;
    }
    if (step === 1) {
      setStep(2);
    }
  };

  const onSave = async () => {
    if (readonly) return;
    try {
      const values = await form.validateFields();
      const record = formToRecord(values, baseRecord, mode);
      upsertTask(record);
      message.success(mode === 'create' ? '任务创建成功' : '配置已更新');
      history.push('/task/list');
    } catch {
      message.warning('请检查表单填写');
      setStep(0);
    }
  };

  const tip = (text: string) => (
    <QuestionCircleOutlined title={text} style={{ color: 'rgba(0,0,0,0.45)', marginLeft: 4 }} />
  );

  return (
    <div className="task-form-wizard">
      <Space style={{ marginBottom: 8 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
          返回任务列表
        </Button>
      </Space>
      <Title level={3} style={{ marginBottom: 4 }}>
        任务中心 - {modeTitle[mode]}
      </Title>
      <Text type="secondary">任务中心 / {modeTitle[mode]}</Text>
      <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 16 }}>
        任务创建/编辑分三步完成：任务信息、人群选择、内容生成。当前为大页模式，模块纵向展示。
        {readonly ? ' 详情模式仅可查看，不可编辑。' : ''}
      </Paragraph>

      <Steps
        current={step}
        style={{ marginBottom: 24, maxWidth: 720 }}
        items={[
          { title: '任务信息' },
          { title: '人群选择' },
          { title: '内容生成' },
        ]}
      />

      <Form
        form={form}
        layout="vertical"
        disabled={readonly}
        initialValues={recordToForm(baseRecord)}
      >
        {step === 0 && (
          <Card title="活动基本信息" style={{ marginBottom: 16 }}>
            <Form.Item
              label="任务名称"
              name="name"
              rules={[{ required: true, message: '请输入任务名称' }]}
            >
              <Input maxLength={50} showCount placeholder="请输入任务名称" />
            </Form.Item>
            <Form.Item
              label="活动类别"
              name="category"
              rules={[{ required: true, message: '请选择活动类别' }]}
            >
              <Select
                options={[
                  { label: '创作活动', value: '创作活动' },
                  { label: '互动活动', value: '互动活动' },
                  { label: '打卡活动', value: '打卡活动' },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="产品名称"
              name="productName"
              rules={[{ required: true, message: '请输入产品名称' }]}
            >
              <Input maxLength={50} showCount placeholder="请输入产品名称" />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  车型选择
                  {tip('选择品牌和车型（演示可选）')}
                </span>
              }
              name="carModel"
            >
              <Select
                allowClear
                placeholder="请选择品牌和车型"
                options={[
                  { label: '问界 / M7', value: '问界-M7' },
                  { label: '问界 / M9', value: '问界-M9' },
                  { label: '华耐家居 / 全系', value: '华耐-全系' },
                ]}
              />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  参与人数
                  {tip('活动计划参与人数上限')}
                </span>
              }
              name="participantLimit"
              rules={[{ required: true, message: '请输入参与人数' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="活动图片">
              <div
                className="task-form-cover"
                style={{ background: baseRecord.coverColor || '#1677ff' }}
              >
                {baseRecord.productName || '活动封面'}
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                仅支持上传图片文件（jpg/jpeg/png/gif/bmp），演示环境使用占位封面
              </Text>
            </Form.Item>
            <Form.Item
              label="活动描述"
              name="description"
              rules={[{ required: true, message: '请输入活动描述' }]}
            >
              <TextArea rows={4} maxLength={1000} showCount placeholder="请输入活动描述" />
            </Form.Item>

            <Form.Item
              label="活动起止时间"
              name="timeRange"
              rules={[{ required: true, message: '请选择活动起止时间' }]}
            >
              <RangePicker showTime style={{ width: '100%' }} />
            </Form.Item>
            <Space size="large" wrap style={{ width: '100%' }}>
              <Form.Item
                label="执行周期"
                name="execCycle"
                rules={[{ required: true }]}
                style={{ marginBottom: 16 }}
              >
                <InputNumber min={1} addonAfter="天" />
              </Form.Item>
              <Form.Item
                label="发酵周期"
                name="fermentCycle"
                rules={[{ required: true }]}
                style={{ marginBottom: 16 }}
              >
                <InputNumber min={1} addonAfter="天" />
              </Form.Item>
              <Form.Item
                label="申诉周期"
                name="appealCycle"
                rules={[{ required: true }]}
                style={{ marginBottom: 16 }}
              >
                <InputNumber min={1} addonAfter="天" />
              </Form.Item>
            </Space>
            <Form.Item label="发布要求" name="postRequirement">
              <TextArea rows={3} maxLength={1000} showCount />
            </Form.Item>
            <Form.Item label="活动说明" name="activityNote">
              <TextArea rows={3} maxLength={1000} showCount />
            </Form.Item>

            <Title level={5}>目标平台与内容形式</Title>
            <Form.Item
              label="目标平台"
              name="platforms"
              rules={[{ required: true, message: '请选择目标平台' }]}
              extra="选择主类将勾选子项；演示为社媒平台多选"
            >
              <Checkbox.Group options={PLATFORM_CHILDREN} />
            </Form.Item>
            <Form.Item label="必带话题" name="requiredTopic">
              <Input maxLength={100} showCount placeholder="#话题" />
            </Form.Item>
            <Form.Item
              label="开启复制必带话题"
              name="copyTopicEnabled"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="内容形式"
              name="contentForms"
              rules={[{ required: true, message: '请选择内容形式' }]}
            >
              <Checkbox.Group
                options={[
                  { label: '图文', value: '图文' },
                  { label: '视频', value: '视频' },
                ]}
              />
            </Form.Item>

            <Form.List name="contentDescs">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Card
                      key={field.key}
                      size="small"
                      style={{ marginBottom: 12 }}
                      title={`内容描述 ${field.name + 1}`}
                      extra={
                        !readonly && fields.length > 1 ? (
                          <Button type="link" danger onClick={() => remove(field.name)}>
                            删除
                          </Button>
                        ) : null
                      }
                    >
                      <Form.Item
                        {...field}
                        name={[field.name, 'title']}
                        label="描述标题"
                        rules={[{ required: true, message: '请输入标题' }]}
                      >
                        <Input maxLength={50} showCount />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'content']}
                        label="描述内容"
                        rules={[{ required: true, message: '请输入内容' }]}
                      >
                        <TextArea rows={3} maxLength={1000} showCount />
                      </Form.Item>
                    </Card>
                  ))}
                  {!readonly && (
                    <Button type="link" onClick={() => add({ title: '', content: '' })}>
                      + 添加
                    </Button>
                  )}
                </>
              )}
            </Form.List>

            <Title level={5} style={{ marginTop: 16 }}>
              积分设置
            </Title>
            <Form.Item
              label="积分下发时机"
              name="pointTiming"
              rules={[{ required: true }]}
            >
              <Select options={POINT_TIMING_OPTIONS} />
            </Form.Item>
            <Form.Item
              label="内容积分"
              name="contentPoints"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  单账号领取限制
                  {tip('不填则不限制')}
                </span>
              }
              name="accountLimit"
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder="不填则不限制" />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  基础积分编码
                  {tip('积分台账关联编码')}
                </span>
              }
              name="basePointCode"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Title level={5}>礼品设置</Title>
            <Form.Item label="是否需要下发礼品" name="needGift">
              <Select
                options={[
                  { label: '否', value: false },
                  { label: '是', value: true },
                ]}
              />
            </Form.Item>

            <Title level={5}>预算</Title>
            <Alert
              type="warning"
              showIcon
              style={{ marginBottom: 12 }}
              message="请先配置积分规则与参与人数，再填写预算，确保满足最低要求。"
            />
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 12 }}
              message={`基于当前积分规则：推荐活动总预算 ≥ ${recommended.toLocaleString()} 积分。（基础积分 × 参与人数 × 平台数）`}
            />
            <Form.Item
              label="活动总预算（积分）"
              name="totalBudget"
              rules={[
                { required: true, message: '请输入预算' },
                {
                  validator: async (_, value) => {
                    if (value != null && value < recommended) {
                      return Promise.reject(
                        new Error(`不能低于推荐限额 ${recommended.toLocaleString()} 积分`),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              extra={
                recommended
                  ? `不能低于推荐限额 ${recommended.toLocaleString()} 积分`
                  : undefined
              }
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="预算来源月份"
              name="budgetMonth"
              rules={[{ required: true, message: '请选择月份' }]}
            >
              <DatePicker picker="month" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="开启预算预警" name="budgetAlert" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Title level={5}>审核规则设置</Title>
            <Text type="secondary">演示环境沿用默认审核规则，可在任务审核模块处理稿件。</Text>
          </Card>
        )}

        {step === 1 && (
          <Card title="推送范围">
            <Form.Item name="pushScope" rules={[{ required: true }]}>
              <Radio.Group
                options={[
                  { label: '推送全部', value: '全部' },
                  { label: 'AI 人群圈选', value: 'AI人群' },
                ]}
              />
            </Form.Item>
          </Card>
        )}

        {step === 2 && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card title="内容">
              <Form.Item label="是否需要内容生成" name="needContentGen">
                <Radio.Group
                  options={[
                    { label: '需要', value: true },
                    { label: '不需要', value: false },
                  ]}
                />
              </Form.Item>
              {needContentGen && (
                <Card size="small" title="已选模板" style={{ marginBottom: 16 }}>
                  <Form.Item
                    label="AI内容生成"
                    name="aiContentEnabled"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="是" unCheckedChildren="否" />
                  </Form.Item>
                  <Form.Item name="contentTemplate" label="模板预览">
                    <TextArea rows={4} />
                  </Form.Item>
                </Card>
              )}
              <Form.Item label="创作要求" name="createRequirement">
                <TextArea
                  rows={3}
                  maxLength={2000}
                  showCount
                  placeholder="请输入创作要求（非必填）"
                />
              </Form.Item>
            </Card>
            <Card title="素材">
              <Form.Item label="是否需要下发素材" name="needMaterial">
                <Radio.Group
                  options={[
                    { label: '需要', value: true },
                    { label: '不需要', value: false },
                  ]}
                />
              </Form.Item>
              {needMaterial && (
                <Text type="secondary">选择「需要」后可从素材库勾选图片/视频（演示占位）。</Text>
              )}
            </Card>
          </Space>
        )}
      </Form>

      <div className="task-form-footer">
        <Space>
          {step > 0 && (
            <Button onClick={() => setStep((s) => s - 1)}>回到上一步</Button>
          )}
          {step < 2 && (
            <Button type="primary" onClick={onNext}>
              下一步
            </Button>
          )}
          {step === 2 && !readonly && (
            <Button type="primary" onClick={onSave}>
              {mode === 'create' ? '创建任务' : '保存配置更新'}
            </Button>
          )}
          {step === 2 && readonly && (
            <Button type="primary" onClick={goBack}>
              返回列表
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
}
