import { DeleteOutlined, PlusOutlined, ThunderboltOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Input,
  Modal,
  Select,
  Space,
  Steps,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import {
  CITY_OPTIONS,
  FIELD_OPTIONS,
  MOCK_MATCHED_KOX,
  OPERATOR_OPTIONS,
  createEmptyCondition,
  createEmptyGroup,
  createId,
  type AudiencePackage,
  type MatchedKox,
  type RuleGroup,
} from '@/mock/audience';

const { Text, Title } = Typography;
const { TextArea } = Input;

type AudienceCircleModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  record?: AudiencePackage | null;
  onClose: () => void;
  onSave: (payload: AudiencePackage) => void;
};

export default function AudienceCircleModal({
  open,
  mode,
  record,
  onClose,
  onSave,
}: AudienceCircleModalProps) {
  const [tab, setTab] = useState('ai');
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');
  const [ruleStep, setRuleStep] = useState(0);
  const [groups, setGroups] = useState<RuleGroup[]>([createEmptyGroup('且')]);
  const [matched, setMatched] = useState<MatchedKox[]>([]);
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && record) {
      setName(record.name);
      setGoal(record.goal || '');
      setRuleDesc(record.ruleDesc || record.description || '');
      setTab(record.mode === 'rule' ? 'rule' : 'ai');
      setMatched(MOCK_MATCHED_KOX.slice(0, record.volume));
      setGroups([createEmptyGroup('且')]);
      setRuleStep(0);
    } else {
      setName('');
      setGoal('');
      setRuleDesc('');
      setTab('ai');
      setMatched([]);
      setGroups([createEmptyGroup('且')]);
      setRuleStep(0);
    }
  }, [open, mode, record]);

  const columns: ColumnsType<MatchedKox> = useMemo(
    () => [
      { title: '用户', dataIndex: 'name' },
      {
        title: '平台',
        dataIndex: 'platforms',
        render: (platforms: string[]) => (
          <Space wrap size={[4, 4]}>
            {platforms.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </Space>
        ),
      },
      {
        title: '粉丝数',
        dataIndex: 'followers',
        render: (value: number) => value.toLocaleString(),
      },
      {
        title: '点赞数',
        dataIndex: 'likes',
        render: (value: number) => value.toLocaleString(),
      },
      {
        title: '高价值标签',
        dataIndex: 'label',
        render: (value: string) => <Tag color="processing">{value}</Tag>,
      },
    ],
    [],
  );

  const runAiMatch = () => {
    if (!goal.trim()) {
      message.warning('请先输入活动目标');
      return;
    }
    setMatching(true);
    window.setTimeout(() => {
      setMatched(MOCK_MATCHED_KOX);
      setMatching(false);
      message.success('AI 智能匹配完成（mock）');
    }, 600);
  };

  const runRuleSearch = () => {
    const hasValue = groups.some((group) => group.conditions.some((item) => item.value));
    if (!hasValue) {
      message.warning('请至少设置一个条件值');
      return;
    }
    setMatching(true);
    window.setTimeout(() => {
      setMatched(MOCK_MATCHED_KOX.slice(0, 6));
      setMatching(false);
      message.success('规则搜索完成（mock）');
    }, 500);
  };

  const handleSave = () => {
    if (!name.trim()) {
      message.warning('请输入人群包名称');
      return;
    }
    if (tab === 'ai' && !goal.trim()) {
      message.warning('请输入活动目标');
      return;
    }
    if (matched.length === 0) {
      message.warning('请先完成匹配或搜索');
      return;
    }

    const payload: AudiencePackage = {
      key: record?.key || createId('pkg'),
      name: name.trim(),
      volume: matched.length,
      description:
        tab === 'ai'
          ? goal.trim().slice(0, 80)
          : ruleDesc.trim() || '规则筛选人群包',
      createTime: record?.createTime || new Date().toISOString().slice(0, 19).replace('T', ' '),
      mode: tab === 'ai' ? 'ai' : 'rule',
      goal: tab === 'ai' ? goal.trim() : record?.goal,
      ruleDesc: tab === 'rule' ? ruleDesc.trim() : record?.ruleDesc,
    };
    onSave(payload);
    message.success(mode === 'edit' ? '人群包已更新（mock）' : '人群包已保存（mock）');
    onClose();
  };

  const updateCondition = (groupId: string, condId: string, patch: Partial<RuleGroup['conditions'][number]>) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map((cond) =>
                cond.id === condId ? { ...cond, ...patch } : cond,
              ),
            }
          : group,
      ),
    );
  };

  return (
    <Modal
      title={mode === 'edit' ? '编辑人群包' : 'AI 人群圈选'}
      open={open}
      onCancel={onClose}
      width={980}
      destroyOnClose
      footer={null}
    >
      <Text type="secondary">
        基于CDP标签的精准筛选，支持规则筛选与AI智能筛选
      </Text>

      <Space style={{ width: '100%', marginTop: 16, marginBottom: 8 }} wrap>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入人群包名称"
          style={{ width: 360 }}
        />
        <Button type="primary" onClick={handleSave}>
          保存人群包
        </Button>
      </Space>

      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          {
            key: 'ai',
            label: 'AI 人群圈选',
            children: (
              <Space direction="vertical" size={16} style={{ display: 'flex' }}>
                <Text type="secondary">输入活动目标，系统将基于CDP标签智能匹配KOX。</Text>
                <div>
                  <Title level={5}>活动目标</Title>
                  <TextArea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    rows={6}
                    maxLength={2000}
                    showCount
                    placeholder="例如：需要在小红书平台推广新款SUV，目标人群为25-35岁的年轻车主，偏好户外生活方式..."
                  />
                </div>
                <Button
                  type="primary"
                  icon={<ThunderboltOutlined />}
                  loading={matching}
                  onClick={runAiMatch}
                >
                  AI 智能匹配
                </Button>

                {matched.length > 0 && (
                  <>
                    <Title level={5} style={{ marginBottom: 0 }}>
                      智能匹配结果
                    </Title>
                    <div
                      style={{
                        background: '#e6f4ff',
                        border: '1px solid #91caff',
                        borderRadius: 6,
                        padding: '8px 12px',
                      }}
                    >
                      共筛选到 {matched.length} 位KOX，高风险博主：0（以下展示部分示例）
                    </div>
                    <Table
                      rowKey="key"
                      size="middle"
                      columns={columns}
                      dataSource={matched}
                      pagination={false}
                    />
                  </>
                )}
              </Space>
            ),
          },
          {
            key: 'rule',
            label: '规则筛选',
            children: (
              <Space direction="vertical" size={16} style={{ display: 'flex' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
                  <Steps
                    size="small"
                    current={ruleStep}
                    style={{ maxWidth: 420 }}
                    items={[{ title: '规则定义' }, { title: '计算设置' }]}
                  />
                  {ruleStep === 0 ? (
                    <Button type="primary" onClick={() => setRuleStep(1)}>
                      下一步
                    </Button>
                  ) : (
                    <Button onClick={() => setRuleStep(0)}>上一步</Button>
                  )}
                </Space>

                {ruleStep === 0 ? (
                  <>
                    {groups.map((group, groupIndex) => (
                      <Card
                        key={group.id}
                        size="small"
                        title={
                          <Space>
                            <span
                              style={{
                                width: 3,
                                height: 14,
                                background: '#1677ff',
                                display: 'inline-block',
                              }}
                            />
                            条件组 {groupIndex + 1}
                            <Select
                              size="small"
                              value={group.logic}
                              style={{ width: 72 }}
                              options={[
                                { label: '且', value: '且' },
                                { label: '或', value: '或' },
                              ]}
                              onChange={(logic) =>
                                setGroups((prev) =>
                                  prev.map((item) =>
                                    item.id === group.id ? { ...item, logic } : item,
                                  ),
                                )
                              }
                            />
                            <Text type="secondary">组内条件以「{group.logic}」关系组合</Text>
                          </Space>
                        }
                        extra={
                          groups.length > 1 ? (
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() =>
                                setGroups((prev) => prev.filter((item) => item.id !== group.id))
                              }
                            />
                          ) : null
                        }
                      >
                        <Space direction="vertical" style={{ display: 'flex' }} size={8}>
                          {group.conditions.map((cond) => (
                            <Space key={cond.id} wrap>
                              <Select
                                value={cond.field}
                                style={{ width: 140 }}
                                options={FIELD_OPTIONS}
                                onChange={(field) => updateCondition(group.id, cond.id, { field })}
                              />
                              <Select
                                value={cond.operator}
                                style={{ width: 120 }}
                                options={OPERATOR_OPTIONS}
                                onChange={(operator) =>
                                  updateCondition(group.id, cond.id, { operator })
                                }
                              />
                              <Select
                                value={cond.value}
                                allowClear
                                placeholder="选择值"
                                style={{ width: 160 }}
                                options={CITY_OPTIONS}
                                onChange={(value) => updateCondition(group.id, cond.id, { value })}
                              />
                              <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                disabled={group.conditions.length === 1}
                                onClick={() =>
                                  setGroups((prev) =>
                                    prev.map((item) =>
                                      item.id === group.id
                                        ? {
                                            ...item,
                                            conditions: item.conditions.filter(
                                              (c) => c.id !== cond.id,
                                            ),
                                          }
                                        : item,
                                    ),
                                  )
                                }
                              />
                            </Space>
                          ))}
                          <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() =>
                              setGroups((prev) =>
                                prev.map((item) =>
                                  item.id === group.id
                                    ? {
                                        ...item,
                                        conditions: [...item.conditions, createEmptyCondition()],
                                      }
                                    : item,
                                ),
                              )
                            }
                          >
                            添加条件
                          </Button>
                        </Space>
                      </Card>
                    ))}

                    <div>
                      <Title level={5}>描述信息</Title>
                      <TextArea
                        value={ruleDesc}
                        onChange={(e) => setRuleDesc(e.target.value)}
                        rows={4}
                        maxLength={500}
                        showCount
                        placeholder="请输入规则筛选的描述信息（可选）"
                      />
                    </div>

                    <Space wrap>
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => setGroups((prev) => [...prev, createEmptyGroup('且')])}
                      >
                        添加且组
                      </Button>
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => setGroups((prev) => [...prev, createEmptyGroup('或')])}
                      >
                        添加或组
                      </Button>
                      <Button
                        onClick={() => {
                          setGroups([createEmptyGroup('且')]);
                          setRuleDesc('');
                          setMatched([]);
                        }}
                      >
                        重置
                      </Button>
                      <Button
                        type="primary"
                        icon={<ThunderboltOutlined />}
                        loading={matching}
                        onClick={runRuleSearch}
                      >
                        搜索
                      </Button>
                    </Space>
                  </>
                ) : (
                  <Card size="small" title="计算设置">
                    <Space direction="vertical">
                      <Text>预估命中量级：{matched.length || '待搜索'}</Text>
                      <Text type="secondary">计算方式：即时计算（mock）</Text>
                      <Text type="secondary">更新策略：保存后静态快照（mock）</Text>
                      <Button type="primary" loading={matching} onClick={runRuleSearch}>
                        重新计算
                      </Button>
                    </Space>
                  </Card>
                )}

                {matched.length > 0 && (
                  <>
                    <Title level={5} style={{ marginBottom: 0 }}>
                      匹配结果
                    </Title>
                    <Table
                      rowKey="key"
                      size="middle"
                      columns={columns}
                      dataSource={matched}
                      pagination={false}
                    />
                  </>
                )}
              </Space>
            ),
          },
        ]}
      />
    </Modal>
  );
}
