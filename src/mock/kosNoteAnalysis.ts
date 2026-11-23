export type KosNoteAnalysisRecord = {
  key: string;
  title: string;
  materialType: string;
  coverColor: string;
  noteLink: string;
  publishTime: string;
  nickname: string;
  avatarColor: string;
  employee: string;
  phone: string;
  followers: number;
  thirdAccount: string;
  homepage: string;
  reads: number;
  likes: number;
  collects: number;
  comments: number;
  taskName: string;
  group: string;
};

export type InteractionBucket =
  | 'all'
  | '50w+'
  | '10w-50w'
  | '5w-10w'
  | '1w-5w'
  | '5k-1w'
  | '1k-5k'
  | '1k-'
  | 'custom';

export const KOS_NOTE_DISPLAY_DAYS = [
  { label: '近7天', value: '7' },
  { label: '近15天', value: '15' },
  { label: '近30天', value: '30' },
  { label: '近90天', value: '90' },
  { label: '全部', value: 'all' },
];

export const KOS_NOTE_GROUP_OPTIONS = [
  { label: '华东一区', value: '华东一区' },
  { label: '华南督导组', value: '华南督导组' },
  { label: '华北二区', value: '华北二区' },
  { label: '西南门店', value: '西南门店' },
  { label: '全国门店', value: '全国门店' },
];

export const INTERACTION_BUCKETS: { key: InteractionBucket; label: string }[] = [
  { key: 'all', label: '不限' },
  { key: '50w+', label: '50万以上' },
  { key: '10w-50w', label: '10万-50万' },
  { key: '5w-10w', label: '5万-10万' },
  { key: '1w-5w', label: '1万-5万' },
  { key: '5k-1w', label: '5千-1万' },
  { key: '1k-5k', label: '1千-5千' },
  { key: '1k-', label: '1千以下' },
  { key: 'custom', label: '自定义' },
];

