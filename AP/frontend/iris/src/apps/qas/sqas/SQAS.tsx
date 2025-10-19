import AppContainer from '@/parts/AppContainer/AppContainer';
import { CustomBox } from '@/parts/Box/CustomBox';
import { CustomButton } from '@/parts/Button/CustomButton';
import { useFileDialog } from '@/parts/Dialog/FileDialog/useFileDialog';
import { parseStockScreenerCSV } from '@/store/api/apps/qas/sqas/sqasApi';
import { StockInfoDataSourceKeys } from '@/store/recoil/apps/sqas/keys/StockInfoDataSourceKeys';
import { stockInfoDataSource } from '@/store/recoil/apps/sqas/sqasRecoil';
import { styled } from '@mui/material';
import { JSX } from 'react';
import { useRecoilCallback } from 'recoil';
import ScreenerViewerForCSVInserter from './parts/ScreenerViewerForCSVInserter';
import useScreenerViewerForCSVInserter from './parts/hooks/useScreenerViewerForCSVInserter';

export default function SQAS(): JSX.Element {
  const { openWindow, state } = useScreenerViewerForCSVInserter();
  const { openFileDialog } = useFileDialog();

  const handleCSVInserterOpen = useRecoilCallback(
    ({ set }) =>
      async () => {
        openFileDialog(async (files: File[]) => {
          const file = files[0];
          const extractDate = new Date(file.lastModified);
          const extractLocale = 'ja_JP';
          const res = await parseStockScreenerCSV(file, extractDate, extractLocale);
          set(stockInfoDataSource(StockInfoDataSourceKeys.INPUT_CSV), res);
          openWindow();
        });
      },
    [openWindow]
  );

  return (
    <AppContainer>
      <Flame>
        <CustomButton onClick={handleCSVInserterOpen}>CSV入力</CustomButton>
      </Flame>
      <ScreenerViewerForCSVInserter state={state} />
    </AppContainer>
  );
}

const Flame = styled(CustomBox)(() => ({
  height: '100%',
}));
