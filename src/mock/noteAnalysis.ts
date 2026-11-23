export type NotePlatform = '小红书' | '抖音' | '视频号' | '懂车帝';
export type NoteTaskType = '创作活动' | '展示性任务' | '门店试驾';
export type NoteContentForm = '图文' | '视频' | '图文+视频';
export type NoteActivityStatus = '进行中' | '已结束' | '已取消';
export type NoteExecStatus = '待提交' | '待审核' | '已通过' | '已驳回' | '已完成';
export type NoteBoostStatus = '未投流' | '投流中' | '已投流';
export type NoteDeliverStatus = '未投递' | '已投递' | '投递失败';

export type NoteAnalysisRecord = {
  key: string;
  index: number;
  taskId: string;
  taskName: string;
  koxId: string;
  taskType: NoteTaskType;
  topic: string;
  koxName: string;
  phone: string;
  office: string;
  track: string;
  ownerTags: string[];
  platform: NotePlatform;
  boostStatus: NoteBoostStatus;
  contentForm: NoteContentForm;
  activityStatus: NoteActivityStatus;
  execStatus: NoteExecStatus;
  publishTime: string;
  endTime: string;
  linkSubmitTime: string;
  keywords: string;
  appealCount: number;
  appealContent: string;
  appealResult: string;
  finalStatusTime: string;
  opLog: string;
  totalPoints: number;
  firstReviewPoints: number;
  firstReviewCode: string;
  secondReviewPoints: number;
  secondReviewCode: string;
  manualPoints: number;
  deliverStatus: NoteDeliverStatus;
  likes: number;
  collects: number;
  comments: number;
  reads: number;
  consults: number;
  viral: boolean;
};

export const NOTE_CONTENT_FORM_OPTIONS = [
  { label: '全部', value: '' },
  { label: '图文', value: '图文' },
  { label: '视频', value: '视频' },
  { label: '图文+视频', value: '图文+视频' },
];

export const NOTE_TASK_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '创作活动', value: '创作活动' },
  { label: '展示性任务', value: '展示性任务' },
  { label: '门店试驾', value: '门店试驾' },
];

export const NOTE_PLATFORM_OPTIONS = [
  { label: '全部', value: '' },
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '视频号', value: '视频号' },
  { label: '懂车帝', value: '懂车帝' },
];

export const NOTE_ACTIVITY_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '进行中', value: '进行中' },
  { label: '已结束', value: '已结束' },
  { label: '已取消', value: '已取消' },
];

export const NOTE_EXEC_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '待提交', value: '待提交' },
  { label: '待审核', value: '待审核' },
  { label: '已通过', value: '已通过' },
  { label: '已驳回', value: '已驳回' },
  { label: '已完成', value: '已完成' },
];

export function notePlatformColor(p: NotePlatform) {
  if (p === '小红书') return 'magenta';
  if (p === '抖音') return 'cyan';
  if (p === '视频号') return 'green';
  return 'gold';
}

export function formatNoteNumber(n: number) {
  if (n >= 10000) {
    const v = n / 10000;
    return `${v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')}万`;
  }
  return n.toLocaleString('zh-CN');
}

export const NOTE_AI_STEPS = [
  '正在读取笔记与任务数据...',
  '正在分析互动、爆文与咨询表现...',
  '正在识别优质笔记特征...',
  '正在总结内容运营建议...',
];