export const MOCK_KOS_NOTE_ANALYSIS: KosNoteAnalysisRecord[] = [
  {
    key: '1',
    title: '周末试驾体验｜城市通勤也能很从容',
    materialType: '图文',
    coverColor: '#1677ff',
    noteLink: 'https://xhslink.com/kos/n1',
    publishTime: '2026-07-28 10:22',
    nickname: '思远看车',
    avatarColor: '#1677ff',
    employee: '陈思远',
    phone: '138****2108',
    followers: 28600,
    thirdAccount: 'xhs_siyuan',
    homepage: 'https://www.xiaohongshu.com/user/siyuan',
    reads: 186520,
    likes: 12480,
    collects: 3560,
    comments: 980,
    taskName: '周末试驾邀约冲刺',
    group: '华东一区',
  },
  {
    key: '2',
    title: '家庭出行选车清单，这三点别忽略',
    materialType: '图文',
    coverColor: '#13c2c2',
    noteLink: 'https://xhslink.com/kos/n2',
    publishTime: '2026-07-26 15:40',
    nickname: '婉清爱生活',
    avatarColor: '#13c2c2',
    employee: '林婉清',
    phone: '139****6631',
    followers: 45200,
    thirdAccount: 'xhs_wanqing',
    homepage: 'https://www.xiaohongshu.com/user/wanqing',
    reads: 152340,
    likes: 9860,
    collects: 4120,
    comments: 760,
    taskName: '家庭出行选车清单',
    group: '华南督导组',
  },
  {
    key: '3',
    title: '门店实拍｜新色到店第一视角',
    materialType: '视频',
    coverColor: '#722ed1',
    noteLink: 'https://xhslink.com/kos/n3',
    publishTime: '2026-07-24 09:18',
    nickname: '启明车生活',
    avatarColor: '#722ed1',
    employee: '赵启明',
    phone: '136****9082',
    followers: 19800,
    thirdAccount: 'xhs_qiming',
    homepage: 'https://www.xiaohongshu.com/user/qiming',
    reads: 128760,
    likes: 8740,
    collects: 2980,
    comments: 640,
    taskName: '新色到店实拍征集',
    group: '华北二区',
  },
  {
    key: '4',
    title: '油耗实测一周，通勤成本算给你看',
    materialType: '图文',
    coverColor: '#fa8c16',
    noteLink: 'https://xhslink.com/kos/n4',
    publishTime: '2026-07-22 19:05',
    nickname: '雨桐说车',
    avatarColor: '#fa8c16',
    employee: '周雨桐',
    phone: '137****4415',
    followers: 33400,
    thirdAccount: 'xhs_yutong',
    homepage: 'https://www.xiaohongshu.com/user/yutong',
    reads: 110280,
    likes: 7650,
    collects: 2650,
    comments: 590,
    taskName: '油耗实测一周挑战',
    group: '西南门店',
  },
  {
    key: '5',
    title: '后排空间对比｜带娃出行更省心',
    materialType: '图文',
    coverColor: '#eb2f96',
    noteLink: 'https://xhslink.com/kos/n5',
    publishTime: '2026-07-20 11:33',
    nickname: '佳宁日常',
    avatarColor: '#eb2f96',
    employee: '吴佳宁',
    phone: '135****7720',
    followers: 22100,
    thirdAccount: 'xhs_jianing',
    homepage: 'https://www.xiaohongshu.com/user/jianing',
    reads: 48640,
    likes: 3920,
    collects: 1410,
    comments: 320,
    taskName: '后排空间对比测评',
    group: '华东一区',
  },
  {
    key: '6',
    title: '智驾辅助日常体验分享',
    materialType: '视频',
    coverColor: '#52c41a',
    noteLink: 'https://xhslink.com/kos/n6',
    publishTime: '2026-07-18 16:48',
    nickname: '浩然驾到',
    avatarColor: '#52c41a',
    employee: '郑浩然',
    phone: '158****3356',
    followers: 16700,
    thirdAccount: 'xhs_haoran',
    homepage: 'https://www.xiaohongshu.com/user/haoran',
    reads: 87420,
    likes: 5840,
    collects: 1980,
    comments: 430,
    taskName: '智驾日常体验分享',
    group: '全国门店',
  },
  {
    key: '7',
    title: '暑期亲子出行专题｜后备箱收纳技巧',
    materialType: '图文',
    coverColor: '#2f54eb',
    noteLink: 'https://xhslink.com/kos/n7',
    publishTime: '2026-07-15 14:12',
    nickname: '孙悦爱分享',
    avatarColor: '#2f54eb',
    employee: '孙悦',
    phone: '186****9901',
    followers: 41200,
    thirdAccount: 'xhs_sunyue',
    homepage: 'https://www.xiaohongshu.com/user/sunyue',
    reads: 6200,
    likes: 480,
    collects: 210,
    comments: 86,
    taskName: '暑期亲子出行专题',
    group: '华南督导组',
  },
  {
    key: '8',
    title: '门店接待服务种草｜到店礼包一览',
    materialType: '图文',
    coverColor: '#fa541c',
    noteLink: 'https://xhslink.com/kos/n8',
    publishTime: '2026-07-12 09:50',
    nickname: '俊杰选车',
    avatarColor: '#fa541c',
    employee: '马俊杰',
    phone: '131****2288',
    followers: 9800,
    thirdAccount: 'xhs_junjie',
    homepage: 'https://www.xiaohongshu.com/user/junjie',
    reads: 3200,
    likes: 260,
    collects: 98,
    comments: 42,
    taskName: '门店接待服务种草',
    group: '华北二区',
  },
];

export function formatKosNoteNumber(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  return value.toLocaleString('zh-CN');
}

export function matchInteractionBucket(reads: number, bucket: InteractionBucket) {
  if (bucket === 'all' || bucket === 'custom') return true;
  if (bucket === '50w+') return reads >= 500000;
  if (bucket === '10w-50w') return reads >= 100000 && reads < 500000;
  if (bucket === '5w-10w') return reads >= 50000 && reads < 100000;
  if (bucket === '1w-5w') return reads >= 10000 && reads < 50000;
  if (bucket === '5k-1w') return reads >= 5000 && reads < 10000;
  if (bucket === '1k-5k') return reads >= 1000 && reads < 5000;
  if (bucket === '1k-') return reads < 1000;
  return true;
}
