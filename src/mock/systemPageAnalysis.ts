export type PageModuleCategory = '小程序' | '后台' | 'H5';

export type PageModuleStat = {
  key: string;
  name: string;
  code: string;
  category: PageModuleCategory;
  views: number;
  uv: number;
  clicks: number;
};

export const PAGE_MODULE_CATEGORY_OPTIONS = [
  { label: '全部模块', value: '' },
  { label: '小程序', value: '小程序' },
  { label: '后台', value: '后台' },
  { label: 'H5', value: 'H5' },
];

export const MOCK_PAGE_MODULE_STATS: PageModuleStat[] = [
  {
    key: '1',
    name: 'AI创作',
    code: 'miniprogram-ai-create',
    category: '小程序',
    views: 1523,
    uv: 987,
    clicks: 452,
  },
  {
    key: '2',
    name: '活动',
    code: 'miniprogram-activity',
    category: '小程序',
    views: 1380,
    uv: 864,
    clicks: 398,
  },
  {
    key: '3',
    name: '我的积分',
    code: 'miniprogram-my-points',
    category: '小程序',
    views: 1264,
    uv: 742,
    clicks: 365,
  },
  {
    key: '4',
    name: '任务中心',
    code: 'miniprogram-task-center',
    category: '小程序',
    views: 1188,
    uv: 690,
    clicks: 341,
  },
  {
    key: '5',
    name: '创作学院',
    code: 'miniprogram-academy',
    category: '小程序',
    views: 1096,
    uv: 612,
    clicks: 298,
  },
  {
    key: '6',
    name: '品牌资讯',
    code: 'miniprogram-brand-news',
    category: '小程序',
    views: 980,
    uv: 540,
    clicks: 256,
  },
  {
    key: '7',
    name: '首页金刚位',
    code: 'miniprogram-diamond',
    category: '小程序',
    views: 876,
    uv: 488,
    clicks: 210,
  },
  {
    key: '8',
    name: '个人中心',
    code: 'miniprogram-profile',
    category: '小程序',
    views: 802,
    uv: 456,
    clicks: 188,
  },
  {
    key: '9',
    name: '素材库',
    code: 'admin-material',
    category: '后台',
    views: 720,
    uv: 390,
    clicks: 156,
  },
  {
    key: '10',
    name: '积分台账',
    code: 'admin-points-ledger',
    category: '后台',
    views: 654,
    uv: 321,
    clicks: 98,
  },
  {
    key: '11',
    name: '活动落地页',
    code: 'h5-campaign-landing',
    category: 'H5',
    views: 1480,
    uv: 920,
    clicks: 410,
  },
  {
    key: '12',
    name: '报名表单页',
    code: 'h5-signup-form',
    category: 'H5',
    views: 1385,
    uv: 870,
    clicks: 404,
  },
];

export function calcCtr(views: number, clicks: number) {
  if (!views) return 0;
  return (clicks / views) * 100;
}

export function formatCtr(views: number, clicks: number) {
  return `${calcCtr(views, clicks).toFixed(2)}%`;
}

export function sumPageStats(list: PageModuleStat[]) {
  return list.reduce(
    (acc, item) => {
      acc.views += item.views;
      acc.uv += item.uv;
      acc.clicks += item.clicks;
      return acc;
    },
    { views: 0, uv: 0, clicks: 0 },
  );
}
