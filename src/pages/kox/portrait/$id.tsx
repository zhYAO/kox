import { DownloadOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Radio,
  Row,
  Space,
  Statistic,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';
import { history, useParams } from '@umijs/max';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MOCK_KOX_LIST, platformLabel } from '@/mock/koxList';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

export default function KoxPortraitPage() {
  const { id } = useParams<{ id: string }>();
  const record = useMemo(
    () => MOCK_KOX_LIST.find((item) => String(item.koxId) === id) ?? MOCK_KOX_LIST[0],
    [id],
  );
  const [mainTab, setMainTab] = useState('private');
  const [subTab, setSubTab] = useState('task');
  const [platform, setPlatform] = useState('all');
  const radarRef = useRef<HTMLDivElement | null>(null);
  const pieRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const chartRefs = useRef<EChartsType[]>([]);

  useEffect(() => {
    chartRefs.current.forEach((chart) => chart.dispose());
    chartRefs.current = [];

    if (mainTab === 'private' && subTab === 'task' && radarRef.current) {
      const chart = echarts.init(radarRef.current);
      chart.setOption({
        tooltip: {},
        radar: {
          indicator: [
            { name: '内容力', max: 100 },
            { name: '影响力', max: 100 },
            { name: '共创力', max: 100 },
          ],
        },
        series: [
          {
            type: 'radar',
            data: [{ value: [72, 58, 65], name: '能力评估' }],
            areaStyle: { opacity: 0.2 },
          },
        ],
      });
      chartRefs.current.push(chart);
    }

    if (mainTab === 'public') {
      if (pieRef.current) {
        const chart = echarts.init(pieRef.current);
        chart.setOption({
          tooltip: { trigger: 'item' },
          legend: { bottom: 0 },
          series: [
            {
              type: 'pie',
              radius: ['40%', '65%'],
              data: [
                { name: '男', value: 42 },
                { name: '女', value: 58 },
              ],
            },
          ],
        });
        chartRefs.current.push(chart);
      }
      if (barRef.current) {
        const chart = echarts.init(barRef.current);
        chart.setOption({
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: ['18-24', '25-30', '31-40', '41-50', '50+'] },
          yAxis: { type: 'value', name: '人数占比(%)' },
          series: [{ type: 'bar', data: [18, 32, 27, 15, 8], barWidth: 28 }],
        });
        chartRefs.current.push(chart);
      }
    }

    const onResize = () => chartRefs.current.forEach((chart) => chart.resize());
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chartRefs.current.forEach((chart) => chart.dispose());
      chartRefs.current = [];
    };
  }, [mainTab, subTab]);

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Button type="link" style={{ padding: 0, width: 'fit-content' }} onClick={() => history.push('/kox/list')}>
        返回 KOX 列表
      </Button>

      <Card>
        <Space align="start" size={16}>
          <Avatar size={64} icon={<UserOutlined />} />
          <div>
            <Space wrap>
              <Title level={4} style={{ margin: 0 }}>
                {record.nickname}
              </Title>
              <Tag color="processing">{record.ownerTag || '小月龄周期（4-12 月）'}</Tag>
            </Space>
            <Space size={24} wrap style={{ marginTop: 8 }}>
              <Text type="secondary">KOX-ID：{record.koxId}</Text>
              <Text type="secondary">手机号：{record.phone}</Text>
              <Text type="secondary">
                所属地区：{record.province} {record.city}
              </Text>
              <Text type="secondary">
                绑定任务平台：
                <Tag>{platformLabel(record.platform)}</Tag>
              </Text>
            </Space>
          </div>
        </Space>
      </Card>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card>
            <Statistic title="总粉丝" value={record.followers} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Statistic title={`${platformLabel(record.platform)} 粉丝数`} value={record.followers} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs
          activeKey={mainTab}
          onChange={(key) => {
            setMainTab(key);
            setSubTab(key === 'private' ? 'task' : 'overview');
          }}
          items={[
            { key: 'private', label: '私域画像' },
            { key: 'public', label: '公域画像' },
          ]}
        />

        {mainTab === 'private' && (
          <>
            <Tabs
              activeKey={subTab}
              onChange={setSubTab}
              items={[
                { key: 'task', label: '参与任务分析' },
                { key: 'ads', label: '投流明细' },
              ]}
            />

            {subTab === 'task' ? (
              <Space direction="vertical" size={16} style={{ display: 'flex' }}>
                <Space wrap>
                  <Text>任务平台：</Text>
                  <Radio.Group value={platform} onChange={(e) => setPlatform(e.target.value)} optionType="button">
                    <Radio.Button value="all">全部</Radio.Button>
                    <Radio.Button value="xiaohongshu">小红书</Radio.Button>
                    <Radio.Button value="douyin">抖音</Radio.Button>
                  </Radio.Group>
                  <Text>时间范围：</Text>
                  <RangePicker defaultValue={[dayjs('2026-05-01'), dayjs('2026-08-01')]} />
                </Space>

                <Row gutter={16}>
                  <Col xs={24} md={10}>
                    <Card title="综合评分" extra={<Text type="secondary">等级 C</Text>}>
                      <Statistic value={20.67} precision={2} valueStyle={{ color: '#1677ff' }} />
                      <Text type="secondary">当前排名：#-</Text>
                    </Card>
                  </Col>
                  <Col xs={24} md={14}>
                    <Card
                      title="三维能力评估"
                      extra={
                        <Button size="small" icon={<DownloadOutlined />}>
                          导出数据
                        </Button>
                      }
                    >
                      <div ref={radarRef} style={{ height: 320 }} />
                    </Card>
                  </Col>
                </Row>
              </Space>
            ) : (
              <Card>
                <Text type="secondary">投流明细（mock 占位）</Text>
              </Card>
            )}
          </>
        )}

        {mainTab === 'public' && (
          <Space direction="vertical" size={16} style={{ display: 'flex' }}>
            <Space>
              <Text>选择平台：</Text>
              <Tag color="error">{platformLabel(record.platform)}（{record.nickname}）</Tag>
            </Space>

            <Row gutter={[16, 16]}>
              {[
                { title: '作品总数', value: record.publishedCount },
                { title: '总粉丝数', value: record.followers, suffix: '人' },
                { title: '平均互动', value: record.avgInteraction },
                { title: '平均点赞', value: 0 },
                { title: '平均评论', value: 0 },
                { title: '平均转发', value: 0 },
                { title: '预估曝光量', value: record.estimatedExposure },
                { title: '预估阅读量', value: record.estimatedReads },
              ].map((item) => (
                <Col xs={12} md={6} key={item.title}>
                  <Card size="small">
                    <Statistic title={item.title} value={item.value} suffix={item.suffix} />
                  </Card>
                </Col>
              ))}
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Card
                  title="粉丝性别分布"
                  extra={
                    <Button size="small" icon={<DownloadOutlined />}>
                      导出数据
                    </Button>
                  }
                >
                  <div ref={pieRef} style={{ height: 260 }} />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card
                  title="粉丝年龄分布"
                  extra={
                    <Button size="small" icon={<DownloadOutlined />}>
                      导出数据
                    </Button>
                  }
                >
                  <div ref={barRef} style={{ height: 260 }} />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card
                  title="粉丝兴趣标签"
                  extra={
                    <Button size="small" icon={<DownloadOutlined />}>
                      导出数据
                    </Button>
                  }
                >
                  <Space wrap>
                    {['母婴', '汽车', '旅行', '美食', '数码'].map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                </Card>
              </Col>
            </Row>
          </Space>
        )}
      </Card>
    </Space>
  );
}
