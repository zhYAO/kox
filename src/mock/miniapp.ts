export type MiniEnabled = '启用' | '禁用';

export type MiniBanner = {
  key: string;
  title: string;
  coverColor: string;
  sort: number;
  enabled: boolean;
  link?: string;
};

export type MiniImage = {
  key: string;
  imageKey: string;
  name: string;
  coverColor: string;
  remark: string;
  enabled: boolean;
};

export type MiniDiamond = {
  key: string;
  name: string;
  coverColor: string;
  innerColor: string;
  sort: number;
  enabled: boolean;
  remark: string;
};

export type MiniBrandNews = {
  key: string;
  title: string;
  coverColor: string;
  publishTime: string;
  jumpType: '长图' | '视频号' | '公众号文章';
  diamond?: string;
  sort: number;
  enabled: boolean;
};

export type MiniCourse = {
  key: string;
  name: string;
  category: string;
  coverColor: string;
  innerColor: string;
  sort: number;
  enabled: boolean;
  remark: string;
};

export type MiniPinnedTask = {
  key: string;
  name: string;
  type: string;
  status: '进行中';
  publishTime: string;
  weight: number | null;
};

export const COURSE_CATEGORY_OPTIONS = [
  { label: '创作入门', value: '创作入门' },
  { label: '进阶技巧', value: '进阶技巧' },
  { label: '平台玩法', value: '平台玩法' },
  { label: '案例拆解', value: '案例拆解' },
];

export const DIAMOND_OPTIONS = [
  { label: '不归属 (可清空)', value: '' },
  { label: '获奖公示', value: '获奖公示' },
  { label: '品牌故事', value: '品牌故事' },
  { label: '活动速递', value: '活动速递' },
];

export const MOCK_BANNERS: MiniBanner[] = [
  {
    key: 'b1',
    title: '城市SUV试驾季',
    coverColor: '#5b8ff9',
    sort: 2,
    enabled: true,
    link: '/pages/activity/suv',
  },
  {
    key: 'b2',
    title: '新色到店专题',
    coverColor: '#5ad8a6',
    sort: 1,
    enabled: true,
    link: '/pages/activity/color',
  },
  {
    key: 'b3',
    title: '暑期亲子出行',
    coverColor: '#f6bd16',
    sort: 0,
    enabled: true,
    link: '/pages/activity/family',
  },
];

export const MOCK_IMAGES: MiniImage[] = [
  {
    key: 'i1',
    imageKey: 'home_banner',
    name: '首页默认 Banner 底图',
    coverColor: '#1677ff',
    remark: '首页轮播兜底图',
    enabled: true,
  },
  {
    key: 'i2',
    imageKey: 'activity_bg',
    name: '活动页背景',
    coverColor: '#722ed1',
    remark: '活动详情页顶部背景',
    enabled: true,
  },
  {
    key: 'i3',
    imageKey: 'academy_empty',
    name: '学院空态插图',
    coverColor: '#13c2c2',
    remark: '创作学院无课程时展示',
    enabled: false,
  },
];

export const MOCK_DIAMONDS: MiniDiamond[] = [
  {
    key: 'd1',
    name: '获奖公示',
    coverColor: '#eb2f96',
    innerColor: '#f759ab',
    sort: 20,
    enabled: true,
    remark: '首页金刚位',
  },
  {
    key: 'd2',
    name: '品牌故事',
    coverColor: '#fa8c16',
    innerColor: '#ffa940',
    sort: 15,
    enabled: true,
    remark: '',
  },
  {
    key: 'd3',
    name: '活动速递',
    coverColor: '#2f54eb',
    innerColor: '#597ef7',
    sort: 8,
    enabled: false,
    remark: '暂未上线',
  },
];

export const MOCK_BRAND_NEWS: MiniBrandNews[] = [
  {
    key: 'n1',
    title: '问界M8父爱相伴，与TA共赴山海之约',
    coverColor: '#1677ff',
    publishTime: '2026-07-20 10:00:00',
    jumpType: '长图',
    diamond: '品牌故事',
    sort: 20,
    enabled: true,
  },
  {
    key: 'n2',
    title: '暑期试驾礼遇开启',
    coverColor: '#52c41a',
    publishTime: '2026-07-15 14:30:00',
    jumpType: '公众号文章',
    diamond: '活动速递',
    sort: 12,
    enabled: true,
  },
  {
    key: 'n3',
    title: '创作者月度之星揭晓',
    coverColor: '#fa541c',
    publishTime: '2026-07-08 09:20:00',
    jumpType: '视频号',
    diamond: '获奖公示',
    sort: 10,
    enabled: true,
  },
];

export const MOCK_COURSES: MiniCourse[] = [
  {
    key: 'c1',
    name: '小红书创作指南',
    category: '创作入门',
    coverColor: '#eb2f96',
    innerColor: '#ffadd2',
    sort: 30,
    enabled: true,
    remark: '新手必看',
  },
  {
    key: 'c2',
    name: '封面设计进阶课',
    category: '进阶技巧',
    coverColor: '#722ed1',
    innerColor: '#d3adf7',
    sort: 20,
    enabled: true,
    remark: '',
  },
  {
    key: 'c3',
    name: '种草笔记拆解',
    category: '案例拆解',
    coverColor: '#13c2c2',
    innerColor: '#87e8de',
    sort: 10,
    enabled: false,
    remark: '待上线',
  },
];

export const MOCK_PINNED_TASKS: MiniPinnedTask[] = [
  {
    key: 't1',
    name: '华耐家居种草活动_demo_副本1',
    type: '创作活动',
    status: '进行中',
    publishTime: '2026-07-31 22:41:14',
    weight: null,
  },
  {
    key: 't2',
    name: 'Gucci 种草活动_demo',
    type: '创作活动',
    status: '进行中',
    publishTime: '2026-07-28 10:36:52',
    weight: null,
  },
  {
    key: 't3',
    name: '周末试驾邀约冲刺',
    type: '种草活动',
    status: '进行中',
    publishTime: '2026-07-25 09:10:00',
    weight: 100,
  },
];
