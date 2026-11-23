export type PublicKocRecord = {
  key: string;
  nickname: string;
  platform: string;
  userId: string;
  ip: string;
  homeUrl: string;
  followers: number;
  title: string;
  noteUrl: string;
  model?: string;
  brand?: string;
  location?: string;
  certifyType?: string;
};

export const MODEL_OPTIONS = [
  { label: 'M7', value: 'M7' },
  { label: 'M9', value: 'M9' },
  { label: 'M5', value: 'M5' },
];

export const BRAND_OPTIONS = [
  { label: '问界', value: '问界' },
  { label: '理想', value: '理想' },
  { label: '特斯拉', value: '特斯拉' },
];

export const PERFORMANCE_TYPE_OPTIONS = [
  { label: '互动', value: '互动' },
  { label: '曝光', value: '曝光' },
  { label: '转化', value: '转化' },
];

export const PERFORMANCE_OPTIONS = [
  { label: '高', value: '高' },
  { label: '中', value: '中' },
  { label: '低', value: '低' },
];

export const LOCATION_OPTIONS = [
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广东', value: '广东' },
  { label: '浙江', value: '浙江' },
];

export const CERTIFY_OPTIONS = [
  { label: '个人认证', value: '个人认证' },
  { label: '机构认证', value: '机构认证' },
  { label: '未认证', value: '未认证' },
];

export const FOLLOWER_OPTIONS = [
  { label: '1万以下', value: '0-10000' },
  { label: '1万-10万', value: '10000-100000' },
  { label: '10万-50万', value: '100000-500000' },
  { label: '50万以上', value: '500000+' },
];

export const PLATFORM_OPTIONS = [
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '微博', value: '微博' },
];

export const MOCK_PUBLIC_KOC_LIST: PublicKocRecord[] = [
  {
    key: '1',
    nickname: '盖一',
    platform: '小红书',
    userId: 'xhs_10086',
    ip: '上海',
    homeUrl: 'https://www.xiaohongshu.com/user/profile/demo1',
    followers: 150391,
    title: '问界 M7 春日出游实测',
    noteUrl: 'https://www.xiaohongshu.com/explore/note1',
    model: 'M7',
    brand: '问界',
    location: '上海',
    certifyType: '个人认证',
  },
  {
    key: '2',
    nickname: '车生活Lab',
    platform: '抖音',
    userId: 'dy_22011',
    ip: '北京',
    homeUrl: 'https://www.douyin.com/user/demo2',
    followers: 203445,
    title: '家庭 SUV 横评：空间与能耗',
    noteUrl: 'https://www.douyin.com/video/demo2',
    model: 'M9',
    brand: '问界',
    location: '北京',
    certifyType: '机构认证',
  },
  {
    key: '3',
    nickname: '阿璐酱',
    platform: '小红书',
    userId: 'xhs_3344',
    ip: '杭州',
    homeUrl: 'https://www.xiaohongshu.com/user/profile/demo3',
    followers: 1242,
    title: '新手妈妈选车心得',
    noteUrl: 'https://www.xiaohongshu.com/explore/note3',
    model: 'M5',
    brand: '问界',
    location: '浙江',
    certifyType: '未认证',
  },
  {
    key: '4',
    nickname: '历历山河',
    platform: '小红书',
    userId: 'xhs_7788',
    ip: '广州',
    homeUrl: 'https://www.xiaohongshu.com/user/profile/demo4',
    followers: 150726,
    title: '周末露营带娃出行清单',
    noteUrl: 'https://www.xiaohongshu.com/explore/note4',
    model: 'M7',
    brand: '问界',
    location: '广东',
    certifyType: '个人认证',
  },
  {
    key: '5',
    nickname: '能源观察',
    platform: '微博',
    userId: 'wb_5566',
    ip: '深圳',
    homeUrl: 'https://weibo.com/u/demo5',
    followers: 88210,
    title: '新能源车主真实续航反馈',
    noteUrl: 'https://weibo.com/detail/demo5',
    model: 'M9',
    brand: '问界',
    location: '广东',
    certifyType: '机构认证',
  },
  {
    key: '6',
    nickname: '小园',
    platform: '小红书',
    userId: 'xhs_9900',
    ip: '成都',
    homeUrl: 'https://www.xiaohongshu.com/user/profile/demo6',
    followers: 340,
    title: '试驾体验记录',
    noteUrl: 'https://www.xiaohongshu.com/explore/note6',
    model: 'M5',
    brand: '问界',
    location: '四川',
    certifyType: '未认证',
  },
];
