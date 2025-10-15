import { useContext } from 'react';
import { FileDialogContext } from './FileDialogProvider';

/**
 * useFileDialog
 *
 * ファイル選択ダイアログを開くためのカスタムフック。
 *
 * @throws Provider でラップされていない場合にエラーを投げる
 * @returns FileDialogContextValue
 */
export function useFileDialog(): FileDialogContext {
  const context = useContext(FileDialogContext);
  if (!context) throw new Error('useFileDialog must be used within a FileDialogProvider');
  return context;
}
