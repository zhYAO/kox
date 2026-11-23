import {
  DeleteOutlined,
  FileImageOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Segmented,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useMemo, useState } from 'react';
import {
  COURSE_CATEGORIES,
  COURSE_CATEGORY_OPTIONS,
  MOCK_COURSES,
  coverOf,
  type CourseCategory,
  type CourseItem,
  type CourseType,
} from '@/mock/academy';

const { Meta } = Card;
const { Text } = Typography;

type UploadFormValues = {
  type: CourseType;
  title: string;
  category: CourseCategory;
  file?: { fileList: UploadFile[] };
};

export default function AcademyPage() {
  const [tab, setTab] = useState<(typeof COURSE_CATEGORIES)[number]>('全部');
  const [courses, setCourses] = useState<CourseItem[]>(() => [...MOCK_COURSES]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [form] = Form.useForm<UploadFormValues>();
  const courseType = Form.useWatch('type', form);

  const dataSource = useMemo(() => {
    if (tab === '全部') return courses;
    return courses.filter((item) => item.category === tab);
  }, [courses, tab]);

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Tabs
          activeKey={tab}
          onChange={(key) => setTab(key as typeof tab)}
          items={COURSE_CATEGORIES.map((item) => ({ key: item, label: item }))}
          style={{ flex: 1, marginBottom: 0 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.setFieldsValue({ type: '视频' });
            setUploadOpen(true);
          }}
        >
          上传课程
        </Button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        {dataSource.map((item) => (
          <Card
            key={item.key}
            hoverable
            styles={{ body: { padding: 12 } }}
            cover={
              <div style={{ position: 'relative' }}>
                <img
                  alt={item.title}
                  src={item.cover}
                  style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                />
                <Tag
                  color={item.type === '视频' ? 'processing' : 'default'}
                  style={{ position: 'absolute', left: 8, top: 8, margin: 0 }}
                  icon={item.type === '视频' ? <PlayCircleOutlined /> : <FileImageOutlined />}
                >
                  {item.type}
                </Tag>
                <Button
                  size="small"
                  shape="circle"
                  icon={<DeleteOutlined />}
                  style={{ position: 'absolute', right: 8, top: 8 }}
                  onClick={() => {
                    Modal.confirm({
                      title: '确认删除该课程？',
                      content: item.title,
                      okText: '删除',
                      okButtonProps: { danger: true },
                      cancelText: '取消',
                      onOk: () => {
                        setCourses((prev) => prev.filter((course) => course.key !== item.key));
                        message.success('课程已删除（mock）');
                      },
                    });
                  }}
                />
              </div>
            }
          >
            <Meta
              title={<span style={{ fontSize: 14 }}>{item.title}</span>}
              description={<Text type="secondary">{item.category}</Text>}
            />
          </Card>
        ))}
      </div>

      {!dataSource.length && <Card>暂无课程</Card>}

      <Modal
        title="上传课程"
        open={uploadOpen}
        onCancel={() => {
          setUploadOpen(false);
          form.resetFields();
        }}
        onOk={async () => {
          const values = await form.validateFields();
          const fileName = values.file?.fileList?.[0]?.name;
          const next: CourseItem = {
            key: `course_${Date.now()}`,
            title: values.title,
            category: values.category,
            type: values.type,
            cover: coverOf(courses.length, values.title),
            fileName,
          };
          setCourses((prev) => [next, ...prev]);
          message.success('课程上传成功（mock）');
          setUploadOpen(false);
          form.resetFields();
        }}
        okText="确认上传"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ type: '视频' }}>
          <Form.Item name="type" label="课程类型" rules={[{ required: true }]}>
            <Segmented options={['视频', '图文']} block />
          </Form.Item>
          <Form.Item name="title" label="课程名称" rules={[{ required: true, message: '请输入课程名称' }]}>
            <Input placeholder="请输入课程名称" />
          </Form.Item>
          <Form.Item name="category" label="课程标签" rules={[{ required: true, message: '请选择课程标签' }]}>
            <Select options={COURSE_CATEGORY_OPTIONS} placeholder="请选择课程标签" />
          </Form.Item>
          <Form.Item
            name="file"
            label={courseType === '图文' ? '上传图文' : '上传视频'}
            valuePropName="file"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value?.fileList?.length) {
                    return Promise.reject(new Error('请上传文件'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Upload.Dragger
              maxCount={1}
              beforeUpload={() => false}
              accept={courseType === '图文' ? '.jpg,.jpeg,.png,.pdf' : '.mp4,.avi,.mov,.webm'}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">
                {courseType === '图文' ? '点击或拖拽上传图文资料' : '点击或拖拽上传视频'}
              </p>
              <p className="ant-upload-hint">
                {courseType === '图文'
                  ? '支持 JPG、PNG、PDF，最大 50MB'
                  : '支持 MP4、AVI、MOV、WebM，最大 500MB'}
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
