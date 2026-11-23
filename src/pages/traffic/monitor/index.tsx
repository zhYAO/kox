import { PaperClipOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Input, Space, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useRef, useState } from 'react';
import {
  MOCK_MONITOR_SESSIONS,
  MONITOR_QUICK_COMMANDS,
  MONITOR_WELCOME,
  buildAssistantReply,
  type MonitorMessage,
} from '@/mock/trafficMonitor';
import './index.css';

const { Text, Title } = Typography;
const { TextArea } = Input;

export default function TrafficMonitorPage() {
  const [activeSession, setActiveSession] = useState(MOCK_MONITOR_SESSIONS[0].key);
  const [messages, setMessages] = useState<MonitorMessage[]>([MONITOR_WELCOME]);
  const [input, setInput] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, typeof MOCK_MONITOR_SESSIONS> = {
      一个月内: [],
      更早: [],
    };
    MOCK_MONITOR_SESSIONS.forEach((s) => map[s.group].push(s));
    return map;
  }, []);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    });
  };

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text) {
      message.warning('请输入消息');
      return;
    }
    const now = dayjs().format('HH:mm:ss');
    const userMsg: MonitorMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      time: now,
    };
    const botMsg: MonitorMessage = {
      id: `a-${Date.now() + 1}`,
      role: 'assistant',
      content: buildAssistantReply(text),
      time: dayjs().format('HH:mm:ss'),
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
    setShowCommands(false);
    scrollToBottom();
  };

  return (
    <div className="traffic-monitor-page">
      <aside className="traffic-monitor-sider">
        <div className="traffic-monitor-sider-title">历史会话</div>
        {(['一个月内', '更早'] as const).map((group) => (
          <div key={group}>
            <div className="traffic-monitor-group">{group}</div>
            {grouped[group].map((item) => (
              <div
                key={item.key}
                className={`traffic-monitor-session ${activeSession === item.key ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveSession(item.key);
                  setMessages([
                    MONITOR_WELCOME,
                    {
                      id: `seed-${item.key}`,
                      role: 'user',
                      content: item.title,
                      time: '10:00:00',
                    },
                    {
                      id: `seed-a-${item.key}`,
                      role: 'assistant',
                      content: buildAssistantReply(item.title),
                      time: '10:00:02',
                    },
                  ]);
                  scrollToBottom();
                }}
              >
                {item.title}
              </div>
            ))}
          </div>
        ))}
      </aside>

      <section className="traffic-monitor-main">
        <div className="traffic-monitor-header">
          <span className="traffic-monitor-header-icon">
            <RobotOutlined />
          </span>
          <div>
            <Title level={5} style={{ margin: 0 }}>
              投流助手5.0(规则版)
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              智能诊断优化 · 即时数据查询 · AI盯盘预警
            </Text>
          </div>
        </div>

        <div className="traffic-monitor-chat" ref={listRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`traffic-monitor-msg ${msg.role === 'user' ? 'is-user' : 'is-bot'}`}
            >
              <div className="traffic-monitor-msg-meta">
                {msg.role === 'user' ? '我' : '投流助手'} · {msg.time}
              </div>
              <div className="traffic-monitor-bubble">{msg.content}</div>
            </div>
          ))}
        </div>

        <div className="traffic-monitor-input">
          {showCommands && (
            <div className="traffic-monitor-commands">
              {MONITOR_QUICK_COMMANDS.map((cmd) => (
                <Tag
                  key={cmd.key}
                  color="blue"
                  style={{ cursor: 'pointer' }}
                  onClick={() => send(cmd.key)}
                >
                  {cmd.key} {cmd.label}
                </Tag>
              ))}
            </div>
          )}
          <div className="traffic-monitor-input-row">
            <Button
              icon={<PaperClipOutlined />}
              onClick={() => message.info('附件上传为演示占位（mock）')}
            />
            <TextArea
              value={input}
              rows={3}
              placeholder="输入消息, Shift+Enter 换行；输入 / 唤起快捷指令"
              onChange={(e) => {
                const v = e.target.value;
                setInput(v);
                setShowCommands(v.trim() === '/' || v.endsWith('/'));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={() => send()}>
              发送
            </Button>
          </div>
          <Space style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              快捷：
            </Text>
            {MONITOR_QUICK_COMMANDS.map((cmd) => (
              <Tag key={cmd.key} style={{ cursor: 'pointer' }} onClick={() => send(cmd.label)}>
                {cmd.label}
              </Tag>
            ))}
          </Space>
        </div>
      </section>
    </div>
  );
}
