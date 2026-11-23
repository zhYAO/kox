import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { history } from '@umijs/max';
import { useEffect } from 'react';
import { getAuth, saveAuth } from '@/utils/auth';
import './login.css';

type LoginValues = {
  username?: string;
  password?: string;
};

const { Title, Text } = Typography;

export default function LoginPage() {
  useEffect(() => {
    if (getAuth()) {
      history.replace('/kox/list');
    }
  }, []);

  const handleFinish = (values: LoginValues) => {
    saveAuth({
      username: values.username ?? '',
      password: values.password ?? '',
    });
    history.replace('/kox/list');
  };

  return (
    <div className="login-page">
      <div className="login-visual" />
      <div className="login-panel">
        <div className="login-card">
          <div className="login-brand">
            <div className="login-logo">KOX</div>
            <Text type="secondary">Admin Console</Text>
          </div>

          <div className="login-copy">
            <Title level={3} style={{ margin: 0 }}>
              欢迎回来
            </Title>
            <Text type="secondary">请输入账号和密码进入系统</Text>
          </div>

          <Form layout="vertical" onFinish={handleFinish} autoComplete="off">
            <Form.Item name="username" initialValue="kox_admin">
              <Input size="large" prefix={<UserOutlined />} placeholder="账号" allowClear />
            </Form.Item>
            <Form.Item name="password" initialValue="123456">
              <Input.Password size="large" prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>

            <Button type="primary" htmlType="submit" size="large" block className="login-submit">
              登录
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
