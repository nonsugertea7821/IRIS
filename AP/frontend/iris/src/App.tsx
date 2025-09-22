// src/App.tsx
import { RecoilRoot } from 'recoil';
import AppRouter from './store/route/AppRouter';

export default function App() {
  return (
    <RecoilRoot>
      <AppRouter />
    </RecoilRoot>
  );
}