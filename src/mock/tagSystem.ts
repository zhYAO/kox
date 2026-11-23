export type TagNodeType = 'folder' | 'tag';

export type TagTreeNode = {
  key: string;
  title: string;
  type: TagNodeType;
  tagId?: number;
  code?: string;
  description?: string;
  tagType?: string;
  updateMode?: string;
  creator?: string;
  koxCount?: number;
  createTime?: string;
  updateTime?: string;
  tagUpdateTime?: string;
  triggerRule?: string;
  excludeRule?: string;
  extraRule?: string;
  children?: TagTreeNode[];
};

export const TAG_TYPE_OPTIONS = [
  { label: 'CDP标签', value: 'CDP标签' },
  { label: '运营标签', value: '运营标签' },
  { label: '效果标签', value: '效果标签' },
];

export const UPDATE_MODE_OPTIONS = [
  { label: 'AI打标', value: 'AI打标' },
  { label: '自动圈选', value: '自动圈选' },
  { label: '人工打标', value: '人工打标' },
];

export const INITIAL_TAG_TREE: TagTreeNode[] = [
  {
    key: 'folder-model',
    title: '车型',
    type: 'folder',
    code: 'model',
    description: '车型相关标签',
    children: [
      {
        key: 'tag-m7',
        title: 'M7',
        type: 'tag',
        tagId: 188,
        code: 'model_m7',
        tagType: 'CDP标签',
        updateMode: '自动圈选',
        creator: '系统管理员',
        description: '',
        koxCount: 211,
        createTime: '2026-04-15 21:09:17',
        updateTime: '2026-06-11 16:19:42',
        tagUpdateTime: '2026-04-15 21:09:18',
      },
      {
        key: 'tag-m9',
        title: 'M9',
        type: 'tag',
        code: 'model_m9',
        tagType: 'CDP标签',
        updateMode: '自动圈选',
        creator: '系统管理员',
        koxCount: 96,
        createTime: '2026-04-15 21:10:01',
        updateTime: '2026-06-01 12:00:00',
        tagUpdateTime: '2026-04-15 21:10:02',
      },
      {
        key: 'tag-m5',
        title: 'M5',
        type: 'tag',
        code: 'model_m5',
        tagType: 'CDP标签',
        updateMode: 'AI打标',
        creator: '运营同学',
        koxCount: 54,
        createTime: '2026-03-02 10:11:12',
        updateTime: '2026-05-20 09:30:00',
        tagUpdateTime: '2026-03-02 10:11:13',
      },
      {
        key: 'tag-m8',
        title: 'M8',
        type: 'tag',
        code: 'model_m8',
        tagType: '运营标签',
        updateMode: '人工打标',
        creator: '运营同学',
        koxCount: 33,
        createTime: '2026-02-18 08:20:00',
        updateTime: '2026-04-08 14:15:00',
        tagUpdateTime: '2026-02-18 08:20:01',
      },
      {
        key: 'tag-m6',
        title: 'M6',
        type: 'tag',
        code: 'model_m6',
        tagType: 'CDP标签',
        updateMode: '自动圈选',
        creator: '系统管理员',
        koxCount: 28,
        createTime: '2026-01-11 19:00:00',
        updateTime: '2026-03-22 11:11:11',
        tagUpdateTime: '2026-01-11 19:00:01',
      },
    ],
  },
  {
    key: 'folder-energy',
    title: '能源类别',
    type: 'folder',
    code: 'energy',
    children: [
      {
        key: 'tag-ev',
        title: '纯电',
        type: 'tag',
        code: 'energy_ev',
        tagType: 'CDP标签',
        updateMode: '自动圈选',
        creator: '系统管理员',
        koxCount: 120,
        createTime: '2026-01-01 10:00:00',
        updateTime: '2026-05-01 10:00:00',
        tagUpdateTime: '2026-01-01 10:00:01',
      },
      {
        key: 'tag-hev',
        title: '混动',
        type: 'tag',
        code: 'energy_hev',
        tagType: 'CDP标签',
        updateMode: 'AI打标',
        creator: '系统管理员',
        koxCount: 76,
        createTime: '2026-01-01 10:05:00',
        updateTime: '2026-05-01 10:05:00',
        tagUpdateTime: '2026-01-01 10:05:01',
      },
    ],
  },
  {
    key: 'folder-lead',
    title: '留资',
    type: 'folder',
    code: 'lead',
    children: [
      {
        key: 'tag-lead-high',
        title: '高意向留资',
        type: 'tag',
        code: 'lead_high',
        tagType: '效果标签',
        updateMode: 'AI打标',
        creator: '运营同学',
        koxCount: 45,
        createTime: '2025-12-12 12:12:12',
        updateTime: '2026-04-04 04:04:04',
        tagUpdateTime: '2025-12-12 12:12:13',
        triggerRule: '内容提及留资、试驾、询价等转化意图',
      },
    ],
  },
  {
    key: 'folder-delivery',
    title: '交车',
    type: 'folder',
    code: 'delivery',
    children: [],
  },
  {
    key: 'folder-ai',
    title: '通过AI判定',
    type: 'folder',
    code: 'ai_judge',
    children: [
      {
        key: 'tag-ai-quality',
        title: '高质量',
        type: 'tag',
        code: 'ai_quality',
        tagType: '效果标签',
        updateMode: 'AI打标',
        creator: '系统管理员',
        koxCount: 88,
        createTime: '2025-11-11 11:11:11',
        updateTime: '2026-06-01 08:00:00',
        tagUpdateTime: '2025-11-11 11:11:12',
        triggerRule: '内容质量高、互动稳定',
        excludeRule: '存在明显营销水军特征',
      },
    ],
  },
];

export function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export function findNode(nodes: TagTreeNode[], key: string): TagTreeNode | null {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children?.length) {
      const found = findNode(node.children, key);
      if (found) return found;
    }
  }
  return null;
}

export function updateNode(
  nodes: TagTreeNode[],
  key: string,
  patch: Partial<TagTreeNode>,
): TagTreeNode[] {
  return nodes.map((node) => {
    if (node.key === key) return { ...node, ...patch };
    if (node.children?.length) {
      return { ...node, children: updateNode(node.children, key, patch) };
    }
    return node;
  });
}

export function appendChild(
  nodes: TagTreeNode[],
  parentKey: string | null,
  child: TagTreeNode,
): TagTreeNode[] {
  if (!parentKey) return [...nodes, child];
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

export function collectFolderKeys(nodes: TagTreeNode[]): string[] {
  const keys: string[] = [];
  const walk = (list: TagTreeNode[]) => {
    list.forEach((node) => {
      if (node.type === 'folder') {
        keys.push(node.key);
        if (node.children?.length) walk(node.children);
      }
    });
  };
  walk(nodes);
  return keys;
}

export function filterTree(nodes: TagTreeNode[], keyword: string): TagTreeNode[] {
  const text = keyword.trim().toLowerCase();
  if (!text) return nodes;

  const walk = (list: TagTreeNode[]): TagTreeNode[] =>
    list
      .map((node) => {
        const children = node.children ? walk(node.children) : [];
        const matched = node.title.toLowerCase().includes(text);
        if (matched || children.length) {
          return { ...node, children };
        }
        return null;
      })
      .filter(Boolean) as TagTreeNode[];

  return walk(nodes);
}
