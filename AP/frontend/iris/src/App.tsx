import { JSX } from 'react';
import { RecoilRoot } from 'recoil';
import AppRouter from './store/route/AppRouter';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import DialogProvider from './parts/Dialog/DialogProvider';

const cache = createCache({ key: 'css', prepend: true });

export default function App(): JSX.Element {
  return (
    <CacheProvider value={cache}>
      <RecoilRoot>
        <DialogProvider>
          <AppRouter />
        </DialogProvider>
      </RecoilRoot>
    </CacheProvider>
  );
}
