import { createContext, JSX, ReactNode, useCallback, useMemo, useState } from 'react';
import FileDialog from './FileDialog';

export interface FileDialogContext {
  /**
   * ファイル選択ダイアログを開く
   *
   * @param onSelect 選択完了時に呼ばれるコールバック
   * @param accept 許可するファイルタイプ（例: "image/*,.pdf"）
   */
  openFileDialog: (onSelect: (files: File[]) => void, accept?: string) => void;
}

export const FileDialogContext = createContext<FileDialogContext | undefined>(undefined);

/**
 * FileDialogProvider
 *
 * ファイル選択ダイアログの状態管理を提供するコンテキストプロバイダー。
 *
 * @param children 子コンポーネント
 * @returns JSX.Element
 */
export function FileDialogProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [callback, setCallback] = useState<((files: File[]) => void) | null>(null);
  const [acceptProp, setAcceptProp] = useState<string | undefined>(undefined);

  /**
   * ファイル選択ダイアログを開く
   *
   * @param onSelect 選択完了時に呼ばれるコールバック
   * @param accept 許可するファイルタイプ
   */
  const openFileDialog = useCallback((onSelect: (files: File[]) => void, accept?: string) => {
    setCallback(() => onSelect);
    setAcceptProp(accept);
    setIsOpen(true);
  }, []);

  /**
   * ファイル選択完了時に呼ばれる内部ハンドラ
   *
   * @param files 選択されたファイル配列
   */
  const handleSelectFiles = useCallback(
    (files: File[]) => {
      if (callback) callback(files);
      setCallback(null);
      setAcceptProp(undefined);
      setIsOpen(false);
    },
    [callback]
  );

  /**
   * ダイアログ閉鎖時のハンドラ
   */
  const handleClose = useCallback(() => {
    setCallback(null);
    setAcceptProp(undefined);
    setIsOpen(false);
  }, []);

  /** コンテキストの値 */
  const context = useMemo<FileDialogContext>(() => {
    return {
      openFileDialog,
    };
  }, [openFileDialog]);

  return (
    <FileDialogContext.Provider value={context}>
      {children}
      <FileDialog isOpen={isOpen} onClose={handleClose} onSelectFiles={handleSelectFiles} accept={acceptProp} />
    </FileDialogContext.Provider>
  );
}
