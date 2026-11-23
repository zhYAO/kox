export type OpsTaskStatus = '待下发' | '待发布' | '发布中' | '已完成' | '已取消';
export type OpsTaskType = '营销类' | '培训类' | '日常运营';
export type OpsMaterialType = '图文任务' | '视频任务' | '混剪任务';
export type OpsPlatform = '小红书' | '抖音' | '视频号' | '懂车帝';
export type OpsAuditStatus = '待审核' | '部分审核' | '已审核';

export type OpsTask = {
  key: string;
  name: string;
  type: OpsTaskType;
  materialType: OpsMaterialType;
  platform: OpsPlatform;
  description: string;
  productName: string;
  staffCount: number;
  editedCount: number;
  publishedCount: number;
  auditedCount: number;
  pendingAuditCount: number;
  issueTime: string;
  planIssueTime: string;
  deadline: string;
  status: OpsTaskStatus;
  auditStatus: OpsAuditStatus;
};

export type OpsStaff = {
  key: string;
  name: string;
  group: string;
  gender: '男' | '女';
  ageGroup: string;
  interests: string[];
};

export const OPS_TYPE_OPTIONS = [
  { label: '全部类型', value: '' },
  { label: '营销类', value: '营销类' },
  { label: '培训类', value: '培训类' },
  { label: '日常运营', value: '日常运营' },
];

export const OPS_MATERIAL_OPTIONS = [
  { label: '全部内容', value: '' },
  { label: '图文任务', value: '图文任务' },
  { label: '视频任务', value: '视频任务' },
  { label: '混剪任务', value: '混剪任务' },
];

export const OPS_STATUS_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '待下发', value: '待下发' },
  { label: '待发布', value: '待发布' },
  { label: '发布中', value: '发布中' },
  { label: '已完成', value: '已完成' },
  { label: '已取消', value: '已取消' },
];

export const OPS_PLATFORM_OPTIONS = [
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '视频号', value: '视频号' },
  { label: '懂车帝', value: '懂车帝' },
];

export const OPS_AUDIT_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '待审核', value: '待审核' },
  { label: '部分审核', value: '部分审核' },
  { label: '已审核', value: '已审核' },
];

export const OPS_ISSUE_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '待下发', value: '待下发' },
  { label: '待发布', value: '待发布' },
  { label: '发布中', value: '发布中' },
  { label: '已完成', value: '已完成' },
];

export function opsStatusColor(status: OpsTaskStatus) {
  if (status === '已完成') return 'success';
  if (status === '发布中') return 'processing';
  if (status === '待发布') return 'warning';
  if (status === '已取消') return 'default';
  return 'blue';
}

