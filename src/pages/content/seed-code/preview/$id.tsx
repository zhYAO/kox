import { Button, Card, Space, Tag, Typography } from 'antd';
import { history, useParams } from '@umijs/max';
import { findSeedCode, platformColor } from '@/mock/seedCode';

const { Title, Paragraph, Text } = Typography;

export default function SeedCodePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const record = findSeedCode(id);

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>
          文章预览
        </Title>
        <Button onClick={() => history.push('/content/seed-code')}>返回列表</Button>
      </div>

      <Card style={{ maxWidth: 760, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0, flex: 1 }}>
            {record.title}
          </Title>
          <Space wrap>
            {record.platforms.map((p) => (
              <Tag key={p} color={platformColor(p)}>
                {p}
              </Tag>
            ))}
            <Text type="secondary">ID: {record.id}</Text>
          </Space>
        </div>
        <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 15, lineHeight: 1.8, marginBottom: 0 }}>
          {record.content}
        </Paragraph>
      </Card>
    </Space>
  );
}
