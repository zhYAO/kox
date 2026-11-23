export type NotifyType = '待审核' | '舆情通知' | '高风险';
export type NotifyReadStatus = '已读' | '未读';

export type SystemNotify = {
  key: string;
  title: string;
  content: string;
  type: NotifyType;
  status: NotifyReadStatus;
  createdAt: string;
  detail?: string;
};

const TEMPLATES: Array<Pick<SystemNotify, 'title' | 'content' | 'type'>> = [
  {
    title: '收到一条新的效果积分申诉',
    content: 'KOX「陈思远」提交了效果积分申诉，请尽快审核处理。',
    type: '待审核',
  },
  {
    title: '笔记舆情通知',
    content: '笔记《周末试驾体验》评论区出现负面舆情，请关注跟进。',
    type: '舆情通知',
  },
  {
    title: '高风险内容警告',
    content: '检测到账号存在高风险发布行为，建议立即核查相关内容。',
    type: '高风险',
  },
  {
    title: '任务审核待处理',
    content: '任务「新色到店实拍征集」有 12 条内容待审核。',
    type: '待审核',
  },
  {
    title: '小红书链接异常提醒',
    content: '部分笔记链接失效或无法访问，请核对后重新提交。',
    type: '舆情通知',
  },
  {
    title: '账号异常活跃警告',
    content: '账号短时高频发布触发风控阈值，请确认是否本人操作。',
    type: '高风险',
  },
  {
    title: '补发积分审核提醒',
    content: '收到 3 笔积分补发申请，等待人工确认。',
    type: '待审核',
  },
  {
    title: '品牌舆情日报',
    content: '近 24 小时品牌相关声量上升 18%，负面占比 3.2%。',
    type: '舆情通知',
  },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export const MOCK_SYSTEM_NOTIFIES: SystemNotify[] = Array.from({ length: 64 }).map((_, i) => {
  const tpl = TEMPLATES[i % TEMPLATES.length];
  const day = 18 - Math.floor(i / 8);
  const hour = 11 - (i % 5);
  const minute = (i * 7) % 60;
  const second = (i * 13) % 60;
  return {
    key: String(i + 1),
    title: tpl.title,
    content: tpl.content,
    type: tpl.type,
    status: i < 8 ? '未读' : '已读',
    createdAt: `2026-05-${pad(Math.max(day, 1))} ${pad(Math.max(hour, 0))}:${pad(minute)}:${pad(second)}`,
    detail: `${tpl.content}\n\n关联编号：NTF-202605-${pad(i + 1)}\n处理建议：请在后台对应模块中查看详情并完成跟进。`,
  };
});

export const NOTIFY_TYPE_OPTIONS = [
  { label: '待审核', value: '待审核' },
  { label: '舆情通知', value: '舆情通知' },
  { label: '高风险', value: '高风险' },
];

export const NOTIFY_STATUS_OPTIONS = [
  { label: '已读', value: '已读' },
  { label: '未读', value: '未读' },
];

export function notifyTypeColor(type: NotifyType) {
  if (type === '待审核') return 'blue';
  if (type === '舆情通知') return 'purple';
  return 'magenta';
}
