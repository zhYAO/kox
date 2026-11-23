export type SeedTaskType = '图文种草' | '视频种草';
export type SeedCodeType = '基础码' | '活动码';
export type SeedStatus = '已完成' | '进行中' | '已停止';
export type SeedPlatform = '小红书' | '抖音' | '懂车帝' | '视频号';

export type SeedCodeRecord = {
  key: string;
  id: number;
  createTime: string;
  taskName: string;
  taskType: SeedTaskType;
  codeType: SeedCodeType;
  platforms: SeedPlatform[];
  topic: string;
  status: SeedStatus;
  generated: number;
  assigned: number;
  title: string;
  content: string;
  shareTarget: string;
  imageCount: number;
  contentStyle: string;
  presetCount: number;
  link: string;
};

export const TASK_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '图文种草', value: '图文种草' },
  { label: '视频种草', value: '视频种草' },
];

export const CODE_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '基础码', value: '基础码' },
  { label: '活动码', value: '活动码' },
];

export const STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '已完成', value: '已完成' },
  { label: '进行中', value: '进行中' },
  { label: '已停止', value: '已停止' },
];

export const PLATFORM_OPTIONS = [
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '懂车帝', value: '懂车帝' },
  { label: '视频号', value: '视频号' },
];

export const SHARE_TARGET_OPTIONS = [
  { label: '笔记发布', value: '笔记发布' },
  { label: '私信分享', value: '私信分享' },
  { label: '群分享', value: '群分享' },
];

export const CONTENT_STYLE_OPTIONS = [
  { label: '种草安利', value: '种草安利' },
  { label: '测评对比', value: '测评对比' },
  { label: '干货科普', value: '干货科普' },
];

export function platformColor(platform: SeedPlatform) {
  if (platform === '小红书') return 'red';
  if (platform === '抖音') return 'cyan';
  if (platform === '懂车帝') return 'gold';
  return 'purple';
}

const NESTLE_CONTENT = `中老年营养怎么补？科学配方奶粉选对了吗？

家里长辈年纪大了，总说“吃啥都没胃口”🙄
查了好多资料才发现：不是不想吃，是吸收跟不上……

最近入手了雀巢佳膳悠选，真的被科学配方打动🤔🚀

√ 全营养矩阵，一口补齐日常缺口
√ 优质动物蛋白，助力肌肉维持
√ 肠道友好 buff，喝着更轻松
√ 口感清淡好入口，长辈接受度高

真心推荐给有同样困扰的家庭❤️
记得按说明冲泡，坚持喝更有感～

#雀巢佳膳悠选 #佳膳悠选 #中老年营养 #科学补养`;

export const MOCK_SEED_CODES: SeedCodeRecord[] = [
  {
    key: 's1',
    id: 1291,
    createTime: '2026-07-16 14:23:32',
    taskName: 'test0716',
    taskType: '图文种草',
    codeType: '基础码',
    platforms: ['小红书'],
    topic: '#雀巢佳膳悠选',
    status: '已完成',
    generated: 100,
    assigned: 0,
    title: '中老年营养怎么补？科学配方奶粉选对了吗？',
    content: NESTLE_CONTENT,
    shareTarget: '笔记发布',
    imageCount: 3,
    contentStyle: '干货科普',
    presetCount: 100,
    link: 'https://www.xiaohongshu.com/explore/seed-demo-1291',
  },
  {
    key: 's2',
    id: 1288,
    createTime: '2026-07-15 10:08:11',
    taskName: '亚洲龙用户种草',
    taskType: '图文种草',
    codeType: '基础码',
    platforms: ['抖音', '懂车帝'],
    topic: '#亚洲龙 #丰田',
    status: '已停止',
    generated: 6,
    assigned: 4,
    title: '亚洲龙长期车主真实感受',
    content: '开了两年亚洲龙，空间、静谧性和油耗都挺均衡，家用通勤很合适。\n\n#亚洲龙 #丰田',
    shareTarget: '笔记发布',
    imageCount: 4,
    contentStyle: '测评对比',
    presetCount: 20,
    link: 'https://www.douyin.com/seed-demo-1288',
  },
  {
    key: 's3',
    id: 1280,
    createTime: '2026-07-12 16:41:05',
    taskName: '华为智能驾驶体验',
    taskType: '视频种草',
    codeType: '活动码',
    platforms: ['小红书', '抖音'],
    topic: '#华为智能驾驶',
    status: '进行中',
    generated: 40,
    assigned: 18,
    title: '智驾新手也能轻松上手',
    content: '第一次开智驾，跟车变道提示很清晰，新手友好。\n\n#华为智能驾驶 #智驾体验',
    shareTarget: '私信分享',
    imageCount: 1,
    contentStyle: '种草安利',
    presetCount: 50,
    link: 'https://www.xiaohongshu.com/explore/seed-demo-1280',
  },
  {
    key: 's4',
    id: 1275,
    createTime: '2026-07-08 09:22:47',
    taskName: '问界M7春季种草',
    taskType: '图文种草',
    codeType: '基础码',
    platforms: ['小红书'],
    topic: '#问界M7 #春季出行',
    status: '已完成',
    generated: 80,
    assigned: 80,
    title: '周末郊游一台就够',
    content: '带娃出城，后备箱和续航都够用，问界M7真的很适合家庭场景。\n\n#问界M7 #春季出行',
    shareTarget: '笔记发布',
    imageCount: 5,
    contentStyle: '种草安利',
    presetCount: 80,
    link: 'https://www.xiaohongshu.com/explore/seed-demo-1275',
  },
  {
    key: 's5',
    id: 1266,
    createTime: '2026-07-01 19:15:20',
    taskName: '尚界H5门店活动',
    taskType: '图文种草',
    codeType: '活动码',
    platforms: ['懂车帝', '视频号'],
    topic: '#尚界H5',
    status: '进行中',
    generated: 25,
    assigned: 9,
    title: '门店试驾避坑指南',
    content: '预约、路线、对比竞品，这份试驾清单帮你少走弯路。\n\n#尚界H5 #试驾',
    shareTarget: '群分享',
    imageCount: 2,
    contentStyle: '干货科普',
    presetCount: 30,
    link: 'https://www.dongchedi.com/seed-demo-1266',
  },
  {
    key: 's6',
    id: 1250,
    createTime: '2026-06-22 11:33:58',
    taskName: '享界S9T商务向',
    taskType: '视频种草',
    codeType: '基础码',
    platforms: ['抖音'],
    topic: '#享界S9T',
    status: '已停止',
    generated: 12,
    assigned: 12,
    title: '行政座舱通勤一天体验',
    content: '后排办公舒适度很高，隔音和座椅都很能打。\n\n#享界S9T #商务出行',
    shareTarget: '笔记发布',
    imageCount: 1,
    contentStyle: '测评对比',
    presetCount: 15,
    link: 'https://www.douyin.com/seed-demo-1250',
  },
];

let runtimeSeedCodes: SeedCodeRecord[] = [...MOCK_SEED_CODES];

export function getSeedCodes() {
  return runtimeSeedCodes;
}

export function setSeedCodes(next: SeedCodeRecord[]) {
  runtimeSeedCodes = next;
}

export function findSeedCode(key?: string) {
  if (!key) return runtimeSeedCodes[0];
  return runtimeSeedCodes.find((item) => item.key === key) || runtimeSeedCodes[0];
}
