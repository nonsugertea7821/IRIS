import { Box, ButtonBase, Paper, Typography } from '@mui/material';
import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { ModalWindow } from '../../Window/ModalWindow';

interface FileDialogProps {
  /** ダイアログの開閉状態 */
  isOpen: boolean;
  /** ダイアログを閉じるコールバック */
  onClose: () => void;
  /** ファイル選択完了時に呼ばれるコールバック */
  onSelectFiles: (files: File[]) => void;
  /** 許可するファイルタイプ（例: "image/*,.pdf"） */
  accept?: string;
}

/**
 * ファイル選択ダイアログ（複数ファイル対応、ドラッグ＆ドロップ＋クリック対応）
 * ドラッグ中は背景色が変化。accept 属性でファイルタイプ制限可能。
 *
 * @param isOpen ダイアログの表示状態
 * @param onClose ダイアログを閉じるコールバック
 * @param onSelectFiles 選択されたファイルを返すコールバック
 * @param accept 許可するファイルタイプ
 * @returns JSX.Element
 */
export default function FileDialog({ isOpen, onClose, onSelectFiles, accept }: FileDialogProps): JSX.Element {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  /**
   * ダイアログ閉鎖時に内部ステートをリセット
   */
  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
      setIsDragActive(false);
    }
  }, [isOpen]);

  /**
   * ファイル選択 input の onChange ハンドラ
   *
   * @param e 入力イベント
   */
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
  }, []);

  /**
   * ドラッグが要素上に入った時のハンドラ
   *
   * @param e ドラッグイベント
   */
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  /**
   * ドラッグが要素外に出た時のハンドラ
   *
   * @param e ドラッグイベント
   */
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  /**
   * ドラッグ中にデフォルト動作を抑制するハンドラ
   *
   * @param e ドラッグイベント
   */
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  /**
   * ドラッグ＆ドロップでファイルがドロップされた時のハンドラ
   *
   * @param e ドラッグイベント
   */
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files) setSelectedFiles(Array.from(e.dataTransfer.files));
  }, []);

  /**
   * OK ボタン押下時の処理
   * 選択ファイルをコールバックに渡してダイアログを閉じる
   */
  const handleOk = useCallback(() => {
    if (selectedFiles.length > 0) onSelectFiles(selectedFiles);
    onClose();
  }, [selectedFiles, onSelectFiles, onClose]);

  return (
    <ModalWindow isOpen={isOpen} onClose={onClose}>
      <Box p={4}>
        {/* ドラッグ＆ドロップ + クリック領域 */}
        <input
          type='file'
          multiple
          accept={accept}
          onChange={handleFileChange}
          style={useMemo(() => {
            return { display: 'none' };
          }, [])}
          id='file-input'
        />
        <label htmlFor='file-input'>
          <ButtonBase
            component={Paper}
            variant='outlined'
            sx={useMemo(() => {
              return {
                p: 4,
                mb: 2,
                width: '100%',
                textAlign: 'center',
                borderStyle: 'dashed',
                '&:hover': { backgroundColor: 'grey.100' },
                backgroundColor: isDragActive ? 'grey.200' : 'inherit',
              };
            }, [isDragActive])}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <Typography>ファイルをドラッグ＆ドロップするか、クリックして選択</Typography>
          </ButtonBase>
        </label>

        {selectedFiles.length > 0 && (
          <Box mb={2}>
            {selectedFiles.map((file) => (
              <Typography key={file.name} variant='body2'>
                {file.name}
              </Typography>
            ))}
          </Box>
        )}

        <Box display='flex' justifyContent='flex-end' gap={1}>
          <ButtonBase component='button' onClick={onClose}>
            キャンセル
          </ButtonBase>
          <ButtonBase component='button' onClick={handleOk} disabled={selectedFiles.length === 0}>
            OK
          </ButtonBase>
        </Box>
      </Box>
    </ModalWindow>
  );
}
