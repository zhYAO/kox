export type KpiItem = {
  key: string;
  label: string;
  value: number | string;
  trend: number;
  icon: 'task' | 'user' | 'content' | 'voice' | 'points' | 'ads';
};

export type NamedValue = { name: string; value: number };

export const OVERVIEW_KPIS: KpiItem[] = [
  { key: 'tasks', label: '本月发布任务数', value: 128, trend: 12.5, icon: 'task' },
  { key: 'users', label: '本月注册用户数', value: 356, trend: 8.2, icon: 'user' },
  { key: 'content', label: '本月内容量', value: 1842, trend: 15.6, icon: 'content' },
  { key: 'voice', label: '本月声量', value: '86.4万', trend: -3.1, icon: 'voice' },
  { key: 'points', label: '本月积分消耗', value: '12.8万', trend: 6.4, icon: 'points' },
  { key: 'ads', label: '本月投流消耗', value: '45.2万', trend: 22.0, icon: 'ads' },
];

export const TASK_TYPE_DIST: NamedValue[] = [
  { name: '图文种草', value: 48 },
  { name: '视频种草', value: 32 },
  { name: '展示性任务', value: 21 },
  { name: '门店试驾', value: 18 },
  { name: '其他', value: 9 },
];

export const TASK_STATUS_DIST: NamedValue[] = [
  { name: '进行中', value: 36 },
  { name: '已完成', value: 58 },
  { name: '待审核', value: 14 },
  { name: '已停止', value: 12 },
  { name: '草稿', value: 8 },
];

export const TASK_MONTHLY_TREND = {
  months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
  values: [22, 28, 35, 41, 37, 46, 52, 48],
};

export const CAR_MODELS = ['问界M7', '问界M9', '尚界H5', '享界S9T', '智界R7'];

export const CAR_CONTENT: NamedValue[] = [
  { name: '问界M7', value: 520 },
  { name: '问界M9', value: 410 },
  { name: '尚界H5', value: 286 },
  { name: '享界S9T', value: 198 },
  { name: '智界R7', value: 162 },
];

export const CAR_VOICE: NamedValue[] = [
  { name: '问界M7', value: 28.6 },
  { name: '问界M9', value: 22.4 },
  { name: '尚界H5', value: 15.8 },
  { name: '享界S9T', value: 11.2 },
  { name: '智界R7', value: 8.4 },
];

export const CAR_POINTS: NamedValue[] = [
  { name: '问界M7', value: 42000 },
  { name: '问界M9', value: 36500 },
  { name: '尚界H5', value: 21800 },
  { name: '享界S9T', value: 15600 },
  { name: '智界R7', value: 12100 },
];

export const CAR_ADS: NamedValue[] = [
  { name: '问界M7', value: 18.6 },
  { name: '问界M9', value: 15.2 },
  { name: '尚界H5', value: 9.8 },
  { name: '享界S9T', value: 7.4 },
  { name: '智界R7', value: 5.1 },
];

export const PLATFORM_CONTENT: NamedValue[] = [
  { name: '小红书', value: 720 },
  { name: '抖音', value: 640 },
  { name: '视频号', value: 280 },
  { name: '懂车帝', value: 146 },
  { name: '其他', value: 56 },
];

export const PLATFORM_VOICE: NamedValue[] = [
  { name: '小红书', value: 38 },
  { name: '抖音', value: 34 },
  { name: '视频号', value: 16 },
  { name: '懂车帝', value: 8 },
  { name: '其他', value: 4 },
];

export const PLATFORM_POINTS: NamedValue[] = [
  { name: '小红书', value: 52000 },
  { name: '抖音', value: 48000 },
  { name: '视频号', value: 18000 },
  { name: '懂车帝', value: 7200 },
  { name: '其他', value: 2800 },
];

export const PLATFORM_ADS: NamedValue[] = [
  { name: '小红书', value: 16.8 },
  { name: '抖音', value: 19.4 },
  { name: '视频号', value: 5.6 },
  { name: '懂车帝', value: 2.8 },
  { name: '其他', value: 0.6 },
];

export const CHART_COLORS = ['#1677ff', '#13c2c2', '#722ed1', '#fa8c16', '#eb2f96', '#52c41a', '#2f54eb'];
