export type AudiencePackage = {
  key: string;
  name: string;
  volume: number;
  description: string;
  createTime: string;
  mode: 'ai' | 'rule';
  goal?: string;
  ruleDesc?: string;
};

export type MatchedKox = {
  key: string;
  name: string;
  platforms: string[];
  followers: number;
  likes: number;
  label: string;
};

export const CITY_OPTIONS = [
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' },
  { label: '杭州', value: '杭州' },
  { label: '成都', value: '成都' },
];

export const FIELD_OPTIONS = [
  { label: '城市', value: 'city' },
  { label: '省份', value: 'province' },
  { label: '平台', value: 'platform' },
  { label: '粉丝数', value: 'followers' },
  { label: '车主标签', value: 'ownerTag' },
];

export const OPERATOR_OPTIONS = [
  { label: '包含', value: 'include' },
  { label: '不包含', value: 'exclude' },
  { label: '等于', value: 'eq' },
  { label: '大于', value: 'gt' },
  { label: '小于', value: 'lt' },
];

export type RuleCondition = {
  id: string;
  field: string;
  operator: string;
  value?: string;
};

export type RuleGroup = {
  id: string;
  logic: '且' | '或';
  conditions: RuleCondition[];
};

export const MOCK_AUDIENCE_LIST: AudiencePackage[] = [
  {
    key: '1',
    name: 'TEST',
    volume: 8,
    description: '🌸 春季试驾活动定向人群，覆盖小红书高互动车主与潜客，用于 M7 试驾邀约与内容共创。',
    createTime: '2026-03-12 14:22:10',
    mode: 'ai',
    goal:
      '围绕问界 M7 春季试驾活动，在小红书匹配 25-40 岁、关注新能源与家庭出行的高质量 KOX，优先高互动、低风险账号。',
  },
  {
    key: '2',
    name: '巧克力奶',
    volume: 12,
    description: '母婴乳品种草人群包，偏好宝妈内容创作者。',
    createTime: '2026-02-28 09:15:33',
    mode: 'rule',
    ruleDesc: '城市包含北上广深，且平台包含小红书。',
  },
  {
    key: '3',
    name: '奶粉',
    volume: 26,
    description: '🌸 奶粉品类达人池，覆盖测评与日常记录类博主。',
    createTime: '2026-02-18 18:40:02',
    mode: 'ai',
    goal: '匹配母婴赛道、粉丝 1万+、近期有奶粉相关笔记的 KOX。',
  },
  {
    key: '4',
    name: 'demo',
    volume: 5,
    description: '测试用人群包，可随时删除。',
    createTime: '2026-01-09 11:08:45',
    mode: 'rule',
    ruleDesc: '粉丝数大于 1000。',
  },
  {
    key: '5',
    name: '母婴活动A',
    volume: 18,
    description: '🌸 线下快闪联动人群，侧重高转化标签。',
    createTime: '2025-12-22 16:27:19',
    mode: 'ai',
    goal: '筛选高转化母婴博主，支持门店核销活动。',
  },
  {
    key: '6',
    name: '华东车主',
    volume: 33,
    description: '华东地区认证车主与潜客合集。',
    createTime: '2025-11-30 10:12:55',
    mode: 'rule',
    ruleDesc: '省份包含江浙沪。',
  },
  {
    key: '7',
    name: '新能源种草',
    volume: 21,
    description: '新能源内容向达人，适合长图文与短视频种草。',
    createTime: '2025-11-08 20:03:41',
    mode: 'ai',
    goal: '匹配新能源、SUV 相关内容创作者。',
  },
  {
    key: '8',
    name: '高互动池',
    volume: 15,
    description: '历史任务互动表现靠前的 KOX 集合。',
    createTime: '2025-10-16 08:36:07',
    mode: 'rule',
    ruleDesc: '高价值标签包含高互动。',
  },
];

export const MOCK_MATCHED_KOX: MatchedKox[] = [
  {
    key: '1',
    name: '盖一',
    platforms: ['抖音', '小红书'],
    followers: 150391,
    likes: 85230,
    label: '高质量',
  },
  {
    key: '2',
    name: 'yly',
    platforms: ['快手'],
    followers: 177986,
    likes: 95640,
    label: '高质量',
  },
  {
    key: '3',
    name: '小园',
    platforms: ['小红书'],
    followers: 340,
    likes: 1520,
    label: '高质量',
  },
  {
    key: '4',
    name: '是张珂儿没错',
    platforms: ['小红书'],
    followers: 137829,
    likes: 58420,
    label: '高互动',
  },
  {
    key: '5',
    name: '历历山河',
    platforms: ['小红书'],
    followers: 150726,
    likes: 76350,
    label: '高互动',
  },
  {
    key: '6',
    name: '阿璐酱',
    platforms: ['小红书'],
    followers: 1242,
    likes: 3664,
    label: '高互动',
  },
  {
    key: '7',
    name: '北岛日记',
    platforms: ['小红书', '抖音'],
    followers: 88210,
    likes: 42110,
    label: '高质量',
  },
  {
    key: '8',
    name: '车生活Lab',
    platforms: ['抖音'],
    followers: 203445,
    likes: 110230,
    label: '高互动',
  },
];

export function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export function createEmptyCondition(): RuleCondition {
  return {
    id: createId('cond'),
    field: 'city',
    operator: 'include',
    value: undefined,
  };
}

export function createEmptyGroup(logic: '且' | '或' = '且'): RuleGroup {
  return {
    id: createId('group'),
    logic,
    conditions: [createEmptyCondition()],
  };
}
