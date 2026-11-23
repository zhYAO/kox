export type CourseType = '视频' | '图文';

export type CourseCategory = '账号运营' | '内容创作' | '平台规则' | '汽车知识';

export type CourseItem = {
  key: string;
  title: string;
  category: CourseCategory;
  type: CourseType;
  cover: string;
  fileName?: string;
};

export const COURSE_CATEGORIES: Array<'全部' | CourseCategory> = [
  '全部',
  '账号运营',
  '内容创作',
  '平台规则',
  '汽车知识',
];

export const COURSE_CATEGORY_OPTIONS = [
  { label: '账号运营', value: '账号运营' },
  { label: '内容创作', value: '内容创作' },
  { label: '平台规则', value: '平台规则' },
  { label: '汽车知识', value: '汽车知识' },
];

const COVER_COLORS = ['#1677ff', '#13c2c2', '#722ed1', '#eb2f96', '#fa8c16', '#52c41a'];

export function coverOf(index: number, title: string) {
  const color = COVER_COLORS[index % COVER_COLORS.length];
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="100%" stop-color="#001529"/>
        </linearGradient>
      </defs>
      <rect width="480" height="270" fill="url(#g)"/>
      <text x="40" y="150" fill="white" font-size="28" font-family="Arial">${title.slice(0, 10)}</text>
    </svg>`,
  );
  return `data:image/svg+xml,${svg}`;
}

export const MOCK_COURSES: CourseItem[] = [
  { key: '1', title: '小红书爆文规则 3.0', category: '平台规则', type: '图文', cover: coverOf(0, '爆文规则3.0') },
  { key: '2', title: '小红书爆文规则 2.0', category: '平台规则', type: '图文', cover: coverOf(1, '爆文规则2.0') },
  { key: '3', title: '小红书爆文规则 1.0', category: '平台规则', type: '图文', cover: coverOf(2, '爆文规则1.0') },
  { key: '4', title: '享界S9T 卖点精讲', category: '汽车知识', type: '图文', cover: coverOf(3, '享界S9T') },
  { key: '5', title: '尚界H5 产品解读', category: '汽车知识', type: '图文', cover: coverOf(4, '尚界H5') },
  { key: '6', title: '问界M7 试驾话术', category: '汽车知识', type: '图文', cover: coverOf(5, '问界M7') },
  { key: '7', title: '抖音养号逻辑', category: '账号运营', type: '视频', cover: coverOf(0, '抖音养号') },
  { key: '8', title: '剪辑软件使用说明', category: '内容创作', type: '视频', cover: coverOf(1, '剪辑软件') },
  { key: '9', title: '添加视频背景', category: '内容创作', type: '视频', cover: coverOf(2, '视频背景') },
  { key: '10', title: '拍摄手法入门', category: '内容创作', type: '视频', cover: coverOf(3, '拍摄手法') },
  { key: '11', title: '人设搭建指南', category: '账号运营', type: '图文', cover: coverOf(4, '人设搭建') },
  { key: '12', title: '评论区运营技巧', category: '账号运营', type: '视频', cover: coverOf(5, '评论区') },
];
