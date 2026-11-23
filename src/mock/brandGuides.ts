export type GuidePlatform = '小红书' | '抖音' | '视频号';

export type GuideAccountNode = {
  key: string;
  title: string;
  children?: GuideAccountNode[];
};

export type GuidePerson = {
  key: string;
  platform: GuidePlatform;
  phone: string;
  group: string;
  name: string;
  region: string;
  province: string;
  store: string;
  supervisor: string;
  treeKey: string;
};

export const GUIDE_PLATFORM_OPTIONS = [
  { label: '全部平台', value: '' },
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '视频号', value: '视频号' },
];

export const MOCK_GUIDE_ACCOUNT_TREE: GuideAccountNode[] = [
  {
    key: 'all',
    title: '全部账号',
    children: [
      {
        key: 'east',
        title: '华东大区',
        children: [
          { key: 'east-sh', title: '上海门店群' },
          { key: 'east-hz', title: '杭州门店群' },
        ],
      },
      {
        key: 'south',
        title: '华南大区',
        children: [
          { key: 'south-gz', title: '广州门店群' },
          { key: 'south-sz', title: '深圳门店群' },
        ],
      },
      {
        key: 'north',
        title: '华北大区',
        children: [{ key: 'north-bj', title: '北京门店群' }],
      },
    ],
  },
];

export const MOCK_GUIDE_PERSONS: GuidePerson[] = [
  {
    key: '1',
    platform: '小红书',
    phone: '13812342108',
    group: '华东导购组',
    name: '陈思远',
    region: '华东',
    province: '上海',
    store: '静安体验中心',
    supervisor: '王督导',
    treeKey: 'east-sh',
  },
  {
    key: '2',
    platform: '抖音',
    phone: '13988666331',
    group: '华东导购组',
    name: '林婉清',
    region: '华东',
    province: '浙江',
    store: '杭州西湖店',
    supervisor: '王督导',
    treeKey: 'east-hz',
  },
  {
    key: '3',
    platform: '小红书',
    phone: '13699009082',
    group: '华北导购组',
    name: '赵启明',
    region: '华北',
    province: '北京',
    store: '朝阳体验店',
    supervisor: '张督导',
    treeKey: 'north-bj',
  },
  {
    key: '4',
    platform: '视频号',
    phone: '13744154415',
    group: '华南导购组',
    name: '周雨桐',
    region: '华南',
    province: '广东',
    store: '广州天河店',
    supervisor: '李督导',
    treeKey: 'south-gz',
  },
  {
    key: '5',
    platform: '小红书',
    phone: '13577207720',
    group: '华南导购组',
    name: '吴佳宁',
    region: '华南',
    province: '广东',
    store: '深圳南山店',
    supervisor: '李督导',
    treeKey: 'south-sz',
  },
  {
    key: '6',
    platform: '抖音',
    phone: '15833563356',
    group: '华北导购组',
    name: '郑浩然',
    region: '华北',
    province: '北京',
    store: '海淀旗舰店',
    supervisor: '张督导',
    treeKey: 'north-bj',
  },
  {
    key: '7',
    platform: '小红书',
    phone: '18699019901',
    group: '华南导购组',
    name: '孙悦',
    region: '华南',
    province: '广东',
    store: '广州天河店',
    supervisor: '李督导',
    treeKey: 'south-gz',
  },
  {
    key: '8',
    platform: '抖音',
    phone: '13122882288',
    group: '华东导购组',
    name: '马俊杰',
    region: '华东',
    province: '上海',
    store: '浦东体验店',
    supervisor: '王督导',
    treeKey: 'east-sh',
  },
];

export function filterGuideTree(nodes: GuideAccountNode[], keyword: string): GuideAccountNode[] {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return nodes;
  const walk = (list: GuideAccountNode[]): GuideAccountNode[] =>
    list
      .map((node) => {
        const children = node.children ? walk(node.children) : [];
        if (node.title.toLowerCase().includes(kw) || children.length) {
          return { ...node, children };
        }
        return null;
      })
      .filter(Boolean) as GuideAccountNode[];
  return walk(nodes);
}

export function collectDescendantKeys(nodes: GuideAccountNode[], target: string): string[] {
  let found: GuideAccountNode | null = null;
  const find = (list: GuideAccountNode[]): boolean => {
    for (const node of list) {
      if (node.key === target) {
        found = node;
        return true;
      }
      if (node.children && find(node.children)) return true;
    }
    return false;
  };
  find(nodes);
  if (!found) return [target];
  const keys: string[] = [];
  const walk = (node: GuideAccountNode) => {
    keys.push(node.key);
    node.children?.forEach(walk);
  };
  walk(found);
  return keys;
}
