import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  MENU_STATUS_OPTIONS,
  MENU_TYPE_OPTIONS,
  MOCK_MENU_PERMISSIONS,
  buildParentOptions,
  filterMenuTree,
  insertMenu,
  menuTypeColor,
  removeMenu,
  updateMenu,
  type MenuPermType,
  type MenuPermission,
} from '@/mock/systemPermissions';

const { TextArea } = Input;
const { Text } = Typography;

type FilterValues = {
  name?: string;
  status?: string;
};

type MenuFormValues = {
  parentId?: string;
  type: MenuPermType;
  name: string;
  code?: string;
  path?: string;
  component?: string;
  icon?: string;
  sort: number;
  enabled: boolean;
  description?: string;
};

const NAME_PATTERN = /^[\u4e00-\u9fa5A-Za-z0-9/\-_()`（）]{2,32}$/;
const CODE_PATTERN = /^[a-z][a-z0-9]*(?:[:._-][a-z0-9]+)*$/;

function copyText(text: string) {
  if (!text) return;
  navigator.clipboard?.writeText(text).then(
    () => message.success('已复制'),
    () => message.info(text),
  );
}

export default function SystemPermissionsPage() {
  const [filterForm] = Form.useForm<FilterValues>();
  const [menuForm] = Form.useForm<MenuFormValues>();
  const [filters, setFilters] = useState<FilterValues>({ status: '' });
  const [tree, setTree] = useState<MenuPermission[]>(() =>
    JSON.parse(JSON.stringify(MOCK_MENU_PERMISSIONS)),
  );
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['kox', 'task', 'system']);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MenuPermission | null>(null);

  const dataSource = useMemo(
    () => filterMenuTree(tree, filters.name, filters.status),
    [tree, filters],
  );

  const parentOptions = useMemo(() => buildParentOptions(tree), [tree]);

  const openCreate = (parentId?: string) => {
    setEditing(null);
    menuForm.setFieldsValue({
      parentId,
      type: parentId ? '菜单' : '目录',
      name: '',
      code: '',
      path: '',
      component: '',
      icon: '',
      sort: 0,
      enabled: true,
      description: '',
    });
    setModalOpen(true);
  };

  const openEdit = (row: MenuPermission) => {
    setEditing(row);
    menuForm.setFieldsValue({
      parentId: row.parentId || undefined,
      type: row.type,
      name: row.name,
      code: row.code,
      path: row.path,
      component: row.component,
      icon: row.icon,
      sort: row.sort,
      enabled: row.enabled,
      description: row.description,
    });
    setModalOpen(true);
  };

  const onSubmit = async () => {
    const values = await menuForm.validateFields();
    if (editing) {
      setTree((prev) =>
        updateMenu(prev, editing.key, {
          name: values.name,
          type: values.type,
          code: values.code,
          path: values.path,
          component: values.component,
          icon: values.icon,
          sort: values.sort,
          enabled: values.enabled,
          description: values.description,
          parentId: values.parentId || null,
        }),
      );
      message.success('已更新菜单');
    } else {
      const key = `menu_${Date.now()}`;
      const item: MenuPermission = {
        key,
        name: values.name,
        type: values.type,
        code: values.code,
        path: values.path,
        component: values.component,
        icon: values.icon,
        sort: values.sort,
        enabled: values.enabled,
        description: values.description,
        parentId: values.parentId || null,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      setTree((prev) => insertMenu(prev, item, values.parentId || null));
      if (values.parentId) {
        setExpandedKeys((keys) =>
          keys.includes(values.parentId!) ? keys : [...keys, values.parentId!],
        );
      }
      message.success('已新增菜单');
    }
    setModalOpen(false);
  };

  const onDelete = (key: string) => {
    setTree((prev) => removeMenu(prev, key));
    message.success('已删除');
  };

  const columns: ColumnsType<MenuPermission> = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      width: 220,
      ellipsis: true,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 100,
      render: (v?: string) => v || '-',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
    },
    {
      title: '权限编码',
      dataIndex: 'code',
      width: 200,
      render: (v?: string) =>
        v ? (
          <Space size={4}>
            <Text code style={{ fontSize: 12 }}>
              {v}
            </Text>
            <Tooltip title="复制">
              <CopyOutlined
                style={{ color: '#1677ff', cursor: 'pointer' }}
                onClick={() => copyText(v)}
              />
            </Tooltip>
          </Space>
        ) : (
          '-'
        ),
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      width: 160,
      ellipsis: true,
      render: (v?: string) => v || '-',
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      width: 180,
      ellipsis: true,
      render: (v?: string) => v || '-',
    },
    {
      title: '菜单类型',
      dataIndex: 'type',
      width: 100,
      render: (v: MenuPermType) => <Tag color={menuTypeColor(v)}>{v}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 100,
      render: (v: boolean) => (
        <Badge status={v ? 'success' : 'default'} text={v ? '启用' : '停用'} />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 170,
      render: (v?: string) => v || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, row) => (
        <Space size={0}>
          <Button type="link" size="small" onClick={() => openCreate(row.key)}>
            + 新增
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(row)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除该菜单及子项？"
            onConfirm={() => onDelete(row.key)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card size="small" style={{ marginBottom: 16 }}>
        <Form
          form={filterForm}
          layout="inline"
          initialValues={{ status: '' }}
          onFinish={(v) => setFilters(v)}
        >
          <Form.Item label="菜单名称" name="name">
            <Input allowClear placeholder="请输入" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select
              allowClear
              placeholder="请选择"
              options={MENU_STATUS_OPTIONS}
              style={{ width: 140 }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                onClick={() => {
                  filterForm.resetFields();
                  setFilters({ status: '' });
                }}
              >
                重置
              </Button>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreate()}>
              新增菜单
            </Button>
            <Tooltip title="刷新">
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setTree(JSON.parse(JSON.stringify(MOCK_MENU_PERMISSIONS)));
                  message.success('已刷新');
                }}
              />
            </Tooltip>
          </Space>
        }
      >
        <Table
          rowKey="key"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 1400 }}
          expandable={{
            expandedRowKeys: expandedKeys,
            onExpandedRowsChange: (keys) => setExpandedKeys(keys as string[]),
          }}
        />
      </Card>

      <Modal
        title={editing ? '编辑菜单' : '新增菜单'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        width={560}
        destroyOnClose
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={menuForm}
          layout="vertical"
          style={{ marginTop: 8 }}
          initialValues={{ sort: 0, enabled: true, type: '目录' }}
        >
          <Form.Item
            label="上级菜单"
            name="parentId"
            extra="不选则为根菜单"
          >
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择上级菜单（不选则为根菜单）"
              options={parentOptions.filter((o) => o.value !== editing?.key)}
            />
          </Form.Item>
          <Form.Item
            label="菜单类型"
            name="type"
            rules={[{ required: true, message: '请选择菜单类型' }]}
          >
            <Select options={MENU_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item
            label="菜单名称"
            name="name"
            rules={[
              { required: true, message: '请输入菜单名称' },
              {
                pattern: NAME_PATTERN,
                message: '2~32 个字符，支持中文、英文、数字及/- _ () （）',
              },
            ]}
          >
            <Input
              maxLength={32}
              showCount
              placeholder="2~32 个字符，支持中文、英文、数字及/- _ () （）"
            />
          </Form.Item>
          <Form.Item
            label="权限编码"
            name="code"
            extra="2~64 个字符，仅支持小写英文、数字及:._ -，以字母开头；目录/菜单可留空"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value) return;
                  if (value.length < 2 || value.length > 64) {
                    throw new Error('长度需为 2~64');
                  }
                  if (!CODE_PATTERN.test(value)) {
                    throw new Error('格式不正确');
                  }
                },
              },
            ]}
          >
            <Input placeholder="例如: system:user:list" />
          </Form.Item>
          <Form.Item label="路由地址" name="path">
            <Input placeholder="例如: /system/user" />
          </Form.Item>
          <Form.Item label="组件路径" name="component">
            <Input placeholder="例如: @/pages/system/user" />
          </Form.Item>
          <Form.Item label="图标" name="icon">
            <Input placeholder="例如: UserOutlined" />
          </Form.Item>
          <Form.Item
            label="排序"
            name="sort"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="状态" name="enabled" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="停用" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} placeholder="请输入菜单描述" maxLength={200} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