export const MOCK_OPS_TASKS: OpsTask[] = [
  {
    key: 'o1',
    name: '问界M7 夏季试驾种草',
    type: '营销类',
    materialType: '图文任务',
    platform: '小红书',
    description: '门店导购围绕试驾体验产出图文笔记',
    productName: '问界M7',
    staffCount: 48,
    editedCount: 36,
    publishedCount: 28,
    auditedCount: 22,
    pendingAuditCount: 6,
    issueTime: '2026-07-10 10:00:00',
    planIssueTime: '2026-07-10 09:30:00',
    deadline: '2026-07-25 23:59:59',
    status: '发布中',
    auditStatus: '部分审核',
  },
  {
    key: 'o2',
    name: '尚界H5 家庭出行共创',
    type: '营销类',
    materialType: '视频任务',
    platform: '抖音',
    description: '周末家庭出游场景短视频',
    productName: '尚界H5',
    staffCount: 32,
    editedCount: 32,
    publishedCount: 30,
    auditedCount: 30,
    pendingAuditCount: 0,
    issueTime: '2026-06-18 14:20:00',
    planIssueTime: '2026-06-18 14:00:00',
    deadline: '2026-07-01 23:59:59',
    status: '已完成',
    auditStatus: '已审核',
  },
  {
    key: 'o3',
    name: '618 门店促销话术演练',
    type: '培训类',
    materialType: '图文任务',
    platform: '视频号',
    description: '促销话术图文模板下发与演练',
    productName: '门店通用',
    staffCount: 60,
    editedCount: 12,
    publishedCount: 0,
    auditedCount: 0,
    pendingAuditCount: 12,
    issueTime: '2026-07-28 09:00:00',
    planIssueTime: '2026-07-28 08:30:00',
    deadline: '2026-08-05 23:59:59',
    status: '待发布',
    auditStatus: '待审核',
  },
  {
    key: 'o4',
    name: '享界S9T 商务场景口播',
    type: '营销类',
    materialType: '混剪任务',
    platform: '抖音',
    description: '行政座舱口播混剪素材包',
    productName: '享界S9T',
    staffCount: 20,
    editedCount: 0,
    publishedCount: 0,
    auditedCount: 0,
    pendingAuditCount: 0,
    issueTime: '-',
    planIssueTime: '2026-08-05 10:00:00',
    deadline: '2026-08-20 23:59:59',
    status: '待下发',
    auditStatus: '待审核',
  },
  {
    key: 'o5',
    name: '智界R7 智驾体验打卡',
    type: '日常运营',
    materialType: '视频任务',
    platform: '懂车帝',
    description: '智驾路况体验短视频打卡',
    productName: '智界R7',
    staffCount: 25,
    editedCount: 18,
    publishedCount: 15,
    auditedCount: 10,
    pendingAuditCount: 5,
    issueTime: '2026-07-15 11:10:00',
    planIssueTime: '2026-07-15 11:00:00',
    deadline: '2026-07-30 23:59:59',
    status: '发布中',
    auditStatus: '部分审核',
  },
  {
    key: 'o6',
    name: '门店周报内容规范培训',
    type: '培训类',
    materialType: '图文任务',
    platform: '小红书',
    description: '内容规范与违规案例说明',
    productName: '内容规范',
    staffCount: 40,
    editedCount: 40,
    publishedCount: 40,
    auditedCount: 40,
    pendingAuditCount: 0,
    issueTime: '2026-05-08 16:00:00',
    planIssueTime: '2026-05-08 15:30:00',
    deadline: '2026-05-15 23:59:59',
    status: '已完成',
    auditStatus: '已审核',
  },
];

export const MOCK_OPS_STAFF: OpsStaff[] = [
  { key: 's1', name: '王导购', group: '华东一组', gender: '女', ageGroup: '25-34', interests: ['美妆', '生活方式'] },
  { key: 's2', name: '李顾问', group: '华东一组', gender: '男', ageGroup: '25-34', interests: ['数码', '时尚'] },
  { key: 's3', name: '陈店员', group: '华南二组', gender: '女', ageGroup: '18-24', interests: ['时尚', '美食'] },
  { key: 's4', name: '赵经理', group: '华北一组', gender: '男', ageGroup: '35-44', interests: ['数码'] },
  { key: 's5', name: '周导购', group: '西南一组', gender: '女', ageGroup: '25-34', interests: ['母婴', '生活方式'] },
  { key: 's6', name: '吴顾问', group: '总部一组', gender: '女', ageGroup: '25-34', interests: ['美妆', '时尚'] },
  { key: 's7', name: '郑店员', group: '华南二组', gender: '男', ageGroup: '18-24', interests: ['美食', '数码'] },
  { key: 's8', name: '孙导购', group: '华东二组', gender: '女', ageGroup: '35-44', interests: ['母婴'] },
];

export const INTEREST_GROUPS = ['美妆', '时尚', '美食', '生活方式', '母婴', '数码'];

export type OpsAuditItemStatus = '待审核' | '已通过' | '已驳回';

export type OpsAuditItem = {
  key: string;
  staffName: string;
  taskName: string;
  taskKey: string;
  group: string;
  status: OpsAuditItemStatus;
  title: string;
  content: string;
  opinion: string;
  cover: string;
  mediaCount: number;
  mediaType: '图文' | '视频';
};

