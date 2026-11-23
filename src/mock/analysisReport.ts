export type AnalysisReport = {
  key: string;
  name: string;
  keywords: string;
  status: '生成中' | '已完成';
  createTime: string;
  regions?: string[];
  excludeWords?: string;
  wordDistance?: number;
  ordered?: boolean;
  dimensions?: string[];
};

export const REPORT_STATUS_OPTIONS = [
  { label: '生成中', value: '生成中' },
  { label: '已完成', value: '已完成' },
];

export const REGION_OPTIONS = [
  { label: '东城区', value: '东城区' },
  { label: '西城区', value: '西城区' },
  { label: '朝阳区', value: '朝阳区' },
  { label: '海淀区', value: '海淀区' },
  { label: '浦东新区', value: '浦东新区' },
  { label: '天河区', value: '天河区' },
];

export const DIMENSION_GROUPS = [
  {
    title: '舆情概况',
    items: [
      { label: '舆情概况', value: '舆情概况' },
      { label: '事件脉络', value: '事件脉络' },
    ],
  },
  {
    title: '舆情传播分析',
    items: [
      { label: '舆情走势分析', value: '舆情走势分析' },
      { label: '网络平台分布', value: '网络平台分布' },
      { label: '媒体热度', value: '媒体热度' },
      { label: '网络热搜分析', value: '网络热搜分析', isNew: true },
      { label: '高热传播发文', value: '高热传播发文', isNew: true },
      { label: '热词演变趋势', value: '热词演变趋势', isNew: true },
      { label: 'MCN参与情况', value: 'MCN参与情况', isNew: true },
    ],
  },
  {
    title: '舆论焦点',
    items: [
      { label: '新闻媒体焦点', value: '新闻媒体焦点' },
      { label: '网民评论焦点', value: '网民评论焦点' },
      { label: '网络大V焦点', value: '网络大V焦点', isNew: true },
      { label: '事件风险点分析', value: '事件风险点分析', isNew: true },
      { label: '舆情处置建议', value: '舆情处置建议' },
      { label: '舆情案例回顾', value: '舆情案例回顾' },
    ],
  },
];

export const DEFAULT_DIMENSIONS = DIMENSION_GROUPS.flatMap((group) =>
  group.items.map((item) => item.value),
);

export const MOCK_ANALYSIS_REPORTS: AnalysisReport[] = [
  {
    key: '1',
    name: '服务口碑测试',
    keywords: '服务|口碑|投诉',
    status: '已完成',
    createTime: '2026-06-30 11:39:39',
    regions: ['东城区'],
    excludeWords: '',
    wordDistance: 0,
    ordered: true,
    dimensions: DEFAULT_DIMENSIONS,
  },
  {
    key: '2',
    name: '问界M9',
    keywords: '问界|M9|提车|异常',
    status: '已完成',
    createTime: '2026-06-28 16:20:11',
    regions: ['朝阳区', '海淀区'],
    excludeWords: '广告',
    wordDistance: 2,
    ordered: true,
    dimensions: DEFAULT_DIMENSIONS,
  },
  {
    key: '3',
    name: '春季试驾舆情',
    keywords: '试驾&M7',
    status: '生成中',
    createTime: '2026-07-30 17:53:00',
    regions: ['浦东新区'],
    excludeWords: '333',
    wordDistance: 0,
    ordered: true,
    dimensions: DEFAULT_DIMENSIONS,
  },
  {
    key: '4',
    name: '新能源口碑监测',
    keywords: '续航|充电|智驾',
    status: '已完成',
    createTime: '2026-05-18 09:12:45',
  },
  {
    key: '5',
    name: '竞品对比专题',
    keywords: 'Model Y|理想L7',
    status: '生成中',
    createTime: '2026-07-29 14:08:22',
  },
  {
    key: '6',
    name: '交付体验复盘',
    keywords: '交付|提车|门店',
    status: '已完成',
    createTime: '2026-04-02 20:30:18',
  },
];
