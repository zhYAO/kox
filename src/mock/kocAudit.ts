export type AuditStatus = '待审核' | '已通过' | '已驳回';

export type AuditBatchItem = {
  key: string;
  excelRow?: string;
  source: '手动导入' | '公域挖掘';
  phone: string;
  office: string;
  platform: string;
  homeUrl: string;
  modelTag: string;
  status: AuditStatus;
  nickname?: string;
  platformId?: string;
  fileName?: string;
  createTime?: string;
  passTime?: string;
  reviewer?: string;
  remark?: string;
  rejectReason?: string;
};

export type AuditBatch = {
  key: string;
  source: '手动导入' | '公域挖掘';
  office: string;
  fileName: string;
  count: number;
  uploadTime: string;
  uploader: string;
  status: AuditStatus;
  batchName: string;
  total: number;
  success: number;
  fail: number;
  pending: number;
  items: AuditBatchItem[];
};

function buildItems(batchKey: string, count: number, office: string, status: AuditStatus): AuditBatchItem[] {
  return Array.from({ length: count }, (_, index) => ({
    key: `${batchKey}_${index + 1}`,
    excelRow: String(index + 2),
    source: index % 3 === 0 ? '公域挖掘' : '手动导入',
    phone: `180****${String(100 + index).padStart(3, '0')}`,
    office,
    platform: ['小红书', '视频号', '抖音'][index % 3],
    homeUrl: `spha${batchKey}${index}`,
    modelTag: ['M7', 'M9', 'M5'][index % 3],
    status,
    nickname: index % 2 === 0 ? '-' : `用户${index + 1}`,
    platformId: `spha${batchKey}${index}`,
    fileName: '手动添加',
    createTime: '2026-07-22 11:45:33',
    passTime: status === '已通过' ? '2026-07-22 11:45:44' : undefined,
    reviewer: status === '待审核' ? undefined : 'kox_admin',
    remark: index === 0 ? '我爱我家demo' : '-',
  }));
}

export const MOCK_AUDIT_BATCHES: AuditBatch[] = [
  {
    key: 'b1',
    source: '手动导入',
    office: '山东',
    fileName: '手动添加',
    count: 11,
    uploadTime: '2026-07-22 11:45:33',
    uploader: 'kox_admin',
    status: '待审核',
    batchName: '添加KOC账号_ADD20260722114533',
    total: 11,
    success: 11,
    fail: 0,
    pending: 6,
    items: buildItems('b1', 11, '山东', '待审核'),
  },
  {
    key: 'b2',
    source: '公域挖掘',
    office: '-',
    fileName: 'KOC导入041666.xlsx',
    count: 7,
    uploadTime: '2026-07-20 09:18:02',
    uploader: 'admin',
    status: '待审核',
    batchName: '公域挖掘_20260720091802',
    total: 7,
    success: 7,
    fail: 0,
    pending: 7,
    items: buildItems('b2', 7, '广东', '待审核'),
  },
  {
    key: 'b3',
    source: '手动导入',
    office: '北京',
    fileName: '手动添加',
    count: 3,
    uploadTime: '2026-07-18 15:22:10',
    uploader: 'kox_admin',
    status: '待审核',
    batchName: '添加KOC账号_ADD20260718152210',
    total: 3,
    success: 3,
    fail: 0,
    pending: 3,
    items: buildItems('b3', 3, '北京', '待审核'),
  },
  {
    key: 'b4',
    source: '手动导入',
    office: '上海',
    fileName: 'KOC导入_pass.xlsx',
    count: 20,
    uploadTime: '2026-07-10 10:00:00',
    uploader: 'ops_lily',
    status: '已通过',
    batchName: '添加KOC账号_PASS20260710',
    total: 20,
    success: 20,
    fail: 0,
    pending: 0,
    items: buildItems('b4', 8, '上海', '已通过'),
  },
  {
    key: 'b5',
    source: '公域挖掘',
    office: '浙江',
    fileName: '公域同步_reject.xlsx',
    count: 9,
    uploadTime: '2026-07-05 19:40:21',
    uploader: 'admin',
    status: '已驳回',
    batchName: '公域挖掘_REJECT20260705',
    total: 9,
    success: 5,
    fail: 4,
    pending: 0,
    items: buildItems('b5', 6, '浙江', '已驳回').map((item, index) => ({
      ...item,
      rejectReason: index % 2 === 0 ? '信息不完整' : '重复提报',
    })),
  },
];