function coverSvg(index: number, title: string) {
  const colors = ['#1677ff', '#eb2f96', '#13c2c2', '#fa8c16', '#722ed1'];
  const color = colors[index % colors.length];
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80">
      <rect width="120" height="80" fill="${color}"/>
      <text x="10" y="48" fill="#fff" font-size="12" font-family="Arial">${title.slice(0, 6)}</text>
    </svg>`,
  );
  return `data:image/svg+xml,${svg}`;
}

export const MOCK_OPS_AUDIT_ITEMS: OpsAuditItem[] = [
  {
    key: 'a1',
    staffName: '王导购',
    taskName: '问界M7 夏季试驾种草',
    taskKey: 'o1',
    group: '华东一组',
    status: '待审核',
    title: '周末带娃试驾问界M7，空间真香',
    content: '后排很宽敞，智驾辅助也很稳，适合家庭出行。#问界M7 #试驾',
    opinion: '-',
    cover: coverSvg(0, '试驾'),
    mediaCount: 4,
    mediaType: '图文',
  },
  {
    key: 'a2',
    staffName: '李顾问',
    taskName: '问界M7 夏季试驾种草',
    taskKey: 'o1',
    group: '华东一组',
    status: '待审核',
    title: '雨天开了一圈，跟车很稳',
    content: '城区快速路实测，变道提示清晰，新手也能上手。',
    opinion: '-',
    cover: coverSvg(1, '雨天'),
    mediaCount: 3,
    mediaType: '图文',
  },
  {
    key: 'a3',
    staffName: '陈店员',
    taskName: '618 门店促销话术演练',
    taskKey: 'o3',
    group: '华南二组',
    status: '待审核',
    title: '618 到店礼遇怎么说更自然',
    content: '分享一套不硬广的到店邀约话术，客户接受度更高。',
    opinion: '-',
    cover: coverSvg(2, '话术'),
    mediaCount: 2,
    mediaType: '图文',
  },
  {
    key: 'a4',
    staffName: '周导购',
    taskName: '智界R7 智驾体验打卡',
    taskKey: 'o5',
    group: '西南一组',
    status: '待审核',
    title: '智驾新手村打卡 Day1',
    content: '第一次开智驾，提示很友好，晚高峰也不慌。',
    opinion: '-',
    cover: coverSvg(3, '智驾'),
    mediaCount: 1,
    mediaType: '视频',
  },
  {
    key: 'a5',
    staffName: '吴顾问',
    taskName: '智界R7 智驾体验打卡',
    taskKey: 'o5',
    group: '总部一组',
    status: '待审核',
    title: '高速路段智驾体验分享',
    content: '巡航跟车丝滑，出口提醒及时，推荐给通勤党。',
    opinion: '-',
    cover: coverSvg(4, '高速'),
    mediaCount: 1,
    mediaType: '视频',
  },
  {
    key: 'a6',
    staffName: '赵经理',
    taskName: '尚界H5 家庭出行共创',
    taskKey: 'o2',
    group: '华北一组',
    status: '已通过',
    title: '全家周末出城一台就够',
    content: '后备箱能塞下推车和露营椅，续航也够往返。',
    opinion: '内容完整，通过',
    cover: coverSvg(0, '家庭'),
    mediaCount: 5,
    mediaType: '图文',
  },
  {
    key: 'a7',
    staffName: '郑店员',
    taskName: '问界M7 夏季试驾种草',
    taskKey: 'o1',
    group: '华南二组',
    status: '已驳回',
    title: '随便开开感觉还行',
    content: '内容过于简单，缺少卖点说明。',
    opinion: '请补充车型卖点与实拍',
    cover: coverSvg(1, '驳回'),
    mediaCount: 1,
    mediaType: '图文',
  },
];

let runtimeAuditItems = [...MOCK_OPS_AUDIT_ITEMS];

export function getOpsAuditItems() {
  return runtimeAuditItems;
}

export function setOpsAuditItems(next: OpsAuditItem[]) {
  runtimeAuditItems = next;
}

export function calcOpsStats(tasks: OpsTask[]) {
  return {
    total: tasks.length,
    pendingIssue: tasks.filter((t) => t.status === '待下发').length,
    pendingPublish: tasks.filter((t) => t.status === '待发布').length,
    publishing: tasks.filter((t) => t.status === '发布中').length,
    completed: tasks.filter((t) => t.status === '已完成').length,
  };
}

let runtimeTasks = [...MOCK_OPS_TASKS];

export function getOpsTasks() {
  return runtimeTasks;
}

export function setOpsTasks(next: OpsTask[]) {
  runtimeTasks = next;
}