export const MOCK_NOTE_ANALYSIS: NoteAnalysisRecord[] = [
  {
    key: 'n1',
    index: 1,
    taskId: '142900106792',
    taskName: '帮宝适26年小红书种草',
    koxId: '8829101',
    taskType: '创作活动',
    topic: '帮宝适26年小红书种草',
    koxName: '晓雨💋',
    phone: '138****6521',
    office: '默认分组',
    track: '母婴',
    ownerTags: ['低互动', '小月龄周期（4-12月）'],
    platform: '小红书',
    boostStatus: '未投流',
    contentForm: '图文',
    activityStatus: '进行中',
    execStatus: '已完成',
    publishTime: '2026-06-18 20:12:33',
    endTime: '2026-07-18 23:59:59',
    linkSubmitTime: '2026-06-20 11:08:22',
    keywords: '帮宝适,纸尿裤',
    appealCount: 0,
    appealContent: '-',
    appealResult: '-',
    finalStatusTime: '2026-06-22 11:50:08',
    opLog: '2026-06-22 11:50:08 审核通过',
    totalPoints: 300,
    firstReviewPoints: 200,
    firstReviewCode: 'PT-BASE-01',
    secondReviewPoints: 100,
    secondReviewCode: 'PT-SEC-01',
    manualPoints: 0,
    deliverStatus: '已投递',
    likes: 1260,
    collects: 380,
    comments: 96,
    reads: 28600,
    consults: 18,
    viral: true,
  },
  {
    key: 'n2',
    index: 2,
    taskId: '142900106793',
    taskName: '问界M7春季体验种草',
    koxId: '7712044',
    taskType: '创作活动',
    topic: '问界M7春季体验',
    koxName: 'W.ym',
    phone: '186****9033',
    office: '华东代表处',
    track: '汽车',
    ownerTags: ['M7', '高互动'],
    platform: '抖音',
    boostStatus: '投流中',
    contentForm: '视频',
    activityStatus: '进行中',
    execStatus: '已通过',
    publishTime: '2026-05-02 19:40:11',
    endTime: '2026-06-02 23:59:59',
    linkSubmitTime: '2026-05-04 09:15:40',
    keywords: '问界M7,试驾',
    appealCount: 1,
    appealContent: '申请补发积分',
    appealResult: '通过',
    finalStatusTime: '2026-05-10 16:22:01',
    opLog: '2026-05-10 16:22:01 二审通过',
    totalPoints: 520,
    firstReviewPoints: 300,
    firstReviewCode: 'PT-BASE-08',
    secondReviewPoints: 200,
    secondReviewCode: 'PT-SEC-03',
    manualPoints: 20,
    deliverStatus: '已投递',
    likes: 9800,
    collects: 2100,
    comments: 640,
    reads: 186000,
    consults: 72,
    viral: true,
  },
  {
    key: 'n3',
    index: 3,
    taskId: '142900106794',
    taskName: '尚界H5家庭出行',
    koxId: '6633810',
    taskType: '创作活动',
    topic: '尚界H5家庭出行',
    koxName: '周末出逃计划',
    phone: '159****4412',
    office: '华南代表处',
    track: '汽车',
    ownerTags: ['认证车主', '种草'],
    platform: '小红书',
    boostStatus: '已投流',
    contentForm: '图文+视频',
    activityStatus: '已结束',
    execStatus: '已完成',
    publishTime: '2026-04-12 12:08:55',
    endTime: '2026-05-12 23:59:59',
    linkSubmitTime: '2026-04-14 18:33:09',
    keywords: '尚界H5,家庭',
    appealCount: 0,
    appealContent: '-',
    appealResult: '-',
    finalStatusTime: '2026-04-20 10:01:44',
    opLog: '2026-04-20 10:01:44 发放积分',
    totalPoints: 400,
    firstReviewPoints: 250,
    firstReviewCode: 'PT-BASE-02',
    secondReviewPoints: 150,
    secondReviewCode: 'PT-SEC-02',
    manualPoints: 0,
    deliverStatus: '已投递',
    likes: 4200,
    collects: 980,
    comments: 310,
    reads: 92000,
    consults: 41,
    viral: true,
  },
  {
    key: 'n4',
    index: 4,
    taskId: '142900106795',
    taskName: '享界S9T商务场景',
    koxId: '5521908',
    taskType: '展示性任务',
    topic: '享界S9T商务舱',
    koxName: '车生活阿凯',
    phone: '177****2288',
    office: '默认分组',
    track: '汽车',
    ownerTags: ['低互动'],
    platform: '懂车帝',
    boostStatus: '未投流',
    contentForm: '图文',
    activityStatus: '已结束',
    execStatus: '已驳回',
    publishTime: '2026-03-22 08:50:17',
    endTime: '2026-04-22 23:59:59',
    linkSubmitTime: '2026-03-25 14:12:36',
    keywords: '享界S9T',
    appealCount: 2,
    appealContent: '内容被误判驳回',
    appealResult: '驳回维持',
    finalStatusTime: '2026-03-28 09:40:12',
    opLog: '2026-03-28 09:40:12 申诉驳回',
    totalPoints: 0,
    firstReviewPoints: 0,
    firstReviewCode: '-',
    secondReviewPoints: 0,
    secondReviewCode: '-',
    manualPoints: 0,
    deliverStatus: '未投递',
    likes: 120,
    collects: 18,
    comments: 6,
    reads: 3600,
    consults: 0,
    viral: false,
  },
  {
    key: 'n5',
    index: 5,
    taskId: '142900106796',
    taskName: '智界R7智驾体验',
    koxId: '4410023',
    taskType: '门店试驾',
    topic: '智驾新手体验',
    koxName: '智驾新手村',
    phone: '135****7780',
    office: '华北代表处',
    track: '汽车',
    ownerTags: ['高互动', '测评'],
    platform: '抖音',
    boostStatus: '投流中',
    contentForm: '视频',
    activityStatus: '进行中',
    execStatus: '待审核',
    publishTime: '2026-07-08 21:05:49',
    endTime: '2026-08-08 23:59:59',
    linkSubmitTime: '2026-07-09 10:22:18',
    keywords: '智界R7,智驾',
    appealCount: 0,
    appealContent: '-',
    appealResult: '-',
    finalStatusTime: '2026-07-09 10:22:18',
    opLog: '2026-07-09 10:22:18 提交审核',
    totalPoints: 0,
    firstReviewPoints: 0,
    firstReviewCode: '-',
    secondReviewPoints: 0,
    secondReviewCode: '-',
    manualPoints: 0,
    deliverStatus: '未投递',
    likes: 3560,
    collects: 720,
    comments: 188,
    reads: 64000,
    consults: 29,
    viral: false,
  },
  {
    key: 'n6',
    index: 6,
    taskId: '142900106797',
    taskName: '华耐家居种草活动_demo',
    koxId: '3308811',
    taskType: '创作活动',
    topic: '家居焕新种草',
    koxName: '小城晚风记',
    phone: '151****3345',
    office: '默认分组',
    track: '家居',
    ownerTags: ['种草'],
    platform: '小红书',
    boostStatus: '未投流',
    contentForm: '图文',
    activityStatus: '进行中',
    execStatus: '已完成',
    publishTime: '2026-07-26 16:44:02',
    endTime: '2026-08-26 23:59:59',
    linkSubmitTime: '2026-07-27 12:10:55',
    keywords: '华耐,家居',
    appealCount: 0,
    appealContent: '-',
    appealResult: '-',
    finalStatusTime: '2026-07-28 15:18:33',
    opLog: '2026-07-28 15:18:33 基审通过',
    totalPoints: 260,
    firstReviewPoints: 260,
    firstReviewCode: 'PT-BASE-11',
    secondReviewPoints: 0,
    secondReviewCode: '-',
    manualPoints: 0,
    deliverStatus: '已投递',
    likes: 880,
    collects: 240,
    comments: 52,
    reads: 18800,
    consults: 11,
    viral: false,
  },
];
