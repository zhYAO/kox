export type TaskCenterStatus = '待开始' | '进行中' | '已结束' | '已取消' | '已暂停';
export type TaskCenterCategory = '创作活动' | '互动活动' | '打卡活动';
export type TaskBudgetStatus = '充足' | '紧张' | '耗尽';

export type TaskCenterRecord = {
  key: string;
  taskId: string;
  name: string;
  category: TaskCenterCategory;
  status: TaskCenterStatus;
  platforms: string[];
  contentForms: string[];
  audienceCount: number;
  participantLimit: number;
  signupCount: number;
  submittedCount: number;
  firstPassCount: number;
  publishTime: string;
  productName: string;
  description: string;
  coverColor: string;
  startTime: string;
  endTime: string;
  execCycle: number;
  fermentCycle: number;
  appealCycle: number;
  postRequirement: string;
  activityNote: string;
  requiredTopic: string;
  copyTopicEnabled: boolean;
  contentDescs: { title: string; content: string }[];
  pointTiming: string;
  contentPoints: number;
  accountLimit?: number | null;
  basePointCode: string;
  needGift: boolean;
  totalBudget: number;
  budgetMonth: string;
  budgetAlert: boolean;
  pushScope: '全部' | 'AI人群';
  needContentGen: boolean;
  aiContentEnabled: boolean;
  contentTemplate: string;
  createRequirement: string;
  needMaterial: boolean;
  budgetStatus: TaskBudgetStatus;
  signupProgress: number;
};

export const TASK_CATEGORY_OPTIONS = [
  { label: '全部类别', value: '' },
  { label: '创作活动', value: '创作活动' },
  { label: '互动活动', value: '互动活动' },
  { label: '打卡活动', value: '打卡活动' },
];

export const TASK_STATUS_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '待开始', value: '待开始' },
  { label: '进行中', value: '进行中' },
  { label: '已结束', value: '已结束' },
  { label: '已取消', value: '已取消' },
  { label: '已暂停', value: '已暂停' },
];

export const TASK_PLATFORM_OPTIONS = [
  { label: '全部平台', value: '' },
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '快手', value: '快手' },
  { label: 'B站', value: 'B站' },
];

export const TASK_CONTENT_FORM_OPTIONS = [
  { label: '全部形式', value: '' },
  { label: '图文', value: '图文' },
  { label: '视频', value: '视频' },
];

export const TASK_BUDGET_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '充足', value: '充足' },
  { label: '紧张', value: '紧张' },
  { label: '耗尽', value: '耗尽' },
];

export const POINT_TIMING_OPTIONS = [
  { label: 'T+0（审核通过立即到账）', value: 'T+0（审核通过立即到账）' },
  { label: 'T+1（次日结算）', value: 'T+1（次日结算）' },
  { label: '活动结束后统一发放', value: '活动结束后统一发放' },
];

const baseTask = (
  partial: Partial<TaskCenterRecord> & Pick<TaskCenterRecord, 'key' | 'taskId' | 'name' | 'status'>,
): TaskCenterRecord => ({
  category: '创作活动',
  platforms: ['小红书', '抖音'],
  contentForms: ['图文', '视频'],
  audienceCount: 3,
  participantLimit: 100,
  signupCount: 45,
  submittedCount: 28,
  firstPassCount: 20,
  publishTime: '2026-07-01 10:00:00',
  productName: '华耐家居',
  description:
    '邀请用户到店体验华耐家居实景空间，并在社媒分享图文/视频种草内容，完成互动目标可获得积分奖励。',
  coverColor: '#1677ff',
  startTime: '2026-07-01 00:00:00',
  endTime: '2026-08-31 23:59:59',
  execCycle: 7,
  fermentCycle: 7,
  appealCycle: 3,
  postRequirement: '内容需原创，禁止搬运，客观分享真实体验。',
  activityNote: '活动期间发布并达到互动目标可获得积分奖励。',
  requiredTopic: '#华耐家居',
  copyTopicEnabled: true,
  contentDescs: [
    {
      title: '图文笔记要求',
      content: '图文笔记：≥3张高清实拍图 + ≥200字原创体验文案，图片清晰无水印，文案真实有细节。',
    },
    {
      title: '视频笔记要求',
      content: '视频笔记：≥30秒，画面稳定清晰',
    },
  ],
  pointTiming: 'T+0（审核通过立即到账）',
  contentPoints: 200,
  accountLimit: null,
  basePointCode: 'hjj',
  needGift: false,
  totalBudget: 40000,
  budgetMonth: '2026-07',
  budgetAlert: false,
  pushScope: '全部',
  needContentGen: true,
  aiContentEnabled: true,
  contentTemplate: '华耐家居实景体验馆\n到店打卡分享真实装修灵感，赢取积分奖励。',
  createRequirement: '',
  needMaterial: false,
  budgetStatus: '充足',
  signupProgress: 45,
  ...partial,
});

