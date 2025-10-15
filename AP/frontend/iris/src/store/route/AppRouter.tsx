import React, { JSX } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authSelector } from '../recoil/common/auth/authRecoil';
import { IrisRoutes } from './routes';

/**
 * 認証保護ルートコンポーネント
 * @author nonsugertea7821
 * @returns JSX.Element
 */
function ProtectedRoute(): JSX.Element {
  const { isAuthenticated } = useRecoilValue(authSelector);
  return isAuthenticated ? <Outlet /> : <Navigate to='/' replace />;
}

/** ログインフォーム */
const LoginForm = React.lazy(() => import('../../apps/common/auth/LoginForm'));
/** ホーム */
const Home = React.lazy(() => import('../../apps/common/home/Home'));

/**
 * アプリルーターコンポーネント
 * @author nonsugertea7821
 * @returns JSX.Element
 */
export default function AppRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route element={<ProtectedRoute />}>
          {/**要認証AP */}
          <Route path={IrisRoutes.AP_IRIS_HOME.path} element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
