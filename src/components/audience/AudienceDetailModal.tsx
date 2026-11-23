import { ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Input,
  Modal,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import {
  MOCK_MATCHED_KOX,
  type AudiencePackage,
  type MatchedKox,
} from '@/mock/audience';

const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;

type AudienceDetailModalProps = {
  open: boolean;
  record: AudiencePackage | null;
  onClose: () => void;
};

export default function AudienceDetailModal({ open, record, onClose }: AudienceDetailModalProps) {
  const [tab, setTab] = useState('ai');
  const [matched, setMatched] = useState<MatchedKox[]>([]);

  useEffect(() => {
    if (!open || !record) return;
    setTab(record.mode === 'rule' ? 'rule' : 'ai');
    setMatched(MOCK_MATCHED_KOX.slice(0, record.volume));
  }, [open, record]);

  const columns: ColumnsType<MatchedKox> = [
    {
      title: '用户',
      dataIndex: 'name',
      render: (value: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {value}
        </Space>
      ),
    },
    {
      title: '平台',
      dataIndex: 'platforms',
      render: (platforms: string[]) => (
        <Space wrap size={[4, 4]}>
          {platforms.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '粉丝数',
      dataIndex: 'followers',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '点赞数',
      dataIndex: 'likes',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '高价值标签',
      dataIndex: 'label',
      render: (value: string) => <Tag color="processing">{value}</Tag>,
    },
  ];

  return (
    <Modal
      title="查看人群包详情"
      open={open}
      onCancel={onClose}
      width={960}
      footer={<Button onClick={onClose}>关闭</Button>}
      destroyOnClose
    >
      <Paragraph type="secondary" style={{ marginTop: 0 }}>
        基于CDP标签的精准筛选，支持规则筛选与AI智能筛选（当前为只读模式）
      </Paragraph>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input value={record?.name} disabled style={{ width: 280 }} />
        <Tag color={record?.mode === 'ai' ? 'purple' : 'blue'}>
          {record?.mode === 'ai' ? 'AI圈选' : '规则筛选'}
        </Tag>
        <Text type="secondary">量级：{record?.volume ?? 0}</Text>
      </Space>

      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          {
            key: 'ai',
            label: 'AI人群圈选',
            children: (
              <Space direction="vertical" size={16} style={{ display: 'flex' }}>
                <Text type="secondary">输入活动目标，系统将基于CDP标签智能匹配KOX。</Text>
                <div>
                  <Title level={5}>活动目标</Title>
                  <TextArea value={record?.goal || '（无 AI 目标描述）'} readOnly rows={6} maxLength={2000} showCount />
                </div>
                <Button type="primary" icon={<ThunderboltOutlined />} disabled>
                  AI 智能匹配
                </Button>

                <Title level={5} style={{ marginBottom: 0 }}>
                  智能匹配结果
                </Title>
                <div
                  style={{
                    background: '#e6f4ff',
                    border: '1px solid #91caff',
                    borderRadius: 6,
                    padding: '8px 12px',
                  }}
                >
                  共筛选到 {matched.length} 位KOX，高风险博主：0（以下展示部分示例）
                </div>
                <Table
                  rowKey="key"
                  size="middle"
                  columns={columns}
                  dataSource={matched}
                  pagination={false}
                />
              </Space>
            ),
          },
          {
            key: 'rule',
            label: '规则筛选',
            children: (
              <Space direction="vertical" size={12} style={{ display: 'flex' }}>
                <Text type="secondary">规则描述（只读）</Text>
                <TextArea value={record?.ruleDesc || record?.description || '（无规则描述）'} readOnly rows={4} />
                <Button
                  onClick={() => {
                    setMatched(MOCK_MATCHED_KOX.slice(0, record?.volume || 8));
                    message.success('已按规则回放匹配结果（mock）');
                  }}
                >
                  查看匹配结果
                </Button>
                <Table
                  rowKey="key"
                  size="middle"
                  columns={columns}
                  dataSource={matched}
                  pagination={false}
                />
              </Space>
            ),
          },
        ]}
      />
    </Modal>
  );
}
