export type MonitorSession = {
  key: string;
  title: string;
  group: '一个月内' | '更早';
};

export type MonitorMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  time: string;
};

export const MOCK_MONITOR_SESSIONS: MonitorSession[] = [
  { key: 's1', title: '生成消耗报表', group: '一个月内' },
  { key: 's2', title: '诊断账户', group: '一个月内' },
  { key: 's3', title: '数据快查', group: '一个月内' },
  { key: 's4', title: '了解 AI 盯盘预警', group: '一个月内' },
  { key: 's5', title: '获取 AI 盯盘预警', group: '一个月内' },
  { key: 's6', title: '使用 AI 盯盘预警', group: '一个月内' },
  { key: 's7', title: '请求账户诊断', group: '更早' },
  { key: 's8', title: '帮我复盘', group: '更早' },
];

export const MONITOR_WELCOME: MonitorMessage = {
  id: 'welcome',
  role: 'assistant',
  time: '刚刚',
  content: `你好，我是投流助手 5.0（规则版）。

我可以提供两类核心能力：

1. **智能诊断优化**  
分析指定周期内的账户表现，识别花费异常、转化下滑、素材疲劳等问题，并给出可执行的优化建议。

2. **即时数据查询**  
按花费、曝光、点击、ROI 等指标，以及计划、创意、营销目标等维度，快速生成查询结果或报表摘要。

你可以直接提问，例如：
- 「帮我诊断昨天消耗异常的账户」
- 「生成本周各计划 ROI 报表」
- 「开启 AI 盯盘预警」`,
};

export const MONITOR_QUICK_COMMANDS = [
  { key: '/diagnose', label: '诊断账户' },
  { key: '/report', label: '生成消耗报表' },
  { key: '/alert', label: 'AI盯盘预警' },
  { key: '/review', label: '帮我复盘' },
];

export function buildAssistantReply(input: string): string {
  const text = input.trim();
  if (!text) return '请输入你想查询或诊断的内容。';
  if (text.includes('预警') || text.startsWith('/alert')) {
    return `已为你整理 **AI 盯盘预警** 规则建议：

1. 花费环比上涨 > 30% 且转化下降 → 预警「花费异常」
2. CTR 连续 3 小时低于账户均值 40% → 预警「素材疲劳」
3. ROI 低于目标阈值 → 预警「转化效率不足」

当前演示环境为 mock，可继续告诉我要监控的账户或计划。`;
  }
  if (text.includes('诊断') || text.startsWith('/diagnose')) {
    return `已完成账户诊断（mock）：

- 账户：pince品策
- 周期：近 7 日
- 主要问题：创意 CTR 下滑、高峰时段出价偏高
- 建议：替换低效创意、下调 20:00-22:00 出价 10%

需要我按计划维度继续下钻吗？`;
  }
  if (text.includes('报表') || text.includes('消耗') || text.startsWith('/report')) {
    return `已生成消耗报表摘要（mock）：

| 日期 | 花费 | 曝光 | 点击 | CTR |
| --- | --- | --- | --- | --- |
| 02-01 | 68.4 | 790 | 25 | 3.16% |
| 02-02 | 143.7 | 1688 | 58 | 3.44% |

如需导出完整明细，可切换到「报表分析」模块查看。`;
  }
  if (text.includes('复盘') || text.startsWith('/review')) {
    return `复盘结论（mock）：

本周花费较上周 +12%，ROI 持平。主要增量来自「春季种草计划」，但评论互动率略降。建议下周加大高互动创意投放，并收紧低效计划预算。`;
  }
  return `已收到：「${text}」

（演示环境）我可以继续帮你做诊断、报表查询或盯盘预警配置。你也可以输入 \`/\` 查看快捷指令。`;
}
