import { DataGridKeys } from '@/parts/DataGrid/key/DataGridKeys';
import { useMessageDialog } from '@/parts/Dialog/MessageDialog/useMessageDialog';
import { ModalWindow } from '@/parts/Window/ModalWindow';
import { putStockInfo } from '@/store/api/apps/qas/sqas/sqasApi';
import { stockInfoDataSource } from '@/store/recoil/apps/sqas/sqasRecoil';
import { Box, Button } from '@mui/material';
import { JSX, useCallback } from 'react';
import { useRecoilCallback } from 'recoil';
import { StockInfoDataSourceKeys } from '../../../../store/recoil/apps/sqas/keys/StockInfoDataSourceKeys';
import DGStockScreenerViewer from './DGScreenerViewer';

export interface ScreenerViewerForCSVInserterState {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
}

interface Props {
  state: ScreenerViewerForCSVInserterState;
}

export default function ScreenerViewerForCSVInserter(props: Props): JSX.Element {
  const { isOpen, setIsOpen } = props.state;

  const { openMessageDialog } = useMessageDialog();

  const handleDBInsertButtonClick = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const dataKey = (await snapshot.getPromise(stockInfoDataSource(StockInfoDataSourceKeys.INPUT_CSV))).key;
        await putStockInfo(dataKey);
        openMessageDialog('DB登録が完了しました。');
      },
    []
  );

  const handleModalWindowClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <ModalWindow isOpen={isOpen} onClose={handleModalWindowClose} title='銘柄情報（CSV入力）' backdropClosable={false}>
      <Box display={'flex'} flexDirection='column' gap={2}>
        <DGStockScreenerViewer
          dataGridKey={DataGridKeys.SQAS_DG_STOCK_SCREENER_VIEWER}
          dataSourceKey={StockInfoDataSourceKeys.INPUT_CSV}
        />
        <Box display={'flex'} justifyContent='space-between' gap={2}>
          <Button variant='contained' onClick={handleDBInsertButtonClick} color='primary'>
            DB登録
          </Button>
          <Button variant='contained' color='secondary' onClick={handleModalWindowClose}>
            戻る
          </Button>
        </Box>
      </Box>
    </ModalWindow>
  );
}
