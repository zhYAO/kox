import {
  ArrowLeftOutlined,
  ClearOutlined,
  CheckSquareOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Select,
  Space,
  Steps,
  Tag,
  Typography,
  message,
} from 'antd';
import { history, useSearchParams } from '@umijs/max';
import { useEffect, useMemo, useState } from 'react';
import {
  INTEREST_GROUPS,
  MOCK_OPS_STAFF,
  OPS_MATERIAL_OPTIONS,
  OPS_PLATFORM_OPTIONS,
  OPS_TYPE_OPTIONS,
  getOpsTasks,
  setOpsTasks,
  type OpsTask,
} from '@/mock/opsTask';
import './list/index.css';

const { Text, Title } = Typography;
const { TextArea } = Input;

type BasicValues = {
  name: string;
  type: string;
  description?: string;
  productName: string;
  materialType: string;
  platform: string;
};

export default function OpsCreatePage() {
  const [params] = useSearchParams();
  const editId = params.get('id');
  const [step, setStep] = useState(0);
  const [form] = Form.useForm<BasicValues>();
  const [basic, setBasic] = useState<BasicValues | null>(null);
  const [keyword, setKeyword] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [gender, setGender] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (!editId) return;
    const task = getOpsTasks().find((item) => item.key === editId);
    if (!task) return;
    const values: BasicValues = {
      name: task.name,
      type: task.type,
      description: task.description,
      productName: task.productName,
      materialType: task.materialType,
      platform: task.platform,
    };
    form.setFieldsValue(values);
    setBasic(values);
    setSelectedStaff(MOCK_OPS_STAFF.slice(0, Math.min(task.staffCount, MOCK_OPS_STAFF.length)).map((s) => s.key));
  }, [editId, form]);

  const staffList = useMemo(() => {
    return MOCK_OPS_STAFF.filter((item) => {
      if (keyword.trim()) {
        const kw = keyword.trim();
        if (!item.name.includes(kw) && !item.group.includes(kw)) return false;
      }
      if (gender.length && !gender.includes(item.gender)) return false;
      if (ageGroup.length && !ageGroup.includes(item.ageGroup)) return false;
      if (interests.length && !interests.some((i) => item.interests.includes(i))) return false;
      return true;
    });
  }, [keyword, gender, ageGroup, interests]);

  const toggleChip = (list: string[], value: string, setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((i) => i !== value) : [...list, value]);
  };

  const saveTask = () => {
    if (!basic) return;
    const now = dayjsLike();
    const existing = editId ? getOpsTasks().find((item) => item.key === editId) : null;
    const next: OpsTask = {
      key: existing?.key || `o_${Date.now()}`,
      name: basic.name,
      type: basic.type as OpsTask['type'],
      materialType: basic.materialType as OpsTask['materialType'],
      platform: basic.platform as OpsTask['platform'],
      description: basic.description || '暂无说明',
      productName: basic.productName,
      staffCount: selectedStaff.length,
      editedCount: existing?.editedCount || 0,
      publishedCount: existing?.publishedCount || 0,
      auditedCount: existing?.auditedCount || 0,
      pendingAuditCount: existing?.pendingAuditCount || 0,
      issueTime: existing?.issueTime || '-',
      planIssueTime: existing?.planIssueTime || now,
      deadline: existing?.deadline || now,
      status: existing?.status || '待下发',
      auditStatus: existing?.auditStatus || '待审核',
    };
    const list = getOpsTasks();
    setOpsTasks(existing ? list.map((item) => (item.key === existing.key ? next : item)) : [next, ...list]);
    message.success(existing ? '任务已更新（mock）' : '任务已创建（mock）');
    history.push('/ops/list');
  };

  return (
    <div className="ops-create-page">
      {step === 0 ? (
        <>
          <Steps
            current={0}
            items={[
              { title: '任务信息', description: '填写任务基本信息' },
              { title: '选择员工', description: '选择导购人员并设置筛选条件' },
              { title: '内容配置', description: '配置内容生成和素材下发' },
            ]}
          />
          <Card title="基本信息">
            <Form
              form={form}
              layout="vertical"
              initialValues={{ type: '营销类', materialType: '图文任务', platform: '小红书' }}
            >
              <Form.Item
                name="name"
                label="任务名称"
                rules={[{ required: true, message: '请输入任务名称' }]}
              >
                <Input showCount maxLength={200} placeholder="如[品牌] MB 推广" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="type" label="任务类型" rules={[{ required: true }]}>
                    <Select options={OPS_TYPE_OPTIONS.filter((o) => o.value)} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="productName" label="产品名称" rules={[{ required: true, message: '请输入产品名称' }]}>
                    <Input placeholder="请输入产品名称" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="description" label="任务描述">
                <TextArea rows={4} placeholder="请输入任务描述" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="materialType" label="素材类型" rules={[{ required: true }]}>
                    <Select options={OPS_MATERIAL_OPTIONS.filter((o) => o.value)} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="platform" label="目标平台" rules={[{ required: true }]}>
                    <Select options={OPS_PLATFORM_OPTIONS} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => form.resetFields()}>重置</Button>
              <Button
                type="primary"
                onClick={async () => {
                  const values = await form.validateFields();
                  setBasic(values);
                  setStep(1);
                }}
              >
                下一步
              </Button>
            </Space>
          </Card>
        </>
      ) : null}

      {step === 1 && (
        <>
          <div className="ops-page-head">
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => setStep(0)}>
                返回上一步
              </Button>
              <Title level={4} style={{ margin: 0 }}>
                选择员工
              </Title>
            </Space>
            <Text type="secondary">步骤 2/3</Text>
          </div>

          <div className="ops-create-body">
            <Card className="ops-create-left" title={<Space><UserOutlined /> 执行员工</Space>}>
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="搜索姓名或分组"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ marginBottom: 12 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text type="secondary">选择员工（可勾选分组或具体员工）</Text>
                <Space>
                  <Button
                    size="small"
                    icon={<CheckSquareOutlined />}
                    onClick={() => setSelectedStaff(staffList.map((s) => s.key))}
                  >
                    全选
                  </Button>
                  <Button size="small" icon={<ClearOutlined />} onClick={() => setSelectedStaff([])}>
                    清空
                  </Button>
                </Space>
              </div>
              {staffList.length ? (
                staffList.map((item) => (
                  <div key={item.key} className="ops-staff-item">
                    <Checkbox
                      checked={selectedStaff.includes(item.key)}
                      onChange={(e) => {
                        setSelectedStaff((prev) =>
                          e.target.checked ? [...prev, item.key] : prev.filter((k) => k !== item.key),
                        );
                      }}
                    >
                      <Space>
                        <Text strong>{item.name}</Text>
                        <Text type="secondary">{item.group}</Text>
                      </Space>
                    </Checkbox>
                    <Space size={[4, 4]} wrap>
                      {item.interests.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  </div>
                ))
              ) : (
                <Empty description="暂无导购人员数据" />
              )}
              <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 16 }}>
                <Button onClick={() => setStep(0)}>上一步</Button>
                <Button
                  type="primary"
                  onClick={() => {
                    if (!selectedStaff.length) {
                      message.warning('请先选择员工');
                      return;
                    }
                    setStep(2);
                  }}
                >
                  下一步
                </Button>
              </Space>
            </Card>

            <div className="ops-create-right">
              <Row gutter={12}>
                <Col span={12}>
                  <Card>
                    <Text type="secondary">已选员工数</Text>
                    <div style={{ fontSize: 28, color: '#1677ff', fontWeight: 600 }}>{selectedStaff.length}</div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Space>
                      <Text type="secondary">实际派发人数</Text>
                      <InfoCircleOutlined />
                    </Space>
                    <div style={{ fontSize: 28, fontWeight: 600 }}>{selectedStaff.length}</div>
                  </Card>
                </Col>
              </Row>
              <Card title="人员筛选">
                <div className="ops-filter-chip">
                  <Text type="secondary">性别</Text>
                  <div style={{ marginTop: 8 }}>
                    {['男', '女'].map((item) => (
                      <Button
                        key={item}
                        size="small"
                        type={gender.includes(item) ? 'primary' : 'default'}
                        style={{ marginRight: 8 }}
                        onClick={() => toggleChip(gender, item, setGender)}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="ops-filter-chip">
                  <Text type="secondary">年龄段</Text>
                  <div style={{ marginTop: 8 }}>
                    {['18岁以下', '18-24', '25-34', '35-44', '>44'].map((item) => (
                      <Button
                        key={item}
                        size="small"
                        type={ageGroup.includes(item) ? 'primary' : 'default'}
                        style={{ marginRight: 8, marginBottom: 8 }}
                        onClick={() => toggleChip(ageGroup, item, setAgeGroup)}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Text type="secondary">兴趣标签（可多选）</Text>
                  <div style={{ marginTop: 8 }}>
                    {INTEREST_GROUPS.map((item) => (
                      <Tag.CheckableTag
                        key={item}
                        checked={interests.includes(item)}
                        onChange={() => toggleChip(interests, item, setInterests)}
                        style={{ marginBottom: 8 }}
                      >
                        {item}
                      </Tag.CheckableTag>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <Card
          title="内容配置"
          extra={<Text type="secondary">步骤 3/3</Text>}
        >
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Text>任务：{basic?.name}</Text>
            <Text>素材类型：{basic?.materialType} / 平台：{basic?.platform}</Text>
            <Text>派发员工：{selectedStaff.length} 人</Text>
            <Text type="secondary">将按任务配置自动生成内容模板并下发素材包（mock）。</Text>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setStep(1)}>上一步</Button>
              <Button type="primary" onClick={saveTask}>
                保存任务
              </Button>
            </Space>
          </Space>
        </Card>
      )}
    </div>
  );
}

function dayjsLike() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:00`;
}
