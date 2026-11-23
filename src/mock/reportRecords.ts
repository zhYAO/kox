export type ReportRecord = {
  key: string;
  type: string;
  title: string;
  status: '已完成' | '处理中' | '失败';
  creator: string;
  startTime: string;
  endTime: string;
  createTime: string;
  summary: {
    qualityStats: string;
    features: string;
    conclusion: string;
  };
};

export const REPORT_TYPE_OPTIONS = [
  { label: 'AI智能分析', value: 'AI智能分析' },
  { label: '任务复盘', value: '任务复盘' },
  { label: '投流分析', value: '投流分析' },
];

export const REPORT_STATUS_OPTIONS = [
  { label: '已完成', value: '已完成' },
  { label: '处理中', value: '处理中' },
  { label: '失败', value: '失败' },
];

export const MOCK_REPORT_RECORDS: ReportRecord[] = Array.from({ length: 75 }, (_, index) => {
  const day = String((index % 28) + 1).padStart(2, '0');
  const hour = String(10 + (index % 10)).padStart(2, '0');
  const minute = String((index * 3) % 60).padStart(2, '0');
  const createTime = `2026-07-${day} ${hour}:${minute}:00`;
  const type = REPORT_TYPE_OPTIONS[index % REPORT_TYPE_OPTIONS.length].value;
  const status = index % 11 === 0 ? '处理中' : index % 17 === 0 ? '失败' : '已完成';

  return {
    key: String(index + 1),
    type,
    title: `${type}-${createTime.slice(0, 16)}`,
    status,
    creator: index % 4 === 0 ? 'ops_lily' : 'kox_admin',
    startTime: createTime,
    endTime: status === '处理中' ? '-' : `2026-07-${day} ${hour}:${String((Number(minute) + 8) % 60).padStart(2, '0')}:12`,
    createTime,
    summary: {
      qualityStats: `优质笔记统计：总笔记 ${2 + (index % 5)} 篇，优质笔记 ${1 + (index % 3)} 篇，优质率 ${((1 + (index % 3)) / (2 + (index % 5)) * 100).toFixed(1)}%。条件：is_quality_note=true。`,
      features:
        '优质笔记核心特征：互动表现高于阈值（互动数 > 522），内容创意完整、信息密度高，合规风险低，适合作为加热样本。',
      conclusion:
        '投流加热结论：建议优先对优质样本进行小预算试投，观察 24h CTR 与互动成本后，再逐步放量；低质样本暂缓加热。',
    },
  };
});
