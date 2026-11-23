export type TaskAuditPlatform = '小红书' | '抖音' | '视频号';
export type BasicAuditStatus = '待审核' | '已审核' | '已退回';
export type EffectAuditStatus = '待审核' | '审核通过' | '已拒绝';
export type AppealStatus = '待处理' | '审核通过' | '已拒绝';
export type AppealType = '基础积分申诉' | '效果积分申诉' | '采集异常申诉';

export type BasicAuditItem = {
  key: string;
  taskId: string;
  taskName: string;
  platform: TaskAuditPlatform;
  contentTitle: string;
  contentLink: string;
  nickname: string;
  koxId: string;
  office: string;
  model: string;
  submitTime: string;
  status: BasicAuditStatus;
  carTag: string;
  keywords: string[];
  minWords: number;
  aiSensitive: '通过' | '不通过';
  aiWords: '通过' | '不通过';
  aiKeywords: '通过' | '不通过';
  aiScore: number;
  contentBody: string;
};

export type CollectExceptionItem = {
  key: string;
  taskId: string;
  taskName: string;
  platform: TaskAuditPlatform;
  contentTitle: string;
  nickname: string;
  koxId: string;
  office: string;
  model: string;
  noteLink: string;
  submitTime: string;
  reason: string;
  userStatus: string;
};

export type EffectAuditItem = {
  key: string;
  taskId: string;
  taskName: string;
  platform: TaskAuditPlatform;
  koc: string;
  koxId: string;
  office: string;
  model: string;
  workLink: string;
  submitTime: string;
  collectTime: string;
  status: EffectAuditStatus;
  likes: number | null;
  collects: number | null;
  comments: number | null;
  shares: number | null;
  leads: number | null;
  effectPoints: number;
  pointsCode: string;
};

export type AppealItem = {
  key: string;
  taskId: string;
  taskName: string;
  platform: TaskAuditPlatform;
  appealType: AppealType;
  koc: string;
  koxId: string;
  office: string;
  model: string;
  reason: string;
  status: AppealStatus;
  appealTime: string;
};

export const TASK_AUDIT_PLATFORM_OPTIONS = [
  { label: '全部平台', value: '' },
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '视频号', value: '视频号' },
];

