/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  filterModelState,
  selectionModelState,
  sortModelState,
} from '@/store/recoil/common/parts/element/DataGrid/recoilDataGridState';
import { Box, styled, SxProps, Theme } from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridFilterModel,
  GridRowSelectionModel,
  GridSortDirection,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { GridSortItem } from '@mui/x-data-grid/models/gridSortModel';
import { JSX, useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { DataGridKeys } from './key/DataGridKeys';

export interface FieldConfig {
  header: string;
  type?: 'string' | 'number' | 'boolean' | 'date';
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'right' | 'center';
  headerAlign?: 'left' | 'right' | 'center';
  flex?: number;
  formatter?: (value: any) => string;
}

interface Props<T extends GridValidRowModel, U extends GridColDef<T>> extends DataGridProps {
  id: DataGridKeys;
  rows: T[];
  columns: U[];
  frameSx?: SxProps<Theme>;
}

export function RecoilDataGrid<T extends GridValidRowModel, U extends GridColDef<T>>(props: Props<T, U>): JSX.Element {
  const { id, rows, columns, frameSx } = props;
  const [selectedRows, setSelectedRows] = useRecoilState<GridRowSelectionModel>(selectionModelState(id));
  const [sortModel, setSortModel] = useRecoilState<GridSortModel>(sortModelState(id));
  const [filterModel, setFilterModel] = useRecoilState<GridFilterModel>(filterModelState(id));

  // --- セル値取得 ---
  const getCellValue = useCallback(
    (row: T, field: string) => {
      const col = (columns as any).find((c: any) => c.field === field) as any | undefined;
      if (col?.valueGetter) {
        try {
          return col.valueGetter({ row, colDef: col, field, value: (row as any)[field], id: (row as any).id });
        } catch {
          return undefined;
        }
      }
      if (field.includes('.')) {
        return field.split('.').reduce((acc: any, k: string) => (acc == null ? undefined : acc[k]), row as any);
      }
      return (row as any)[field];
    },
    [columns]
  );

  // --- ソートトグル ---
  const handleSortToggle = useCallback(
    (field: string) => {
      setSortModel((prev) => {
        const existing = prev.find((s) => s.field === field);
        if (!existing) return [...prev, { field, sort: 'asc' as GridSortDirection }];
        if (existing.sort === 'asc') return prev.map((s) => (s.field === field ? { ...s, sort: 'desc' } : s));
        return prev.filter((s) => s.field !== field);
      });
    },
    [setSortModel]
  );

  // --- ソート済み行 ---
  const sortedRows = useMemo(() => {
    if (!sortModel?.length) return rows;
    const activeSorts = sortModel.filter((s) => s.sort);
    if (!activeSorts.length) return rows;

    const indexed = rows.map((r, i) => ({ r, i }));
    indexed.sort((A, B) => {
      const a = A.r;
      const b = B.r;
      for (const { field, sort } of activeSorts) {
        const av = getCellValue(a, field);
        const bv = getCellValue(b, field);

        if (av == null && bv == null) continue;
        if (av == null) return 1;
        if (bv == null) return -1;

        if (typeof av === 'number' && typeof bv === 'number') return sort === 'asc' ? av - bv : bv - av;

        const aTime =
          av instanceof Date ? av.getTime() : Number.isNaN(Date.parse(String(av))) ? NaN : Date.parse(String(av));
        const bTime =
          bv instanceof Date ? bv.getTime() : Number.isNaN(Date.parse(String(bv))) ? NaN : Date.parse(String(bv));
        if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) return sort === 'asc' ? aTime - bTime : bTime - aTime;

        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });
        if (cmp !== 0) return sort === 'asc' ? cmp : -cmp;
      }
      return A.i - B.i; // 安定ソート
    });

    return indexed.map((x) => x.r);
  }, [rows, sortModel, getCellValue]);

  // --- ヘッダー ---
  const headerStyle = useMemo(
    () => ({ cursor: 'pointer', display: 'flex', alignItems: 'center', width: '100%', height: '100%' }),
    []
  );
  const handleHeaderClick = useCallback((field: string) => () => handleSortToggle(field), [handleSortToggle]);

  const getSortState = useCallback(
    (index: number) => {
      const sortState = index !== -1 ? sortModel[index] : undefined;
      return sortState;
    },
    [sortModel]
  );

  const createAllowChar = useCallback((sortState: GridSortItem | undefined) => {
    return sortState?.sort === 'asc' ? ' ▲' : sortState?.sort === 'desc' ? ' ▼' : '';
  }, []);

  const createPriorityChar = useCallback(
    (index: number) => {
      return index !== -1 && sortModel.length > 1 ? `(${index + 1})` : '';
    },
    [sortModel.length]
  );

  const getRenderHeader = useCallback(
    (field: string, headerName?: string) => {
      const index = sortModel.findIndex((s) => s.field === field);
      const sortState = getSortState(index);
      const arrow = createAllowChar(sortState);
      const priority = createPriorityChar(index);
      return (
        <div style={headerStyle} onClick={handleHeaderClick(field)} role='button' tabIndex={0}>
          {headerName ?? field}
          {arrow}
          {priority}
        </div>
      );
    },
    [sortModel, getSortState, createAllowChar, createPriorityChar, headerStyle, handleHeaderClick]
  );

  const getExtendColWidth = useCallback(
    (col: U) => {
      const index = sortModel.findIndex((s) => s.field === col.field);
      const sortState = getSortState(index);
      const arrow = createAllowChar(sortState);
      const priority = createPriorityChar(index);
      if (arrow || priority) {
        // ソートアイコンと優先度表示分を加味
        const extraWidth = 20 + (priority ? 14 * priority.length : 0);
        if (col.width) return col.width + extraWidth;
        if (col.flex) return undefined; // flex指定時はwidthを変更しない
        if (col.minWidth) return col.minWidth + extraWidth;
        return 150 + extraWidth; // デフォルト値150に加算
      }
      return col.width ?? 150;
    },
    [createAllowChar, createPriorityChar, getSortState, sortModel]
  );

  // --- メモ化された列 ---
  const memoizedColumns = useMemo<GridColDef[]>(
    () =>
      columns.map((col) => ({
        ...col,
        width: getExtendColWidth(col),
        sortable: false,
        renderHeader: (params: any) => getRenderHeader(params.field, params.colDef?.headerName ?? params.field),
      })),
    [columns, getExtendColWidth, getRenderHeader]
  );
  const noop = useCallback(() => {}, []);

  return (
    <Box sx={frameSx}>
      <StyledDataGrid
        pagination
        disableRowSelectionOnClick
        sortingMode='server'
        rows={sortedRows}
        columns={memoizedColumns}
        onSortModelChange={noop}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={setSelectedRows}
      />
    </Box>
  );
}

const StyledDataGrid = styled(DataGrid)(() => ({
  height: '100%',
  width: '100%',
}));
