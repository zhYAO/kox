import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Drawer, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState, type ReactNode } from 'react';

const { Paragraph, Text, Title } = Typography;

export const DEFAULT_AI_STEPS = [
  '正在读取数据...',
  '正在分析互动与爆文分布...',
  '正在识别高价值特征...',
  '正在总结运营规律...',
];

type AiAnalysisDrawerProps<T extends object> = {
  open: boolean;
  onClose: () => void;
  summaryTitle: string;
  steps?: string[];
  summary: ReactNode;
  selectedRows: T[];
  selectedColumns: ColumnsType<T>;
  rowKey: string;
  downloadText: string;
  onDownload: () => void;
};

export default function AiAnalysisDrawer<T extends object>({
  open,
  onClose,
  summaryTitle,
  steps = DEFAULT_AI_STEPS,
  summary,
  selectedRows,
  selectedColumns,
  rowKey,
  downloadText,
  onDownload,
}: AiAnalysisDrawerProps<T>) {
  const [stepIndex, setStepIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
    setAnalyzing(true);
  }, [open, selectedRows.length]);

  useEffect(() => {
    if (!open || !analyzing) return;
    if (stepIndex >= steps.length) {
      setAnalyzing(false);
      return;
    }
    const timer = window.setTimeout(() => setStepIndex((s) => s + 1), 600);
    return () => window.clearTimeout(timer);
  }, [open, analyzing, stepIndex, steps.length]);

  const done = stepIndex >= steps.length;

  return (
    <Drawer
      title="AI 智能分析"
      open={open}
      onClose={onClose}
      width={480}
      destroyOnClose={false}
      footer={
        <Button type="primary" block icon={<DownloadOutlined />} onClick={onDownload}>
          {downloadText}
        </Button>
      }
    >
      <Card size="small" style={{ marginBottom: 16, background: '#f6ffed', borderColor: '#b7eb8f' }}>
        <Title level={5} style={{ marginTop: 0 }}>
          {summaryTitle}
        </Title>
        <Space direction="vertical" size={6} style={{ width: '100%', marginBottom: 12 }}>
          {steps.map((step, index) => {
            const finished = stepIndex > index;
            const current = analyzing && stepIndex === index;
            return (
              <Text key={step} type={finished || current ? undefined : 'secondary'}>
                {finished ? '✓ ' : current ? '… ' : '○ '}
                {step}
              </Text>
            );
          })}
        </Space>
        {done && (typeof summary === 'string' ? <Paragraph>{summary}</Paragraph> : summary)}
      </Card>

      <Title level={5}>已选列表</Title>
      <Table
        size="small"
        rowKey={rowKey}
        pagination={false}
        dataSource={selectedRows}
        columns={selectedColumns}
        scroll={{ x: true }}
      />
    </Drawer>
  );
}
