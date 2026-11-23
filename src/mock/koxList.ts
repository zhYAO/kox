export type KoxRecord = {
  key: string;
  source: string;
  group: string;
  koxId: number;
  nickname: string;
  phone: string;
  province: string;
  city: string;
  ipLocation: string;
  status: '可用' | '不可用';
  listStatus: string;
  historyOffice: string;
  unbindTime: string;
  hasCdpTag: string;
  ownerTag: string;
  ownerTagStart: string;
  ownerTagEnd: string;
  tags: string;
  contentTag: string;
  effectTag: string;
  mentionCompetitor: string;
  competitorModel: string;
  totalPoints: number;
  remark: string;
  createTime: string;
  tagUpdateTime: string;
  track: string;
  store: string;
  registerTime: string;
  openId: string;
  unionId: string;
  platformNickname: string;
  platform: string;
  office: string;
  followers: number;
  accountStructure: string;
  taskCount: number;
  publishedCount: number;
  viralCount: number;
  viralRate: number;
  estimatedExposure: number;
  estimatedReads: number;
  commentCount: number;
  validInquiryCount: number;
  validInquiryRate: number;
  avgValidInquiry: number;
  interactionCount: number;
  avgInteraction: number;
};

export type ColumnGroup = 'basic' | 'koc';

export type ColumnMeta = {
  key: string;
  title: string;
  group: ColumnGroup;
  fixed?: boolean;
  defaultChecked?: boolean;
  width?: number;
};

export const COLUMN_METAS: ColumnMeta[] = [
  { key: 'source', title: '提报来源', group: 'basic', defaultChecked: true, width: 110 },
  { key: 'group', title: '代表处', group: 'basic', defaultChecked: true, width: 120 },
  { key: 'koxId', title: 'KOX-ID', group: 'basic', defaultChecked: true, width: 100 },
  { key: 'nickname', title: '昵称', group: 'basic', fixed: true, defaultChecked: true, width: 140 },
  { key: 'phone', title: '手机号', group: 'basic', defaultChecked: true, width: 130 },
  { key: 'province', title: '省份', group: 'basic', defaultChecked: true, width: 90 },
  { key: 'city', title: '城市', group: 'basic', defaultChecked: true, width: 90 },
  { key: 'ipLocation', title: 'IP属地', group: 'basic', defaultChecked: true, width: 100 },
  { key: 'status', title: '状态', group: 'basic', defaultChecked: true, width: 90 },
  { key: 'listStatus', title: '名单状态', group: 'basic', defaultChecked: true, width: 100 },
  { key: 'historyOffice', title: '历史代表处', group: 'basic', defaultChecked: true, width: 120 },
  { key: 'unbindTime', title: '解绑时间', group: 'basic', defaultChecked: true, width: 170 },
  { key: 'hasCdpTag', title: '是否有CDP标签', group: 'basic', defaultChecked: false, width: 130 },
  { key: 'ownerTag', title: '车主标签', group: 'basic', defaultChecked: true, width: 110 },
  { key: 'ownerTagStart', title: '车主标签生效时间', group: 'basic', defaultChecked: true, width: 170 },
  { key: 'ownerTagEnd', title: '车主标签失效时间', group: 'basic', defaultChecked: true, width: 170 },
  { key: 'tags', title: '标签', group: 'basic', defaultChecked: true, width: 140 },
  { key: 'contentTag', title: '内容标签', group: 'basic', defaultChecked: true, width: 120 },
  { key: 'effectTag', title: '效果标签', group: 'basic', defaultChecked: true, width: 120 },
  { key: 'mentionCompetitor', title: '是否提及竞品', group: 'basic', defaultChecked: false, width: 120 },
  { key: 'competitorModel', title: '竞品车型', group: 'basic', defaultChecked: false, width: 120 },
  { key: 'totalPoints', title: '总积分', group: 'basic', defaultChecked: true, width: 100 },
  { key: 'remark', title: '备注', group: 'basic', defaultChecked: true, width: 140 },
  { key: 'createTime', title: '创建时间', group: 'basic', defaultChecked: true, width: 170 },
  { key: 'tagUpdateTime', title: '标签更新时间', group: 'basic', defaultChecked: true, width: 170 },
  { key: 'track', title: '赛道', group: 'basic', defaultChecked: false, width: 100 },
  { key: 'store', title: '门店', group: 'basic', defaultChecked: false, width: 120 },
  { key: 'registerTime', title: '注册时间', group: 'basic', defaultChecked: false, width: 170 },
  { key: 'openId', title: 'OPENID', group: 'basic', defaultChecked: false, width: 160 },
  { key: 'unionId', title: 'UNIONID', group: 'basic', defaultChecked: false, width: 160 },
  { key: 'platformNickname', title: '平台昵称', group: 'basic', defaultChecked: false, width: 120 },
  { key: 'action', title: '操作', group: 'basic', fixed: true, defaultChecked: true, width: 160 },
  { key: 'platformLabel', title: '平台', group: 'koc', defaultChecked: true, width: 100 },
  { key: 'followers', title: '总粉丝数', group: 'koc', defaultChecked: true, width: 110 },
  { key: 'accountStructure', title: '账号结构', group: 'koc', defaultChecked: true, width: 110 },
  { key: 'taskCount', title: '参加总任务数', group: 'koc', defaultChecked: true, width: 120 },
  { key: 'publishedCount', title: '已发布内容数', group: 'koc', defaultChecked: true, width: 120 },
  { key: 'viralCount', title: '爆文数', group: 'koc', defaultChecked: true, width: 90 },
  { key: 'viralRate', title: '爆文率(%)', group: 'koc', defaultChecked: true, width: 100 },
  { key: 'estimatedExposure', title: '预估曝光量', group: 'koc', defaultChecked: true, width: 110 },
  { key: 'estimatedReads', title: '预估阅读量', group: 'koc', defaultChecked: true, width: 110 },
  { key: 'commentCount', title: '总评数', group: 'koc', defaultChecked: true, width: 90 },
  { key: 'validInquiryCount', title: '总有效咨询数', group: 'koc', defaultChecked: true, width: 120 },
  { key: 'validInquiryRate', title: '有效咨询率(%)', group: 'koc', defaultChecked: true, width: 120 },
  { key: 'avgValidInquiry', title: '平均有效咨询数', group: 'koc', defaultChecked: true, width: 130 },
  { key: 'interactionCount', title: '总互动数', group: 'koc', defaultChecked: true, width: 100 },
  { key: 'avgInteraction', title: '平均互动数', group: 'koc', defaultChecked: true, width: 110 },
];