export const MOCK_BASIC_AUDITS: BasicAuditItem[] = [
  {
    key: 'b1',
    taskId: '142900106792',
    taskName: '帮宝适26年小红书母爱瞬间分享活动',
    platform: '小红书',
    contentTitle: '',
    contentLink: 'https://www.xiaohongshu.com/explore/note1',
    nickname: '露露君',
    koxId: '768',
    office: '默认分组',
    model: '-',
    submitTime: '2026-06-22 12:07:05',
    status: '待审核',
    carTag: '黑金帮',
    keywords: ['帮宝适'],
    minWords: 200,
    aiSensitive: '通过',
    aiWords: '通过',
    aiKeywords: '通过',
    aiScore: 92,
    contentBody: '（无正文）',
  },
  {
    key: 'b2',
    taskId: '142900106792',
    taskName: '帮宝适26年小红书母爱瞬间分享活动',
    platform: '小红书',
    contentTitle: '母爱瞬间日记',
    contentLink: 'https://www.xiaohongshu.com/explore/note2',
    nickname: '快乐养巴',
    koxId: '769',
    office: '默认分组',
    model: '-',
    submitTime: '2026-06-22 11:40:18',
    status: '待审核',
    carTag: '黑金帮',
    keywords: ['帮宝适'],
    minWords: 200,
    aiSensitive: '通过',
    aiWords: '通过',
    aiKeywords: '通过',
    aiScore: 88,
    contentBody: '记录宝宝成长的一天，帮宝适陪伴很安心……',
  },
  {
    key: 'b3',
    taskId: '142900106792',
    taskName: '帮宝适26年小红书母爱瞬间分享活动',
    platform: '抖音',
    contentTitle: '带娃日常Vlog',
    contentLink: 'https://www.douyin.com/video/v1',
    nickname: '慢慢的蜗牛',
    koxId: '19',
    office: '',
    model: '-',
    submitTime: '2026-06-21 19:22:40',
    status: '待审核',
    carTag: '黑金帮',
    keywords: ['帮宝适'],
    minWords: 200,
    aiSensitive: '通过',
    aiWords: '通过',
    aiKeywords: '通过',
    aiScore: 85,
    contentBody: '短视频脚本说明……',
  },
  {
    key: 'b4',
    taskId: '142900106792',
    taskName: '帮宝适26年小红书母爱瞬间分享活动',
    platform: '小红书',
    contentTitle: '夜喂时光',
    contentLink: 'https://www.xiaohongshu.com/explore/note3',
    nickname: '月光妈妈',
    koxId: '36',
    office: '默认分组',
    model: '-',
    submitTime: '2026-06-20 22:10:11',
    status: '已审核',
    carTag: '黑金帮',
    keywords: ['帮宝适'],
    minWords: 200,
    aiSensitive: '通过',
    aiWords: '通过',
    aiKeywords: '通过',
    aiScore: 90,
    contentBody: '夜喂也要轻柔呵护……',
  },
  {
    key: 'b5',
    taskId: '142900106792',
    taskName: '帮宝适26年小红书母爱瞬间分享活动',
    platform: '小红书',
    contentTitle: '出行好物分享',
    contentLink: 'https://www.xiaohongshu.com/explore/note4',
    nickname: '旅行奶爸',
    koxId: '102',
    office: '默认分组',
    model: '-',
    submitTime: '2026-06-20 16:05:33',
    status: '已审核',
    carTag: '黑金帮',
    keywords: ['帮宝适'],
    minWords: 200,
    aiSensitive: '通过',
    aiWords: '通过',
    aiKeywords: '通过',
    aiScore: 87,
    contentBody: '长途出行必备……',
  },
  {
    key: 'b6',
    taskId: '140100101246',
    taskName: 'DEMO-问界M7春季体验种草',
    platform: '小红书',
    contentTitle: '周末试驾很从容',
    contentLink: 'https://www.xiaohongshu.com/explore/m7a',
    nickname: '陈思远',
    koxId: '2108',
    office: '华东一区',
    model: '问界M7',
    submitTime: '2026-06-18 10:12:00',
    status: '已审核',
    carTag: '问界M7',
    keywords: ['问界M7', '试驾'],
    minWords: 150,
    aiSensitive: '通过',
    aiWords: '通过',
    aiKeywords: '通过',
    aiScore: 94,
    contentBody: '城市通勤体验分享……',
  },
  {
    key: 'b7',
    taskId: '140100101246',
    taskName: 'DEMO-问界M7春季体验种草',
    platform: '抖音',
    contentTitle: '智驾辅助日常',
    contentLink: 'https://www.douyin.com/video/m7b',
    nickname: '林婉清',
    koxId: '6631',
    office: '华南督导组',
    model: '问界M7',
    submitTime: '2026-06-17 15:40:22',
    status: '已审核',
    carTag: '问界M7',
    keywords: ['问界M7'],
    minWords: 150,
    aiSensitive: '通过',
    aiWords: '通过',
    aiKeywords: '通过',
    aiScore: 91,
    contentBody: '智驾体验短视频……',
  },
  {
    key: 'b8',
    taskId: '140100101246',
    taskName: 'DEMO-问界M7春季体验种草',
    platform: '小红书',
    contentTitle: '后排空间对比',
    contentLink: 'https://www.xiaohongshu.com/explore/m7c',
    nickname: '赵启明',
    koxId: '9082',
    office: '华北二区',
    model: '问界M7',
    submitTime: '2026-06-16 09:18:45',
    status: '已审核',
    carTag: '问界M7',
    keywords: ['问界M7'],
    minWords: 150,
    aiSensitive: '通过',
    aiWords: '通过',
    aiKeywords: '通过',
    aiScore: 89,
    contentBody: '家庭出行空间实测……',
  },
];

export const MOCK_COLLECT_EXCEPTIONS: CollectExceptionItem[] = [
  {
    key: 'c1',
    taskId: '148700103492',
    taskName: '巧克力奶种草活动',
    platform: '小红书',
    contentTitle: '大人味🍫不齁甜黑巧奶...',
    nickname: '周乾一',
    koxId: '865577',
    office: '默认分组',
    model: '-',
    noteLink: 'https://www.xiaohongshu.com/explore/choco1',
    submitTime: '2026-07-21 10:48:59',
    reason: '该笔记与媒体绑定账号不同',
    userStatus: '审核中',
  },
  {
    key: 'c2',
    taskId: '140100101246',
    taskName: 'DEMO-问界M7春季体验种草',
    platform: '小红书',
    contentTitle: '到店实拍第一视角',
    nickname: '盖一',
    koxId: '229',
    office: '默认分组',
    model: '问界M7',
    noteLink: 'https://www.xiaohongshu.com/explore/m7x',
    submitTime: '2026-07-20 16:21:10',
    reason: '笔记链接无法访问或已删除',
    userStatus: '审核中',
  },
  {
    key: 'c3',
    taskId: '142900106792',
    taskName: '帮宝适26年小红书母爱瞬间分享活动',
    platform: '小红书',
    contentTitle: '母婴好物清单',
    nickname: '露露君',
    koxId: '768',
    office: '默认分组',
    model: '-',
    noteLink: 'https://www.xiaohongshu.com/explore/noteX',
    submitTime: '2026-07-19 11:05:33',
    reason: '未检测到必带话题/关键词',
    userStatus: '审核中',
  },
];

