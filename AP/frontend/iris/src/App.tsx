import { JSX } from 'react';
import usePromiseRejectionHandler from './store/browser/usePromiseRejectionHandler';
import AppRouter from './store/route/AppRouter';
export default function App(): JSX.Element {
  // Promise例外のハンドリング
  usePromiseRejectionHandler();
  return <AppRouter />;
}
