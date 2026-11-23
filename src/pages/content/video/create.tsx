import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
  SaveOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Steps,
  Typography,
  Upload,
  message,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { history } from '@umijs/max';
import { useState } from 'react';
import { CREATE_STEPS, getVideoTasks, setVideoTasks, type VideoTask } from '@/mock/videoStudio';
import './index.css';

const { Text, Title, Paragraph } = Typography;

export default function VideoCreatePage() {
  const [form] = Form.useForm<{ name: string; description?: string }>();
  const [step, setStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const saveTask = async (goWorkspace = false) => {
    const values = await form.validateFields();
    const now = new Date();
    const label = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
    const next: VideoTask = {
      key: `v_${Date.now()}`,
      name: values.name,
      description: values.description || '暂无描述',
      status: fileList.length ? '处理中' : '草稿',
      progress: fileList.length ? (step >= 2 ? 100 : 50) : 0,
      materialCount: Math.max(fileList.length, 0),
      updateTime: label,
      updateLabel: '刚刚',
      scriptReady: step >= 2,
    };
    setVideoTasks([next, ...getVideoTasks()]);
    message.success('任务已保存（mock）');
    if (goWorkspace) {
      history.push(`/content/video/task/${next.key}`);
    } else {
      history.push('/content/video');
    }
  };

  return (
    <div className="video-create-page">
      <div className="video-page-head">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/content/video')}>
            返回
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            创建新任务
          </Title>
        </Space>
        <Button type="primary" icon={<SaveOutlined />} onClick={() => saveTask(false)}>
          保存任务
        </Button>
      </div>

      <Card>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
                <Input placeholder="请输入任务名称" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="description" label="任务描述">
                <Input placeholder="请输入任务描述（可选）" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card>
        <Steps
          current={step}
          onChange={(current) => {
            if (current > 0 && !fileList.length) {
              message.warning('请先上传视频');
              return;
            }
            setStep(current);
          }}
          items={[
            { title: '选择视频', icon: <VideoCameraOutlined /> },
            { title: '分析内容', icon: <EditOutlined /> },
            { title: '编辑脚本', icon: <CheckCircleOutlined /> },
          ]}
        />

        <div className="video-workflow">
          {step === 0 && (
            <>
              <Title level={5}>
                <VideoCameraOutlined style={{ color: '#1677ff', marginRight: 8 }} />
                选择视频
              </Title>
              <Paragraph type="secondary">
                请先上传素材视频。后续分析将优先基于画面内容进行分段与脚本生成。
              </Paragraph>
              <Upload.Dragger
                multiple
                accept=".mp4,.mov,.avi,.webm"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={({ fileList: next }) => setFileList(next)}
                className="video-upload-box"
              >
                <PlusOutlined style={{ fontSize: 28, color: '#1677ff' }} />
                <p className="ant-upload-text">点击添加视频文件</p>
                <p className="ant-upload-hint">支持 MP4、MOV、AVI 等，可一次选择多个文件</p>
              </Upload.Dragger>
            </>
          )}

          {step === 1 && (
            <>
              <Title level={5}>
                <EditOutlined style={{ color: '#1677ff', marginRight: 8 }} />
                分析内容
              </Title>
              <Paragraph type="secondary">系统将识别画面主体、口播片段与关键卖点（mock）。</Paragraph>
              <Card size="small">
                <Space direction="vertical">
                  <Text>已识别片段：开场介绍 / 户型亮点 / 价格信息</Text>
                  <Text type="secondary">置信度：86%</Text>
                </Space>
              </Card>
            </>
          )}

          {step === 2 && (
            <>
              <Title level={5}>
                <FileTextOutlined style={{ color: '#1677ff', marginRight: 8 }} />
                编辑脚本
              </Title>
              <Input.TextArea
                rows={8}
                defaultValue={`【开场】梨园地铁 800 米，通勤真方便！
【卖点】72 平 + 20 平扩展空间，格局灵活。
【价格】首付门槛友好，适合刚需上车。
【收尾】想看房的评论区扣 1，我拉你进群。`}
              />
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 8 }}>
          {step > 0 && <Button onClick={() => setStep((s) => s - 1)}>上一步</Button>}
          {step < CREATE_STEPS.length - 1 ? (
            <Button
              type="primary"
              disabled={step === 0 && !fileList.length}
              onClick={() => setStep((s) => s + 1)}
            >
              下一步
            </Button>
          ) : (
            <Button type="primary" onClick={() => saveTask(true)}>
              完成并进入工作台
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
