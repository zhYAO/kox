export type AiNoteItem = {
  key: string;
  title: string;
  interactions: number;
  interactionsLabel: string;
  cover: string;
  industry: string;
  summary: string;
};

export type AiAnalysisCategory = '笔记标签' | '场景痛点' | '沟通人群';

export type AiGeneratedItem = {
  key: string;
  title: string;
  painPoint: string;
  score: number;
  summary: string;
  content: string;
  tag: string;
  audience: string;
};

function coverOf(index: number, title: string) {
  const colors = ['#eb2f96', '#1677ff', '#13c2c2', '#fa8c16', '#722ed1', '#52c41a'];
  const color = colors[index % colors.length];
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="100%" stop-color="#001529"/>
        </linearGradient>
      </defs>
      <rect width="160" height="160" fill="url(#g)"/>
      <text x="16" y="88" fill="white" font-size="16" font-family="Arial">${title.slice(0, 6)}</text>
    </svg>`,
  );
  return `data:image/svg+xml,${svg}`;
}

export const TIME_RANGE_OPTIONS = [
  { label: '近7天', value: '7' },
  { label: '近30天', value: '30' },
  { label: '近90天', value: '90' },
  { label: '近180天', value: '180' },
];

export const SORT_OPTIONS = [
  { label: '互动量最多', value: 'interactions' },
  { label: '最新发布', value: 'latest' },
  { label: '点赞最多', value: 'likes' },
];

export const INDUSTRY_OPTIONS = [
  {
    title: '美妆',
    value: '美妆',
    children: [
      { title: '整体妆容', value: '整体妆容' },
      { title: '唇妆', value: '唇妆' },
      { title: '眼妆', value: '眼妆' },
      { title: '美甲', value: '美甲' },
      { title: '底妆', value: '底妆' },
      { title: '美妆合集', value: '美妆合集' },
      { title: '香水', value: '香水' },
      { title: '美妆其他', value: '美妆其他' },
    ],
  },
  {
    title: '汽车',
    value: '汽车',
    children: [
      { title: '智能驾驶', value: '智能驾驶' },
      { title: '外观内饰', value: '外观内饰' },
      { title: '试驾体验', value: '试驾体验' },
      { title: '购车决策', value: '购车决策' },
    ],
  },
  {
    title: '数码',
    value: '数码',
    children: [
      { title: '手机', value: '手机' },
      { title: '耳机', value: '耳机' },
      { title: '智能穿戴', value: '智能穿戴' },
    ],
  },
];

export const ANALYSIS_OPTIONS: Record<AiAnalysisCategory, Array<{ label: string; color: string }>> = {
  笔记标签: [
    { label: '经验教程', color: 'blue' },
    { label: '妆容示范', color: 'magenta' },
    { label: '好物推荐', color: 'geekblue' },
    { label: '避坑指南', color: 'volcano' },
  ],
  场景痛点: [
    { label: '选购决策', color: 'orange' },
    { label: '妆容不会画', color: 'gold' },
    { label: '显气色差', color: 'red' },
    { label: '约会没灵感', color: 'lime' },
  ],
  沟通人群: [
    { label: '年轻女性', color: 'green' },
    { label: '粉丝群体', color: 'cyan' },
    { label: '职场白领', color: 'purple' },
    { label: '学生党', color: 'blue' },
  ],
};

export const MOCK_AI_NOTES: AiNoteItem[] = [
  {
    key: 'n1',
    title: '520想画个不一样的妆',
    interactions: 52,
    interactionsLabel: '52',
    cover: coverOf(0, '520妆'),
    industry: '整体妆容',
    summary: '520想画个不一样的妆，今天教大家一个自带柔光滤镜的约会妆，轻松显白又高级。',
  },
  {
    key: 'n2',
    title: '时代少年团上海演唱会约妆啦~',
    interactions: 2400,
    interactionsLabel: '2.4k',
    cover: coverOf(1, '约妆'),
    industry: '整体妆容',
    summary: '演唱会约妆分享，舞台灯光下也不糊妆，重点讲了眼妆和定妆技巧。',
  },
  {
    key: 'n3',
    title: '新手也能学会的通勤淡妆',
    interactions: 1860,
    interactionsLabel: '1.9k',
    cover: coverOf(2, '淡妆'),
    industry: '底妆',
    summary: '10分钟出门妆，底妆服帖不卡粉，适合每天赶地铁的姐妹。',
  },
  {
    key: 'n4',
    title: '问界M9智能驾驶体验',
    interactions: 9200,
    interactionsLabel: '9.2k',
    cover: coverOf(3, 'M9'),
    industry: '智能驾驶',
    summary: '高速+城区实测智驾，变道提醒清晰，新手友好。',
  },
  {
    key: 'n5',
    title: '唇釉显白合集，黄皮闭眼入',
    interactions: 3100,
    interactionsLabel: '3.1k',
    cover: coverOf(4, '唇釉'),
    industry: '唇妆',
    summary: '黄皮显白唇釉合集，从日常到约会色号都有，附上试色对比。',
  },
  {
    key: 'n6',
    title: '眼妆新手避坑：肿眼泡也能画',
    interactions: 1280,
    interactionsLabel: '1.3k',
    cover: coverOf(5, '眼妆'),
    industry: '眼妆',
    summary: '肿眼泡画法拆解，卧蚕和眼线怎么画才不显肿。',
  },
];

export const MOCK_GENERATED: AiGeneratedItem[] = [
  {
    key: 'g1',
    title: '约会妆自带柔光滤镜 ✨',
    painPoint: '选购决策',
    score: 8.5,
    summary: '520想画个不一样的妆，柔光滤镜感约会妆一次学会。',
    content:
      '先用轻薄底妆打底，局部提亮T区，再用珠光眼影点缀眼头。唇色推荐 YSL 或 Armani 显白豆沙，整体干净高级，约会拍照超出片。',
    tag: '经验教程',
    audience: '年轻女性',
  },
  {
    key: 'g2',
    title: '演唱会妆容不糊妆秘籍',
    painPoint: '选购决策',
    score: 8.2,
    summary: '舞台灯光下也稳的约妆思路，重点在定妆和眼妆层次。',
    content:
      '开场先喷定妆水，眼妆用哑光打底+细闪提亮，睫毛夹翘后上纤长款。推荐防水眉笔和持妆粉底，整场演出都不怕花妆。',
    tag: '经验教程',
    audience: '粉丝群体',
  },
  {
    key: 'g3',
    title: '黄皮显白唇色怎么选',
    painPoint: '选购决策',
    score: 7.9,
    summary: '从日常到约会，三支显白唇釉就能搞定全部场景。',
    content:
      '日常偏豆沙雾面，约会可叠一点水光。选色避开脏橘色，优先带一点粉调的砖红色，黄皮立刻提气色。',
    tag: '经验教程',
    audience: '年轻女性',
  },
];
