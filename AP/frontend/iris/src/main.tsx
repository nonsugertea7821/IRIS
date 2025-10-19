import { CacheProvider } from '@emotion/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App';
import DialogProvider from './parts/Dialog/DialogProvider';

import createCache from '@emotion/cache';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')!);

const cache = createCache({ key: 'css', prepend: true });

root.render(
  <React.StrictMode>
    <CacheProvider value={cache}>
      <RecoilRoot>
        <DialogProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DialogProvider>
      </RecoilRoot>
    </CacheProvider>
  </React.StrictMode>
);