export const DEFAULT_VISIBLE_COLUMNS = COLUMN_METAS.filter((item) => item.defaultChecked !== false).map(
  (item) => item.key,
);

export const PLATFORM_OPTIONS = [
  { label: '小红书', value: 'xiaohongshu' },
  { label: '抖音', value: 'douyin' },
  { label: '微博', value: 'weibo' },
];

export const OFFICE_OPTIONS = [
  { label: '默认分组', value: 'default' },
  { label: '代表处/广东', value: 'gd' },
  { label: '代表处/北京', value: 'bj' },
  { label: '代表处/上海', value: 'sh' },
];

export const STATUS_OPTIONS = [
  { label: '可用', value: '可用' },
  { label: '不可用', value: '不可用' },
];

export const LIST_STATUS_OPTIONS = [
  { label: '默认', value: '默认' },
  { label: '重点', value: '重点' },
  { label: '观察', value: '观察' },
];

export const DIMENSION_OPTIONS = [
  { label: '用户维度', value: 'user' },
  { label: '账号维度', value: 'account' },
  { label: '账号权重', value: 'weight' },
  { label: '历史代表处', value: 'history' },
];

const NICKNAMES = ['W.ym', '晓雨', '阿泽', 'Lin.', '小满', '北北', 'Momo', '清清'];
const SOURCES = ['公域挖掘', '自然引流', '活动报名', '人工导入'];
const OWNER_TAGS = ['认证车主', '潜客', '忠实用户', '试驾用户'];
const CONTENT_TAGS = ['种草', '测评', '探店', '对比'];
const EFFECT_TAGS = ['高互动', '高转化', '稳定产出'];
const TRACKS = ['SUV', '轿车', '新能源', '豪华'];
const STORES = ['朝阳店', '浦东店', '天河店', '西湖店', '武侯店'];
const STRUCTURES = ['个人号', '矩阵号', '机构号'];
const PROVINCES = [
  { province: '北京', city: '北京' },
  { province: '上海', city: '上海' },
  { province: '广东', city: '广州' },
  { province: '浙江', city: '杭州' },
  { province: '四川', city: '成都' },
];

