export type ActivityBudgetStatus = '进行中' | '预警' | '已完成';

export type ActivityBudget = {
  key: string;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  status: ActivityBudgetStatus;
  total: number; // 万
  used: number; // 万
};

export type MonthBudgetStatus = '正常' | '预警' | '已关停';

export type MonthBudget = {
  key: string;
  month: string; // YYYY-MM
  name: string;
  recharged: number;
  used: number;
  warnRate: number;
  shutdown: boolean;
  status: MonthBudgetStatus;
};

export type RechargeRecord = {
  key: string;
  month: string;
  time: string;
  points: number;
  remark: string;
};

export const BUDGET_KPIS = {
  annualTotal: 970,
  used: 589,
  remain: 381,
  warnCount: 3,
};

export const MONTHLY_TREND = {
  months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  actual: [42, 55, 48, 68, 95, 72, 88, 110, 76, 82, 70, 75],
  limit: [80, 85, 90, 95, 100, 110, 120, 125, 130, 140, 155, 170],
};

export const MOCK_ACTIVITY_BUDGETS: ActivityBudget[] = [
  {
    key: 'ab1',
    name: 'Q4新车型推广计划',
    category: '内容制作',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: '进行中',
    total: 120,
    used: 95,
  },
  {
    key: 'ab2',
    name: '冬季试驾活动',
    category: '活动运营',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: '预警',
    total: 85,
    used: 82,
  },
  {
    key: 'ab3',
    name: '年度品牌传播',
    category: '平台推广',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: '进行中',
    total: 200,
    used: 120,
  },
  {
    key: 'ab4',
    name: '2026年度KOC营销预算',
    category: 'KOC营销',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: '进行中',
    total: 380,
    used: 145,
  },
  {
    key: 'ab5',
    name: '春季门店共创专项',
    category: '门店运营',
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    status: '已完成',
    total: 60,
    used: 58,
  },
];

export const MOCK_MONTH_BUDGETS: MonthBudget[] = [
  {
    key: 'm12',
    month: '2026-12',
    name: '12月营销预算',
    recharged: 1600000,
    used: 700000,
    warnRate: 90,
    shutdown: false,
    status: '正常',
  },
  {
    key: 'm11',
    month: '2026-11',
    name: '11月营销预算',
    recharged: 1100000,
    used: 850000,
    warnRate: 90,
    shutdown: false,
    status: '正常',
  },
  {
    key: 'm10',
    month: '2026-10',
    name: '10月营销预算',
    recharged: 980000,
    used: 910000,
    warnRate: 90,
    shutdown: false,
    status: '预警',
  },
  {
    key: 'm09',
    month: '2026-09',
    name: '9月营销预算',
    recharged: 1200000,
    used: 1120000,
    warnRate: 90,
    shutdown: false,
    status: '预警',
  },
  {
    key: 'm08',
    month: '2026-08',
    name: '8月营销预算',
    recharged: 1500000,
    used: 980000,
    warnRate: 85,
    shutdown: false,
    status: '正常',
  },
  {
    key: 'm07',
    month: '2026-07',
    name: '7月营销预算',
    recharged: 1300000,
    used: 760000,
    warnRate: 90,
    shutdown: false,
    status: '正常',
  },
];

export const MOCK_RECHARGE_RECORDS: RechargeRecord[] = [
  { key: 'r1', month: '2026-12', time: '2026-12-01 10:00:00', points: 1000000, remark: '12月营销预算' },
  { key: 'r2', month: '2026-12', time: '2026-04-19 18:45:22', points: 100000, remark: 'M5专项' },
  { key: 'r3', month: '2026-12', time: '2026-02-27 16:38:37', points: 500000, remark: '第二次充值' },
  { key: 'r4', month: '2026-11', time: '2026-11-01 09:30:00', points: 800000, remark: '11月首充' },
  { key: 'r5', month: '2026-11', time: '2026-11-15 14:20:11', points: 300000, remark: '追加充值' },
  { key: 'r6', month: '2026-10', time: '2026-10-02 11:00:00', points: 980000, remark: '10月营销预算' },
];

export function formatPoints(n: number) {
  return n.toLocaleString('zh-CN');
}

export function usageRate(recharged: number, used: number) {
  if (!recharged) return 0;
  return Math.round((used / recharged) * 100);
}

export function activityProgress(item: ActivityBudget) {
  if (!item.total) return 0;
  return Math.round((item.used / item.total) * 100);
}

let runtimeMonths = [...MOCK_MONTH_BUDGETS];
let runtimeRecharges = [...MOCK_RECHARGE_RECORDS];

export function getMonthBudgets() {
  return runtimeMonths;
}

export function setMonthBudgets(next: MonthBudget[]) {
  runtimeMonths = next;
}

export function getRechargeRecords() {
  return runtimeRecharges;
}

export function setRechargeRecords(next: RechargeRecord[]) {
  runtimeRecharges = next;
}
