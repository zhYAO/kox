export type MaterialType = '图片' | '视频';

export type MaterialGroup = {
  key: string;
  name: string;
  parentKey?: string;
  /** 层级 1-3 */
  level: 1 | 2 | 3;
};

export type MaterialItem = {
  key: string;
  title: string;
  type: MaterialType;
  /** 所属分组；空表示未分配 */
  groupKey?: string;
  tags: string[];
  uploadTime: string;
  cover: string;
};

export const UNASSIGNED_LABEL = '未分配';

const COVER_COLORS = ['#1677ff', '#13c2c2', '#722ed1', '#eb2f96', '#fa8c16', '#52c41a', '#2f54eb', '#fa541c'];

export function materialCover(index: number, title: string, type: MaterialType) {
  const color = COVER_COLORS[index % COVER_COLORS.length];
  const badge = type === '视频' ? '▶' : '🖼';
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="100%" stop-color="#001529"/>
        </linearGradient>
      </defs>
      <rect width="480" height="360" fill="url(#g)"/>
      <text x="36" y="60" fill="rgba(255,255,255,0.85)" font-size="22" font-family="Arial">${badge} ${type}</text>
      <text x="36" y="200" fill="white" font-size="32" font-family="Arial">${title.slice(0, 8)}</text>
    </svg>`,
  );
  return `data:image/svg+xml,${svg}`;
}

export const MOCK_GROUPS: MaterialGroup[] = [
  { key: 'g_car', name: '汽车', level: 1 },
  { key: 'g_car_ext', name: '外观', parentKey: 'g_car', level: 2 },
  { key: 'g_car_int', name: '内饰', parentKey: 'g_car', level: 2 },
  { key: 'g_life', name: '生活', level: 1 },
  { key: 'g_life_food', name: '美食', parentKey: 'g_life', level: 2 },
];

const SEED: Array<Omit<MaterialItem, 'cover'>> = [
  { key: 'm1', title: '外观', type: '图片', groupKey: 'g_car_ext', tags: ['问界M9', '外观'], uploadTime: '2026-07-12 21:37' },
  { key: 'm2', title: '巧克力奶', type: '图片', tags: ['美食', '巧克力奶'], uploadTime: '2026-07-20 17:16' },
  { key: 'm3', title: '房源', type: '图片', tags: ['房源', '样板间'], uploadTime: '2026-07-18 10:22' },
  { key: 'm4', title: '问界M7侧脸', type: '图片', groupKey: 'g_car_ext', tags: ['问界M7', '外观'], uploadTime: '2026-07-15 09:41' },
  { key: 'm5', title: '座舱夜景', type: '视频', groupKey: 'g_car_int', tags: ['内饰', '夜景'], uploadTime: '2026-07-11 14:08' },
  { key: 'm6', title: '春季新品', type: '图片', groupKey: 'g_life', tags: ['春季新品', '官方'], uploadTime: '2026-07-09 16:33' },
  { key: 'm7', title: '试驾路况', type: '视频', groupKey: 'g_car', tags: ['试驾', '路况'], uploadTime: '2026-07-08 11:05' },
  { key: 'm8', title: '书架陈列', type: '图片', tags: ['家居', '书架'], uploadTime: '2026-07-07 19:20' },
  { key: 'm9', title: '咖啡拉花', type: '图片', groupKey: 'g_life_food', tags: ['咖啡', '拉花'], uploadTime: '2026-07-06 08:55' },
  { key: 'm10', title: '尚界H5正前', type: '图片', groupKey: 'g_car_ext', tags: ['尚界H5', '外观'], uploadTime: '2026-07-05 13:12' },
  { key: 'm11', title: '方向盘特写', type: '图片', groupKey: 'g_car_int', tags: ['内饰', '方向盘'], uploadTime: '2026-07-04 15:47' },
  { key: 'm12', title: '城市夜景BGM', type: '视频', tags: ['夜景', 'BGM'], uploadTime: '2026-07-03 21:01' },
  { key: 'm13', title: '享界S9T卖点', type: '图片', groupKey: 'g_car', tags: ['享界S9T', '卖点'], uploadTime: '2026-07-02 10:18' },
  { key: 'm14', title: '甜品摆盘', type: '图片', groupKey: 'g_life_food', tags: ['甜品', '摆盘'], uploadTime: '2026-07-01 12:40' },
  { key: 'm15', title: '雨天路面', type: '视频', groupKey: 'g_car', tags: ['雨天', '路况'], uploadTime: '2026-06-30 17:29' },
  { key: 'm16', title: '官方壁纸', type: '图片', tags: ['壁纸', '官方'], uploadTime: '2026-06-28 09:03' },
  { key: 'm17', title: '后备箱空间', type: '图片', groupKey: 'g_car_int', tags: ['空间', '后备箱'], uploadTime: '2026-06-26 14:55' },
  { key: 'm18', title: '露营场景', type: '图片', groupKey: 'g_life', tags: ['露营', '场景'], uploadTime: '2026-06-24 18:11' },
  { key: 'm19', title: '充电桩指引', type: '视频', groupKey: 'g_car', tags: ['充电', '指引'], uploadTime: '2026-06-22 11:36' },
  { key: 'm20', title: '高清车漆', type: '图片', groupKey: 'g_car_ext', tags: ['外观', '高清', '官方'], uploadTime: '2026-06-20 16:48' },
];

export const MOCK_MATERIALS: MaterialItem[] = SEED.map((item, index) => ({
  ...item,
  cover: materialCover(index, item.title, item.type),
}));

export function countByGroup(materials: MaterialItem[], groups: MaterialGroup[]) {
  const map: Record<string, number> = { all: materials.length, unassigned: 0 };
  groups.forEach((g) => {
    map[g.key] = 0;
  });
  materials.forEach((m) => {
    if (!m.groupKey) {
      map.unassigned += 1;
      return;
    }
    map[m.groupKey] = (map[m.groupKey] || 0) + 1;
    // 父级累计
    let parent = groups.find((g) => g.key === m.groupKey)?.parentKey;
    while (parent) {
      map[parent] = (map[parent] || 0) + 1;
      parent = groups.find((g) => g.key === parent)?.parentKey;
    }
  });
  return map;
}

export function groupPathLabel(groups: MaterialGroup[], groupKey?: string) {
  if (!groupKey) return UNASSIGNED_LABEL;
  const chain: string[] = [];
  let current = groups.find((g) => g.key === groupKey);
  while (current) {
    chain.unshift(current.name);
    current = current.parentKey ? groups.find((g) => g.key === current!.parentKey) : undefined;
  }
  return chain.join(' / ') || '图片库';
}

/** 可作为上级的分组（三级不可再选） */
export function parentGroupOptions(groups: MaterialGroup[]) {
  return groups
    .filter((g) => g.level < 3)
    .map((g) => ({
      value: g.key,
      label: `${'　'.repeat(g.level - 1)}${g.name}`,
    }));
}

export function allGroupSelectOptions(groups: MaterialGroup[]) {
  return groups.map((g) => ({
    value: g.key,
    label: groupPathLabel(groups, g.key),
  }));
}
