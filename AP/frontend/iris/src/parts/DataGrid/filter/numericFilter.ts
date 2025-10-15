/* eslint-disable @typescript-eslint/no-explicit-any */
import { GridFilterItem } from '@mui/x-data-grid/models/gridFilterItem';

/**
 * 数値フィルターアイテム
 */
export interface NumericFilterItem {
  field: string;
  operator: '>' | '>=' | '<' | '<=' | '=' | '!='; // MUI と同じ
  value: number;
}

/**
 * フィルターモデルのアイテムを数値フィルターに変換する
 * @param items フィルターアイテム
 * @returns 数値フィルターアイテム
 */
export const mapFilterModelToNumericFilters = (items: GridFilterItem[]): NumericFilterItem[] => {
  return items
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '')
    .map(({ field, operator, value }) => ({
      field,
      operator: operator as NumericFilterItem['operator'],
      value: Number(value),
    }));
};

/**
 * 数値フィルターを適用する
 * @param rows 行
 * @param filters フィルター
 * @returns フィルター適用後の行
 */
export const applyNumericFilters = <T extends Record<string, any>>(rows: T[], filters: NumericFilterItem[]): T[] => {
  return rows.filter((row) =>
    filters.every((filter) => {
      const cellValue = row[filter.field];
      if (cellValue === null || cellValue === undefined) return false;
      switch (filter.operator) {
        case '>=':
          return cellValue >= filter.value;
        case '<=':
          return cellValue <= filter.value;
        case '>':
          return cellValue > filter.value;
        case '<':
          return cellValue < filter.value;
        case '=':
          return cellValue === filter.value;
        case '!=':
          return cellValue !== filter.value;
        default:
          return true;
      }
    })
  );
};
