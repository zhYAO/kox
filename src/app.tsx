import { ConfigProvider, theme } from 'antd';
import { history } from '@umijs/max';
import type { ReactNode } from 'react';
import { getAuth } from '@/utils/auth';
import './styles/global.css';

export function rootContainer(container: ReactNode) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          borderRadius: 8,
          colorPrimary: '#1677ff',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
        },
      }}
      modal={{
        centered: true,
      }}
    >
      {container}
    </ConfigProvider>
  );
}

/** 默认进登录页；仅本地有登录缓存时可进业务页 */
export function onRouteChange({ location }: { location: { pathname: string } }) {
  const { pathname } = location;
  const authed = Boolean(getAuth());

  if (pathname === '/login') {
    if (authed) {
      history.replace('/kox/list');
    }
    return;
  }

  if (!authed) {
    history.replace('/login');
  }
}
