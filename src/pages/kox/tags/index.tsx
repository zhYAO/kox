import {
  EditOutlined,
  FolderOutlined,
  PlusOutlined,
  SearchOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Tree,
  Typography,
  message,
} from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useMemo, useState } from 'react';
import {
  INITIAL_TAG_TREE,
  TAG_TYPE_OPTIONS,
  UPDATE_MODE_OPTIONS,
  appendChild,
  collectFolderKeys,
  createId,
  filterTree,
  findNode,
  updateNode,
  type TagTreeNode,
} from '@/mock/tagSystem';

const { Text, Title } = Typography;
const { TextArea } = Input;

function toTreeData(nodes: TagTreeNode[]): DataNode[] {
  return nodes.map((node) => ({
    key: node.key,
    title: node.title,
    icon: node.type === 'folder' ? <FolderOutlined /> : <TagsOutlined />,
    children: node.children ? toTreeData(node.children) : undefined,
    isLeaf: node.type === 'tag',
  }));
}

export default function TagSystemPage() {
  const [tree, setTree] = useState<TagTreeNode[]>(() => structuredClone(INITIAL_TAG_TREE));
  const [keyword, setKeyword] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['folder-model']);
  const [selectedKey, setSelectedKey] = useState('tag-m7');
  const [nodeOpen, setNodeOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(false);
  const [nodeForm] = Form.useForm();
  const [tagForm] = Form.useForm();

  const displayTree = useMemo(() => filterTree(tree, keyword), [tree, keyword]);
  const selected = findNode(tree, selectedKey);
  const updateMode = Form.useWatch('updateMode', tagForm);

  const openCreateTag = () => {
    setEditingTag(false);
    tagForm.setFieldsValue({
      title: undefined,
      code: undefined,
      tagType: 'CDP标签',
      description: undefined,
      updateMode: 'AI打标',
      triggerRule: undefined,
      excludeRule: undefined,
      extraRule: undefined,
      parentKey: selected?.type === 'folder' ? selected.key : 'folder-model',
    });
    setTagOpen(true);
  };

  const openEditTag = () => {
    if (!selected || selected.type !== 'tag') {
      message.warning('请先选择一个标签');
      return;
    }
    setEditingTag(true);
    tagForm.setFieldsValue({
      title: selected.title,
      code: selected.code,
      tagType: selected.tagType,
      description: selected.description,
      updateMode: selected.updateMode,
      triggerRule: selected.triggerRule,
      excludeRule: selected.excludeRule,
      extraRule: selected.extraRule,
      parentKey: undefined,
    });
    setTagOpen(true);
  };

  return (
    <Row gutter={16} style={{ minHeight: 'calc(100vh - 120px)' }}>
      <Col xs={24} md={8} lg={7} xl={6}>
        <Card size="small" styles={{ body: { padding: 12 } }}>
          <Space style={{ width: '100%', marginBottom: 12 }} wrap>
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                nodeForm.resetFields();
                setNodeOpen(true);
              }}
            >
              新建节点
            </Button>
            <Button type="primary" icon={<TagsOutlined />} onClick={openCreateTag}>
              新建标签
            </Button>
          </Space>

          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="搜索标签"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ marginBottom: 12 }}
          />

          <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text strong>标签树</Text>
            <Space>
              <Button
                type="link"
                size="small"
                onClick={() => setExpandedKeys(collectFolderKeys(displayTree))}
              >
                展开
              </Button>
              <Button type="link" size="small" onClick={() => setExpandedKeys([])}>
                收起
              </Button>
            </Space>
          </Space>

          <Tree
            showIcon
            treeData={toTreeData(displayTree)}
            selectedKeys={[selectedKey]}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys as string[])}
            onSelect={(keys) => {
              if (keys[0]) setSelectedKey(String(keys[0]));
            }}
          />
        </Card>
      </Col>

      <Col xs={24} md={16} lg={17} xl={18}>
        <Card
          size="small"
          title={
            selected ? (
              <Space>
                <Title level={4} style={{ margin: 0 }}>
                  {selected.title}
                </Title>
                {selected.type === 'tag' && (
                  <Tag color="processing">KOX人数 {selected.koxCount ?? 0}</Tag>
                )}
                {selected.type === 'folder' && <Tag>节点</Tag>}
              </Space>
            ) : (
              '请选择标签'
            )
          }
          extra={
            selected?.type === 'tag' ? (
              <Button type="primary" icon={<EditOutlined />} onClick={openEditTag}>
                编辑
              </Button>
            ) : null
          }
        >
          {!selected ? (
            <Text type="secondary">请从左侧选择节点或标签</Text>
          ) : selected.type === 'folder' ? (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="节点名称">{selected.title}</Descriptions.Item>
              <Descriptions.Item label="节点编码">{selected.code || '-'}</Descriptions.Item>
              <Descriptions.Item label="节点描述">{selected.description || '-'}</Descriptions.Item>
              <Descriptions.Item label="子节点数">{selected.children?.length || 0}</Descriptions.Item>
            </Descriptions>
          ) : (
            <Space direction="vertical" size={16} style={{ display: 'flex' }}>
              <Card size="small" title="基本信息" type="inner">
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="标签ID">{selected.tagId ?? '-'}</Descriptions.Item>
                  <Descriptions.Item label="标签类型">
                    <Tag color="purple">{selected.tagType || '-'}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="更新方式">{selected.updateMode || '-'}</Descriptions.Item>
                  <Descriptions.Item label="创建人">{selected.creator || '-'}</Descriptions.Item>
                  <Descriptions.Item label="描述" span={2}>
                    {selected.description || '—'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card size="small" title="时间" type="inner">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="创建时间">{selected.createTime || '-'}</Descriptions.Item>
                  <Descriptions.Item label="最后更新">{selected.updateTime || '-'}</Descriptions.Item>
                  <Descriptions.Item label="标签更新时间">{selected.tagUpdateTime || '-'}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Space>
          )}
        </Card>
      </Col>

      <Modal
        title="新建节点"
        open={nodeOpen}
        onCancel={() => setNodeOpen(false)}
        onOk={async () => {
          const values = await nodeForm.validateFields();
          const node: TagTreeNode = {
            key: createId('folder'),
            title: values.title,
            type: 'folder',
            code: values.code,
            description: values.description,
            children: [],
          };
          setTree((prev) => appendChild(prev, null, node));
          setSelectedKey(node.key);
          setNodeOpen(false);
          message.success('节点已创建（mock）');
        }}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={nodeForm} layout="vertical">
          <Form.Item name="title" label="节点名称" rules={[{ required: true, message: '请输入节点名称' }]}>
            <Input placeholder="如：垂直类目" />
          </Form.Item>
          <Form.Item name="code" label="节点编码" rules={[{ required: true, message: '请输入节点编码' }]}>
            <Input placeholder="如：category" />
          </Form.Item>
          <Form.Item name="description" label="节点描述">
            <TextArea rows={4} placeholder="请输入节点描述" />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={editingTag ? '编辑标签' : '新建标签'}
        width={480}
        open={tagOpen}
        onClose={() => setTagOpen(false)}
        destroyOnClose
        footer={
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => setTagOpen(false)}>取消</Button>
            <Button
              type="primary"
              onClick={async () => {
                const values = await tagForm.validateFields();
                const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

                if (editingTag && selected?.type === 'tag') {
                  setTree((prev) =>
                    updateNode(prev, selected.key, {
                      title: values.title,
                      code: values.code,
                      tagType: values.tagType,
                      description: values.description,
                      updateMode: values.updateMode,
                      triggerRule: values.triggerRule,
                      excludeRule: values.excludeRule,
                      extraRule: values.extraRule,
                      updateTime: now,
                      tagUpdateTime: now,
                    }),
                  );
                  message.success('标签已更新（mock）');
                } else {
                  const tag: TagTreeNode = {
                    key: createId('tag'),
                    title: values.title,
                    type: 'tag',
                    tagId: Math.floor(100 + Math.random() * 900),
                    code: values.code,
                    tagType: values.tagType,
                    description: values.description,
                    updateMode: values.updateMode,
                    triggerRule: values.triggerRule,
                    excludeRule: values.excludeRule,
                    extraRule: values.extraRule,
                    creator: 'kox_admin',
                    koxCount: 0,
                    createTime: now,
                    updateTime: now,
                    tagUpdateTime: now,
                  };
                  const parentKey = values.parentKey || 'folder-model';
                  setTree((prev) => appendChild(prev, parentKey, tag));
                  setExpandedKeys((prev) => (prev.includes(parentKey) ? prev : [...prev, parentKey]));
                  setSelectedKey(tag.key);
                  message.success('标签已创建（mock）');
                }
                setTagOpen(false);
              }}
            >
              保存
            </Button>
          </Space>
        }
      >
        <Form form={tagForm} layout="vertical">
          {!editingTag && (
            <Form.Item name="parentKey" label="所属节点" rules={[{ required: true, message: '请选择节点' }]}>
              <Select
                options={tree
                  .filter((item) => item.type === 'folder')
                  .map((item) => ({ label: item.title, value: item.key }))}
              />
            </Form.Item>
          )}
          <Form.Item name="title" label="标签名称" rules={[{ required: true, message: '请输入标签名称' }]}>
            <Input placeholder="如：高转化" />
          </Form.Item>
          <Form.Item name="code" label="标签编码" rules={[{ required: true, message: '请输入标签编码' }]}>
            <Input placeholder="如：effect_gaozhuan" />
          </Form.Item>
          <Form.Item name="tagType" label="标签类型" rules={[{ required: true, message: '请选择标签类型' }]}>
            <Select options={TAG_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item name="description" label="标签描述">
            <TextArea rows={3} placeholder="请输入标签描述" />
          </Form.Item>
          <Form.Item
            name="updateMode"
            label={
              <Space>
                更新方式
                <Tooltip title="决定标签如何更新到 KOX">
                  <Text type="secondary">?</Text>
                </Tooltip>
              </Space>
            }
            rules={[{ required: true, message: '请选择更新方式' }]}
          >
            <Select options={UPDATE_MODE_OPTIONS} />
          </Form.Item>

          {updateMode === 'AI打标' && (
            <>
              <Title level={5}>AI 打标规则</Title>
              <Form.Item
                name="triggerRule"
                label={
                  <Space>
                    触发条件
                    <Tooltip title="AI 将根据此条件分析 KOX 内容">
                      <Text type="secondary">?</Text>
                    </Tooltip>
                  </Space>
                }
              >
                <TextArea rows={3} placeholder="请描述触发该标签的条件，AI 将根据此条件分析 KOX 内容" />
              </Form.Item>
              <Form.Item
                name="excludeRule"
                label={
                  <Space>
                    排除条件
                    <Tooltip title="满足此条件的 KOX 不会被打上该标签">
                      <Text type="secondary">?</Text>
                    </Tooltip>
                  </Space>
                }
              >
                <TextArea rows={3} placeholder="请描述需要排除的情况，满足此条件的 KOX 不会被打上该标签" />
              </Form.Item>
              <Form.Item
                name="extraRule"
                label={
                  <Space>
                    补充说明
                    <Tooltip title="可填写额外的背景信息、示例或特殊规则">
                      <Text type="secondary">?</Text>
                    </Tooltip>
                  </Space>
                }
              >
                <TextArea rows={3} placeholder="可填写额外的背景信息、示例或特殊规则" />
              </Form.Item>
            </>
          )}
        </Form>
      </Drawer>
    </Row>
  );
}
