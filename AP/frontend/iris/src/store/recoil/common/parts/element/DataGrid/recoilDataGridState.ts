import { DataGridKeys } from '@/parts/DataGrid/key/DataGridKeys';
import { AtomKeys } from '@/store/recoil/keys/AtomKeys';
import { GridFilterModel, GridRowId, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';
import { atomFamily } from 'recoil';

// 選択行
export const selectionModelState = atomFamily<GridRowSelectionModel, DataGridKeys>({
  key: AtomKeys.IRIS_PARTS_DATAGRID_SELECTION_MODEL_STATE,
  default: { type: 'include', ids: new Set<GridRowId>() },
});

// ソートモデル
export const sortModelState = atomFamily<GridSortModel, DataGridKeys>({
  key: AtomKeys.IRIS_PARTS_DATAGRID_SORT_MODEL_STATE,
  default: [],
});

// フィルタモデル
export const filterModelState = atomFamily<GridFilterModel, DataGridKeys>({
  key: AtomKeys.IRIS_PARTS_DATAGRID_FILTER_MODEL_STATE,
  default: { items: [] },
});
