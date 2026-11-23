import { Button, Drawer, Form, Input, message, Select, Space, Typography } from 'antd';
import { useEffect } from 'react';
import {
  LIST_STATUS_OPTIONS,
  OFFICE_OPTIONS,
  STATUS_OPTIONS,
  type KoxRecord,
} from '@/mock/koxList';

const { Text } = Typography;
const { TextArea } = Input;

const SOURCE_OPTIONS = [
  { label: '公域挖掘', value: '公域挖掘' },
  { label: '自然引流', value: '自然引流' },
  { label: '活动报名', value: '活动报名' },
  { label: '人工导入', value: '人工导入' },
];

const TAG_OPTIONS = [
  { label: '小月龄周期（4-12 月）', value: '小月龄周期（4-12 月）' },
  { label: '认证车主', value: '认证车主' },
  { label: '潜客', value: '潜客' },
  { label: '种草', value: '种草' },
  { label: '测评', value: '测评' },
  { label: '高互动', value: '高互动' },
];

type EditKoxDrawerProps = {
  open: boolean;
  record: KoxRecord | null;
  onClose: () => void;
  onSave: (values: Partial<KoxRecord> & { tagList?: string[]; ownerTagList?: string[]; contentTagList?: string[]; effectTagList?: string[] }) => void;
};

export default function EditKoxDrawer({ open, record, onClose, onSave }: EditKoxDrawerProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open || !record) return;
    form.setFieldsValue({
      status: record.status,
      listStatus: record.listStatus,
      source: record.source,
      group: record.group,
      remark: record.remark === '-' ? '' : record.remark,
      tagList: record.tags ? record.tags.split(',') : [],
      ownerTagList: record.ownerTag ? [record.ownerTag] : [],
      contentTagList: record.contentTag ? [record.contentTag] : [],
      effectTagList: record.effectTag ? [record.effectTag] : [],
    });
  }, [open, record, form]);

  return (
    <Drawer
      title="编辑KOX"
      width={420}
      open={open}
      onClose={onClose}
      destroyOnClose
      footer={
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            onClick={async () => {
              const values = await form.validateFields();
              onSave(values);
              message.success('保存成功（mock）');
              onClose();
            }}
          >
            保存
          </Button>
        </Space>
      }
    >
      {record && (
        <Space direction="vertical" size={4} style={{ marginBottom: 16 }}>
          <Text type="secondary">KOX ID：{record.koxId}</Text>
          <Text type="secondary">KOX 名称：{record.nickname}</Text>
        </Space>
      )}

      <Form form={form} layout="vertical">
        <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
          <Select options={STATUS_OPTIONS} />
        </Form.Item>
        <Form.Item name="listStatus" label="名单状态">
          <Select options={LIST_STATUS_OPTIONS} />
        </Form.Item>
        <Form.Item name="source" label="提报来源" rules={[{ required: true, message: '请选择提报来源' }]}>
          <Select options={SOURCE_OPTIONS} />
        </Form.Item>
        <Form.Item name="group" label="所属分组" rules={[{ required: true, message: '请选择所属分组' }]}>
          <Select options={OFFICE_OPTIONS.map((item) => ({ label: item.label, value: item.label }))} />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <TextArea rows={4} maxLength={500} showCount placeholder="请输入备注信息" />
        </Form.Item>
        <Form.Item name="tagList" label="标签">
          <Select mode="multiple" allowClear options={TAG_OPTIONS} placeholder="请选择标签" />
        </Form.Item>
        <Form.Item name="ownerTagList" label="车主标签">
          <Select mode="multiple" allowClear options={TAG_OPTIONS} placeholder="请选择车主标签" />
        </Form.Item>
        <Form.Item name="contentTagList" label="内容标签">
          <Select mode="multiple" allowClear options={TAG_OPTIONS} placeholder="请选择内容标签" />
        </Form.Item>
        <Form.Item name="effectTagList" label="效果标签">
          <Select mode="multiple" allowClear options={TAG_OPTIONS} placeholder="请选择效果标签" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
