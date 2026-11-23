import {
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  LeftOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Steps,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useRef, useState } from 'react';
import {
  DEFAULT_DIMENSIONS,
  DIMENSION_GROUPS,
  MOCK_ANALYSIS_REPORTS,
  REGION_OPTIONS,
  REPORT_STATUS_OPTIONS,
  type AnalysisReport,
} from '@/mock/analysisReport';

const { RangePicker } = DatePicker;
const { Link, Text, Title } = Typography;
const { TextArea } = Input;

const INFO_ATTR_OPTIONS = ['全选', '敏感', '非敏感', '中性'];
const INFO_CONTENT_OPTIONS = ['全部', '正常信息', '噪音信息'];
const REGION_MATCH_OPTIONS = ['全选', '定位地', '用户所在地', '内容涉及地', '精准提及地'];
const KEYWORD_MATCH_OPTIONS = [
  '全选',
  '标题',
  '内容',
  '封面识别',
  '图文识别',
  '音频识别',
  '作者',
  '定位地',
  '用户所在地',
];
const AUTH_TYPE_OPTIONS = ['全选', '政务认证', '机构认证', '企业认证', '个人认证', '未认证'];

function OptionGroup({
  label,
  required,
  tip,
  options,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  tip?: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const allKey = options[0];
  const rest = options.slice(1);

  const toggle = (item: string) => {
    if (item === allKey) {
      onChange(value.includes(allKey) ? [] : [...options]);
      return;
    }
    let next = value.includes(item) ? value.filter((v) => v !== item) : [...value, item];
    next = next.filter((v) => v !== allKey);
    if (rest.every((v) => next.includes(v))) next = [...options];
    onChange(next);
  };

  return (
    <Form.Item
      label={
        <Space>
          {required && <Text type="danger">*</Text>}
          {label}
          {tip && (
            <Tooltip title={tip}>
              <QuestionCircleOutlined />
            </Tooltip>
          )}
        </Space>
      }
      required={required}
    >
      <Space wrap>
        {options.map((item) => (
          <Button
            key={item}
            size="small"
            type={value.includes(item) ? 'primary' : 'default'}
            onClick={() => toggle(item)}
          >
            {item}
          </Button>
        ))}
      </Space>
    </Form.Item>
  );
}

export default function AnalysisReportPage() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string>();
  const [records, setRecords] = useState<AnalysisReport[]>(() => [...MOCK_ANALYSIS_REPORTS]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [detail, setDetail] = useState<AnalysisReport | null>(null);
  const [basicForm] = Form.useForm();
  const keywordRef = useRef<any>(null);

  const [infoAttr, setInfoAttr] = useState<string[]>([...INFO_ATTR_OPTIONS]);
  const [infoContent, setInfoContent] = useState<string[]>(['全部']);
  const [regionMatch, setRegionMatch] = useState<string[]>([...REGION_MATCH_OPTIONS]);
  const [keywordMatch, setKeywordMatch] = useState<string[]>([...KEYWORD_MATCH_OPTIONS]);
  const [authType, setAuthType] = useState<string[]>([...AUTH_TYPE_OPTIONS]);
  const [monitorTime, setMonitorTime] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(3, 'day').hour(18).minute(10),
    dayjs().hour(18).minute(10),
  ]);

  const dataSource = useMemo(() => {
    return records.filter((item) => {
      if (keyword && !item.name.includes(keyword.trim())) return false;
      if (status && item.status !== status) return false;
      return true;
    });
  }, [keyword, records, status]);

  const insertKeywordToken = (token: string) => {
    const current = basicForm.getFieldValue('keywords') || '';
    basicForm.setFieldsValue({ keywords: `${current}${token}` });
    keywordRef.current?.focus?.();
  };

  const openWizard = () => {
    setStep(0);
    basicForm.setFieldsValue({
      name: '',
      regions: ['东城区'],
      monitorNoRegion: false,
      keywords: '',
      excludeWords: '',
      enableDistance: true,
      wordDistance: 0,
      ordered: true,
      dimensions: DEFAULT_DIMENSIONS,
    });
    setInfoAttr([...INFO_ATTR_OPTIONS]);
    setInfoContent(['全部']);
    setRegionMatch([...REGION_MATCH_OPTIONS]);
    setKeywordMatch([...KEYWORD_MATCH_OPTIONS]);
    setAuthType([...AUTH_TYPE_OPTIONS]);
    setWizardOpen(true);
  };

  const generateReport = async () => {
    const values = await basicForm.validateFields();
    if (!regionMatch.length || !keywordMatch.length || !authType.length) {
      message.warning('请完善必填筛选条件');
      return;
    }
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const report: AnalysisReport = {
      key: `report_${Date.now()}`,
      name: values.name,
      keywords: values.keywords,
      status: '生成中',
      createTime: now,
      regions: values.regions,
      excludeWords: values.excludeWords,
      wordDistance: values.enableDistance ? values.wordDistance : undefined,
      ordered: values.ordered,
      dimensions: values.dimensions,
    };
    setRecords((prev) => [report, ...prev]);
    setWizardOpen(false);
    message.success('报告已开始生成（mock）');

    window.setTimeout(() => {
      setRecords((prev) =>
        prev.map((item) => (item.key === report.key ? { ...item, status: '已完成' } : item)),
      );
    }, 2500);
  };

  const columns: ColumnsType<AnalysisReport> = [
    {
      title: '报告名称',
      dataIndex: 'name',
      render: (value: string) => (
        <Space>
          <FileTextOutlined />
          {value}
        </Space>
      ),
    },
    { title: '关键词', dataIndex: 'keywords', ellipsis: true },
    {
      title: '报告状态',
      dataIndex: 'status',
      width: 120,
      render: (value: AnalysisReport['status']) => (
        <Tag color={value === '已完成' ? 'success' : 'processing'}>{value}</Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 260,
      fixed: 'right',
      render: (_, record) => {
        const done = record.status === '已完成';
        return (
          <Space wrap>
            <Link onClick={() => setDetail(record)}>
              <EyeOutlined /> 详情
            </Link>
            <Link
              disabled={!done}
              onClick={() => done && message.success(`查看报告：${record.name}（mock）`)}
            >
              <FileSearchOutlined /> 查看
            </Link>
            <Link
              disabled={!done}
              onClick={() => done && message.success(`下载报告：${record.name}（mock）`)}
            >
              <DownloadOutlined /> 下载
            </Link>
            <Link
              type="danger"
              onClick={() => {
                Modal.confirm({
                  title: '确认删除该报告？',
                  content: `删除后不可恢复：${record.name}`,
                  okText: '删除',
                  okButtonProps: { danger: true },
                  cancelText: '取消',
                  onOk: () => {
                    setRecords((prev) => prev.filter((item) => item.key !== record.key));
                    message.success('已删除（mock）');
                  },
                });
              }}
            >
              <DeleteOutlined /> 删除
            </Link>
          </Space>
        );
      },
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card size="small">
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="报告标题名称"
              style={{ width: 240 }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Select
              allowClear
              placeholder="报告状态"
              style={{ width: 160 }}
              options={REPORT_STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setKeyword('');
                setStatus(undefined);
              }}
            >
              重置
            </Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={openWizard}>
            创建AI报告
          </Button>
        </Space>
      </Card>

      <Card size="small">
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1000 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            defaultPageSize: 20,
          }}
        />
      </Card>

      <Modal
        title={null}
        open={wizardOpen}
        onCancel={() => setWizardOpen(false)}
        width={980}
        footer={null}
        destroyOnClose
      >
        <Steps
          current={step}
          style={{ maxWidth: 480, margin: '0 auto 24px' }}
          items={[
            { title: '基础设置', icon: <FileSearchOutlined /> },
            { title: '筛选条件', icon: step >= 1 ? <CheckCircleOutlined /> : undefined },
          ]}
        />

        {step === 0 ? (
          <>
            <Title level={4}>创建分析报告</Title>
            <Form form={basicForm} layout="vertical">
              <Form.Item
                name="name"
                label="标题名称"
                rules={[
                  { required: true, message: '请输入标题名称' },
                  { max: 20, message: '最多 20 个字' },
                ]}
              >
                <Input showCount maxLength={20} placeholder="请输入标题名称" />
              </Form.Item>
              <Form.Item name="regions" label="关注地域">
                <Select mode="multiple" allowClear options={REGION_OPTIONS} placeholder="请选择地域" />
              </Form.Item>
              <Form.Item name="monitorNoRegion" label="监测无地域信息的作品" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item
                name="keywords"
                label={
                  <Space>
                    关键词
                    <Tooltip title="支持 & | () 组合表达式">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                rules={[{ required: true, message: '请输入关键词' }]}
              >
                <TextArea ref={keywordRef} rows={4} placeholder="例如：问界&M7|(提车|试驾)" />
              </Form.Item>
              <Space style={{ marginBottom: 16 }} wrap>
                {['&', '|', '()', '(', ')', '—'].map((token) => (
                  <Button key={token} size="small" onClick={() => insertKeywordToken(token)}>
                    {token}
                  </Button>
                ))}
                <Tooltip title="& 且，| 或，() 分组">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
              <Form.Item name="excludeWords" label="排除词">
                <Input placeholder="请输入排除词" />
              </Form.Item>
              <Form.Item label="词距">
                <Space align="start">
                  <Form.Item name="enableDistance" valuePropName="checked" noStyle>
                    <Switch />
                  </Form.Item>
                  <Form.Item name="wordDistance" noStyle>
                    <InputNumber min={0} max={20} />
                  </Form.Item>
                </Space>
                <div>
                  <Text type="secondary">
                    关键词之间的字距大于您的设定值时，信息将自动过滤不展示。
                  </Text>
                </div>
              </Form.Item>
              <Form.Item name="ordered" label="按关键词先后顺序查询" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item
                name="dimensions"
                label="分析维度"
                rules={[{ required: true, message: '请选择分析维度' }]}
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <Space direction="vertical" size={16} style={{ display: 'flex' }}>
                    {DIMENSION_GROUPS.map((group) => (
                      <div key={group.title}>
                        <Text strong>{group.title}</Text>
                        <Row gutter={[12, 8]} style={{ marginTop: 8 }}>
                          {group.items.map((item) => (
                            <Col xs={24} sm={12} md={8} key={item.value}>
                              <Checkbox value={item.value}>
                                {item.label}
                                {item.isNew ? (
                                  <Badge
                                    count="NEW"
                                    style={{ backgroundColor: '#ff4d4f', marginLeft: 6 }}
                                  />
                                ) : null}
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Form.Item>
            </Form>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setWizardOpen(false)}>取消</Button>
              <Button
                type="primary"
                icon={<RightOutlined />}
                onClick={async () => {
                  await basicForm.validateFields();
                  setStep(1);
                }}
              >
                下一步
              </Button>
            </Space>
          </>
        ) : (
          <>
            <Form layout="vertical">
              <Form.Item
                label="监测时间"
                extra={<Text type="secondary">时间范围最大可查询100天</Text>}
              >
                <RangePicker
                  showTime
                  style={{ width: 420 }}
                  value={monitorTime}
                  onChange={(value) => {
                    if (value?.[0] && value?.[1]) setMonitorTime([value[0], value[1]]);
                  }}
                />
              </Form.Item>
              <OptionGroup
                label="信息属性"
                options={INFO_ATTR_OPTIONS}
                value={infoAttr}
                onChange={setInfoAttr}
              />
              <OptionGroup
                label="信息内容"
                tip="噪音信息将被单独归类"
                options={INFO_CONTENT_OPTIONS}
                value={infoContent}
                onChange={setInfoContent}
              />
              <OptionGroup
                label="关注地域匹配"
                required
                options={REGION_MATCH_OPTIONS}
                value={regionMatch}
                onChange={setRegionMatch}
              />
              <OptionGroup
                label="关键词匹配"
                required
                options={KEYWORD_MATCH_OPTIONS}
                value={keywordMatch}
                onChange={setKeywordMatch}
              />
              <OptionGroup
                label="认证类型"
                required
                options={AUTH_TYPE_OPTIONS}
                value={authType}
                onChange={setAuthType}
              />
            </Form>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button icon={<LeftOutlined />} onClick={() => setStep(0)}>
                上一步
              </Button>
              <Button onClick={() => message.info('预览数据（mock）')}>预览数据</Button>
              <Button type="primary" onClick={generateReport}>
                生成报告
              </Button>
            </Space>
          </>
        )}
      </Modal>

      <Modal
        title={detail ? `报告详情 - ${detail.name}` : '报告详情'}
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={<Button onClick={() => setDetail(null)}>关闭</Button>}
        width={720}
      >
        {detail && (
          <Space direction="vertical" size={8}>
            <Text>报告名称：{detail.name}</Text>
            <Text>关键词：{detail.keywords}</Text>
            <Text>
              状态：
              <Tag color={detail.status === '已完成' ? 'success' : 'processing'}>{detail.status}</Tag>
            </Text>
            <Text>创建时间：{detail.createTime}</Text>
            <Text>关注地域：{(detail.regions || []).join('、') || '-'}</Text>
            <Text>排除词：{detail.excludeWords || '-'}</Text>
            <Text>分析维度：{(detail.dimensions || []).join('、') || '-'}</Text>
          </Space>
        )}
      </Modal>
    </Space>
  );
}
