export type VideoTaskStatus = '草稿' | '处理中' | '已完成' | '已归档';

export type VideoTask = {
  key: string;
  name: string;
  description: string;
  status: VideoTaskStatus;
  progress: number;
  materialCount: number;
  updateTime: string;
  updateLabel: string;
  scriptReady?: boolean;
};

export const STATUS_FILTER_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '草稿', value: '草稿' },
  { label: '处理中', value: '处理中' },
  { label: '已完成', value: '已完成' },
  { label: '已归档', value: '已归档' },
];

export const WORKSPACE_MENUS = [
  { key: 'vision', label: '画面识别' },
  { key: 'subtitle', label: '字幕提取' },
  { key: 'script', label: '脚本生成' },
  { key: 'mix', label: '视频混剪' },
] as const;

export const CREATE_STEPS = [
  { key: 'select', title: '选择视频' },
  { key: 'analyze', title: '分析内容' },
  { key: 'script', title: '编辑脚本' },
] as const;

export const MOCK_VIDEO_TASKS: VideoTask[] = [
  {
    key: 'v1',
    name: '我爱我家demo',
    description: '房源口播视频',
    status: '已完成',
    progress: 100,
    materialCount: 1,
    updateTime: '2026/6/26',
    updateLabel: '2026/6/26',
    scriptReady: true,
  },
  {
    key: 'v2',
    name: 'test2',
    description: '暂无描述',
    status: '已完成',
    progress: 100,
    materialCount: 1,
    updateTime: '2026/6/26',
    updateLabel: '2 天前',
  },
  {
    key: 'v3',
    name: '感冒灵koc',
    description: '暂无描述',
    status: '已完成',
    progress: 100,
    materialCount: 1,
    updateTime: '2026/6/20',
    updateLabel: '2026/6/20',
  },
  {
    key: 'v4',
    name: '沃尔沃测试',
    description: '暂无描述',
    status: '已完成',
    progress: 100,
    materialCount: 1,
    updateTime: '2026/7/14',
    updateLabel: '2026/7/14',
  },
  {
    key: 'v5',
    name: '春季新品混剪',
    description: '美妆口播混剪',
    status: '处理中',
    progress: 50,
    materialCount: 1,
    updateTime: '2026/7/28',
    updateLabel: '今天',
  },
  {
    key: 'v6',
    name: '问界M7试驾',
    description: '试驾路况素材',
    status: '已完成',
    progress: 100,
    materialCount: 2,
    updateTime: '2026/7/10',
    updateLabel: '2026/7/10',
  },
  {
    key: 'v7',
    name: '尚界H5门店',
    description: '门店活动成片',
    status: '已完成',
    progress: 100,
    materialCount: 1,
    updateTime: '2026/7/02',
    updateLabel: '2026/7/02',
  },
  {
    key: 'v8',
    name: '享界S9T行政舱',
    description: '商务场景口播',
    status: '已完成',
    progress: 100,
    materialCount: 1,
    updateTime: '2026/6/18',
    updateLabel: '2026/6/18',
  },
];

let runtimeTasks: VideoTask[] = [...MOCK_VIDEO_TASKS];

export function getVideoTasks() {
  return runtimeTasks;
}

export function setVideoTasks(next: VideoTask[]) {
  runtimeTasks = next;
}

export function findVideoTask(key?: string) {
  if (!key) return runtimeTasks[0];
  return runtimeTasks.find((item) => item.key === key) || runtimeTasks[0];
}

export function statusColor(status: VideoTaskStatus) {
  if (status === '已完成') return 'success';
  if (status === '处理中') return 'processing';
  if (status === '草稿') return 'default';
  return 'warning';
}

export function countByStatus(tasks: VideoTask[]) {
  return {
    all: tasks.length,
    草稿: tasks.filter((t) => t.status === '草稿').length,
    处理中: tasks.filter((t) => t.status === '处理中').length,
    已完成: tasks.filter((t) => t.status === '已完成').length,
    已归档: tasks.filter((t) => t.status === '已归档').length,
  };
}
