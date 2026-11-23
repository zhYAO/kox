import { PlusOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  COURSE_CATEGORY_OPTIONS,
  DIAMOND_OPTIONS,
  MOCK_BANNERS,
  MOCK_BRAND_NEWS,
  MOCK_COURSES,
  MOCK_DIAMONDS,
  MOCK_IMAGES,
  MOCK_PINNED_TASKS,
  type MiniBanner,
  type MiniBrandNews,
  type MiniCourse,
  type MiniDiamond,
  type MiniImage,
  type MiniPinnedTask,
} from '@/mock/miniapp';
import './index.css';

const { Title, Text, Link, Paragraph } = Typography;
const { TextArea } = Input;

type TabKey = 'banner' | 'image' | 'diamond' | 'news' | 'course' | 'pin';

function UploadMock({
  color,
  label,
  onPick,
}: {
  color?: string;
  label: string;
  onPick: () => void;
}) {
  if (color) {
    return (
      <div
        className="miniapp-upload-preview"
        style={{ background: color }}
        onClick={onPick}
      >
        {label}
      </div>
    );
  }
  return (
    <div className="miniapp-upload-box" onClick={onPick}>
      <PlusOutlined />
      <span>上传</span>
    </div>
  );
}

export default function MiniappManagePage() {
  const [tab, setTab] = useState<TabKey>('banner');

  const [banners, setBanners] = useState(() => [...MOCK_BANNERS]);
  const [images, setImages] = useState(() => [...MOCK_IMAGES]);
  const [diamonds, setDiamonds] = useState(() => [...MOCK_DIAMONDS]);
  const [news, setNews] = useState(() => [...MOCK_BRAND_NEWS]);
  const [courses, setCourses] = useState(() => [...MOCK_COURSES]);
  const [tasks, setTasks] = useState(() => [...MOCK_PINNED_TASKS]);

  const [bannerOpen, setBannerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<MiniBanner | null>(null);
  const [bannerForm] = Form.useForm();

  const [imageOpen, setImageOpen] = useState(false);
  const [imageForm] = Form.useForm();

  const [diamondOpen, setDiamondOpen] = useState(false);
  const [editingDiamond, setEditingDiamond] = useState<MiniDiamond | null>(null);
  const [diamondForm] = Form.useForm();

  const [newsOpen, setNewsOpen] = useState(false);
  const [newsForm] = Form.useForm();

  const [courseOpen, setCourseOpen] = useState(false);
  const [courseForm] = Form.useForm();

  const [pinOpen, setPinOpen] = useState(false);
  const [pinTask, setPinTask] = useState<MiniPinnedTask | null>(null);
  const [pinWeight, setPinWeight] = useState<number | null>(null);

  const sortedBanners = useMemo(
    () => [...banners].sort((a, b) => b.sort - a.sort),
    [banners],
  );

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const aw = a.weight ?? -1;
      const bw = b.weight ?? -1;
      if (aw !== bw) return bw - aw;
      return dayjs(b.publishTime).valueOf() - dayjs(a.publishTime).valueOf();
    });
  }, [tasks]);

  const openBanner = (row?: MiniBanner) => {
    setEditingBanner(row || null);
    bannerForm.setFieldsValue(
      row
        ? { title: row.title, sort: row.sort, enabled: row.enabled, link: row.link }
        : { title: '', sort: 0, enabled: true, link: '' },
    );
    setBannerOpen(true);
  };

  const saveBanner = async () => {
    const values = await bannerForm.validateFields();
    if (editingBanner) {
      setBanners((prev) =>
        prev.map((item) =>
          item.key === editingBanner.key
            ? {
                ...item,
                title: values.title,
                sort: values.sort ?? 0,
                enabled: !!values.enabled,
                link: values.link,
              }
            : item,
        ),
      );
      message.success('Banner 已更新');
    } else {
      setBanners((prev) => [
        {
          key: `b-${Date.now()}`,
          title: values.title,
          coverColor: '#1677ff',
          sort: values.sort ?? 0,
          enabled: true,
          link: values.link,
        },
        ...prev,
      ]);
      message.success('Banner 已创建');
    }
    setBannerOpen(false);
  };

  const imageColumns: ColumnsType<MiniImage> = [
    {
      title: '图片',
      dataIndex: 'coverColor',
      width: 90,
      render: (c: string) => <span className="miniapp-thumb square" style={{ background: c }}>图</span>,
    },
    { title: '图片标识 Key', dataIndex: 'imageKey', width: 160 },
    { title: '图片名称', dataIndex: 'name' },
    { title: '备注/用途', dataIndex: 'remark', ellipsis: true, render: (v) => v || '-' },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 90,
      render: (v: boolean) =>
        v ? <Badge status="success" text="启用" /> : <Badge status="default" text="禁用" />,
    },
    {
      title: '操作',
      width: 120,
      render: (_, row) => (
        <Space>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => {
              setImages((prev) => prev.filter((i) => i.key !== row.key));
              message.success('已删除');
            }}
          >
            <Link type="danger">删除</Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const diamondColumns: ColumnsType<MiniDiamond> = [
    {
      title: '封面图',
      dataIndex: 'coverColor',
      width: 110,
      render: (c: string) => <span className="miniapp-thumb wide" style={{ background: c }}>封面</span>,
    },
    { title: '名称', dataIndex: 'name', width: 140 },
    {
      title: '内部图',
      dataIndex: 'innerColor',
      width: 110,
      render: (c: string) => <span className="miniapp-thumb wide" style={{ background: c }}>内部</span>,
    },
    { title: '排序', dataIndex: 'sort', width: 80 },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 90,
      render: (v: boolean) =>
        v ? <Badge status="success" text="启用" /> : <Badge status="default" text="禁用" />,
    },
    {
      title: '操作',
      width: 140,
      render: (_, row) => (
        <Space>
          <Link
            onClick={() => {
              setEditingDiamond(row);
              diamondForm.setFieldsValue({
                name: row.name,
                sort: row.sort,
                enabled: row.enabled ? '启用' : '禁用',
                remark: row.remark,
                cover: row.coverColor,
                inner: row.innerColor,
              });
              setDiamondOpen(true);
            }}
          >
            编辑
          </Link>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => {
              setDiamonds((prev) => prev.filter((i) => i.key !== row.key));
              message.success('已删除');
            }}
          >
            <Link type="danger">删除</Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const newsColumns: ColumnsType<MiniBrandNews> = [
    {
      title: '头图',
      dataIndex: 'coverColor',
      width: 90,
      render: (c: string) => <span className="miniapp-thumb square" style={{ background: c }}>头图</span>,
    },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '发布时间', dataIndex: 'publishTime', width: 170 },
    { title: '跳转方式', dataIndex: 'jumpType', width: 110 },
    { title: '排序', dataIndex: 'sort', width: 80 },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 90,
      render: (v: boolean) =>
        v ? <Badge status="success" text="启用" /> : <Badge status="default" text="禁用" />,
    },
    {
      title: '操作',
      width: 100,
      render: (_, row) => (
        <Popconfirm
          title="确认删除？"
          onConfirm={() => {
            setNews((prev) => prev.filter((i) => i.key !== row.key));
            message.success('已删除');
          }}
        >
          <Link type="danger">删除</Link>
        </Popconfirm>
      ),
    },
  ];

  const courseColumns: ColumnsType<MiniCourse> = [
    {
      title: '封面图',
      dataIndex: 'coverColor',
      width: 90,
      render: (c: string) => <span className="miniapp-thumb square" style={{ background: c }}>封面</span>,
    },
    { title: '课程名称', dataIndex: 'name' },
    { title: '分类', dataIndex: 'category', width: 110 },
    {
      title: '内部长图',
      dataIndex: 'innerColor',
      width: 100,
      render: (c: string) => <span className="miniapp-thumb square" style={{ background: c }}>长图</span>,
    },
    { title: '排序', dataIndex: 'sort', width: 80 },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 90,
      render: (v: boolean) =>
        v ? <Badge status="success" text="启用" /> : <Badge status="default" text="禁用" />,
    },
    {
      title: '操作',
      width: 100,
      render: (_, row) => (
        <Popconfirm
          title="确认删除？"
          onConfirm={() => {
            setCourses((prev) => prev.filter((i) => i.key !== row.key));
            message.success('已删除');
          }}
        >
          <Link type="danger">删除</Link>
        </Popconfirm>
      ),
    },
  ];

  const pinColumns: ColumnsType<MiniPinnedTask> = [
    { title: '活动名称', dataIndex: 'name' },
    { title: '活动类型', dataIndex: 'type', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: string) => <Tag color="success">{v}</Tag>,
    },
    { title: '发布时间', dataIndex: 'publishTime', width: 170 },
    {
      title: '排序权重',
      dataIndex: 'weight',
      width: 110,
      render: (v: number | null) => (v == null ? '—' : v),
    },
    {
      title: '置顶',
      dataIndex: 'weight',
      width: 100,
      render: (v: number | null) =>
        v == null ? <Text type="secondary">未置顶</Text> : <Tag color="blue">已置顶</Tag>,
    },
    {
      title: '操作',
      width: 110,
      render: (_, row) => (
        <Link
          onClick={() => {
            setPinTask(row);
            setPinWeight(row.weight);
            setPinOpen(true);
          }}
        >
          配置权重
        </Link>
      ),
    },
  ];

  return (
    <div className="miniapp-page">
      <Card>
        <Title level={4} className="miniapp-title">
          小程序管理
        </Title>
        <Tabs
          activeKey={tab}
          onChange={(k) => setTab(k as TabKey)}
          items={[
            { key: 'banner', label: 'Banner 轮播' },
            { key: 'image', label: '图片管理' },
            { key: 'diamond', label: '金刚位配置' },
            { key: 'news', label: '品牌资讯' },
            { key: 'course', label: '创作学院' },
            { key: 'pin', label: '任务置顶配置' },
          ]}
        />

        {tab === 'banner' && (
          <>
            <div className="miniapp-toolbar">
              <span />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openBanner()}>
                新增 Banner
              </Button>
            </div>
            <div className="miniapp-banner-list">
              {sortedBanners.map((item) => (
                <div className="miniapp-banner-item" key={item.key}>
                  <span className="miniapp-thumb" style={{ background: item.coverColor }}>
                    {item.title.slice(0, 4)}
                  </span>
                  <div className="miniapp-banner-meta">
                    <div className="miniapp-banner-title">{item.title}</div>
                    <Text type="secondary">
                      排序: {item.sort} | 状态: {item.enabled ? '启用' : '禁用'}
                    </Text>
                  </div>
                  <Space>
                    <Button onClick={() => openBanner(item)}>编辑</Button>
                    <Popconfirm
                      title="确认删除该 Banner？"
                      onConfirm={() => {
                        setBanners((prev) => prev.filter((b) => b.key !== item.key));
                        message.success('已删除');
                      }}
                    >
                      <Button danger>删除</Button>
                    </Popconfirm>
                  </Space>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'image' && (
          <>
            <div className="miniapp-toolbar">
              <Text type="secondary">
                共 {images.length} 张图片，小程序通过 imageKey 读取对应图片
              </Text>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  imageForm.setFieldsValue({
                    imageKey: '',
                    name: '',
                    remark: '',
                    enabled: '启用',
                    cover: undefined,
                  });
                  setImageOpen(true);
                }}
              >
                新增图片
              </Button>
            </div>
            <Table rowKey="key" columns={imageColumns} dataSource={images} pagination={false} />
          </>
        )}

        {tab === 'diamond' && (
          <>
            <div className="miniapp-toolbar">
              <Text type="secondary">取启用状态下排序最高的 2 条展示在首页</Text>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingDiamond(null);
                  diamondForm.setFieldsValue({
                    name: '',
                    sort: 10,
                    enabled: '启用',
                    remark: '',
                    cover: undefined,
                    inner: undefined,
                  });
                  setDiamondOpen(true);
                }}
              >
                新增金刚位
              </Button>
            </div>
            <Table rowKey="key" columns={diamondColumns} dataSource={diamonds} pagination={false} />
          </>
        )}

        {tab === 'news' && (
          <>
            <div className="miniapp-toolbar">
              <span />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  newsForm.setFieldsValue({
                    title: '',
                    publishTime: dayjs(),
                    diamond: '',
                    jumpType: '长图',
                    sort: 10,
                    enabled: '启用',
                    cover: undefined,
                    longImage: undefined,
                  });
                  setNewsOpen(true);
                }}
              >
                新增资讯
              </Button>
            </div>
            <Table rowKey="key" columns={newsColumns} dataSource={news} pagination={false} />
          </>
        )}

        {tab === 'course' && (
          <>
            <div className="miniapp-toolbar">
              <span />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  courseForm.setFieldsValue({
                    name: '',
                    category: undefined,
                    sort: 10,
                    enabled: '启用',
                    remark: '',
                    cover: undefined,
                    inner: undefined,
                  });
                  setCourseOpen(true);
                }}
              >
                新增课程
              </Button>
            </div>
            <Table rowKey="key" columns={courseColumns} dataSource={courses} pagination={false} />
          </>
        )}

        {tab === 'pin' && (
          <>
            <Paragraph className="miniapp-hint">
              配置小程序任务列表展示顺序。权重排序仅可对「进行中」活动设置；有权重活动按权重倒序置顶，无权重活动排在其后并按发布时间倒序。小程序端无需操作，仅读取该配置排序。
            </Paragraph>
            <div className="miniapp-toolbar">
              <Text strong>进行中活动列表 共 {tasks.length} 条</Text>
              <Text type="secondary">支持同时置顶多个活动，通过权重区分先后</Text>
            </div>
            <Table rowKey="key" columns={pinColumns} dataSource={sortedTasks} pagination={false} />
          </>
        )}
      </Card>

      <Modal
        title={editingBanner ? '编辑 Banner' : '新增 Banner'}
        open={bannerOpen}
        onCancel={() => setBannerOpen(false)}
        onOk={saveBanner}
        destroyOnClose
      >
        <Form form={bannerForm} layout="vertical">
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入 Banner 标题" maxLength={50} showCount />
          </Form.Item>
          <Form.Item label="排序权重" name="sort">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="跳转链接" name="link">
            <Input placeholder="选填" />
          </Form.Item>
          <Form.Item label="状态" name="enabled">
            <Radio.Group
              options={[
                { label: '启用', value: true },
                { label: '禁用', value: false },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="新增图片"
        open={imageOpen}
        onCancel={() => setImageOpen(false)}
        footer={null}
        destroyOnClose
        width={520}
      >
        <Form
          form={imageForm}
          layout="vertical"
          onFinish={(values) => {
            setImages((prev) => [
              {
                key: `i-${Date.now()}`,
                imageKey: values.imageKey,
                name: values.name,
                coverColor: values.cover || '#1677ff',
                remark: values.remark || '',
                enabled: values.enabled === '启用',
              },
              ...prev,
            ]);
            message.success('图片已创建');
            setImageOpen(false);
          }}
        >
          <Form.Item
            label="图片标识 Key"
            name="imageKey"
            extra="小程序通过此Key读取图片，如 home_banner、activity_bg，一旦设定建议不要修改"
            rules={[{ required: true, message: '请输入 Key' }]}
          >
            <Input placeholder="如: home_banner" />
          </Form.Item>
          <Form.Item label="图片名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入图片名称" />
          </Form.Item>
          <Form.Item
            label="图片"
            name="cover"
            rules={[{ required: true, message: '请上传图片' }]}
          >
            <UploadField form={imageForm} name="cover" label="已选图" />
          </Form.Item>
          <Form.Item label="备注/用途" name="remark">
            <TextArea rows={3} placeholder="说明此图片的用途，方便维护" maxLength={255} showCount />
          </Form.Item>
          <Form.Item label="状态" name="enabled">
            <Radio.Group
              options={[
                { label: '启用', value: '启用' },
                { label: '禁用', value: '禁用' },
              ]}
            />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              创建图片
            </Button>
            <Button onClick={() => setImageOpen(false)}>取消</Button>
          </Space>
        </Form>
      </Modal>

      <Modal
        title={editingDiamond ? '编辑金刚位' : '新增金刚位'}
        open={diamondOpen}
        onCancel={() => setDiamondOpen(false)}
        footer={null}
        destroyOnClose
        width={520}
      >
        <Form
          form={diamondForm}
          layout="vertical"
          onFinish={(values) => {
            const next: MiniDiamond = {
              key: editingDiamond?.key || `d-${Date.now()}`,
              name: values.name,
              coverColor: values.cover || '#eb2f96',
              innerColor: values.inner || '#f759ab',
              sort: values.sort ?? 10,
              enabled: values.enabled === '启用',
              remark: values.remark || '',
            };
            if (editingDiamond) {
              setDiamonds((prev) =>
                prev.map((item) => (item.key === editingDiamond.key ? next : item)),
              );
              message.success('金刚位已更新');
            } else {
              setDiamonds((prev) => [next, ...prev]);
              message.success('金刚位已创建');
            }
            setDiamondOpen(false);
          }}
        >
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="如：获奖公示" />
          </Form.Item>
          <Form.Item
            label="封面图"
            name="cover"
            extra="首页金刚位卡片展示。建议 335x152 (@2x 670x304), jpg/png, ≤10MB"
            rules={[{ required: true, message: '请上传封面图' }]}
          >
            <UploadField form={diamondForm} name="cover" label="封面" />
          </Form.Item>
          <Form.Item
            label="内部图"
            name="inner"
            extra="点击金刚位后内容页整图展示。建议宽度 750px 起，jpg/png, ≤10MB, 无需配置跳转"
            rules={[{ required: true, message: '请上传内部图' }]}
          >
            <UploadField form={diamondForm} name="inner" label="内部" />
          </Form.Item>
          <Form.Item label="排序权重" name="sort" extra="取启用状态下排序最高的 2 条展示在首页">
            <InputNumber min={0} style={{ width: 160 }} />
          </Form.Item>
          <Form.Item label="状态" name="enabled">
            <Radio.Group
              options={[
                { label: '启用', value: '启用' },
                { label: '禁用', value: '禁用' },
              ]}
            />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <TextArea rows={3} placeholder="选填" maxLength={255} showCount />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {editingDiamond ? '保存' : '创建金刚位'}
            </Button>
            <Button onClick={() => setDiamondOpen(false)}>取消</Button>
          </Space>
        </Form>
      </Modal>

      <Modal
        title="新增品牌资讯"
        open={newsOpen}
        onCancel={() => setNewsOpen(false)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <Form
          form={newsForm}
          layout="vertical"
          onFinish={(values) => {
            setNews((prev) => [
              {
                key: `n-${Date.now()}`,
                title: values.title,
                coverColor: values.cover || '#1677ff',
                publishTime: values.publishTime.format('YYYY-MM-DD HH:mm:ss'),
                jumpType: values.jumpType,
                diamond: values.diamond || '',
                sort: values.sort ?? 10,
                enabled: values.enabled === '启用',
              },
              ...prev,
            ]);
            message.success('资讯已创建');
            setNewsOpen(false);
          }}
        >
          <Form.Item
            label="头图"
            name="cover"
            extra="列表左侧展示，建议 1:1，jpg/png, ≤10MB"
            rules={[{ required: true, message: '请上传头图' }]}
          >
            <UploadField form={newsForm} name="cover" label="头图" />
          </Form.Item>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="如: 问界M8父爱相伴，与TA共赴山海之约" maxLength={100} showCount />
          </Form.Item>
          <Form.Item
            label="发布时间"
            name="publishTime"
            extra='展示在列表右下角，格式 YYYY-MM-DD HH:MM:SS'
            rules={[{ required: true, message: '请选择发布时间' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="归属金刚位" name="diamond">
            <Select options={DIAMOND_OPTIONS} allowClear placeholder="不归属 (可清空)" />
          </Form.Item>
          <Form.Item
            label="点击后跳转"
            name="jumpType"
            rules={[{ required: true, message: '请选择跳转方式' }]}
          >
            <Radio.Group
              options={[
                { label: '长图', value: '长图' },
                { label: '视频号', value: '视频号' },
                { label: '公众号文章', value: '公众号文章' },
              ]}
            />
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(prev, cur) => prev.jumpType !== cur.jumpType}>
            {({ getFieldValue }) =>
              getFieldValue('jumpType') === '长图' ? (
                <Form.Item
                  label="长图"
                  name="longImage"
                  extra="详情页全屏展示，建议宽度 750px 起，jpg/png, ≤10MB"
                  rules={[{ required: true, message: '请上传长图' }]}
                >
                  <UploadField form={newsForm} name="longImage" label="长图" />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item label="排序权重" name="sort" extra="数值越大越靠前">
            <InputNumber min={0} style={{ width: 160 }} />
          </Form.Item>
          <Form.Item label="状态" name="enabled">
            <Radio.Group
              options={[
                { label: '启用', value: '启用' },
                { label: '禁用', value: '禁用' },
              ]}
            />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              创建资讯
            </Button>
            <Button onClick={() => setNewsOpen(false)}>取消</Button>
          </Space>
        </Form>
      </Modal>

      <Modal
        title="新增课程"
        open={courseOpen}
        onCancel={() => setCourseOpen(false)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <Form
          form={courseForm}
          layout="vertical"
          onFinish={(values) => {
            setCourses((prev) => [
              {
                key: `c-${Date.now()}`,
                name: values.name,
                category: values.category,
                coverColor: values.cover || '#eb2f96',
                innerColor: values.inner || '#ffadd2',
                sort: values.sort ?? 10,
                enabled: values.enabled === '启用',
                remark: values.remark || '',
              },
              ...prev,
            ]);
            message.success('课程已创建');
            setCourseOpen(false);
          }}
        >
          <Form.Item
            label="封面图"
            name="cover"
            extra="用于创作学院课程卡片展示，建议 1:1 正方形，jpg/png, ≤10MB"
            rules={[{ required: true, message: '请上传封面图' }]}
          >
            <UploadField form={courseForm} name="cover" label="封面" />
          </Form.Item>
          <Form.Item
            label="内部长图"
            name="inner"
            extra="用户点击课程后，在详情页全图展示教程内容。建议宽度 750px 起，jpg/png, ≤10MB"
            rules={[{ required: true, message: '请上传内部长图' }]}
          >
            <UploadField form={courseForm} name="inner" label="长图" />
          </Form.Item>
          <Form.Item
            label="课程名称"
            name="name"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="如: 小红书创作指南" maxLength={100} showCount />
          </Form.Item>
          <Form.Item
            label="分类"
            name="category"
            extra="对应小程序创作学院顶部分类筛选"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select options={COURSE_CATEGORY_OPTIONS} placeholder="请选择分类" />
          </Form.Item>
          <Form.Item label="排序权重" name="sort" extra="数值越大越靠前">
            <InputNumber min={0} style={{ width: 160 }} />
          </Form.Item>
          <Form.Item label="状态" name="enabled">
            <Radio.Group
              options={[
                { label: '启用', value: '启用' },
                { label: '禁用', value: '禁用' },
              ]}
            />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <TextArea rows={3} placeholder="选填" maxLength={255} showCount />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              创建课程
            </Button>
            <Button onClick={() => setCourseOpen(false)}>取消</Button>
          </Space>
        </Form>
      </Modal>

      <Modal
        title={pinTask ? `配置排序权重 · ${pinTask.name}` : '配置排序权重'}
        open={pinOpen}
        onCancel={() => setPinOpen(false)}
        destroyOnClose
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="link"
              style={{ paddingInline: 0 }}
              onClick={() => setPinWeight(null)}
            >
              清空权重
            </Button>
            <Space>
              <Button onClick={() => setPinOpen(false)}>取消</Button>
              <Button
                type="primary"
                onClick={() => {
                  if (!pinTask) return;
                  setTasks((prev) =>
                    prev.map((item) =>
                      item.key === pinTask.key ? { ...item, weight: pinWeight } : item,
                    ),
                  );
                  message.success('权重已保存');
                  setPinOpen(false);
                }}
              >
                确定
              </Button>
            </Space>
          </div>
        }
        width={560}
      >
        {pinTask && (
          <>
            <div className="miniapp-weight-info">
              <div>类型：{pinTask.type}</div>
              <div>
                状态：<Text type="success">{pinTask.status}</Text>
              </div>
              <div>发布时间：{pinTask.publishTime}</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>排序权重</Text>
            </div>
            <InputNumber
              min={1}
              precision={0}
              value={pinWeight ?? undefined}
              onChange={(v) => setPinWeight(typeof v === 'number' ? v : null)}
              placeholder="请输入排序权重"
              style={{ width: '100%' }}
            />
            <div className="miniapp-hint" style={{ marginTop: 8 }}>
              数值越大越靠前。填写正整数即置顶；留空按发布时间倒序，排在有权重活动之后。
            </div>
            <div className="miniapp-rule-box">
              <div>
                1. 有权重活动按权重倒序排在前面，可同时置顶多个活动。
              </div>
              <div>
                2. 未配置权重的活动按发布时间倒序，排在全部有权重活动之后。
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

function UploadField({
  form,
  name,
  label,
}: {
  form: FormInstance;
  name: string;
  label: string;
}) {
  const color = Form.useWatch(name, form) as string | undefined;
  return (
    <UploadMock
      color={color}
      label={label}
      onPick={() => {
        const colors = ['#1677ff', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16', '#52c41a'];
        form.setFieldValue(name, colors[Math.floor(Math.random() * colors.length)]);
        message.success('已选择图片（mock）');
      }}
    />
  );
}
