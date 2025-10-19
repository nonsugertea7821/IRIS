import { StockInfoResponse } from '@/apps/qas/sqas/data/StockInfoResponse';
import { IrisUrl } from '@/store/api/irisUrl';
import { axiosHelper } from '@/store/axios/axiosHelper';

export function parseStockScreenerCSV(file: File, extractDate: Date, extractLocale: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('extractDate', extractDate.toISOString());
  formData.append('extractLocale', extractLocale);
  return axiosHelper.post<StockInfoResponse>(IrisUrl.IRIS_API_POST_SQAS_PARSE_STOCK_SCREENER_CSV, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function putStockInfo(dataKey: string) {
  await axiosHelper.put(IrisUrl.IRIS_API_PUT_SQAS_PUT_STOCK_INFO, null, { params: { dataKey } });
}