let TASK_STORE: TaskCenterRecord[] = [
  baseTask({
    key: '1',
    taskId: '150200108708',
    name: '华耐家居种草活动_demo_副本1',
    status: '进行中',
    signupCount: 62,
    submittedCount: 41,
    firstPassCount: 33,
    signupProgress: 62,
  }),
  baseTask({
    key: '2',
    taskId: '150200108701',
    name: '华耐家居种草活动_demo',
    status: '进行中',
    publishTime: '2026-06-28 09:30:00',
    signupCount: 55,
    submittedCount: 36,
    firstPassCount: 29,
    signupProgress: 55,
  }),
  baseTask({
    key: '3',
    taskId: '150200100112',
    name: '问界M7春季体验种草',
    status: '待开始',
    category: '互动活动',
    productName: '问界M7',
    platforms: ['小红书'],
    contentForms: ['图文'],
    publishTime: '2026-08-05 12:00:00',
    startTime: '2026-08-10 00:00:00',
    endTime: '2026-09-10 23:59:59',
    signupCount: 0,
    submittedCount: 0,
    firstPassCount: 0,
    signupProgress: 0,
    requiredTopic: '#问界M7',
    basePointCode: 'm7',
    totalBudget: 50000,
  }),
  baseTask({
    key: '4',
    taskId: '150200099001',
    name: '帮宝适母爱瞬间分享',
    status: '已结束',
    category: '打卡活动',
    productName: '帮宝适',
    platforms: ['小红书', '抖音'],
    publishTime: '2026-05-01 10:00:00',
    startTime: '2026-05-01 00:00:00',
    endTime: '2026-06-01 23:59:59',
    signupCount: 180,
    submittedCount: 150,
    firstPassCount: 120,
    signupProgress: 100,
    budgetStatus: '耗尽',
    requiredTopic: '#帮宝适',
    basePointCode: 'bb',
  }),
  baseTask({
    key: '5',
    taskId: '150200088221',
    name: '门店接待内容征集',
    status: '已取消',
    category: '创作活动',
    publishTime: '2026-04-12 14:20:00',
    signupCount: 12,
    submittedCount: 3,
    firstPassCount: 1,
    signupProgress: 12,
    budgetStatus: '紧张',
  }),
  baseTask({
    key: '6',
    taskId: '150200077110',
    name: '新色到店实拍挑战',
    status: '已结束',
    publishTime: '2026-03-01 09:00:00',
    startTime: '2026-03-01 00:00:00',
    endTime: '2026-03-31 23:59:59',
    signupCount: 90,
    submittedCount: 70,
    firstPassCount: 58,
    signupProgress: 90,
  }),
  baseTask({
    key: '7',
    taskId: '150200066009',
    name: '暑期亲子出行专题',
    status: '已结束',
    category: '互动活动',
    publishTime: '2026-02-01 11:00:00',
    signupCount: 110,
    submittedCount: 88,
    firstPassCount: 70,
    signupProgress: 100,
  }),
  baseTask({
    key: '8',
    taskId: '150200055008',
    name: '智驾体验短视频征集',
    status: '已暂停',
    category: '创作活动',
    platforms: ['抖音'],
    contentForms: ['视频'],
    publishTime: '2026-07-15 16:00:00',
    signupCount: 30,
    submittedCount: 12,
    firstPassCount: 8,
    signupProgress: 30,
    budgetStatus: '紧张',
  }),
];

// pad to ~115-like feel with generated ended tasks
for (let i = 9; i <= 20; i += 1) {
  TASK_STORE.push(
    baseTask({
      key: String(i),
      taskId: `15020010${8000 + i}`,
      name: `历史活动任务_${i}`,
      status: '已结束',
      publishTime: `2025-${String((i % 12) + 1).padStart(2, '0')}-10 10:00:00`,
      signupCount: 40 + i,
      submittedCount: 20 + i,
      firstPassCount: 10 + i,
      signupProgress: 100,
    }),
  );
}

export function getTaskCenterList() {
  return TASK_STORE;
}

export function setTaskCenterList(next: TaskCenterRecord[]) {
  TASK_STORE = next;
}

export function getTaskById(id: string) {
  return TASK_STORE.find((t) => t.key === id || t.taskId === id);
}

export function upsertTask(task: TaskCenterRecord) {
  const idx = TASK_STORE.findIndex((t) => t.key === task.key);
  if (idx >= 0) {
    TASK_STORE = [...TASK_STORE.slice(0, idx), task, ...TASK_STORE.slice(idx + 1)];
  } else {
    TASK_STORE = [task, ...TASK_STORE];
  }
}

export function removeTask(key: string) {
  TASK_STORE = TASK_STORE.filter((t) => t.key !== key);
}

export function statusColor(status: TaskCenterStatus) {
  if (status === '进行中') return 'success';
  if (status === '待开始') return 'processing';
  if (status === '已暂停') return 'warning';
  return 'default';
}

export function summarizeTasks(list: TaskCenterRecord[]) {
  const total = list.length;
  const pending = list.filter((i) => i.status === '待开始').length;
  const running = list.filter((i) => i.status === '进行中').length;
  const ended = list.filter((i) => i.status === '已结束').length;
  const pct = (n: number) => (total ? ((n / total) * 100).toFixed(1) : '0.0');
  return {
    total,
    pending,
    running,
    ended,
    pendingPct: pct(pending),
    runningPct: pct(running),
    endedPct: pct(ended),
  };
}

export function createEmptyTask(): TaskCenterRecord {
  return baseTask({
    key: `${Date.now()}`,
    taskId: `15${Date.now().toString().slice(-10)}`,
    name: '',
    status: '待开始',
    publishTime: '',
    signupCount: 0,
    submittedCount: 0,
    firstPassCount: 0,
    signupProgress: 0,
  });
}
