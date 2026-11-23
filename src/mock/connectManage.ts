export type ConnectRecord = {
  key: string;
  nickname: string;
  platform: string;
  userId: string;
  ip: string;
  homeUrl: string;
  connectStatus: '已建联' | '未建联';
  exportStatus: '已导出' | '未导出';
  exporter: string;
  exportTime: string;
};

export const PLATFORM_OPTIONS = [
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '视频号', value: '视频号' },
];

export const IP_OPTIONS = [
  { label: '四川省', value: '四川省' },
  { label: '福建省', value: '福建省' },
  { label: '广东省', value: '广东省' },
  { label: '浙江省', value: '浙江省' },
  { label: '北京市', value: '北京市' },
  { label: '上海市', value: '上海市' },
];

export const CONNECT_STATUS_OPTIONS = [
  { label: '已建联', value: '已建联' },
  { label: '未建联', value: '未建联' },
];

export const EXPORT_STATUS_OPTIONS = [
  { label: '已导出', value: '已导出' },
  { label: '未导出', value: '未导出' },
];

const NICKNAMES = [
  '峡谷小迷',
  '一朵云',
  '阿泽日记',
  '北岛出行',
  '小满生活',
  '清清种草',
  '车友阿杰',
  '林间漫步',
];

export const MOCK_CONNECT_LIST: ConnectRecord[] = Array.from({ length: 119 }, (_, index) => {
  const connected = index % 3 !== 0;
  const exported = connected && index % 2 === 0;
  const day = String((index % 28) + 1).padStart(2, '0');
  const hour = String(10 + (index % 8)).padStart(2, '0');
  const minute = String((index * 5) % 60).padStart(2, '0');

  return {
    key: String(index + 1),
    nickname: NICKNAMES[index % NICKNAMES.length],
    platform: PLATFORM_OPTIONS[index % PLATFORM_OPTIONS.length].value,
    userId: `${6000000000000000000n + BigInt(index * 17)}`,
    ip: IP_OPTIONS[index % IP_OPTIONS.length].value,
    homeUrl: `https://www.xiaohongshu.com/user/profile/${10000 + index}`,
    connectStatus: connected ? '已建联' : '未建联',
    exportStatus: exported ? '已导出' : '未导出',
    exporter: exported ? (index % 4 === 0 ? 'ops_lily' : 'kox_admin') : '-',
    exportTime: exported ? `2026-07-${day} ${hour}:${minute}:15` : '-',
  };
});
