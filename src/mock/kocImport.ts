export type ImportRecord = {
  key: string;
  uploadTime: string;
  source: '手动导入' | '公域挖掘';
  uploader: string;
  office: string;
  fileName: string;
  total: number;
  success: number;
  fail: number;
  status: '已完成' | '处理中' | '失败';
};

export const MOCK_IMPORT_RECORDS: ImportRecord[] = [
  {
    key: '1',
    uploadTime: '2026-07-22 11:46:45',
    source: '手动导入',
    uploader: 'kox_admin',
    office: '山东',
    fileName: 'KOC导入模板_20260722.xlsx',
    total: 120,
    success: 118,
    fail: 2,
    status: '已完成',
  },
  {
    key: '2',
    uploadTime: '2026-07-18 09:12:03',
    source: '公域挖掘',
    uploader: 'kox_admin',
    office: '广东',
    fileName: '公域挖掘同步_0718.xlsx',
    total: 56,
    success: 56,
    fail: 0,
    status: '已完成',
  },
  {
    key: '3',
    uploadTime: '2026-07-10 16:28:19',
    source: '手动导入',
    uploader: 'ops_lily',
    office: '北京',
    fileName: '手动添加',
    total: 8,
    success: 8,
    fail: 0,
    status: '已完成',
  },
  {
    key: '4',
    uploadTime: '2026-06-30 14:05:41',
    source: '手动导入',
    uploader: 'kox_admin',
    office: '上海',
    fileName: 'KOC导入模板_0630.xlsx',
    total: 200,
    success: 176,
    fail: 24,
    status: '已完成',
  },
  {
    key: '5',
    uploadTime: '2026-06-21 10:33:08',
    source: '公域挖掘',
    uploader: 'ops_tom',
    office: '浙江',
    fileName: '公域挖掘同步_0621.xlsx',
    total: 33,
    success: 30,
    fail: 3,
    status: '已完成',
  },
];
