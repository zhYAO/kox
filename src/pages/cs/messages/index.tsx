import {
  DesktopOutlined,
  MobileOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Input,
  Modal,
  Segmented,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  MOCK_CS_MESSAGES,
  type CsChatMessage,
  type CsMessageRecord,
  type CsMessageSource,
  type CsMessageStatus,
} from '@/mock/csMessages';
import './index.css';

const { Text, Title } = Typography;

type StatusFilter = '全部' | CsMessageStatus;
type SourceFilter = '全部' | CsMessageSource;

function statusTag(status: CsMessageStatus) {
  if (status === '待处理') return <Tag color="orange">待处理</Tag>;
  if (status === '已处理') return <Tag color="green">已处理</Tag>;
  return <Tag color="blue">智能客服</Tag>;
}

function sourceTag(source: CsMessageSource) {
  if (source === 'PC端') {
    return (
      <Tag color="blue" icon={<DesktopOutlined />}>
        PC端
      </Tag>
    );
  }
  return (
    <Tag color="green" icon={<MobileOutlined />}>
      手机端
    </Tag>
  );
}

export default function CsMessagesPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('全部');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('全部');
  const [keyword, setKeyword] = useState('');
  const [records, setRecords] = useState<CsMessageRecord[]>(() => [...MOCK_CS_MESSAGES]);
  const [current, setCurrent] = useState<CsMessageRecord | null>(null);
  const [reply, setReply] = useState('');
  const [open, setOpen] = useState(false);

  const dataSource = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return records.filter((item) => {
      if (statusFilter !== '全部' && item.status !== statusFilter) return false;
      if (sourceFilter !== '全部' && item.source !== sourceFilter) return false;
      if (kw) {
        const hit =
          item.username.toLowerCase().includes(kw) ||
          item.koxId.toLowerCase().includes(kw) ||
          item.lastMessage.toLowerCase().includes(kw) ||
          item.sessionId.toLowerCase().includes(kw);
        if (!hit) return false;
      }
      return true;
    });
  }, [records, statusFilter, sourceFilter, keyword]);

  const columns: ColumnsType<CsMessageRecord> = [
    { title: '会话ID', dataIndex: 'sessionId', width: 140 },
    {
      title: '用户',
      dataIndex: 'username',
      width: 140,
      render: (v: string) => (
        <span className="cs-user-cell">
          <Avatar size={28} icon={<UserOutlined />} />
          <Text>{v}</Text>
        </span>
      ),
    },
    { title: 'KOXID', dataIndex: 'koxId', width: 90 },
    {
      title: '来源',
      dataIndex: 'source',
      width: 110,
      render: (v: CsMessageSource) => sourceTag(v),
    },
    {
      title: '最后消息',
      dataIndex: 'lastMessage',
      ellipsis: true,
      render: (v: string) => <Text type="secondary">{v}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: CsMessageStatus) => statusTag(v),
    },
    {
      title: '未读消息',
      dataIndex: 'unread',
      width: 100,
      align: 'center',
      render: (v: number | null) => (v == null || v === 0 ? '-' : v),
    },
    { title: '创建时间', dataIndex: 'createdAt', width: 150 },
    { title: '最后消息时间', dataIndex: 'lastMessageAt', width: 150 },
    {
      title: '操作',
      key: 'action',
      width: 110,
      fixed: 'right',
      render: (_, row) => (
        <Button
          type="link"
          style={{ paddingInline: 0 }}
          onClick={() => {
            setCurrent(row);
            setReply('');
            setOpen(true);
          }}
        >
          查看对话
        </Button>
      ),
    },
  ];

  const sendReply = () => {
    if (!current) return;
    const content = reply.trim();
    if (!content) {
      message.warning('请输入回复内容');
      return;
    }
    const now = dayjs();
    const msg: CsChatMessage = {
      id: `local-${Date.now()}`,
      role: 'agent',
      sender: '人工客服',
      content,
      time: now.format('HH:mm:ss'),
    };
    const stamp = now.format('YYYY-MM-DD HH:mm');
    setRecords((prev) =>
      prev.map((item) =>
        item.key === current.key
          ? {
              ...item,
              status: '已处理',
              unread: null,
              lastMessage: content,
              lastMessageAt: stamp,
              messages: [...item.messages, msg],
            }
          : item,
      ),
    );
    setCurrent((prev) =>
      prev
        ? {
            ...prev,
            status: '已处理',
            unread: null,
            lastMessage: content,
            lastMessageAt: stamp,
            messages: [...prev.messages, msg],
          }
        : prev,
    );
    setReply('');
    message.success('回复已发送');
  };

  return (
    <div className="cs-messages-page">
      <Card>
        <div className="cs-filter-bar">
          <div className="cs-filter-item">
            <span className="cs-filter-label">状态</span>
            <Segmented
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as StatusFilter)}
              options={['全部', '待处理', '已处理', '智能客服']}
            />
          </div>
          <div className="cs-filter-item">
            <span className="cs-filter-label">来源</span>
            <Segmented
              value={sourceFilter}
              onChange={(v) => setSourceFilter(v as SourceFilter)}
              options={['全部', 'PC端', '手机端']}
            />
          </div>
          <Input
            className="cs-filter-search"
            allowClear
            prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
            placeholder="搜索用户名、KOXID或消息内容"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>
          客服留言列表
        </Title>
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1280 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (t) => `第 1-${Math.min(20, t)} 条/总共 ${t} 条`,
          }}
        />
      </Card>

      <Modal
        className="cs-chat-modal"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={720}
        destroyOnClose
        title={
          current ? (
            <div className="cs-chat-header" style={{ padding: 0, border: 'none' }}>
              <Avatar size={40} icon={<UserOutlined />} />
              <div className="cs-chat-header-meta">
                <Text strong>{current.username}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  会话ID: {current.sessionId}
                </Text>
              </div>
            </div>
          ) : null
        }
        styles={{ body: { padding: 0 } }}
      >
        {current && (
          <>
            <div className="cs-chat-list">
              {current.messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`cs-chat-row ${isUser ? 'is-user' : 'is-bot'}`}
                  >
                    <div className="cs-chat-meta">
                      {msg.sender} · {msg.time}
                    </div>
                    <div className={`cs-chat-bubble ${isUser ? 'is-user' : 'is-bot'}`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cs-chat-footer">
              <Input.TextArea
                rows={4}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="输入回复内容..."
              />
              <div className="cs-chat-actions">
                <Button onClick={() => setOpen(false)}>取消</Button>
                <Button type="primary" onClick={sendReply}>
                  发送
                </Button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
