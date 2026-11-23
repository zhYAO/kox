export type DisplayTaskStatus = '草稿' | '进行中' | '已结束' | '已发布';
export type DisplayTaskPlatform = '抖音' | '小红书' | '视频号';

export type DisplayTask = {
  key: string;
  taskId: string;
  name: string;
  remark: string;
  status: DisplayTaskStatus;
  platform: DisplayTaskPlatform;
  collectCycle: number;
  matchedPosts: number;
  publishTime: string;
  startTime: string;
  endTime: string;
  topic: string;
  requiredTopic: string;
  coverColor: string;
  moduleTitle: string;
  ruleDesc: string;
  steps: string[];
  statementTitle: string;
  statementDesc: string;
  audience: string;
};

export const DISPLAY_PLATFORM_OPTIONS = [
  { label: '全部平台', value: '' },
  { label: '抖音', value: '抖音' },
  { label: '小红书', value: '小红书' },
  { label: '视频号', value: '视频号' },
];

export const DISPLAY_STATUS_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '草稿', value: '草稿' },
  { label: '进行中', value: '进行中' },
  { label: '已发布', value: '已发布' },
  { label: '已结束', value: '已结束' },
];

export const DISPLAY_TOPIC_OPTIONS = [
  { label: '品牌种草', value: '品牌种草' },
  { label: '门店体验', value: '门店体验' },
  { label: '新品曝光', value: '新品曝光' },
  { label: '测试', value: '测试' },
];

export const DISPLAY_AUDIENCE_OPTIONS = [
  { label: '全部 KOX', value: '全部 KOX' },
  { label: '华东导购组', value: '华东导购组' },
  { label: '华南督导组', value: '华南督导组' },
  { label: '华北投放人群', value: '华北投放人群' },
];

export const MOCK_DISPLAY_TASKS: DisplayTask[] = [
  {
    key: '1',
    taskId: 'DT1782105587567',
    name: '测试-副本',
    remark: '测试',
    status: '已结束',
    platform: '抖音',
    collectCycle: 1,
    matchedPosts: 0,
    publishTime: '2026-06-22 13:44',
    startTime: '2026-06-17 00:00',
    endTime: '2026-06-24 00:00',
    topic: '测试',
    requiredTopic: '测试',
    coverColor: '#faad14',
    moduleTitle: '测试',
    ruleDesc: '测试',
    steps: ['测试12'],
    statementTitle: '任务说明',
    statementDesc: '此活动无需手动报名参与',
    audience: '全部 KOX',
  },
  {
    key: '2',
    taskId: 'DT1782100473222',
    name: '测试',
    remark: '测试',
    status: '草稿',
    platform: '抖音',
    collectCycle: 1,
    matchedPosts: 0,
    publishTime: '2026-06-22 11:54',
    startTime: '2026-06-23 00:00',
    endTime: '2026-06-24 00:00',
    topic: '测试',
    requiredTopic: '测试',
    coverColor: '#1677ff',
    moduleTitle: '测试模块',
    ruleDesc: '按要求发布内容',
    steps: ['打开抖音', '发布指定话题内容'],
    statementTitle: '',
    statementDesc: '',
    audience: '华东导购组',
  },
  {
    key: '3',
    taskId: 'DT1782110028841',
    name: '问界M7春季体验展示',
    remark: '无积分展示采集',
    status: '进行中',
    platform: '小红书',
    collectCycle: 1,
    matchedPosts: 128,
    publishTime: '2026-07-10 09:30',
    startTime: '2026-07-10 00:00',
    endTime: '2026-08-10 23:59',
    topic: '品牌种草',
    requiredTopic: '#问界M7 #春季体验',
    coverColor: '#722ed1',
    moduleTitle: '体验规则',
    ruleDesc: '发布真实试驾体验内容，需包含指定话题',
    steps: ['完成试驾', '发布笔记并带话题', '等待系统采集'],
    statementTitle: '参与说明',
    statementDesc: '此活动无需手动报名参与，发布即采集',
    audience: '全部 KOX',
  },
  {
    key: '4',
    taskId: 'DT1782115566012',
    name: '门店接待内容展示采',
    remark: '门店场景',
    status: '已发布',
    platform: '视频号',
    collectCycle: 3,
    matchedPosts: 56,
    publishTime: '2026-07-20 15:20',
    startTime: '2026-07-21 00:00',
    endTime: '2026-08-21 00:00',
    topic: '门店体验',
    requiredTopic: '#门店接待 #到店体验',
    coverColor: '#13c2c2',
    moduleTitle: '门店内容规范',
    ruleDesc: '展示门店接待与到店礼遇',
    steps: ['拍摄门店环境', '发布并带话题'],
    statementTitle: '温馨提示',
    statementDesc: '请勿发布与品牌无关内容',
    audience: '华南督导组',
  },
  {
    key: '5',
    taskId: 'DT1782120033445',
    name: '新品色系曝光展示',
    remark: '新色专题',
    status: '进行中',
    platform: '抖音',
    collectCycle: 1,
    matchedPosts: 89,
    publishTime: '2026-07-28 10:00',
    startTime: '2026-07-28 00:00',
    endTime: '2026-08-28 00:00',
    topic: '新品曝光',
    requiredTopic: '#新色到店 #实拍',
    coverColor: '#eb2f96',
    moduleTitle: '拍摄要求',
    ruleDesc: '需包含车身新色实拍镜头',
    steps: ['到店拍摄', '发布短视频', '等待采集回传'],
    statementTitle: '',
    statementDesc: '',
    audience: '华北投放人群',
  },
];

export function displayStatusColor(status: DisplayTaskStatus) {
  if (status === '进行中' || status === '已发布') return 'processing';
  if (status === '已结束') return 'default';
  return 'warning';
}

export function genDisplayTaskId() {
  return `DT${Date.now()}`;
}
