export type BrandOrgType = '品牌商' | '大区' | '门店' | '部门';

export type BrandOrgNode = {
  key: string;
  title: string;
  children?: BrandOrgNode[];
};

export type BrandOrgRecord = {
  key: string;
  shortName: string;
  fullName: string;
  type: BrandOrgType;
  owner: string;
  parentKey: string;
};

export const BRAND_ORG_TYPE_OPTIONS = [
  { label: '全部类型', value: '' },
  { label: '品牌商', value: '品牌商' },
  { label: '大区', value: '大区' },
  { label: '门店', value: '门店' },
  { label: '部门', value: '部门' },
];

export const MOCK_BRAND_ORG_TREE: BrandOrgNode[] = [
  {
    key: 'root',
    title: '品牌总部',
    children: [
      {
        key: 'askey',
        title: '问界',
        children: [
          { key: 'askey-east', title: '华东大区' },
          { key: 'askey-south', title: '华南大区' },
          { key: 'askey-north', title: '华北大区' },
        ],
      },
      {
        key: 'fotile',
        title: '方太',
        children: [
          { key: 'fotile-east', title: '华东渠道' },
          { key: 'fotile-west', title: '西南渠道' },
        ],
      },
      {
        key: 'crv',
        title: '华润万家',
        children: [
          { key: 'crv-sh', title: '上海门店群' },
          { key: 'crv-sz', title: '深圳门店群' },
        ],
      },
    ],
  },
];

export const MOCK_BRAND_ORGS: BrandOrgRecord[] = [
  {
    key: '1',
    shortName: '品牌总部',
    fullName: 'KoxLink 品牌运营总部',
    type: '品牌商',
    owner: 'kox_admin',
    parentKey: 'root',
  },
  {
    key: '2',
    shortName: '问界',
    fullName: '问界汽车品牌事业部',
    type: '品牌商',
    owner: '张凯',
    parentKey: 'root',
  },
  {
    key: '3',
    shortName: '华东大区',
    fullName: '问界华东销售大区',
    type: '大区',
    owner: '陈思远',
    parentKey: 'askey',
  },
  {
    key: '4',
    shortName: '华南大区',
    fullName: '问界华南销售大区',
    type: '大区',
    owner: '林婉清',
    parentKey: 'askey',
  },
  {
    key: '5',
    shortName: '华北大区',
    fullName: '问界华北销售大区',
    type: '大区',
    owner: '赵启明',
    parentKey: 'askey',
  },
  {
    key: '6',
    shortName: '方太',
    fullName: '方太厨电品牌合作方',
    type: '品牌商',
    owner: '王敏',
    parentKey: 'root',
  },
  {
    key: '7',
    shortName: '华东渠道',
    fullName: '方太华东渠道运营中心',
    type: '大区',
    owner: '周雨桐',
    parentKey: 'fotile',
  },
  {
    key: '8',
    shortName: '西南渠道',
    fullName: '方太西南渠道运营中心',
    type: '大区',
    owner: '吴佳宁',
    parentKey: 'fotile',
  },
  {
    key: '9',
    shortName: '华润万家',
    fullName: '华润万家零售合作品牌',
    type: '品牌商',
    owner: 'ole',
    parentKey: 'root',
  },
  {
    key: '10',
    shortName: '上海门店群',
    fullName: '华润万家上海重点门店群',
    type: '门店',
    owner: '孙悦',
    parentKey: 'crv',
  },
  {
    key: '11',
    shortName: '深圳门店群',
    fullName: '华润万家深圳重点门店群',
    type: '门店',
    owner: '马俊杰',
    parentKey: 'crv',
  },
  {
    key: '12',
    shortName: '运营部',
    fullName: '品牌总部内容运营部',
    type: '部门',
    owner: 'yunying01',
    parentKey: 'root',
  },
];

export function collectTreeKeys(nodes: BrandOrgNode[]): string[] {
  const keys: string[] = [];
  const walk = (list: BrandOrgNode[]) => {
    list.forEach((n) => {
      keys.push(n.key);
      if (n.children?.length) walk(n.children);
    });
  };
  walk(nodes);
  return keys;
}

export function filterBrandTree(nodes: BrandOrgNode[], keyword: string): BrandOrgNode[] {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return nodes;
  const walk = (list: BrandOrgNode[]): BrandOrgNode[] =>
    list
      .map((node) => {
        const children = node.children ? walk(node.children) : [];
        if (node.title.toLowerCase().includes(kw) || children.length) {
          return { ...node, children };
        }
        return null;
      })
      .filter(Boolean) as BrandOrgNode[];
  return walk(nodes);
}
