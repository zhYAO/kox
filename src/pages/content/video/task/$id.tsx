import {
  ArrowLeftOutlined,
  PlayCircleFilled,
  SaveOutlined,
  ScissorOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Button, Menu, Space, Tag, Typography, message } from 'antd';
import { history, useParams } from '@umijs/max';
import { useMemo, useState } from 'react';
import { WORKSPACE_MENUS, findVideoTask, statusColor } from '@/mock/videoStudio';
import './../index.css';

const { Text, Title, Paragraph } = Typography;

export default function VideoTaskPage() {
  const { id } = useParams<{ id: string }>();
  const task = useMemo(() => findVideoTask(id), [id]);
  const [menuKey, setMenuKey] = useState<string>('vision');

  const panelText: Record<string, { title: string; desc: string }> = {
    vision: {
      title: '画面识别',
      desc: '已识别房源画面中的地铁距离、面积与价格字幕区域（mock）。',
    },
    subtitle: {
      title: '字幕提取',
      desc: '已提取口播字幕：梨园地铁800米 / 72平+20平扩展空间（mock）。',
    },
    script: {
      title: '脚本生成',
      desc: task.scriptReady
        ? '脚本已生成，可在混剪前继续微调话术。'
        : '可基于识别结果生成口播脚本（mock）。',
    },
    mix: {
      title: '视频混剪',
      desc: '按脚本自动拼接开场、卖点与收尾片段，可导出成片（mock）。',
    },
  };

  return (
    <div className="video-task-page">
      <div className="video-page-head">
        <Space align="start">
          <Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/content/video')}>
            返回
          </Button>
          <div>
            <Space wrap>
              <Title level={4} style={{ margin: 0 }}>
                {task.name}
              </Title>
              <Tag color={statusColor(task.status)}>{task.status}</Tag>
              {task.scriptReady && <Tag color="success">已生成脚本</Tag>}
            </Space>
            <Text type="secondary">{task.description || '暂无描述'}</Text>
          </div>
        </Space>
        <Button type="primary" icon={<SaveOutlined />} onClick={() => message.success('任务已保存（mock）')}>
          保存任务
        </Button>
      </div>

      <div className="video-task-body">
        <div className="video-side-menu">
          <Menu
            mode="inline"
            selectedKeys={[menuKey]}
            onClick={({ key }) => setMenuKey(key)}
            items={WORKSPACE_MENUS.map((item) => ({
              key: item.key,
              icon:
                item.key === 'vision' ? (
                  <EyeOutlined />
                ) : item.key === 'subtitle' ? (
                  <FileTextOutlined />
                ) : item.key === 'script' ? (
                  <ThunderboltOutlined />
                ) : (
                  <ScissorOutlined />
                ),
              label: item.label,
            }))}
          />
          <div style={{ padding: 12 }}>
            <Text strong>{panelText[menuKey]?.title}</Text>
            <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0, fontSize: 12 }}>
              {panelText[menuKey]?.desc}
            </Paragraph>
          </div>
        </div>

        <div className="video-player-panel">
          <div className="video-phone-frame">
            <div className="video-phone-media">
              <h3>梨园地铁800米</h3>
              <div className="highlight">72平 + 20平扩展空间</div>
              <div className="video-phone-meta">
                北京·通州
                <br />
                刚需上车友好，格局灵活好改造
                <br />
                #我爱我家 #通州房源 #刚需
              </div>
            </div>
            <div className="video-phone-controls">
              <PlayCircleFilled style={{ color: '#fff' }} />
              <div className="bar">
                <span />
              </div>
              <Text style={{ color: '#aaa', fontSize: 12 }}>0:12 / 0:35</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
