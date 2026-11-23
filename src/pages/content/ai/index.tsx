import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Input,
  Menu,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Steps,
  Tag,
  TreeSelect,
  Typography,
  message,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import {
  ANALYSIS_OPTIONS,
  INDUSTRY_OPTIONS,
  MOCK_AI_NOTES,
  MOCK_GENERATED,
  SORT_OPTIONS,
  TIME_RANGE_OPTIONS,
  type AiAnalysisCategory,
  type AiGeneratedItem,
  type AiNoteItem,
} from '@/mock/aiStudio';
import './index.css';

const { Text, Title, Paragraph, Link } = Typography;

type SelectionMap = Record<AiAnalysisCategory, string[]>;

const EMPTY_SELECTION: SelectionMap = {
  笔记标签: [],
  场景痛点: [],
  沟通人群: [],
};

export default function AiStudioPage() {
  const [step, setStep] = useState(0);
  const [timeRange, setTimeRange] = useState('90');
  const [industry, setIndustry] = useState<string | undefined>();
  const [sort, setSort] = useState('interactions');
  const [keyword, setKeyword] = useState('');
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [notes, setNotes] = useState<AiNoteItem[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [previewNote, setPreviewNote] = useState<AiNoteItem | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [analysisTab, setAnalysisTab] = useState<AiAnalysisCategory>('沟通人群');
  const [selection, setSelection] = useState<SelectionMap>(EMPTY_SELECTION);

  const [resultAudience, setResultAudience] = useState('年轻女性');
  const [pickedResult, setPickedResult] = useState<string>();
  const [previewGen, setPreviewGen] = useState<AiGeneratedItem | null>(null);

  const selectedNotes = useMemo(
    () => notes.filter((item) => selectedKeys.includes(item.key)),
    [notes, selectedKeys],
  );

  const generatedList = useMemo(
    () => MOCK_GENERATED.filter((item) => item.audience === resultAudience || resultAudience === '全部'),
    [resultAudience],
  );

  const audienceMenuItems = useMemo(() => {
    const tags = selection['笔记标签'];
    const audiences = selection['沟通人群'];
    const root = tags[0] || '经验教程';
    return [
      {
        key: root,
        label: root,
        children: audiences.map((item) => ({ key: item, label: item })),
      },
    ];
  }, [selection]);

  useEffect(() => {
    if (step !== 1) return;
    setAnalyzing(true);
    setAnalysisReady(false);
    const timer = window.setTimeout(() => {
      setAnalyzing(false);
      setAnalysisReady(true);
      setSelection({
        笔记标签: ['经验教程'],
        场景痛点: ['选购决策'],
        沟通人群: ['年轻女性', '粉丝群体'],
      });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [step, selectedKeys.join(',')]);

  useEffect(() => {
    const audiences = selection['沟通人群'];
    if (audiences.length && !audiences.includes(resultAudience)) {
      setResultAudience(audiences[0]);
    }
  }, [selection, resultAudience]);

  const toggleTag = (category: AiAnalysisCategory, label: string) => {
    setSelection((prev) => {
      const list = prev[category];
      const next = list.includes(label) ? list.filter((item) => item !== label) : [...list, label];
      return { ...prev, [category]: next };
    });
  };

  const handleSearch = () => {
    setSearching(true);
    window.setTimeout(() => {
      let list = [...MOCK_AI_NOTES];
      if (industry) {
        list = list.filter((item) => item.industry === industry || item.industry.includes(industry));
        // 若按父级美妆筛选，子类匹配不到父级名时放宽：包含美妆相关行业
        if (!list.length && ['美妆', '汽车', '数码'].includes(industry)) {
          const children =
            INDUSTRY_OPTIONS.find((o) => o.value === industry)?.children.map((c) => c.value) || [];
          list = MOCK_AI_NOTES.filter((item) => children.includes(item.industry));
        }
      }
      if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase();
        list = list.filter(
          (item) =>
            item.title.toLowerCase().includes(kw) || item.summary.toLowerCase().includes(kw),
        );
      }
      if (sort === 'interactions' || sort === 'likes') {
        list = [...list].sort((a, b) => b.interactions - a.interactions);
      }
      setNotes(list);
      setSearched(true);
      setSearching(false);
      setSelectedKeys((prev) => prev.filter((key) => list.some((item) => item.key === key)));
    }, 400);
  };

  const goAnalysis = () => {
    if (!selectedKeys.length) {
      message.warning('请先勾选素材笔记');
      return;
    }
    setStep(1);
  };

  const goGenerate = () => {
    if (!selection['笔记标签'].length || !selection['场景痛点'].length || !selection['沟通人群'].length) {
      message.warning('请完整勾选笔记标签、场景痛点、沟通人群');
      return;
    }
    setPickedResult(undefined);
    setStep(2);
  };

  return (
    <div className="ai-studio">
      <Card styles={{ body: { padding: '20px 24px 8px' } }}>
        <Steps
          current={step}
          items={[
            { title: '素材查询' },
            { title: 'AI分析' },
            { title: 'AI内容生成' },
          ]}
          style={{ maxWidth: 720, margin: '0 auto 8px' }}
        />
      </Card>

      {step === 0 && (
        <Card className="ai-step-card">
          <Space wrap size={12} style={{ marginBottom: 12 }}>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              options={TIME_RANGE_OPTIONS}
              style={{ width: 140 }}
              popupMatchSelectWidth={false}
            />
            <TreeSelect
              allowClear
              placeholder="行业分类"
              treeData={INDUSTRY_OPTIONS}
              value={industry}
              onChange={(v) => setIndustry(v)}
              style={{ width: 220 }}
              treeDefaultExpandAll
            />
            <Select value={sort} onChange={setSort} options={SORT_OPTIONS} style={{ width: 160 }} />
          </Space>

          <Space.Compact style={{ width: '100%', maxWidth: 720, marginBottom: 16 }}>
            <Input
              allowClear
              placeholder="输入关键词, 如: 问界M9智能驾驶体验"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button type="primary" icon={<SearchOutlined />} loading={searching} onClick={handleSearch}>
              搜索笔记
            </Button>
          </Space.Compact>

          {!searched ? (
            <Empty description="点击「搜索笔记」查询素材" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Spin spinning={searching}>
              <div className="ai-note-grid">
                {notes.map((item) => {
                  const checked = selectedKeys.includes(item.key);
                  return (
                    <div
                      key={item.key}
                      className={`ai-note-card${checked ? ' is-checked' : ''}`}
                      onClick={() => {
                        setSelectedKeys((prev) =>
                          prev.includes(item.key)
                            ? prev.filter((k) => k !== item.key)
                            : [...prev, item.key],
                        );
                      }}
                    >
                      <Checkbox checked={checked} />
                      <img src={item.cover} alt={item.title} />
                      <div className="ai-note-meta">
                        <Text strong ellipsis>
                          {item.title}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          笔记 互动 {item.interactionsLabel}
                        </Text>
                        <Link
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewNote(item);
                          }}
                        >
                          预览内容
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!notes.length && <Empty description="暂无匹配笔记" />}
            </Spin>
          )}

          <div className="ai-footer-actions">
            <Text type="secondary">已选 {selectedKeys.length} 条</Text>
            <Button type="primary" onClick={goAnalysis}>
              下一步: AI分析 →
            </Button>
          </div>
        </Card>
      )}

      {step === 1 && (
        <Row gutter={16} className="ai-analysis-row">
          <Col xs={24} lg={7}>
            <div className="ai-panel">
              <Title level={5}>已选素材 ({selectedNotes.length})</Title>
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                {selectedNotes.map((item) => (
                  <Card key={item.key} size="small" styles={{ body: { display: 'flex', gap: 12 } }}>
                    <img src={item.cover} alt="" style={{ width: 56, height: 56, borderRadius: 6, objectFit: 'cover' }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Text strong ellipsis style={{ display: 'block' }}>
                        {item.title}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        笔记 互动 {item.interactionsLabel}
                      </Text>
                      <div>
                        <Link onClick={() => setPreviewNote(item)}>预览内容</Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </Space>
            </div>
          </Col>

          <Col xs={24} lg={10}>
            <div className="ai-panel">
              <Title level={5}>AI 内容分析</Title>
              {analyzing || !analysisReady ? (
                <div className="ai-analyzing">
                  <Spin />
                  <Text type="secondary">分析中...</Text>
                </div>
              ) : (
                <>
                  <div className="ai-analysis-tabs">
                    {(Object.keys(ANALYSIS_OPTIONS) as AiAnalysisCategory[]).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        className={analysisTab === tab ? 'is-active' : ''}
                        onClick={() => setAnalysisTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <Space size={[8, 8]} wrap style={{ marginTop: 16 }}>
                    {ANALYSIS_OPTIONS[analysisTab].map((opt) => {
                      const active = selection[analysisTab].includes(opt.label);
                      return (
                        <Tag.CheckableTag
                          key={opt.label}
                          checked={active}
                          onChange={() => toggleTag(analysisTab, opt.label)}
                          style={{
                            border: active ? '1px solid #1677ff' : '1px solid #d9d9d9',
                            padding: '4px 10px',
                          }}
                        >
                          {opt.label}
                        </Tag.CheckableTag>
                      );
                    })}
                  </Space>
                </>
              )}
            </div>
          </Col>

          <Col xs={24} lg={7}>
            <div className="ai-panel ai-panel-sticky">
              <Title level={5}>当前选择</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
                在「笔记标签 / 场景痛点 / 沟通人群」中勾选后，此处展示汇总
              </Text>
              {(Object.keys(EMPTY_SELECTION) as AiAnalysisCategory[]).map((key) => (
                <div key={key} style={{ marginBottom: 12 }}>
                  <Text type="secondary">{key}：</Text>
                  <div style={{ marginTop: 6 }}>
                    {selection[key].length ? (
                      <Space size={[4, 4]} wrap>
                        {selection[key].map((label) => {
                          const color =
                            ANALYSIS_OPTIONS[key].find((item) => item.label === label)?.color || 'default';
                          return (
                            <Tag key={label} color={color}>
                              {label}
                            </Tag>
                          );
                        })}
                      </Space>
                    ) : (
                      <Text>-</Text>
                    )}
                  </div>
                </div>
              ))}
              <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
                <Button block icon={<ArrowLeftOutlined />} onClick={() => setStep(0)}>
                  返回素材查询
                </Button>
                <Button type="primary" block icon={<ArrowRightOutlined />} onClick={goGenerate}>
                  进入下一步 AI内容生成 →
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      )}

      {step === 2 && (
        <Card
          title="生成结果"
          extra={
            <Button
              type="primary"
              disabled={!pickedResult}
              onClick={() => message.success('已以此模板创建任务（mock）')}
            >
              以此模板创建任务
            </Button>
          }
        >
          <div className="ai-result-layout">
            <Menu
              mode="inline"
              selectedKeys={[resultAudience]}
              defaultOpenKeys={audienceMenuItems.map((item) => item.key)}
              items={audienceMenuItems}
              onClick={({ key }) => setResultAudience(key)}
              style={{ width: 200, borderInlineEnd: 0, background: 'transparent' }}
            />
            <div className="ai-result-list">
              <Radio.Group
                value={pickedResult}
                onChange={(e) => setPickedResult(e.target.value)}
                style={{ width: '100%' }}
              >
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  {generatedList.map((item) => (
                    <Card key={item.key} className="ai-result-card">
                      <div className="ai-result-head">
                        <Space>
                          <Radio value={item.key} />
                          <Text strong>{item.title}</Text>
                        </Space>
                        <Link onClick={() => message.info('跳转配置种草码（mock）')}>配置种草码</Link>
                      </div>
                      <Space size={8} style={{ margin: '8px 0' }}>
                        <Tag color="orange">痛点：{item.painPoint}</Tag>
                        <Text type="danger">评分 {item.score}</Text>
                      </Space>
                      <Paragraph style={{ marginBottom: 8 }}>{item.summary}</Paragraph>
                      <Paragraph type="secondary" style={{ marginBottom: 8 }}>
                        {item.content}
                      </Paragraph>
                      <Link onClick={() => setPreviewGen(item)}>预览内容</Link>
                    </Card>
                  ))}
                  {!generatedList.length && <Empty description="暂无生成结果" />}
                </Space>
              </Radio.Group>
              <Button style={{ marginTop: 16 }} icon={<ArrowLeftOutlined />} onClick={() => setStep(1)}>
                返回 AI分析
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Modal
        title="预览内容"
        open={!!previewNote}
        onCancel={() => setPreviewNote(null)}
        footer={<Button onClick={() => setPreviewNote(null)}>关闭</Button>}
      >
        {previewNote && (
          <Space direction="vertical">
            <Text strong>{previewNote.title}</Text>
            <Text type="secondary">互动 {previewNote.interactionsLabel}</Text>
            <Paragraph>{previewNote.summary}</Paragraph>
          </Space>
        )}
      </Modal>

      <Modal
        title="预览生成内容"
        open={!!previewGen}
        onCancel={() => setPreviewGen(null)}
        footer={<Button onClick={() => setPreviewGen(null)}>关闭</Button>}
      >
        {previewGen && (
          <Space direction="vertical">
            <Text strong>{previewGen.title}</Text>
            <Tag color="orange">痛点：{previewGen.painPoint}</Tag>
            <Paragraph>{previewGen.summary}</Paragraph>
            <Paragraph>{previewGen.content}</Paragraph>
          </Space>
        )}
      </Modal>
    </div>
  );
}
