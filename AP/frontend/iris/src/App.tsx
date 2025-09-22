import { JSX } from 'react';
import { RecoilRoot } from 'recoil';
import AppRouter from './store/route/AppRouter';

export default function App():JSX.Element {
  return (
    <RecoilRoot>
      <AppRouter />
    </RecoilRoot>
  );
}