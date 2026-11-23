import {
  DownloadOutlined,
  DownOutlined,
  ExclamationCircleFilled,
  ReloadOutlined,
  SettingOutlined,
  UpOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { history } from '@umijs/max';
import type { Key, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import EditKoxDrawer from '@/components/EditKoxDrawer';
import {
  COLUMN_METAS,
  DEFAULT_VISIBLE_COLUMNS,
  DIMENSION_OPTIONS,
  LIST_STATUS_OPTIONS,
  MOCK_KOX_LIST,
  OFFICE_OPTIONS,
  PLATFORM_OPTIONS,
  STATUS_OPTIONS,
  platformLabel,
  type KoxRecord,
} from '@/mock/koxList';

const { RangePicker } = DatePicker;
const { Link, Text, Title } = Typography;

type FilterValues = {
  koxId?: string;
  nickname?: string;
  phone?: string;
  platform?: string;
  office?: string;
  model?: string;
  ownerTag?: string;
  ownerIdentity?: string;
  excludeTag?: string;
  status?: string;
  listStatus?: string;
  task?: string;
  track?: string;
  registerTime?: unknown;
  unbindTime?: unknown;
  createTime?: unknown;
};

export default function KoxListPage() {
  const [form] = Form.useForm<FilterValues>();
  const [expanded, setExpanded] = useState(true);
  const [dimension, setDimension] = useState('user');
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [columnOpen, setColumnOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);
  const [draftKeys, setDraftKeys] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);
  const [records, setRecords] = useState<KoxRecord[]>(() => [...MOCK_KOX_LIST]);
  const [editing, setEditing] = useState<KoxRecord | null>(null);

  const openUnbindConfirm = (record: KoxRecord) => {
    Modal.confirm({
      title: '确认解绑该 KOC 用户？',
      icon: <ExclamationCircleFilled />,
      width: 480,
      content:
        '解绑后用户状态将变更为【不可用】，自动解除与本代表处的绑定关系，后续各类数据报表不再统计该用户相关数据，解绑记录支持留存导出。',
      okText: '确认解绑',
      cancelText: '取消',
      onOk: () => {
        setRecords((prev) =>
          prev.map((item) =>
            item.key === record.key
              ? {
                  ...item,
                  status: '不可用',
                  unbindTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
                }
              : item,
          ),
        );
        message.success('已解绑（mock）');
      },
    });
  };

  const renderCell = (key: string, record: KoxRecord): ReactNode => {
    switch (key) {
      case 'source':
        return <Tag color="processing">{record.source}</Tag>;
      case 'nickname':
        return (
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            <span>{record.nickname}</span>
          </Space>
        );
      case 'status':
        return <Tag color={record.status === '可用' ? 'success' : 'default'}>{record.status}</Tag>;
      case 'listStatus':
        return <Button size="small">{record.listStatus}</Button>;
      case 'platformLabel':
        return platformLabel(record.platform);
      case 'action':
        return (
          <Space>
            <Link onClick={() => history.push(`/kox/portrait/${record.koxId}`)}>查看</Link>
            <Link onClick={() => setEditing(record)}>编辑</Link>
            <Link type="danger" onClick={() => openUnbindConfirm(record)}>
              解绑
            </Link>
          </Space>
        );
      default: {
        const value = record[key as keyof KoxRecord];
        return (value ?? '-') as ReactNode;
      }
    }
  };

  const dataSource = useMemo(() => {
    return records.filter((item) => {
      if (filters.koxId && !String(item.koxId).includes(filters.koxId.trim())) return false;
      if (filters.nickname && !item.nickname.includes(filters.nickname.trim())) return false;
      if (filters.phone && !item.phone.includes(filters.phone.trim())) return false;
      if (filters.platform && item.platform !== filters.platform) return false;
      if (filters.office && item.office !== filters.office) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.listStatus && item.listStatus !== filters.listStatus) return false;
      return true;
    });
  }, [filters, records]);

  const columns: ColumnsType<KoxRecord> = useMemo(() => {
    const visibleMetas = COLUMN_METAS.filter(
      (meta) => meta.key === 'action' || visibleKeys.includes(meta.key),
    );
    const normalMetas = visibleMetas.filter((meta) => meta.key !== 'action');
    const actionMeta = COLUMN_METAS.find((meta) => meta.key === 'action');
    const ordered = actionMeta ? [...normalMetas, actionMeta] : normalMetas;

    return ordered.map((meta) => ({
      title: meta.title,
      dataIndex:
        meta.key === 'platformLabel' ? 'platform' : meta.key === 'action' ? undefined : meta.key,
      key: meta.key,
      width: meta.width,
      fixed:
        meta.key === 'nickname' ? ('left' as const) : meta.key === 'action' ? ('right' as const) : undefined,
      ellipsis: true,
      render: (_: unknown, record: KoxRecord) => renderCell(meta.key, record),
    }));
  }, [visibleKeys]);

  const basicMetas = COLUMN_METAS.filter((item) => item.group === 'basic');
  const kocMetas = COLUMN_METAS.filter((item) => item.group === 'koc');
  const basicCheckedCount = basicMetas.filter((item) => draftKeys.includes(item.key)).length;
  const kocCheckedCount = kocMetas.filter((item) => draftKeys.includes(item.key)).length;

  const toggleKey = (key: string, checked: boolean, fixed?: boolean) => {
    if (fixed) return;
    setDraftKeys((prev) => {
      if (checked) return prev.includes(key) ? prev : [...prev, key];
      return prev.filter((item) => item !== key);
    });
  };

  const setGroupChecked = (group: 'basic' | 'koc', checked: boolean) => {
    const groupKeys = COLUMN_METAS.filter((item) => item.group === group).map((item) => item.key);
    setDraftKeys((prev) => {
      const keep = prev.filter(
        (key) => !groupKeys.includes(key) || COLUMN_METAS.find((m) => m.key === key)?.fixed,
      );
      if (!checked) return keep;
      return Array.from(new Set([...keep, ...groupKeys]));
    });
  };

  const rowSelection: TableProps<KoxRecord>['rowSelection'] = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card size="small">
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            setFilters(values);
            message.success('已按条件过滤（mock）');
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="koxId" label="KOX-ID">
                <Input allowClear placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="nickname" label="昵称">
                <Input allowClear placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="phone" label="手机号">
                <Input allowClear placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="platform" label="平台">
                <Select allowClear options={PLATFORM_OPTIONS} placeholder="请选择" />
              </Form.Item>
            </Col>

            {expanded && (
              <>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="office" label="代表处">
                    <Select allowClear options={OFFICE_OPTIONS} placeholder="请选择" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="model" label="车型">
                    <Select allowClear options={[{ label: '全部', value: 'all' }]} placeholder="请选择" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="ownerTag" label="车主标签">
                    <Select allowClear options={[{ label: '全部', value: 'all' }]} placeholder="请选择" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="ownerIdentity" label="车主身份">
                    <Select allowClear options={[{ label: '全部', value: 'all' }]} placeholder="请选择" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="excludeTag" label="排除标签">
                    <Select allowClear options={[{ label: '全部', value: 'all' }]} placeholder="请选择" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="status" label="状态">
                    <Select allowClear options={STATUS_OPTIONS} placeholder="请选择" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="listStatus" label="名单状态">
                    <Select allowClear options={LIST_STATUS_OPTIONS} placeholder="请选择" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="task" label="任务">
                    <Select allowClear options={[{ label: '全部', value: 'all' }]} placeholder="请选择" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="track" label="赛道">
                    <Select allowClear options={[{ label: '全部', value: 'all' }]} placeholder="请选择" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="registerTime" label="注册时间">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="unbindTime" label="解绑时间">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="createTime" label="创建时间">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>

          <Row justify="end">
            <Space>
              <Button
                type="link"
                onClick={() => setExpanded((value) => !value)}
                icon={expanded ? <UpOutlined /> : <DownOutlined />}
              >
                {expanded ? '收起筛选' : '展开筛选'}
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={() => {
                  setDraftKeys(visibleKeys);
                  setColumnOpen(true);
                }}
              >
                列配置
              </Button>
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
          </Row>
        </Form>
      </Card>

      <Card size="small">
        <Space style={{ marginBottom: 16 }} wrap>
          <Button icon={<DownloadOutlined />} onClick={() => message.success('导出列表（mock）')}>
            导出列表
          </Button>
          <Select value={dimension} style={{ width: 160 }} options={DIMENSION_OPTIONS} onChange={setDimension} />
          <Text type="secondary">
            已选 {selectedRowKeys.length} 项 / 显示 {visibleKeys.length} 列
          </Text>
        </Space>

        <Table<KoxRecord>
          rowKey="key"
          size="middle"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: Math.max(1400, visibleKeys.length * 110) }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <EditKoxDrawer
        open={!!editing}
        record={editing}
        onClose={() => setEditing(null)}
        onSave={(values) => {
          if (!editing) return;
          setRecords((prev) =>
            prev.map((item) =>
              item.key === editing.key
                ? {
                    ...item,
                    status: (values.status as KoxRecord['status']) || item.status,
                    listStatus: (values.listStatus as string) || item.listStatus,
                    source: (values.source as string) || item.source,
                    group: (values.group as string) || item.group,
                    remark: (values.remark as string) || item.remark,
                    tags: (values.tagList as string[] | undefined)?.join(',') || item.tags,
                    ownerTag: (values.ownerTagList as string[] | undefined)?.[0] || item.ownerTag,
                    contentTag: (values.contentTagList as string[] | undefined)?.[0] || item.contentTag,
                    effectTag: (values.effectTagList as string[] | undefined)?.[0] || item.effectTag,
                  }
                : item,
            ),
          );
        }}
      />

      <Modal
        title={
          <Space>
            <SettingOutlined />
            列配置
          </Space>
        }
        open={columnOpen}
        onCancel={() => setColumnOpen(false)}
        width={720}
        footer={
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button icon={<ReloadOutlined />} onClick={() => setDraftKeys(DEFAULT_VISIBLE_COLUMNS)}>
              重置默认
            </Button>
            <Space>
              <Button onClick={() => setColumnOpen(false)}>取消</Button>
              <Button
                type="primary"
                onClick={() => {
                  const next = draftKeys.includes('action') ? draftKeys : [...draftKeys, 'action'];
                  setVisibleKeys(next);
                  setColumnOpen(false);
                  message.success('列配置已应用');
                }}
              >
                应用配置
              </Button>
            </Space>
          </Space>
        }
      >
        <Checkbox
          checked={draftKeys.length === COLUMN_METAS.length}
          indeterminate={draftKeys.length > 0 && draftKeys.length < COLUMN_METAS.length}
          onChange={(e) => {
            if (e.target.checked) {
              setDraftKeys(COLUMN_METAS.map((item) => item.key));
            } else {
              setDraftKeys(COLUMN_METAS.filter((item) => item.fixed).map((item) => item.key));
            }
          }}
        >
          全选
        </Checkbox>

        <Divider style={{ margin: '12px 0' }} />

        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
          <div>
            <Checkbox
              checked={basicCheckedCount === basicMetas.length}
              indeterminate={basicCheckedCount > 0 && basicCheckedCount < basicMetas.length}
              onChange={(e) => setGroupChecked('basic', e.target.checked)}
            >
              <Title level={5} style={{ display: 'inline', margin: 0 }}>
                基础（{basicCheckedCount}/{basicMetas.length}）
              </Title>
            </Checkbox>
            <Row gutter={[12, 8]} style={{ marginTop: 12 }}>
              {basicMetas.map((item) => (
                <Col span={8} key={item.key}>
                  <Checkbox
                    checked={draftKeys.includes(item.key)}
                    disabled={item.fixed}
                    onChange={(e) => toggleKey(item.key, e.target.checked, item.fixed)}
                  >
                    {item.title}
                    {item.fixed ? '（固定）' : ''}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </div>

          <div>
            <Checkbox
              checked={kocCheckedCount === kocMetas.length}
              indeterminate={kocCheckedCount > 0 && kocCheckedCount < kocMetas.length}
              onChange={(e) => setGroupChecked('koc', e.target.checked)}
            >
              <Title level={5} style={{ display: 'inline', margin: 0 }}>
                KOC分析（{kocCheckedCount}/{kocMetas.length}）
              </Title>
            </Checkbox>
            <Row gutter={[12, 8]} style={{ marginTop: 12 }}>
              {kocMetas.map((item) => (
                <Col span={8} key={item.key}>
                  <Checkbox
                    checked={draftKeys.includes(item.key)}
                    onChange={(e) => toggleKey(item.key, e.target.checked)}
                  >
                    {item.title}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </div>
        </Space>
      </Modal>
    </Space>
  );
}
