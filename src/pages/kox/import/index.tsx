import {
  DownloadOutlined,
  EyeOutlined,
  InboxOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import { useMemo, useState } from 'react';
import { MOCK_IMPORT_RECORDS, type ImportRecord } from '@/mock/kocImport';

const { Dragger } = Upload;
const { Link, Text } = Typography;

export default function KocImportPage() {
  const [keyword, setKeyword] = useState('');
  const [records, setRecords] = useState<ImportRecord[]>(() => [...MOCK_IMPORT_RECORDS]);

  const dataSource = useMemo(() => {
    const text = keyword.trim();
    if (!text) return records;
    return records.filter(
      (item) =>
        item.fileName.includes(text) ||
        item.uploader.includes(text) ||
        item.office.includes(text),
    );
  }, [keyword, records]);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls',
    showUploadList: false,
    beforeUpload: (file) => {
      const isExcel =
        file.type.includes('sheet') ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls');
      if (!isExcel) {
        message.error('仅支持 .xlsx / .xls');
        return Upload.LIST_IGNORE;
      }

      const total = 20 + Math.floor(Math.random() * 40);
      const fail = Math.floor(Math.random() * 3);
      const success = total - fail;
      const next: ImportRecord = {
        key: `import_${Date.now()}`,
        uploadTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        source: '手动导入',
        uploader: 'kox_admin',
        office: '默认分组',
        fileName: file.name,
        total,
        success,
        fail,
        status: '已完成',
      };
      setRecords((prev) => [next, ...prev]);
      message.success(`${file.name} 上传并导入完成（mock）`);
      return false;
    },
  };

  const columns: ColumnsType<ImportRecord> = [
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      width: 180,
      sorter: (a, b) => a.uploadTime.localeCompare(b.uploadTime),
    },
    {
      title: '提报来源',
      dataIndex: 'source',
      width: 120,
      render: (value: ImportRecord['source']) => (
        <Tag color={value === '手动导入' ? 'success' : 'processing'}>{value}</Tag>
      ),
    },
    {
      title: '上传人/代表处',
      key: 'uploader',
      width: 140,
      render: (_, record) => (
        <div>
          <div>{record.uploader}</div>
          <Text type="secondary">{record.office}</Text>
        </div>
      ),
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      ellipsis: true,
    },
    {
      title: '导入条数',
      key: 'count',
      width: 120,
      render: (_, record) => (
        <div>
          <div>总数 {record.total}</div>
          <div style={{ color: '#52c41a' }}>成功 {record.success}</div>
          <div style={{ color: '#ff4d4f' }}>失败 {record.fail}</div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value: string) => <Tag color="success">{value}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      fixed: 'right',
      render: (_, record) => (
        <Space wrap>
          <Link
            onClick={() => {
              Modal.info({
                title: '导入详情',
                width: 520,
                content: (
                  <Space direction="vertical">
                    <Text>文件名：{record.fileName}</Text>
                    <Text>来源：{record.source}</Text>
                    <Text>上传人：{record.uploader} / {record.office}</Text>
                    <Text>总数 {record.total}，成功 {record.success}，失败 {record.fail}</Text>
                  </Space>
                ),
              });
            }}
          >
            <EyeOutlined /> 查看
          </Link>
          <Link onClick={() => message.success(`开始下载：${record.fileName}（mock）`)}>
            <DownloadOutlined /> 下载
          </Link>
          {record.fail > 0 && (
            <Link type="danger" onClick={() => message.success('失败数据已下载（mock）')}>
              <DownloadOutlined /> 下载失败数据
            </Link>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card
        size="small"
        title="名单上传"
        extra={
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => message.success('导入模板已下载（mock）')}
          >
            下载导入模板
          </Button>
        }
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">拖拽文件到此处，或点击上传</p>
          <p className="ant-upload-hint">支持 .xlsx, .xls 格式</p>
        </Dragger>
      </Card>

      <Card size="small" title="导入记录">
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="搜索文件名、上传人、代表处..."
            style={{ width: 320 }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              const next: ImportRecord = {
                key: `manual_${Date.now()}`,
                uploadTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
                source: '手动导入',
                uploader: 'kox_admin',
                office: '默认分组',
                fileName: '手动添加',
                total: 1,
                success: 1,
                fail: 0,
                status: '已完成',
              };
              setRecords((prev) => [next, ...prev]);
              message.success('已添加 KOC 账号（mock）');
            }}
          >
            添加KOC账号
          </Button>
        </Space>

        <Table
          rowKey="key"
          size="middle"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1100 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </Space>
  );
}
