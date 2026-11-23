import { SearchOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Space, Table, Typography, message } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { useMemo, useState } from 'react';
import AudienceCircleModal from '@/components/audience/AudienceCircleModal';
import AudienceDetailModal from '@/components/audience/AudienceDetailModal';
import { MOCK_AUDIENCE_LIST, type AudiencePackage } from '@/mock/audience';

const { Link, Text } = Typography;

function ExpandableText({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const needExpand = text.length > 36;
  const shown = !needExpand || open ? text : `${text.slice(0, 36)}...`;

  return (
    <span>
      {shown}
      {needExpand && (
        <Link style={{ marginLeft: 4 }} onClick={() => setOpen((value) => !value)}>
          {open ? '收起' : '展开'}
        </Link>
      )}
    </span>
  );
}

export default function AudienceListPage() {
  const [keyword, setKeyword] = useState('');
  const [records, setRecords] = useState<AudiencePackage[]>(() => [...MOCK_AUDIENCE_LIST]);
  const [circleOpen, setCircleOpen] = useState(false);
  const [circleMode, setCircleMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<AudiencePackage | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState<AudiencePackage | null>(null);

  const dataSource = useMemo(() => {
    const text = keyword.trim();
    if (!text) return records;
    return records.filter((item) => item.name.includes(text));
  }, [keyword, records]);

  const columns: ColumnsType<AudiencePackage> = [
    {
      title: '人群包名称',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name, 'zh-CN'),
    },
    {
      title: '量级',
      dataIndex: 'volume',
      width: 100,
      sorter: (a, b) => a.volume - b.volume,
    },
    {
      title: '描述',
      dataIndex: 'description',
      render: (value: string) => <ExpandableText text={value} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      sorter: (a, b) => a.createTime.localeCompare(b.createTime),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Link
            onClick={() => {
              setDetailRecord(record);
              setDetailOpen(true);
            }}
          >
            详情
          </Link>
          <Link
            onClick={() => {
              setEditing(record);
              setCircleMode('edit');
              setCircleOpen(true);
            }}
          >
            编辑
          </Link>
          <Link
            type="danger"
            onClick={() => {
              Modal.confirm({
                title: '确认删除该人群包？',
                content: `删除后不可恢复：${record.name}`,
                okText: '删除',
                okButtonProps: { danger: true },
                cancelText: '取消',
                onOk: () => {
                  setRecords((prev) => prev.filter((item) => item.key !== record.key));
                  message.success('已删除（mock）');
                },
              });
            }}
          >
            删除
          </Link>
        </Space>
      ),
    },
  ];

  const onChange: TableProps<AudiencePackage>['onChange'] = () => undefined;

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card size="small">
        <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="搜索人群包名称"
            style={{ width: 280 }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={() => {
              setEditing(null);
              setCircleMode('create');
              setCircleOpen(true);
            }}
          >
            AI 人群圈选
          </Button>
        </Space>
      </Card>

      <Card size="small">
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          共 {dataSource.length} 个人群包
        </Text>
        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          onChange={onChange}
          scroll={{ x: 900 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <AudienceCircleModal
        open={circleOpen}
        mode={circleMode}
        record={editing}
        onClose={() => {
          setCircleOpen(false);
          setEditing(null);
        }}
        onSave={(payload) => {
          setRecords((prev) => {
            const exists = prev.some((item) => item.key === payload.key);
            if (exists) {
              return prev.map((item) => (item.key === payload.key ? payload : item));
            }
            return [payload, ...prev];
          });
        }}
      />

      <AudienceDetailModal
        open={detailOpen}
        record={detailRecord}
        onClose={() => {
          setDetailOpen(false);
          setDetailRecord(null);
        }}
      />
    </Space>
  );
}
