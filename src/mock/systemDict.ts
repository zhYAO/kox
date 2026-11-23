export type DictStatus = '正常' | '停用';

export type DictType = {
  key: string;
  name: string;
  type: string;
  status: DictStatus;
  remark: string;
  updatedAt: string;
};

export type DictItem = {
  key: string;
  label: string;
  value: string;
  type: string;
  sort: number;
  isDefault: boolean;
  status: DictStatus;
  cssClass?: string;
  listClass?: string;
  remark?: string;
  updatedAt: string;
};

const TS = '2026-03-17 18:03:04';
const TS2 = '2026-03-17 17:41:03';
const TS3 = '2026-03-17 17:40:59';

export const MOCK_DICT_TYPES: DictType[] = [
  { key: '1', name: '任务活动类别', type: 'task_category', status: '正常', remark: '任务中心筛选', updatedAt: TS },
  { key: '2', name: '任务目标平台', type: 'task_platform', status: '正常', remark: '任务中心筛选', updatedAt: TS },
  { key: '3', name: '任务内容形式', type: 'task_content_form', status: '正常', remark: '任务中心筛选', updatedAt: TS },
  { key: '4', name: '任务预算状态', type: 'task_budget_status', status: '正常', remark: '任务中心筛选', updatedAt: TS },
  { key: '5', name: '内容形式', type: 'content_type', status: '正常', remark: '', updatedAt: TS2 },
  { key: '6', name: '是否爆文', type: 'is_viral', status: '正常', remark: '', updatedAt: TS2 },
  { key: '7', name: '发布平台', type: 'platform', status: '正常', remark: '', updatedAt: TS2 },
  { key: '8', name: '活动类别', type: 'task_type', status: '正常', remark: '', updatedAt: TS2 },
  { key: '9', name: '任务活动状态', type: 'task_status', status: '正常', remark: '任务中心筛选', updatedAt: TS },
  { key: '10', name: '用户性别', type: 'user_gender', status: '正常', remark: '系统预置字典', updatedAt: TS3 },
];

export const MOCK_DICT_ITEMS: DictItem[] = [
  { key: 'c1', label: '创作活动', value: '1', type: 'task_category', sort: 1, isDefault: false, status: '正常', updatedAt: TS },
  { key: 'c2', label: '互动活动', value: '2', type: 'task_category', sort: 2, isDefault: false, status: '正常', updatedAt: TS },
  { key: 'c3', label: '打卡活动', value: '3', type: 'task_category', sort: 3, isDefault: false, status: '正常', updatedAt: TS },
  { key: 'p1', label: '小红书', value: 'xhs', type: 'task_platform', sort: 1, isDefault: true, status: '正常', updatedAt: TS },
  { key: 'p2', label: '抖音', value: 'douyin', type: 'task_platform', sort: 2, isDefault: false, status: '正常', updatedAt: TS },
  { key: 'p3', label: '视频号', value: 'channels', type: 'task_platform', sort: 3, isDefault: false, status: '正常', updatedAt: TS },
  { key: 'f1', label: '图文', value: 'image_text', type: 'task_content_form', sort: 1, isDefault: false, status: '正常', updatedAt: TS },
  { key: 'f2', label: '视频', value: 'video', type: 'task_content_form', sort: 2, isDefault: false, status: '正常', updatedAt: TS },
  { key: 'b1', label: '充足', value: 'enough', type: 'task_budget_status', sort: 1, isDefault: false, status: '正常', updatedAt: TS },
  { key: 'b2', label: '紧张', value: 'tight', type: 'task_budget_status', sort: 2, isDefault: false, status: '正常', updatedAt: TS },
  { key: 'b3', label: '耗尽', value: 'exhausted', type: 'task_budget_status', sort: 3, isDefault: false, status: '正常', updatedAt: TS },
  { key: 'ct1', label: '图文', value: '1', type: 'content_type', sort: 1, isDefault: false, status: '正常', updatedAt: TS2 },
  { key: 'ct2', label: '视频', value: '2', type: 'content_type', sort: 2, isDefault: false, status: '正常', updatedAt: TS2 },
  { key: 'v1', label: '是', value: '1', type: 'is_viral', sort: 1, isDefault: false, status: '正常', updatedAt: TS2 },
  { key: 'v2', label: '否', value: '0', type: 'is_viral', sort: 2, isDefault: true, status: '正常', updatedAt: TS2 },
  { key: 'pl1', label: '小红书', value: 'xhs', type: 'platform', sort: 1, isDefault: false, status: '正常', updatedAt: TS2 },
  { key: 'pl2', label: '抖音', value: 'douyin', type: 'platform', sort: 2, isDefault: false, status: '正常', updatedAt: TS2 },
  { key: 'tt1', label: '种草', value: 'seed', type: 'task_type', sort: 1, isDefault: false, status: '正常', updatedAt: TS2 },
  { key: 'tt2', label: '展示', value: 'show', type: 'task_type', sort: 2, isDefault: false, status: '正常', updatedAt: TS2 },
  { key: 's1', label: '未开始', value: 'pending', type: 'task_status', sort: 1, isDefault: false, status: '正常', updatedAt: TS },
  { key: 's2', label: '进行中', value: 'running', type: 'task_status', sort: 2, isDefault: true, status: '正常', updatedAt: TS },
  { key: 's3', label: '已结束', value: 'ended', type: 'task_status', sort: 3, isDefault: false, status: '正常', updatedAt: TS },
  { key: 'g1', label: '男', value: 'male', type: 'user_gender', sort: 1, isDefault: false, status: '正常', updatedAt: TS3 },
  { key: 'g2', label: '女', value: 'female', type: 'user_gender', sort: 2, isDefault: false, status: '正常', updatedAt: TS3 },
  { key: 'g3', label: '未知', value: 'unknown', type: 'user_gender', sort: 3, isDefault: true, status: '正常', updatedAt: TS3 },
];
