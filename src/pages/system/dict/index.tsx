import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  MOCK_DICT_ITEMS,
  MOCK_DICT_TYPES,
  type DictItem,
  type DictStatus,
  type DictType,
} from '@/mock/systemDict';

const { Link } = Typography;
const { TextArea } = Input;

type TabKey = 'type' | 'data';

type TypeFilter = { name?: string; type?: string; status?: string };
type DataFilter = { type?: string; label?: string; status?: string };

export default function SystemDictPage() {
  const [tab, setTab] = useState<TabKey>('type');
  const [types, setTypes] = useState<DictType[]>(() => [...MOCK_DICT_TYPES]);
  const [items, setItems] = useState<DictItem[]>(() => [...MOCK_DICT_ITEMS]);

  const [typeFilterForm] = Form.useForm<TypeFilter>();
  const [dataFilterForm] = Form.useForm<DataFilter>();
  const [typeFilters, setTypeFilters] = useState<TypeFilter>({});
  const [dataFilters, setDataFilters] = useState<DataFilter>({ type: 'task_category' });

  const [typeOpen, setTypeOpen] = useState(false);
  const [editingType, setEditingType] = useState<DictType | null>(null);
  const [typeForm] = Form.useForm();

  const [itemOpen, setItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DictItem | null>(null);
  const [itemForm] = Form.useForm();

  const typeOptions = useMemo(
    () => types.map((t) => ({ label: `${t.name} (${t.type})`, value: t.type })),
    [types],
  );

  const filteredTypes = useMemo(() => {
    return types.filter((item) => {
      if (typeFilters.name && !item.name.includes(typeFilters.name.trim())) return false;
      if (typeFilters.type && !item.type.includes(typeFilters.type.trim())) return false;
      if (typeFilters.status && item.status !== typeFilters.status) return false;
      return true;
    });
  }, [types, typeFilters]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (dataFilters.type && item.type !== dataFilters.type) return false;
        if (dataFilters.label && !item.label.includes(dataFilters.label.trim())) return false;
        if (dataFilters.status && item.status !== dataFilters.status) return false;
        return true;
      })
      .sort((a, b) => a.sort - b.sort);
  }, [items, dataFilters]);

  const openTypeModal = (row?: DictType) => {
    setEditingType(row || null);
    typeForm.setFieldsValue(
      row
        ? { name: row.name, type: row.type, status: row.status, remark: row.remark }
        : { name: '', type: '', status: '正常', remark: '' },
    );
    setTypeOpen(true);
  };

  const saveType = async () => {
    const values = await typeForm.validateFields();
    const stamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    if (editingType) {
      setTypes((prev) =>
        prev.map((item) =>
          item.key === editingType.key
            ? { ...item, name: values.name, status: values.status, remark: values.remark || '', updatedAt: stamp }
            : item,
        ),
      );
      message.success('字典类型已更新');
    } else {
      if (types.some((t) => t.type === values.type)) {
        message.error('字典类型已存在');
        return;
      }
      setTypes((prev) => [
        {
          key: `${Date.now()}`,
          name: values.name,
          type: values.type,
          status: values.status,
          remark: values.remark || '',
          updatedAt: stamp,
        },
        ...prev,
      ]);
      message.success('字典类型已创建');
    }
    setTypeOpen(false);
  };

  const openItemModal = (row?: DictItem) => {
    const currentType = dataFilters.type || typeOptions[0]?.value;
    setEditingItem(row || null);
    itemForm.setFieldsValue(
      row
        ? {
            type: row.type,
            label: row.label,
            value: row.value,
            sort: row.sort,
            isDefault: row.isDefault ? '是' : '否',
            status: row.status,
            cssClass: row.cssClass,
            listClass: row.listClass,
            remark: row.remark,
          }
        : {
            type: currentType,
            label: '',
            value: '',
            sort: 0,
            isDefault: '否',
            status: '正常',
            cssClass: '',
            listClass: '',
            remark: '',
          },
    );
    setItemOpen(true);
  };

  const saveItem = async () => {
    const values = await itemForm.validateFields();
    const stamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const next: DictItem = {
      key: editingItem?.key || `i-${Date.now()}`,
      type: values.type,
      label: values.label,
      value: values.value,
      sort: values.sort ?? 0,
      isDefault: values.isDefault === '是',
      status: values.status as DictStatus,
      cssClass: values.cssClass,
      listClass: values.listClass,
      remark: values.remark,
      updatedAt: stamp,
    };
    if (editingItem) {
      setItems((prev) => prev.map((item) => (item.key === editingItem.key ? next : item)));
      message.success('字典数据已更新');
    } else {
      setItems((prev) => [next, ...prev]);
      message.success('字典数据已创建');
    }
    setItemOpen(false);
  };

  const goItems = (type: string) => {
    setTab('data');
    setDataFilters({ type, label: undefined, status: undefined });
    dataFilterForm.setFieldsValue({ type, label: undefined, status: undefined });
  };

  const typeColumns: ColumnsType<DictType> = [
    { title: '字典名称', dataIndex: 'name', width: 160 },
    { title: '字典类型', dataIndex: 'type', width: 180 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v: DictStatus) => (
        <Tag color={v === '正常' ? 'success' : 'default'}>{v}</Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      render: (v: string) => v || '-',
    },
    { title: '更新时间', dataIndex: 'updatedAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, row) => (
        <Space size={12}>
          <Link onClick={() => openTypeModal(row)}>编辑</Link>
          <Link onClick={() => goItems(row.type)}>字典项</Link>
          <Popconfirm
            title="确认删除该字典类型？"
            onConfirm={() => {
              setTypes((prev) => prev.filter((i) => i.key !== row.key));
              setItems((prev) => prev.filter((i) => i.type !== row.type));
              message.success('已删除');
            }}
          >
            <Link type="danger">删除</Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const itemColumns: ColumnsType<DictItem> = [
    { title: '字典标签', dataIndex: 'label', width: 140 },
    { title: '字典键值', dataIndex: 'value', width: 120 },
    { title: '字典类型', dataIndex: 'type', width: 160 },
    { title: '排序', dataIndex: 'sort', width: 80 },
    {
      title: '默认',
      dataIndex: 'isDefault',
      width: 80,
      render: (v: boolean) => (v ? '是' : '否'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v: DictStatus) => (
        <Tag color={v === '正常' ? 'success' : 'default'}>{v}</Tag>
      ),
    },
    { title: '更新时间', dataIndex: 'updatedAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: (_, row) => (
        <Space size={12}>
          <Link onClick={() => openItemModal(row)}>编辑</Link>
          <Popconfirm
            title="确认删除该字典数据？"
            onConfirm={() => {
              setItems((prev) => prev.filter((i) => i.key !== row.key));
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
    <Card>
      <Tabs
        activeKey={tab}
        onChange={(k) => setTab(k as TabKey)}
        tabBarExtraContent={
          tab === 'type' ? (
            <Button type="primary" onClick={() => openTypeModal()}>
              新增字典类型
            </Button>
          ) : (
            <Button type="primary" onClick={() => openItemModal()}>
              新增字典数据
            </Button>
          )
        }
        items={[
          {
            key: 'type',
            label: '字典类型管理',
            children: (
              <Space direction="vertical" size={16} style={{ display: 'flex' }}>
                <Form
                  form={typeFilterForm}
                  layout="inline"
                  onFinish={(values) => setTypeFilters(values)}
                  style={{ rowGap: 12 }}
                >
                  <Form.Item name="name">
                    <Input placeholder="字典名称" allowClear style={{ width: 160 }} />
                  </Form.Item>
                  <Form.Item name="type">
                    <Input placeholder="字典类型" allowClear style={{ width: 160 }} />
                  </Form.Item>
                  <Form.Item name="status">
                    <Select
                      allowClear
                      placeholder="状态"
                      style={{ width: 120 }}
                      options={[
                        { label: '正常', value: '正常' },
                        { label: '停用', value: '停用' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button
                        onClick={() => {
                          typeFilterForm.resetFields();
                          setTypeFilters({});
                        }}
                      >
                        重置
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
                <Table
                  rowKey="key"
                  size="middle"
                  columns={typeColumns}
                  dataSource={filteredTypes}
                  scroll={{ x: 1000 }}
                  pagination={{ pageSize: 10, showSizeChanger: true }}
                />
              </Space>
            ),
          },
          {
            key: 'data',
            label: '字典数据管理',
            children: (
              <Space direction="vertical" size={16} style={{ display: 'flex' }}>
                <Form
                  form={dataFilterForm}
                  layout="inline"
                  initialValues={{ type: 'task_category' }}
                  onFinish={(values) => setDataFilters(values)}
                  style={{ rowGap: 12 }}
                >
                  <Form.Item name="type">
                    <Select
                      style={{ width: 240 }}
                      options={typeOptions}
                      placeholder="选择字典类型"
                      showSearch
                      optionFilterProp="label"
                    />
                  </Form.Item>
                  <Form.Item name="label">
                    <Input placeholder="字典标签" allowClear style={{ width: 160 }} />
                  </Form.Item>
                  <Form.Item name="status">
                    <Select
                      allowClear
                      placeholder="状态"
                      style={{ width: 120 }}
                      options={[
                        { label: '正常', value: '正常' },
                        { label: '停用', value: '停用' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button
                        onClick={() => {
                          dataFilterForm.setFieldsValue({
                            type: 'task_category',
                            label: undefined,
                            status: undefined,
                          });
                          setDataFilters({ type: 'task_category' });
                        }}
                      >
                        重置
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
                <Table
                  rowKey="key"
                  size="middle"
                  columns={itemColumns}
                  dataSource={filteredItems}
                  scroll={{ x: 1100 }}
                  pagination={{ pageSize: 10, showSizeChanger: true }}
                />
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editingType ? '编辑字典类型' : '新增字典类型'}
        open={typeOpen}
        onCancel={() => setTypeOpen(false)}
        onOk={saveType}
        destroyOnClose
      >
        <Form form={typeForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            label="字典名称"
            name="name"
            rules={[{ required: true, message: '请输入字典名称' }]}
          >
            <Input placeholder="请输入字典名称" />
          </Form.Item>
          <Form.Item
            label="字典类型"
            name="type"
            rules={[
              { required: true, message: '请输入字典类型' },
              { pattern: /^[a-z][a-z0-9_]*$/, message: '小写字母开头，仅字母数字下划线' },
            ]}
          >
            <Input placeholder="如 task_category" disabled={!!editingType} />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true }]}>
            <Select
              options={[
                { label: '正常', value: '正常' },
                { label: '停用', value: '停用' },
              ]}
            />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <TextArea rows={3} placeholder="选填" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingItem ? '编辑字典数据' : '新增字典数据'}
        open={itemOpen}
        onCancel={() => setItemOpen(false)}
        onOk={saveItem}
        destroyOnClose
        width={520}
      >
        <Form form={itemForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item label="字典类型" name="type" rules={[{ required: true }]}>
            <Select options={typeOptions} disabled={!!editingItem} />
          </Form.Item>
          <Form.Item
            label="字典标签"
            name="label"
            rules={[{ required: true, message: '请输入字典标签' }]}
          >
            <Input placeholder="请输入字典标签" />
          </Form.Item>
          <Form.Item
            label="字典键值"
            name="value"
            rules={[{ required: true, message: '请输入字典键值' }]}
          >
            <Input placeholder="请输入字典键值" />
          </Form.Item>
          <Form.Item label="排序" name="sort">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="默认值" name="isDefault" rules={[{ required: true }]}>
            <Select
              options={[
                { label: '是', value: '是' },
                { label: '否', value: '否' },
              ]}
            />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true }]}>
            <Select
              options={[
                { label: '正常', value: '正常' },
                { label: '停用', value: '停用' },
              ]}
            />
          </Form.Item>
          <Form.Item label="样式类" name="cssClass">
            <Input placeholder="选填" />
          </Form.Item>
          <Form.Item label="列表样式" name="listClass">
            <Input placeholder="选填" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <TextArea rows={3} placeholder="选填" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
