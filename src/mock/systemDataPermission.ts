export type OrgNodeType = '总部' | '大区' | '代表处';

export type OrgDataScope = '全量数据（总部）' | '本大区及下级' | '仅本代表处';

export type OrgNode = {
  key: string;
  name: string;
  type: OrgNodeType;
  members: string[];
  dataScope: OrgDataScope;
  regionCode?: string;
  children?: OrgNode[];
};

export const REGION_OPTIONS = [
  { label: '华东大区', value: 'east' },
  { label: '华南大区', value: 'south' },
  { label: '华北大区', value: 'north' },
  { label: '西南大区', value: 'southwest' },
  { label: '西北大区', value: 'northwest' },
];

export const MOCK_ORG_TREE: OrgNode[] = [
  {
    key: 'hq',
    name: '品牌总部',
    type: '总部',
    members: ['kox_admin', 'yunying01', 'tenant1_user', 'admin'],
    dataScope: '全量数据（总部）',
    children: [
      {
        key: 'east',
        name: '华东大区',
        type: '大区',
        members: ['ops_chen', 'ops_lin'],
        dataScope: '本大区及下级',
        regionCode: 'east',
        children: [
          {
            key: 'east-1',
            name: '上海代表处',
            type: '代表处',
            members: ['cs_zhou'],
            dataScope: '仅本代表处',
            regionCode: 'east',
          },
          {
            key: 'east-2',
            name: '杭州代表处',
            type: '代表处',
            members: ['viewer_ma'],
            dataScope: '仅本代表处',
            regionCode: 'east',
          },
        ],
      },
      {
        key: 'south',
        name: '华南大区',
        type: '大区',
        members: ['ops_wu'],
        dataScope: '本大区及下级',
        regionCode: 'south',
        children: [
          {
            key: 'south-1',
            name: '广州代表处',
            type: '代表处',
            members: ['cs_sun'],
            dataScope: '仅本代表处',
            regionCode: 'south',
          },
        ],
      },
      {
        key: 'north',
        name: '华北大区',
        type: '大区',
        members: ['data_zhao'],
        dataScope: '本大区及下级',
        regionCode: 'north',
        children: [],
      },
    ],
  },
];

export const MEMBER_ACCOUNT_OPTIONS = [
  'kox_admin',
  'yunying01',
  'tenant1_user',
  'admin',
  'ops_chen',
  'ops_lin',
  'ops_wu',
  'data_zhao',
  'cs_zhou',
  'cs_sun',
  'viewer_ma',
];

export function typeColor(type: OrgNodeType) {
  if (type === '总部') return 'red';
  if (type === '大区') return 'blue';
  return 'green';
}

export function scopeColor(scope: OrgDataScope) {
  if (scope === '全量数据（总部）') return 'purple';
  if (scope === '本大区及下级') return 'geekblue';
  return 'cyan';
}

export function updateOrgTree(
  nodes: OrgNode[],
  key: string,
  updater: (node: OrgNode) => OrgNode,
): OrgNode[] {
  return nodes.map((node) => {
    if (node.key === key) return updater(node);
    if (node.children?.length) {
      return { ...node, children: updateOrgTree(node.children, key, updater) };
    }
    return node;
  });
}

export function appendChild(
  nodes: OrgNode[],
  parentKey: string,
  child: OrgNode,
): OrgNode[] {
  return nodes.map((node) => {
    if (node.key === parentKey) {
      return { ...node, children: [...(node.children || []), child] };
    }
    if (node.children?.length) {
      return { ...node, children: appendChild(node.children, parentKey, child) };
    }
    return node;
  });
}