function maskPhone(seed: number) {
  const prefix = ['185', '138', '139', '186', '137'][seed % 5];
  const suffix = String(100 + (seed % 900)).padStart(3, '0');
  return `${prefix}****${suffix}`;
}

function pad(num: number) {
  return String(num).padStart(2, '0');
}

function mockTime(seed: number, day = 1) {
  const month = (seed % 12) + 1;
  return `2025-${pad(month)}-${pad((day % 28) + 1)} ${pad(seed % 24)}:${pad((seed * 7) % 60)}:00`;
}

export const MOCK_KOX_LIST: KoxRecord[] = Array.from({ length: 48 }, (_, index) => {
  const loc = PROVINCES[index % PROVINCES.length];
  const office = OFFICE_OPTIONS[index % OFFICE_OPTIONS.length];
  const platform = PLATFORM_OPTIONS[index % PLATFORM_OPTIONS.length];
  const viralCount = index % 6;
  const publishedCount = 8 + (index % 20);
  const validInquiryCount = 2 + (index % 15);
  const interactionCount = 30 + index * 3;

  return {
    key: String(index + 1),
    source: SOURCES[index % SOURCES.length],
    group: office.label,
    koxId: 700 + index * 17,
    nickname: NICKNAMES[index % NICKNAMES.length],
    phone: maskPhone(index + 3),
    province: loc.province,
    city: loc.city,
    ipLocation: loc.city,
    status: index % 7 === 0 ? '不可用' : '可用',
    listStatus: LIST_STATUS_OPTIONS[index % LIST_STATUS_OPTIONS.length].value,
    historyOffice: index % 4 === 0 ? office.label : '-',
    unbindTime: index % 5 === 0 ? mockTime(index + 2, 12) : '-',
    hasCdpTag: index % 3 === 0 ? '是' : '否',
    ownerTag: OWNER_TAGS[index % OWNER_TAGS.length],
    ownerTagStart: mockTime(index + 1, 3),
    ownerTagEnd: mockTime(index + 8, 20),
    tags: `${OWNER_TAGS[index % OWNER_TAGS.length]},${CONTENT_TAGS[index % CONTENT_TAGS.length]}`,
    contentTag: CONTENT_TAGS[index % CONTENT_TAGS.length],
    effectTag: EFFECT_TAGS[index % EFFECT_TAGS.length],
    mentionCompetitor: index % 4 === 0 ? '是' : '否',
    competitorModel: index % 4 === 0 ? ['Model Y', '汉EV', '唐DM'][index % 3] : '-',
    totalPoints: 1200 + index * 37,
    remark: index % 6 === 0 ? '重点跟进' : '-',
    createTime: mockTime(index + 4, 5),
    tagUpdateTime: mockTime(index + 6, 9),
    track: TRACKS[index % TRACKS.length],
    store: STORES[index % STORES.length],
    registerTime: mockTime(index + 3, 2),
    openId: `ox_${100000 + index}`,
    unionId: `un_${200000 + index}`,
    platformNickname: `${NICKNAMES[index % NICKNAMES.length]}_p`,
    platform: platform.value,
    office: office.value,
    followers: 1200 + index * 280,
    accountStructure: STRUCTURES[index % STRUCTURES.length],
    taskCount: 3 + (index % 12),
    publishedCount,
    viralCount,
    viralRate: Number(((viralCount / publishedCount) * 100).toFixed(1)),
    estimatedExposure: 8000 + index * 520,
    estimatedReads: 3200 + index * 210,
    commentCount: 40 + index * 5,
    validInquiryCount,
    validInquiryRate: Number(((validInquiryCount / Math.max(publishedCount, 1)) * 100).toFixed(1)),
    avgValidInquiry: Number((validInquiryCount / Math.max(publishedCount, 1)).toFixed(2)),
    interactionCount,
    avgInteraction: Number((interactionCount / Math.max(publishedCount, 1)).toFixed(1)),
  };
});

export function platformLabel(value: string) {
  return PLATFORM_OPTIONS.find((item) => item.value === value)?.label ?? value;
}