export const MOCK_EFFECT_AUDITS: EffectAuditItem[] = [
  {
    key: 'e1',
    taskId: '142900106792',
    taskName: '帮宝适26年小红书母爱瞬间分享活动',
    platform: '小红书',
    koc: '露露君',
    koxId: '768',
    office: '默认分组',
    model: '-',
    workLink: 'https://www.xiaohongshu.com/explore/note1',
    submitTime: '2026-06-22 12:07:05',
    collectTime: '-',
    status: '待审核',
    likes: null,
    collects: null,
    comments: null,
    shares: null,
    leads: null,
    effectPoints: 0,
    pointsCode: '',
  },
  {
    key: 'e2',
    taskId: '142900106792',
    taskName: '帮宝适26年小红书母爱瞬间分享活动',
    platform: '抖音',
    koc: '快乐养巴',
    koxId: '769',
    office: '默认分组',
    model: '-',
    workLink: 'https://www.douyin.com/video/v2',
    submitTime: '2026-06-22 10:20:11',
    collectTime: '2026-06-23 10:00:00',
    status: '待审核',
    likes: 1260,
    collects: 320,
    comments: 88,
    shares: 45,
    leads: 6,
    effectPoints: 120,
    pointsCode: '',
  },
  {
    key: 'e3',
    taskId: '140100101246',
    taskName: 'DEMO-问界M7春季体验种草',
    platform: '小红书',
    koc: '陈思远',
    koxId: '2108',
    office: '华东一区',
    model: '问界M7',
    workLink: 'https://www.xiaohongshu.com/explore/m7a',
    submitTime: '2026-06-18 10:12:00',
    collectTime: '2026-06-19 09:00:00',
    status: '待审核',
    likes: 3200,
    collects: 860,
    comments: 210,
    shares: 95,
    leads: 18,
    effectPoints: 260,
    pointsCode: '',
  },
  {
    key: 'e4',
    taskId: '140100101246',
    taskName: 'DEMO-问界M7春季体验种草',
    platform: '小红书',
    koc: '林婉清',
    koxId: '6631',
    office: '华南督导组',
    model: '问界M7',
    workLink: 'https://www.xiaohongshu.com/explore/m7b',
    submitTime: '2026-06-17 15:40:22',
    collectTime: '2026-06-18 12:00:00',
    status: '待审核',
    likes: 2100,
    collects: 540,
    comments: 160,
    shares: 70,
    leads: 12,
    effectPoints: 180,
    pointsCode: '',
  },
  {
    key: 'e5',
    taskId: '140100101246',
    taskName: 'DEMO-问界M7春季体验种草',
    platform: '抖音',
    koc: '赵启明',
    koxId: '9082',
    office: '华北二区',
    model: '问界M7',
    workLink: 'https://www.douyin.com/video/m7c',
    submitTime: '2026-06-16 09:18:45',
    collectTime: '2026-06-17 09:00:00',
    status: '审核通过',
    likes: 4500,
    collects: 1100,
    comments: 300,
    shares: 140,
    leads: 25,
    effectPoints: 320,
    pointsCode: 'FX-M7-001',
  },
];

export const MOCK_APPEALS: AppealItem[] = [
  {
    key: 'a1',
    taskId: '142900106792',
    taskName: '帮宝适26年小红书母爱瞬间分享活动',
    platform: '小红书',
    appealType: '基础积分申诉',
    koc: '露露君',
    koxId: '768',
    office: '默认分组',
    model: '-',
    reason: '内容符合要求，请求复审基础积分',
    status: '待处理',
    appealTime: '2026-06-23 09:12:00',
  },
  {
    key: 'a2',
    taskId: '148700103492',
    taskName: '巧克力奶种草活动',
    platform: '小红书',
    appealType: '采集异常申诉',
    koc: '周乾一',
    koxId: '865577',
    office: '默认分组',
    model: '-',
    reason: '已更换正确账号链接，请重新采集',
    status: '待处理',
    appealTime: '2026-07-21 14:20:00',
  },
  {
    key: 'a3',
    taskId: '140100101246',
    taskName: 'DEMO-问界M7春季体验种草',
    platform: '小红书',
    appealType: '效果积分申诉',
    koc: '陈思远',
    koxId: '2108',
    office: '华东一区',
    model: '问界M7',
    reason: '互动数据已更新，请求补发效果积分',
    status: '审核通过',
    appealTime: '2026-06-20 11:05:00',
  },
];
