import {
  CheckCircleFilled,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileImageOutlined,
  FolderOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Modal,
  Segmented,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useMemo, useState } from 'react';
import {
  MOCK_GROUPS,
  MOCK_MATERIALS,
  UNASSIGNED_LABEL,
  allGroupSelectOptions,
  countByGroup,
  groupPathLabel,
  materialCover,
  parentGroupOptions,
  type MaterialGroup,
  type MaterialItem,
  type MaterialType,
} from '@/mock/material';
import './index.css';

const { Text } = Typography;

type TypeFilter = '全部类型' | MaterialType;

export default function MaterialLibraryPage() {
  const [groups, setGroups] = useState<MaterialGroup[]>(() => [...MOCK_GROUPS]);
  const [materials, setMaterials] = useState<MaterialItem[]>(() => [...MOCK_MATERIALS]);
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('全部类型');
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const [groupOpen, setGroupOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [preview, setPreview] = useState<MaterialItem | null>(null);

  const [groupForm] = Form.useForm<{ parentKey?: string; name: string }>();
  const [uploadForm] = Form.useForm<{ groupKey?: string; tags: string; file?: { fileList: UploadFile[] } }>();
  const [moveForm] = Form.useForm<{ groupKey: string }>();

  const counts = useMemo(() => countByGroup(materials, groups), [materials, groups]);

  const dataSource = useMemo(() => {
    return materials.filter((item) => {
      if (activeGroup === 'unassigned' && item.groupKey) return false;
      if (activeGroup !== 'all' && activeGroup !== 'unassigned') {
        const matchSelf = item.groupKey === activeGroup;
        const matchChild = groups.some(
          (g) => g.key === item.groupKey && (g.parentKey === activeGroup || ancestorOf(groups, g.key, activeGroup)),
        );
        if (!matchSelf && !matchChild) return false;
      }
      if (typeFilter !== '全部类型' && item.type !== typeFilter) return false;
      if (appliedKeyword) {
        const kw = appliedKeyword.trim().toLowerCase();
        const hit =
          item.title.toLowerCase().includes(kw) ||
          item.tags.some((t) => t.toLowerCase().includes(kw));
        if (!hit) return false;
      }
      return true;
    });
  }, [materials, groups, activeGroup, typeFilter, appliedKeyword]);

  const allPageSelected = dataSource.length > 0 && dataSource.every((item) => selectedKeys.includes(item.key));
  const groupOptions = allGroupSelectOptions(groups);

  const toggleSelect = (key: string) => {
    setSelectedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const removeMaterials = (keys: string[]) => {
    setMaterials((prev) => prev.filter((item) => !keys.includes(item.key)));
    setSelectedKeys((prev) => prev.filter((k) => !keys.includes(k)));
  };

  return (
    <div className="material-page">
      <Card className="material-group-panel" styles={{ body: { padding: 16 } }}>
        <Space style={{ marginBottom: 12 }}>
          <FolderOutlined style={{ color: '#1677ff' }} />
          <Text strong>我的分组</Text>
        </Space>
        <div className="material-group-list">
          <GroupItem
            active={activeGroup === 'all'}
            label={`全部素材 (${counts.all || 0})`}
            onClick={() => setActiveGroup('all')}
          />
          {groups
            .filter((g) => g.level === 1)
            .map((g) => (
              <div key={g.key}>
                <GroupItem
                  active={activeGroup === g.key}
                  label={`${g.name} (${counts[g.key] || 0})`}
                  onClick={() => setActiveGroup(g.key)}
                />
                {groups
                  .filter((c) => c.parentKey === g.key)
                  .map((c) => (
                    <div key={c.key}>
                      <GroupItem
                        nested
                        active={activeGroup === c.key}
                        label={`${c.name} (${counts[c.key] || 0})`}
                        onClick={() => setActiveGroup(c.key)}
                      />
                      {groups
                        .filter((gc) => gc.parentKey === c.key)
                        .map((gc) => (
                          <GroupItem
                            key={gc.key}
                            nested={2}
                            active={activeGroup === gc.key}
                            label={`${gc.name} (${counts[gc.key] || 0})`}
                            onClick={() => setActiveGroup(gc.key)}
                          />
                        ))}
                    </div>
                  ))}
              </div>
            ))}
          <GroupItem
            active={activeGroup === 'unassigned'}
            label={`${UNASSIGNED_LABEL} (${counts.unassigned || 0})`}
            onClick={() => setActiveGroup('unassigned')}
          />
        </div>
        <Button
          type="link"
          icon={<PlusOutlined />}
          style={{ paddingLeft: 0, marginTop: 8 }}
          onClick={() => {
            groupForm.resetFields();
            setGroupOpen(true);
          }}
        >
          新建分组
        </Button>
      </Card>

      <div className="material-main">
        <Card styles={{ body: { padding: 16 } }}>
          <Space wrap size={12} style={{ width: '100%' }}>
            <Text>素材类型</Text>
            <Segmented
              value={typeFilter}
              onChange={(v) => setTypeFilter(v as TypeFilter)}
              options={['全部类型', '图片', '视频']}
            />
            <Input
              allowClear
              style={{ width: 360, maxWidth: '100%' }}
              placeholder="搜索素材标签，例如：问界M9外观、春季新品"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={() => setAppliedKeyword(keyword)}
            />
            <Button icon={<SearchOutlined />} onClick={() => setAppliedKeyword(keyword)}>
              搜索素材
            </Button>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => {
                uploadForm.resetFields();
                setUploadOpen(true);
              }}
            >
              批量上传素材
            </Button>
            <Button
              disabled={!selectedKeys.length}
              onClick={() => {
                moveForm.resetFields();
                setMoveOpen(true);
              }}
            >
              移动分组
            </Button>
            <Button
              danger
              disabled={!selectedKeys.length}
              onClick={() => {
                Modal.confirm({
                  title: '确认批量删除？',
                  content: `将删除已选 ${selectedKeys.length} 项素材（mock）`,
                  okText: '删除',
                  okButtonProps: { danger: true },
                  cancelText: '取消',
                  onOk: () => {
                    removeMaterials(selectedKeys);
                    message.success('已批量删除（mock）');
                  },
                });
              }}
            >
              批量删除
            </Button>
            {!!selectedKeys.length && <Text type="secondary">已选 {selectedKeys.length} 项</Text>}
          </Space>
        </Card>

        <div className="material-toolbar">
          <Text type="secondary">共 {dataSource.length} 个素材</Text>
          <Checkbox
            checked={allPageSelected}
            indeterminate={!!selectedKeys.length && !allPageSelected}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedKeys((prev) => Array.from(new Set([...prev, ...dataSource.map((i) => i.key)])));
              } else {
                const pageKeys = new Set(dataSource.map((i) => i.key));
                setSelectedKeys((prev) => prev.filter((k) => !pageKeys.has(k)));
              }
            }}
          >
            本页全选
          </Checkbox>
        </div>

        <div className="material-grid">
          {dataSource.map((item) => {
            const selected = selectedKeys.includes(item.key);
            const groupLabel = groupPathLabel(groups, item.groupKey);
            const unassigned = !item.groupKey;
            return (
              <div
                key={item.key}
                className={`material-card${selected ? ' is-selected' : ''}`}
                onMouseEnter={() => setHoveredKey(item.key)}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <div className="material-cover" onClick={() => toggleSelect(item.key)}>
                  <img src={item.cover} alt={item.title} />
                  <Tag
                    className="material-type-tag"
                    icon={item.type === '视频' ? <PlayCircleOutlined /> : <FileImageOutlined />}
                  >
                    {item.type}
                  </Tag>
                  <Tag className="material-group-tag" color={unassigned ? 'gold' : 'default'}>
                    {unassigned ? UNASSIGNED_LABEL : groupLabel.split(' / ').pop()}
                  </Tag>
                  {(hoveredKey === item.key || selected) && (
                    <div className="material-cover-actions" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="预览">
                        <Button
                          shape="circle"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => setPreview(item)}
                        />
                      </Tooltip>
                      <Tooltip title="下载">
                        <Button
                          shape="circle"
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={() => message.success(`开始下载「${item.title}」（mock）`)}
                        />
                      </Tooltip>
                      <Tooltip title="删除">
                        <Button
                          shape="circle"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            Modal.confirm({
                              title: '确认删除该素材？',
                              content: item.title,
                              okText: '删除',
                              okButtonProps: { danger: true },
                              cancelText: '取消',
                              onOk: () => {
                                removeMaterials([item.key]);
                                message.success('素材已删除（mock）');
                              },
                            });
                          }}
                        />
                      </Tooltip>
                    </div>
                  )}
                  {selected && <CheckCircleFilled className="material-check" />}
                </div>
                <div className="material-meta">
                  <Text strong ellipsis>
                    {item.title}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    上传时间 {item.uploadTime}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>

        {!dataSource.length && <Card>暂无素材</Card>}
      </div>

      <Modal
        title="新建分组"
        open={groupOpen}
        onCancel={() => setGroupOpen(false)}
        onOk={async () => {
          const values = await groupForm.validateFields();
          const parent = groups.find((g) => g.key === values.parentKey);
          if (parent?.level === 3) {
            message.error('三级节点不可再作为上级');
            return;
          }
          const level = ((parent?.level || 0) + 1) as 1 | 2 | 3;
          const next: MaterialGroup = {
            key: `g_${Date.now()}`,
            name: values.name,
            parentKey: values.parentKey,
            level,
          };
          setGroups((prev) => [...prev, next]);
          message.success('分组已创建（mock）');
          setGroupOpen(false);
        }}
        okText="创建"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={groupForm} layout="vertical">
          <Form.Item
            name="parentKey"
            label="上级分组（不选则新建一级）"
            extra="最多支持三级分类，三级节点不可再作为上级"
          >
            <Select
              allowClear
              options={parentGroupOptions(groups)}
              placeholder="不选 = 新建一级分组"
            />
          </Form.Item>
          <Form.Item name="name" label="分组名称" rules={[{ required: true, message: '请输入分组名称' }]}>
            <Input placeholder="请输入分组名称" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="批量上传素材"
        open={uploadOpen}
        onCancel={() => setUploadOpen(false)}
        onOk={async () => {
          const values = await uploadForm.validateFields();
          const files = values.file?.fileList || [];
          const tags = values.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
          const now = formatNow();
          const added: MaterialItem[] = files.map((file, index) => {
            const isVideo = /\.(mp4|avi|mov|webm)$/i.test(file.name || '');
            const type: MaterialType = isVideo ? '视频' : '图片';
            const title = (file.name || '未命名').replace(/\.[^.]+$/, '').slice(0, 12) || '未命名';
            return {
              key: `m_up_${Date.now()}_${index}`,
              title,
              type,
              groupKey: values.groupKey,
              tags,
              uploadTime: now,
              cover: materialCover(materials.length + index, title, type),
            };
          });
          setMaterials((prev) => [...added, ...prev]);
          message.success(`已上传 ${added.length} 个素材（mock）`);
          setUploadOpen(false);
        }}
        okText="确认上传"
        cancelText="取消"
        destroyOnClose
        width={640}
      >
        <Form form={uploadForm} layout="vertical">
          <Form.Item
            name="file"
            valuePropName="file"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value?.fileList?.length) return Promise.reject(new Error('请选择文件'));
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Upload.Dragger multiple maxCount={20} beforeUpload={() => false} accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.avi,.mov,.webm">
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ color: '#1677ff' }} />
              </p>
              <p className="ant-upload-text">点击选择多个文件，支持图片和视频</p>
              <p className="ant-upload-hint">已选文件见下方列表；单图≤10MB，单视频≤500MB，总量≤500MB</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item name="groupKey" label="选择分组" rules={[{ required: true, message: '请选择分组' }]}>
            <Select options={groupOptions} placeholder="请选择分组（可选任意层级）" />
          </Form.Item>
          <Form.Item
            name="tags"
            label="标签（多个用英文逗号分隔）"
            rules={[{ required: true, message: '请输入标签' }]}
          >
            <Input placeholder="如：外观,高清,官方" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="移动分组"
        open={moveOpen}
        onCancel={() => setMoveOpen(false)}
        onOk={async () => {
          const values = await moveForm.validateFields();
          setMaterials((prev) =>
            prev.map((item) =>
              selectedKeys.includes(item.key) ? { ...item, groupKey: values.groupKey } : item,
            ),
          );
          message.success(`已移动 ${selectedKeys.length} 项（mock）`);
          setSelectedKeys([]);
          setMoveOpen(false);
        }}
        okText="确认移动"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={moveForm} layout="vertical">
          <Form.Item name="groupKey" label="目标分组" rules={[{ required: true, message: '请选择目标分组' }]}>
            <Select options={groupOptions} placeholder="请选择目标分组" />
          </Form.Item>
          <Text type="secondary">将移动已选 {selectedKeys.length} 项素材</Text>
        </Form>
      </Modal>

      <Modal
        title={preview ? `预览 - ${preview.title}` : '预览'}
        open={!!preview}
        onCancel={() => setPreview(null)}
        footer={<Button onClick={() => setPreview(null)}>关闭</Button>}
        width={720}
      >
        {preview && (
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <img src={preview.cover} alt={preview.title} style={{ width: '100%', borderRadius: 8 }} />
            <Text>类型：{preview.type}</Text>
            <Text>分组：{groupPathLabel(groups, preview.groupKey)}</Text>
            <Text>标签：{preview.tags.join('、') || '-'}</Text>
            <Text>上传时间：{preview.uploadTime}</Text>
          </Space>
        )}
      </Modal>
    </div>
  );
}

function GroupItem({
  label,
  active,
  onClick,
  nested,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  nested?: boolean | number;
}) {
  const pad = nested === 2 ? 36 : nested ? 24 : 12;
  return (
    <div
      className={`material-group-item${active ? ' is-active' : ''}`}
      style={{ paddingLeft: pad }}
      onClick={onClick}
    >
      {label}
    </div>
  );
}

function ancestorOf(groups: MaterialGroup[], key: string, ancestorKey: string) {
  let current = groups.find((g) => g.key === key);
  while (current?.parentKey) {
    if (current.parentKey === ancestorKey) return true;
    current = groups.find((g) => g.key === current!.parentKey);
  }
  return false;
}

function formatNow() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
