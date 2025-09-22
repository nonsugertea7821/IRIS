import { JSX } from 'react';
import { RecoilRoot } from 'recoil';
import AppRouter from './store/route/AppRouter';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

const cache = createCache({ key: 'css', prepend: true });

export default function App(): JSX.Element {
  return (
    <CacheProvider value={cache}>
      <RecoilRoot>
        <AppRouter />
      </RecoilRoot>
    </CacheProvider>
  );
}