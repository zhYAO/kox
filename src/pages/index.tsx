import { history } from '@umijs/max';
import { useEffect } from 'react';
import { getAuth } from '@/utils/auth';

/** 根路径：无登录缓存进 login，有缓存进业务首页 */
export default function HomePage() {
  useEffect(() => {
    history.replace(getAuth() ? '/kox/list' : '/login');
  }, []);

  return null;
}
