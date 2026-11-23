import { Card, Typography } from 'antd';
import { useParams } from '@umijs/max';

const { Text, Title } = Typography;

export default function PlaceholderPage() {
  const { key } = useParams<{ key: string }>();

  return (
    <Card>
      <Title level={4} style={{ marginTop: 0 }}>
        页面占位
      </Title>
      <Text type="secondary">菜单：{key}（后续用 mock 数据实现）</Text>
    </Card>
  );
}
