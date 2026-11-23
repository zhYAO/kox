export type DashboardFolder = {
  key: string;
  title: string;
  children?: { key: string; title: string }[];
};

export type CategoryReportRow = {
  key: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  categoryPath: string;
  activeAccounts: number;
  ctrMin: number;
  ctrMax: number;
};

export const MOCK_MY_DASHBOARDS: DashboardFolder[] = [
  {
    key: 'demo',
    title: '演示',
    children: [{ key: 'board-1', title: '1' }],
  },
  {
    key: 'campaign',
    title: '投放效果',
    children: [
      { key: 'board-roi', title: 'ROI 看板' },
      { key: 'board-ctr', title: 'CTR 监控' },
    ],
  },
];

export const MOCK_SHARED_DASHBOARDS: DashboardFolder[] = [
  {
    key: 'shared',
    title: '协作空间',
    children: [{ key: 'board-shared-1', title: '品牌联投看板' }],
  },
];

const L1 = ['教育培训', '宠物(新)', '母婴', '3C数码', '家居家装', '美妆护肤', '汽车', '食品饮料'];
const L2: Record<string, string[]> = {
  教育培训: ['K12教育', '职业教育', '兴趣培训'],
  '宠物(新)': ['宠物食品', '宠物用品', '宠物医疗'],
  母婴: ['奶粉辅食', '婴童用品', '童装童鞋'],
  '3C数码': ['手机通讯', '电脑办公', '智能硬件'],
  家居家装: ['家具', '家纺', '建材'],
  美妆护肤: ['护肤', '彩妆', '个护'],
  汽车: ['整车', '汽车配件', '车后服务'],
  食品饮料: ['休闲零食', '乳品饮料', '生鲜'],
};
const L3_POOL = ['品牌旗舰', '新品推广', '日常投放', '大促活动', '拉新专项'];
const L4_POOL = ['信息流', '搜索广告', '达人合作', '内容种草', '店铺直投'];

function buildRows(): CategoryReportRow[] {
  const rows: CategoryReportRow[] = [];
  let i = 0;
  L1.forEach((l1) => {
    (L2[l1] || ['综合']).forEach((l2) => {
      L3_POOL.forEach((l3) => {
        L4_POOL.slice(0, 3).forEach((l4) => {
          i += 1;
          const ctrMin = 8 + ((i * 3) % 10) + (i % 5) * 0.2;
          const ctrMax = ctrMin + 4 + (i % 7) * 0.3;
          rows.push({
            key: String(i),
            level1: l1,
            level2: l2,
            level3: l3,
            level4: l4,
            categoryPath: `${l1}/${l2}/${l3}/${l4}`,
            activeAccounts: 20 + ((i * 17) % 180),
            ctrMin: Number(ctrMin.toFixed(2)),
            ctrMax: Number(ctrMax.toFixed(2)),
          });
        });
      });
    });
  });
  return rows;
}

export const MOCK_CATEGORY_REPORT: CategoryReportRow[] = buildRows();
