export type ScreenLogAction = '截屏' | '录屏';

export type ScreenLogRecord = {
  key: string;
  nickname: string;
  account: string;
  operatedAt: string;
  action: ScreenLogAction;
};

export const MOCK_SCREEN_LOGS: ScreenLogRecord[] = [
  {
    key: '1',
    nickname: '张三',
    account: 'zhangsan',
    operatedAt: '2026-03-26 14:22:18',
    action: '截屏',
  },
  {
    key: '2',
    nickname: '李四',
    account: 'lisi',
    operatedAt: '2026-03-26 14:18:05',
    action: '录屏',
  },
  {
    key: '3',
    nickname: '王五',
    account: 'wangwu',
    operatedAt: '2026-03-26 13:55:41',
    action: '截屏',
  },
  {
    key: '4',
    nickname: '赵六',
    account: 'zhaoliu',
    operatedAt: '2026-03-26 13:40:12',
    action: '录屏',
  },
  {
    key: '5',
    nickname: '陈思远',
    account: 'ops_chen',
    operatedAt: '2026-03-26 12:08:33',
    action: '截屏',
  },
  {
    key: '6',
    nickname: '林婉清',
    account: 'ops_lin',
    operatedAt: '2026-03-26 11:26:09',
    action: '录屏',
  },
  {
    key: '7',
    nickname: 'kox管理员',
    account: 'kox_admin',
    operatedAt: '2026-03-26 10:15:47',
    action: '截屏',
  },
  {
    key: '8',
    nickname: '周雨桐',
    account: 'cs_zhou',
    operatedAt: '2026-03-26 09:42:20',
    action: '录屏',
  },
];
