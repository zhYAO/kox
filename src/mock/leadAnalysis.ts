export type LeadPlatform = '小红书' | '抖音' | '视频号';

export type LeadRecord = {
  key: string;
  taskName: string;
  platform: LeadPlatform;
  koc: string;
  noteTitle: string;
  customer: string;
  model: string;
  region: string;
  content: string;
  createdAt: string;
  detail?: string;
};

export const LEAD_PLATFORM_OPTIONS = [
  { label: '全部平台', value: '' },
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '视频号', value: '视频号' },
];

const TASK = '问界 M7 春季体验种草活动';

export const MOCK_LEAD_RECORDS: LeadRecord[] = [
  {
    key: '1',
    taskName: TASK,
    platform: '小红书',
    koc: '陈思远',
    noteTitle: '问界 M7 春季体验种草｜城市通勤很从容',
    customer: '从不户外的户外爱好者',
    model: '问界 M7',
    region: '上海',
    content: '问界 M7 起售价大概多少？',
    createdAt: '2026-05-22 16:42:10',
    detail: '用户在评论区咨询起售价，并询问是否有试驾政策。',
  },
  {
    key: '2',
    taskName: TASK,
    platform: '小红书',
    koc: '林婉清',
    noteTitle: '带娃出行选问界 M7，后排空间真香',
    customer: '小红署630F9FEA',
    model: '问界 M7',
    region: '-',
    content: '哪里的问界 M7 保真？',
    createdAt: '2026-05-22 11:18:33',
  },
  {
    key: '3',
    taskName: TASK,
    platform: '小红书',
    koc: '赵启明',
    noteTitle: '周末试驾问界 M7 第一视角',
    customer: '路过看车的小明',
    model: '问界 M7',
    region: '杭州',
    content: '智驾辅助在市区好用吗？',
    createdAt: '2026-05-21 20:05:44',
  },
  {
    key: '4',
    taskName: TASK,
    platform: '小红书',
    koc: '陈思远',
    noteTitle: '问界 M7 春季体验种草｜油耗实测一周',
    customer: '精打细算车主',
    model: '问界 M7',
    region: '苏州',
    content: '馈电油耗大概多少？有没有实测数据？',
    createdAt: '2026-05-21 15:26:08',
  },
  {
    key: '5',
    taskName: TASK,
    platform: '抖音',
    koc: '周雨桐',
    noteTitle: '问界M7到店实拍，新色太好看了',
    customer: '抖友阿强',
    model: '问界 M7',
    region: '广州',
    content: '广州哪家店可以预约试驾？',
    createdAt: '2026-05-20 19:40:21',
  },
  {
    key: '6',
    taskName: TASK,
    platform: '小红书',
    koc: '林婉清',
    noteTitle: '家庭出行选车清单，问界 M7 上榜理由',
    customer: '两娃妈妈日记',
    model: '问界 M7',
    region: '深圳',
    content: '后排座椅加热通风都有吗？',
    createdAt: '2026-05-20 14:12:55',
  },
  {
    key: '7',
    taskName: TASK,
    platform: '视频号',
    koc: '吴佳宁',
    noteTitle: '问界 M7 春季体验种草活动分享',
    customer: '微信用户_88a2',
    model: '问界 M7',
    region: '-',
    content: '活动礼包包含什么？',
    createdAt: '2026-05-19 21:08:17',
  },
  {
    key: '8',
    taskName: TASK,
    platform: '小红书',
    koc: '赵启明',
    noteTitle: '问界 M7 与同级竞品对比笔记',
    customer: '对比党本党',
    model: '问界 M7',
    region: '北京',
    content: '和理想 L7 比空间谁更合适家用？',
    createdAt: '2026-05-19 10:33:49',
  },
  {
    key: '9',
    taskName: TASK,
    platform: '小红书',
    koc: '陈思远',
    noteTitle: '问界 M7 春季体验种草｜内饰细节',
    customer: '爱干净的车迷',
    model: '问界 M7',
    region: '南京',
    content: '内饰材质耐脏吗？有没有浅色可选？',
    createdAt: '2026-05-18 18:22:06',
  },
  {
    key: '10',
    taskName: TASK,
    platform: '抖音',
    koc: '周雨桐',
    noteTitle: '问界M7夜间智驾体验',
    customer: '夜跑车主',
    model: '问界 M7',
    region: '成都',
    content: '夜间辅助驾驶稳定吗？',
    createdAt: '2026-05-18 12:50:30',
  },
  {
    key: '11',
    taskName: TASK,
    platform: '小红书',
    koc: '林婉清',
    noteTitle: '问界 M7 春季体验种草｜后备箱收纳',
    customer: '户外露营达人',
    model: '问界 M7',
    region: '杭州',
    content: '后备箱放露营装备够不够用？',
    createdAt: '2026-05-18 09:15:42',
  },
  {
    key: '12',
    taskName: TASK,
    platform: '小红书',
    koc: '',
    noteTitle: '问界 M7 春季体验种草活动合集',
    customer: '匿名用户A12',
    model: '问界 M7',
    region: '-',
    content: '现在下定有没有优惠？',
    createdAt: '2026-05-18 08:41:19',
  },
  {
    key: '13',
    taskName: TASK,
    platform: '视频号',
    koc: '吴佳宁',
    noteTitle: '问界 M7 到店接待体验',
    customer: '准备换车的老王',
    model: '问界 M7',
    region: '佛山',
    content: '能否安排周末试驾？想带家人一起看。',
    createdAt: '2026-05-18 07:58:03',
  },
];

export function summarizeLeads(list: LeadRecord[]) {
  const tasks = new Set(list.map((i) => i.taskName));
  const kocs = new Set(list.map((i) => i.koc).filter(Boolean));
  const models = Array.from(new Set(list.map((i) => i.model).filter(Boolean)));
  return {
    totalLeads: list.length,
    taskCount: tasks.size,
    kocCount: kocs.size,
    modelsText: models.join('、') || '-',
  };
}
