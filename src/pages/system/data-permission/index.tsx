import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState, type Key } from 'react';
import {
  MEMBER_ACCOUNT_OPTIONS,
  MOCK_ORG_TREE,
  REGION_OPTIONS,
  appendChild,
  scopeColor,
  typeColor,
  updateOrgTree,
  type OrgDataScope,
  type OrgNode,
  type OrgNodeType,
} from '@/mock/systemDataPermission';

const { Title, Link, Text } = Typography;

type CreateMode = 'region' | 'office' | null;

export default function SystemDataPermissionPage() {
  const [tree, setTree] = useState<OrgNode[]>(() => structuredClone(MOCK_ORG_TREE));
  const [expandedKeys, setExpandedKeys] = useState<readonly Key[]>(['hq']);

  const [createOpen, setCreateOpen] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [parentKey, setParentKey] = useState<string>('hq');
  const [createForm] = Form.useForm();

  const [memberOpen, setMemberOpen] = useState(false);
  const [current, setCurrent] = useState<OrgNode | null>(null);
  const [memberForm] = Form.useForm();

  const [editOpen, setEditOpen] = useState(false);
  const [editForm] = Form.useForm();

  const regionOptions = useMemo(() => REGION_OPTIONS, []);

  const openCreateRegion = (parent = 'hq') => {
    setCreateMode('region');
    setParentKey(parent);
    createForm.setFieldsValue({ name: '', regionCode: undefined });
    setCreateOpen(true);
  };

  const openCreateOffice = (parent: string) => {
    setCreateMode('office');
    setParentKey(parent);
    createForm.setFieldsValue({ name: '', regionCode: undefined });
    setCreateOpen(true);
  };

  const submitCreate = async () => {
    const values = await createForm.validateFields();
    const isRegion = createMode === 'region';
    const child: OrgNode = {
      key: `${parentKey}-${Date.now()}`,
      name: values.name.trim(),
      type: isRegion ? '大区' : '代表处',
      members: [],
      dataScope: isRegion ? '本大区及下级' : '仅本代表处',
      regionCode: values.regionCode,
      children: isRegion ? [] : undefined,
    };
    setTree((prev) => appendChild(prev, parentKey, child));
    setExpandedKeys((prev) => Array.from(new Set([...prev, parentKey])));
    message.success(isRegion ? '大区已创建' : '代表处已创建');
    setCreateOpen(false);
  };

  const columns: ColumnsType<OrgNode> = [
    {
      title: '组织名称',
      dataIndex: 'name',
      width: 260,
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (v: OrgNodeType) => <Tag color={typeColor(v)}>{v}</Tag>,
    },
    {
      title: '成员账号',
      dataIndex: 'members',
      render: (members: string[]) =>
        members.length ? (
          <Space size={[4, 4]} wrap>
            {members.map((m) => (
              <Tag color="blue" key={m}>
                {m}
              </Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary">暂无成员</Text>
        ),
    },
    {
      title: '数据范围',
      dataIndex: 'dataScope',
      width: 180,
      render: (v: OrgDataScope) => <Tag color={scopeColor(v)}>{v}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 320,
      render: (_, row) => (
        <Space size={12} wrap>
          {row.type === '总部' && (
            <Link onClick={() => openCreateRegion(row.key)}>
              <PlusOutlined /> 新增大区
            </Link>
          )}
          {row.type === '大区' && (
            <Link onClick={() => openCreateOffice(row.key)}>
              <PlusOutlined /> 新增代表处
            </Link>
          )}
          <Link
            onClick={() => {
              setCurrent(row);
              memberForm.setFieldsValue({ members: row.members });
              setMemberOpen(true);
            }}
          >
            管理成员
          </Link>
          <Link
            onClick={() => {
              setCurrent(row);
              editForm.setFieldsValue({
                name: row.name,
                dataScope: row.dataScope,
                regionCode: row.regionCode,
              });
              setEditOpen(true);
            }}
          >
            编辑
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          组织架构 & 数据权限管理
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setTree(structuredClone(MOCK_ORG_TREE));
              setExpandedKeys(['hq']);
              message.success('已刷新');
            }}
          >
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreateRegion('hq')}>
            新增大区
          </Button>
        </Space>
      </div>

      <Table
        rowKey="key"
        size="middle"
        columns={columns}
        dataSource={tree}
        pagination={false}
        expandable={{
          expandedRowKeys: [...expandedKeys],
          onExpandedRowsChange: (keys) => setExpandedKeys(keys),
        }}
      />

      <Modal
        title={createMode === 'office' ? '新建代表处' : '新建大区'}
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={submitCreate}
        destroyOnClose
      >
        <Form form={createForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
            label="关联大区"
            name="regionCode"
            rules={[{ required: true, message: '请选择关联大区' }]}
          >
            <Select placeholder="请选择关联大区" options={regionOptions} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`管理成员${current ? ` · ${current.name}` : ''}`}
        open={memberOpen}
        onCancel={() => setMemberOpen(false)}
        onOk={async () => {
          const values = await memberForm.validateFields();
          if (!current) return;
          setTree((prev) =>
            updateOrgTree(prev, current.key, (node) => ({
              ...node,
              members: values.members || [],
            })),
          );
          message.success('成员已更新');
          setMemberOpen(false);
        }}
        destroyOnClose
      >
        <Form form={memberForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item label="成员账号" name="members">
            <Select
              mode="multiple"
              allowClear
              placeholder="请选择成员账号"
              options={MEMBER_ACCOUNT_OPTIONS.map((v) => ({ label: v, value: v }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`编辑组织${current ? ` · ${current.name}` : ''}`}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={async () => {
          const values = await editForm.validateFields();
          if (!current) return;
          setTree((prev) =>
            updateOrgTree(prev, current.key, (node) => ({
              ...node,
              name: values.name.trim(),
              dataScope: values.dataScope,
              regionCode: values.regionCode || node.regionCode,
            })),
          );
          message.success('组织已更新');
          setEditOpen(false);
        }}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="数据范围"
            name="dataScope"
            rules={[{ required: true, message: '请选择数据范围' }]}
          >
            <Select
              options={[
                { label: '全量数据（总部）', value: '全量数据（总部）' },
                { label: '本大区及下级', value: '本大区及下级' },
                { label: '仅本代表处', value: '仅本代表处' },
              ]}
            />
          </Form.Item>
          {current?.type !== '总部' && (
            <Form.Item label="关联大区" name="regionCode">
              <Select options={regionOptions} allowClear placeholder="请选择关联大区" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Card>
  );
}
