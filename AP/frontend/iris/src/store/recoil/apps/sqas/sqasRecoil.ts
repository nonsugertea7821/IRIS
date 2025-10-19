import { StockInfoResponse } from '@/apps/qas/sqas/data/StockInfoResponse';
import { atomFamily } from 'recoil';
import { AtomKeys } from '../../keys/AtomKeys';
import { StockInfoDataSourceKeys } from './keys/StockInfoDataSourceKeys';

/**
 * SQAS/株式情報 データ保持オブジェクトを取得する
 * @param param0 {@link StockInfoDataSourceKeys}
 */
export const stockInfoDataSource = atomFamily<StockInfoResponse, StockInfoDataSourceKeys>({
  key: AtomKeys.IRIS_SQAS_STOCK_INFO_DATA_SOURCE_STATE,
  default: { key: '', data: [] },
});
