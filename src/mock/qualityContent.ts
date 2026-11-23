export type ContentPlatform = '抖音' | '小红书' | '视频号';
export type ContentForm = '视频' | '图文';
export type QualityStatus = '已投流加热' | '待投流' | '未投流';

export type QualityNote = {
  key: string;
  rank?: number;
  title: string;
  summary: string;
  platform: ContentPlatform;
  form: ContentForm;
  taskName: string;
  likes: number;
  collects: number;
  comments: number;
  interactions: number;
  status: QualityStatus;
  publishTime: string;
  url: string;
  /** t100 | excellent */
  pool: 't100' | 'excellent';
};

export const PLATFORM_OPTIONS = [
  { label: '全部平台', value: '' },
  { label: '抖音', value: '抖音' },
  { label: '小红书', value: '小红书' },
  { label: '视频号', value: '视频号' },
];

export const STATUS_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '已投流加热', value: '已投流加热' },
  { label: '待投流', value: '待投流' },
  { label: '未投流', value: '未投流' },
];

export const QUALITY_STATS = {
  total: 167,
  avgConsultRate: '12.8%',
  boosted: 45,
  pendingBoost: 122,
};

export const MOCK_QUALITY_NOTES: QualityNote[] = [
  {
    key: 'q1',
    rank: 1,
    title: '肖战让尚界“锁国”~',
    summary:
      '尚界Z7真的太香了！鸿蒙智行加持，智驾体验直接拉满 #肖战 #尚界Z7 #鸿蒙智行 试完这台车真的有被惊喜到，锁国不是说说而已～',
    platform: '抖音',
    form: '视频',
    taskName: '问界M7 春季体验种草 【演示用-勿删】 0423',
    likes: 10957,
    collects: 559,
    comments: 705,
    interactions: 12221,
    status: '已投流加热',
    publishTime: '2026-04-23 18:22:11',
    url: 'https://www.douyin.com/',
    pool: 't100',
  },
  {
    key: 'q2',
    rank: 2,
    title: '首付3万多开走~日产N7...',
    summary: '首付三万多就能开走，家用代步真香。油耗表现不错，空间也够用，适合城市通勤。',
    platform: '小红书',
    form: '图文',
    taskName: '问界M8',
    likes: 262,
    collects: 71,
    comments: 0,
    interactions: 333,
    status: '待投流',
    publishTime: '2026-05-02 10:15:33',
    url: 'https://www.xiaohongshu.com/',
    pool: 't100',
  },
  {
    key: 'q3',
    rank: 3,
    title: '问界M7雨天智驾实测',
    summary: '下雨天开了半小时城市快速路，变道跟车都挺稳，雨刮联动也很聪明。',
    platform: '抖音',
    form: '视频',
    taskName: '问界M7 春季体验种草 【演示用-勿删】 0423',
    likes: 8320,
    collects: 412,
    comments: 298,
    interactions: 9030,
    status: '已投流加热',
    publishTime: '2026-04-28 21:06:44',
    url: 'https://www.douyin.com/',
    pool: 't100',
  },
  {
    key: 'q4',
    rank: 4,
    title: '尚界H5周末郊游记录',
    summary: '带娃周末出城，后备箱塞得下推车和露营椅，续航也够往返。',
    platform: '小红书',
    form: '图文',
    taskName: '尚界H5 家庭出行',
    likes: 1560,
    collects: 320,
    comments: 88,
    interactions: 1968,
    status: '待投流',
    publishTime: '2026-05-10 09:41:02',
    url: 'https://www.xiaohongshu.com/',
    pool: 't100',
  },
  {
    key: 'q5',
    rank: 5,
    title: '享界S9T行政座舱体验',
    summary: '后排简直移动办公室，隔音和座椅按摩都很在线，适合长途商务。',
    platform: '视频号',
    form: '视频',
    taskName: '享界S9T 商务场景',
    likes: 4210,
    collects: 188,
    comments: 96,
    interactions: 4494,
    status: '未投流',
    publishTime: '2026-05-12 14:20:18',
    url: 'https://channels.weixin.qq.com/',
    pool: 't100',
  },
  {
    key: 'e1',
    title: '肖战让尚界“锁国”~',
    summary:
      '尚界Z7真的太香了！鸿蒙智行加持，智驾体验直接拉满 #肖战 #尚界Z7 #鸿蒙智行 试完这台车真的有被惊喜到，锁国不是说说而已～ 同款配置我帮你们问过门店了。',
    platform: '抖音',
    form: '视频',
    taskName: '问界M7 春季体验种草 【演示用-勿删】 0423',
    likes: 10957,
    collects: 559,
    comments: 705,
    interactions: 12221,
    status: '已投流加热',
    publishTime: '2026-04-23 18:22:11',
    url: 'https://www.douyin.com/',
    pool: 'excellent',
  },
  {
    key: 'e2',
    title: '首付3万多开走~日产N7...',
    summary: '首付三万多就能开走，家用代步真香。油耗表现不错，空间也够用，适合城市通勤和接送孩子。',
    platform: '小红书',
    form: '图文',
    taskName: '问界M8',
    likes: 262,
    collects: 71,
    comments: 0,
    interactions: 333,
    status: '待投流',
    publishTime: '2026-05-02 10:15:33',
    url: 'https://www.xiaohongshu.com/',
    pool: 'excellent',
  },
  {
    key: 'e3',
    title: '一台车搞定全家周末',
    summary: '从市区到山里往返无压力，儿童座椅安装方便，后备箱还能塞烧烤炉。',
    platform: '小红书',
    form: '图文',
    taskName: '问界M7 春季体验种草 【演示用-勿删】 0423',
    likes: 980,
    collects: 210,
    comments: 64,
    interactions: 1254,
    status: '待投流',
    publishTime: '2026-05-08 16:33:27',
    url: 'https://www.xiaohongshu.com/',
    pool: 'excellent',
  },
  {
    key: 'e4',
    title: '智驾新手也能轻松上手',
    summary: '第一次开智驾，跟车变道提示很清晰，新手友好，晚上回家也不慌。',
    platform: '抖音',
    form: '视频',
    taskName: '智驾体验征集',
    likes: 3560,
    collects: 145,
    comments: 201,
    interactions: 3906,
    status: '已投流加热',
    publishTime: '2026-05-15 20:08:55',
    url: 'https://www.douyin.com/',
    pool: 'excellent',
  },
  {
    key: 'e5',
    title: '门店试驾避坑指南',
    summary: '预约、路线、对比竞品，这份试驾清单帮你少走弯路。',
    platform: '视频号',
    form: '图文',
    taskName: '门店运营支持',
    likes: 640,
    collects: 98,
    comments: 42,
    interactions: 780,
    status: '未投流',
    publishTime: '2026-05-18 11:12:40',
    url: 'https://channels.weixin.qq.com/',
    pool: 'excellent',
  },
];

export function formatCount(n: number) {
  if (n >= 10000) {
    const v = n / 10000;
    return `${v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')}万`;
  }
  return n.toLocaleString('zh-CN');
}

export function statusColor(status: QualityStatus) {
  if (status === '已投流加热') return 'success';
  if (status === '待投流') return 'processing';
  return 'default';
}
