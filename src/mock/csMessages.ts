export type CsMessageStatus = '待处理' | '已处理' | '智能客服';
export type CsMessageSource = 'PC端' | '手机端';

export type CsChatMessage = {
  id: string;
  role: 'user' | 'ai' | 'agent';
  sender: string;
  content: string;
  time: string;
};

export type CsMessageRecord = {
  key: string;
  sessionId: string;
  username: string;
  koxId: string;
  source: CsMessageSource;
  lastMessage: string;
  status: CsMessageStatus;
  unread: number | null;
  createdAt: string;
  lastMessageAt: string;
  messages: CsChatMessage[];
};

export const MOCK_CS_MESSAGES: CsMessageRecord[] = [
  {
    key: '1',
    sessionId: '019311513402',
    username: 'kox_admin',
    koxId: '1',
    source: 'PC端',
    lastMessage: '您好，深小桃为您服务~麻烦您详细说一下是关于什么的审核呢，以便我更准确地为您解答审核结果的时间。',
    status: '智能客服',
    unread: null,
    createdAt: '2026-07-21 16:21',
    lastMessageAt: '2026-07-21 16:21',
    messages: [
      {
        id: 'm1',
        role: 'user',
        sender: 'kox_admin',
        content: '什么时候出审核结果？',
        time: '16:21:25',
      },
      {
        id: 'm2',
        role: 'ai',
        sender: 'AI客服',
        content:
          '您好，深小桃为您服务~麻烦您详细说一下是关于什么的审核呢，以便我更准确地为您解答审核结果的时间。',
        time: '16:21:36',
      },
    ],
  },
  {
    key: '2',
    sessionId: '019311488910',
    username: '盖一',
    koxId: '229',
    source: '手机端',
    lastMessage: '积分到账延迟了两天，能帮忙查一下吗？',
    status: '待处理',
    unread: 2,
    createdAt: '2026-07-20 11:08',
    lastMessageAt: '2026-07-21 09:42',
    messages: [
      {
        id: 'm1',
        role: 'user',
        sender: '盖一',
        content: '积分到账延迟了两天，能帮忙查一下吗？',
        time: '11:08:12',
      },
      {
        id: 'm2',
        role: 'ai',
        sender: 'AI客服',
        content: '您好，深小桃为您服务~请提供一下积分流水号或任务名称，我帮您核对。',
        time: '11:08:40',
      },
      {
        id: 'm3',
        role: 'user',
        sender: '盖一',
        content: '流水号 PL202607180088，任务是周末试驾邀约。',
        time: '09:42:05',
      },
    ],
  },
  {
    key: '3',
    sessionId: '019310992331',
    username: '林婉清',
    koxId: '1028',
    source: 'PC端',
    lastMessage: '好的，已为您标记补发，预计今日到账。',
    status: '已处理',
    unread: null,
    createdAt: '2026-07-18 14:30',
    lastMessageAt: '2026-07-18 15:06',
    messages: [
      {
        id: 'm1',
        role: 'user',
        sender: '林婉清',
        content: '补发积分提交后一直显示处理中',
        time: '14:30:18',
      },
      {
        id: 'm2',
        role: 'ai',
        sender: 'AI客服',
        content: '您好，深小桃为您服务~已转人工客服跟进。',
        time: '14:30:45',
      },
      {
        id: 'm3',
        role: 'agent',
        sender: '人工客服',
        content: '已核实，系统排队中，我这边加急处理。',
        time: '14:55:02',
      },
      {
        id: 'm4',
        role: 'agent',
        sender: '人工客服',
        content: '好的，已为您标记补发，预计今日到账。',
        time: '15:06:20',
      },
      {
        id: 'm5',
        role: 'user',
        sender: '林婉清',
        content: '收到，谢谢',
        time: '15:06:48',
      },
    ],
  },
  {
    key: '4',
    sessionId: '019309771204',
    username: '赵启明',
    koxId: '886',
    source: '手机端',
    lastMessage: '任务链接打不开，提示无权限',
    status: '待处理',
    unread: 1,
    createdAt: '2026-07-17 09:12',
    lastMessageAt: '2026-07-17 09:15',
    messages: [
      {
        id: 'm1',
        role: 'user',
        sender: '赵启明',
        content: '任务链接打不开，提示无权限',
        time: '09:12:33',
      },
      {
        id: 'm2',
        role: 'ai',
        sender: 'AI客服',
        content: '您好，深小桃为您服务~请问是哪个任务名称？我帮您确认权限配置。',
        time: '09:12:58',
      },
      {
        id: 'm3',
        role: 'user',
        sender: '赵启明',
        content: '新色到店实拍征集',
        time: '09:15:10',
      },
    ],
  },
  {
    key: '5',
    sessionId: '019308441556',
    username: '周雨桐',
    koxId: '556',
    source: 'PC端',
    lastMessage: '账号绑定手机号如何修改？',
    status: '智能客服',
    unread: null,
    createdAt: '2026-07-15 18:40',
    lastMessageAt: '2026-07-15 18:41',
    messages: [
      {
        id: 'm1',
        role: 'user',
        sender: '周雨桐',
        content: '账号绑定手机号如何修改？',
        time: '18:40:22',
      },
      {
        id: 'm2',
        role: 'ai',
        sender: 'AI客服',
        content:
          '您好，深小桃为您服务~可在「个人中心 - 账号安全」中更换手机号，需完成原手机号验证。',
        time: '18:41:05',
      },
    ],
  },
];
