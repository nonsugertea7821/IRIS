import { DataGridKeys } from '@/parts/DataGrid/key/DataGridKeys';
import { FieldConfig, RecoilDataGrid } from '@/parts/DataGrid/RecoilDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { JSX, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { StockInfoDataSourceKeys } from '../../../../store/recoil/apps/sqas/keys/StockInfoDataSourceKeys';
import { stockInfoDataSource } from '../../../../store/recoil/apps/sqas/sqasRecoil';
import { StockInfo } from '../data/StockInfo';

interface Props {
  dataSourceKey: StockInfoDataSourceKeys;
  dataGridKey: DataGridKeys;
}

export default function DGStockScreenerViewer(props: Props): JSX.Element {
  const { dataSourceKey, dataGridKey } = props;

  //#region Formatter
  // const stringFormatter = (value?: string) => (value ? value : '');
  // const numberFormatter = (value?: number) => value?.toLocaleString() ?? '';
  const percentFormatter = (value?: number) => (value !== undefined ? `${value.toFixed(2)}%` : '');
  // const dateFormatter = (value?: string) => (value ? new Date(value).toLocaleDateString() : '');
  //#endregion
  //#region FieldConfig

  const stockFieldConfig: Record<keyof StockInfo, FieldConfig> = useMemo(
    () => ({
      ticker: { header: '銘柄コード', type: 'number', width: 100 },
      name: { header: '銘柄名', type: 'string', minWidth: 150, flex: 1 },
      market: { header: '市場', type: 'string', width: 75 },
      industry: { header: '業種', type: 'string', minWidth: 120, flex: 1 },
      listingDate: { header: '上場年月日', type: 'date', width: 100 },
      price: { header: '株価', type: 'number', width: 100 },
      change: { header: '前日比', type: 'number', width: 100 },
      changePercent: { header: '前日比(%)', type: 'number', width: 100, formatter: percentFormatter },
      volume: { header: '出来高', type: 'number', width: 120 },
      marketCap: { header: '時価総額', type: 'number', width: 120 },
      sharesOutstanding: { header: '発行済株式数', type: 'number', width: 120 },
      freeFloatRatio: { header: '浮動株比率(%)', type: 'number', width: 100, formatter: percentFormatter },
      dividendYield: { header: '配当利回り(%)', type: 'number', formatter: percentFormatter },
      dividendPerShare: { header: '1株当たり配当金(円)', type: 'number', width: 120 },
      equityCapitalRatio: { header: '自己資本比率(%)', type: 'number', width: 120, formatter: percentFormatter },
      per: { header: 'PER', type: 'number', width: 120 },
      pbr: { header: 'PBR', type: 'number', width: 120 },
      eps: { header: 'EPS(円)', type: 'number', width: 120 },
      bps: { header: 'BPS(円)', type: 'number', width: 120 },
      roe: { header: 'ROE(%)', type: 'number', width: 120, formatter: percentFormatter },
      roa: { header: 'ROA(%)', type: 'number', width: 120, formatter: percentFormatter },
      debtRatio: { header: '負債比率(%)', type: 'number', width: 120, formatter: percentFormatter },
      currentRatio: { header: '流動比率(%)', type: 'number', width: 120, formatter: percentFormatter },
      quickRatio: { header: '当座比率(%)', type: 'number', width: 120, formatter: percentFormatter },
      equityRatio: { header: '自己資本利益率(%)', type: 'number', width: 180, formatter: percentFormatter },
      revenue: { header: '売上高', type: 'number', width: 120 },
      operatingIncome: { header: '営業利益', type: 'number', width: 120 },
      ordinaryIncome: { header: '経常利益', type: 'number', width: 120 },
      netIncome: { header: '当期純利益', type: 'number', width: 120 },
      totalAssets: { header: '総資産', type: 'number', width: 120 },
      totalEquity: { header: '純資産', type: 'number', width: 120 },
      interestBearingDebt: { header: '有利子負債', type: 'number', width: 120 },
      operatingCashFlow: { header: '営業CF', type: 'number', width: 120 },
      investingCashFlow: { header: '投資CF', type: 'number', width: 120 },
      financingCashFlow: { header: '財務CF', type: 'number', width: 120 },
    }),
    []
  );

  //#endregion

  const rows: StockInfo[] = useRecoilValue(stockInfoDataSource(dataSourceKey)).data;

  const columns: GridColDef<StockInfo>[] = useMemo(() => {
    // データが入っているフィールドを抽出
    const usedFields = Object.keys(stockFieldConfig).filter((field) =>
      rows.some(
        (row) =>
          row[field as keyof StockInfo] !== null &&
          row[field as keyof StockInfo] !== undefined &&
          row[field as keyof StockInfo] !== ''
      )
    );

    // 必要なカラムのみ生成
    return usedFields.map((field) => {
      const config = stockFieldConfig[field];
      return {
        field,
        type: config.type ? config.type : 'string',
        width: config.width,
        minWidth: config.minWidth,
        maxWidth: config.maxWidth,
        align: config.align,
        headerAlign: config.headerAlign,
        flex: config.flex,
        headerName: config.header,
        valueFormatter: config.formatter
          ? (params: string | number) => {
              if (!params) return '';
              return config.formatter!(params);
            }
          : undefined,
      };
    });
  }, [stockFieldConfig, rows]);

  return (
    <RecoilDataGrid
      id={dataGridKey}
      columns={columns}
      rows={rows}
      initialState={useMemo(() => {
        return {
          pagination: { paginationModel: { pageSize: 100, page: 0 } },
        };
      }, [])}
      pageSizeOptions={useMemo(() => [100], [])}
      frameSx={useMemo(() => {
        return { height: '70vh', width: '100%' };
      }, [])}
    />
  );
}
