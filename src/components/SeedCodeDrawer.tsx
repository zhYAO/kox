import { QrcodeOutlined, LinkOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  message,
} from 'antd';
import { useEffect } from 'react';
import {
  CODE_TYPE_OPTIONS,
  CONTENT_STYLE_OPTIONS,
  PLATFORM_OPTIONS,
  SHARE_TARGET_OPTIONS,
  TASK_TYPE_OPTIONS,
  type SeedCodeRecord,
} from '@/mock/seedCode';

const { Text } = Typography;
const { TextArea } = Input;

export type SeedCodeFormValues = {
  taskType: SeedCodeRecord['taskType'];
  taskName: string;
  title: string;
  topic: string;
  shareTarget: string;
  platforms: SeedCodeRecord['platforms'];
  content: string;
  imageCount: number;
  contentStyle: string;
  presetCount: number;
  codeType: SeedCodeRecord['codeType'];
};

type Props = {
  open: boolean;
  record: SeedCodeRecord | null;
  onClose: () => void;
  onSave: (values: SeedCodeFormValues) => void;
};

export default function SeedCodeDrawer({ open, record, onClose, onSave }: Props) {
  const [form] = Form.useForm<SeedCodeFormValues>();

  useEffect(() => {
    if (!open) return;
    if (record) {
      form.setFieldsValue({
        taskType: record.taskType,
        taskName: record.taskName,
        title: record.title,
        topic: record.topic,
        shareTarget: record.shareTarget,
        platforms: record.platforms,
        content: record.content,
        imageCount: record.imageCount,
        contentStyle: record.contentStyle,
        presetCount: record.presetCount,
        codeType: record.codeType,
      });
    } else {
      form.setFieldsValue({
        taskType: '图文种草',
        codeType: '基础码',
        shareTarget: '笔记发布',
        contentStyle: '种草安利',
        imageCount: 3,
        presetCount: 20,
        platforms: ['小红书'],
      });
    }
  }, [open, record, form]);

  const handleSave = async () => {
    const values = await form.validateFields();
    onSave(values);
    message.success(record ? '已保存（mock）' : '已创建（mock）');
    onClose();
  };

  return (
    <Drawer
      title={record ? '编辑种草码' : '创建种草码'}
      open={open}
      onClose={onClose}
      width={720}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="taskType" label="任务类型" rules={[{ required: true }]}>
              <Select options={TASK_TYPE_OPTIONS.filter((o) => o.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="taskName" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
              <Input placeholder="请输入任务名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
              <Input placeholder="请输入标题" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="topic" label="话题" rules={[{ required: true, message: '请输入话题' }]}>
              <Input placeholder="如：#雀巢佳膳悠选" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="shareTarget" label="分享目标" rules={[{ required: true }]}>
              <Select options={SHARE_TARGET_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="platforms" label="选择平台" rules={[{ required: true, message: '请选择平台' }]}>
              <Select mode="multiple" options={PLATFORM_OPTIONS} placeholder="请选择平台" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="content" label="正文" rules={[{ required: true, message: '请输入正文' }]}>
              <TextArea rows={5} placeholder="请输入正文内容" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="imageCount" label="单个文章图片数" rules={[{ required: true }]}>
              <InputNumber min={1} max={18} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="contentStyle" label="内容风格" rules={[{ required: true }]}>
              <Select options={CONTENT_STYLE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="presetCount" label="预设文章数" rules={[{ required: true }]}>
              <InputNumber min={1} max={500} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="codeType" label="码类型" rules={[{ required: true }]}>
              <Select options={CODE_TYPE_OPTIONS.filter((o) => o.value)} />
            </Form.Item>
          </Col>
        </Row>

        <div
          style={{
            border: '1px dashed #91caff',
            borderRadius: 8,
            padding: '28px 16px',
            textAlign: 'center',
            background: '#f0f7ff',
            cursor: 'pointer',
            marginBottom: 16,
          }}
          onClick={() => message.info('打开素材库选择（mock）')}
        >
          <Text type="secondary">从素材库选择图片素材</Text>
        </div>

        <Text strong>主题 Banner</Text>
        <div
          style={{
            marginTop: 8,
            border: '1px dashed #d9d9d9',
            borderRadius: 8,
            padding: '20px 16px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => message.info('上传主题 Banner（mock）')}
        >
          <Text type="secondary">点击上传主题 Banner（可选）</Text>
        </div>
      </Form>
    </Drawer>
  );
}

export function showSeedLinkModal(link: string) {
  Modal.info({
    title: '种草链接',
    icon: <LinkOutlined />,
    content: (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text copyable>{link}</Text>
      </Space>
    ),
    okText: '关闭',
  });
}

export function showQrShareModal(record: SeedCodeRecord) {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
      <rect width="180" height="180" fill="#fff"/>
      <rect x="16" y="16" width="40" height="40" fill="#111"/>
      <rect x="124" y="16" width="40" height="40" fill="#111"/>
      <rect x="16" y="124" width="40" height="40" fill="#111"/>
      <rect x="70" y="70" width="40" height="40" fill="#111"/>
      <text x="90" y="168" text-anchor="middle" font-size="10" fill="#666">${record.id}</text>
    </svg>`,
  );
  Modal.info({
    title: '二维码分享',
    icon: <QrcodeOutlined />,
    content: (
      <Space direction="vertical" align="center" style={{ width: '100%' }}>
        <img src={`data:image/svg+xml,${svg}`} alt="qr" width={180} height={180} />
        <Text type="secondary">{record.taskName}</Text>
      </Space>
    ),
    okText: '关闭',
  });
}
