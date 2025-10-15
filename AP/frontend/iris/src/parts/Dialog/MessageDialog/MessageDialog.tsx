import { Box, ButtonBase, Typography } from '@mui/material';
import { JSX, useCallback, useMemo } from 'react';
import { ModalWindow } from '../../Window/ModalWindow';

export type MessageDialogHeader = '確認' | '情報' | '警告';

export type MessageDialogButtons = 'ok' | 'ok-cancel' | { okLabel?: string; cancelLabel?: string }; // ラベルカスタム

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onOk?: () => void;
  header?: MessageDialogHeader;
  /** ボタン種類 */
  buttons?: MessageDialogButtons;
}

/**
 * 汎用メッセージダイアログ
 */
export default function MessageDialog({
  isOpen,
  onClose,
  message,
  onOk,
  header = '確認',
  buttons = 'ok',
}: MessageDialogProps): JSX.Element {
  /** OKボタンハンドラ */
  const handleOk = useCallback(() => {
    if (onOk) onOk();
    onClose();
  }, [onClose, onOk]);

  // ボタンラベルと表示判定
  const { showCancel, okLabel, cancelLabel } = useMemo(() => {
    if (buttons === 'ok') return { showCancel: false, okLabel: 'OK', cancelLabel: '' };
    if (buttons === 'ok-cancel') return { showCancel: true, okLabel: 'OK', cancelLabel: 'キャンセル' };
    return {
      showCancel: true,
      okLabel: buttons.okLabel ?? 'OK',
      cancelLabel: buttons.cancelLabel ?? 'キャンセル',
    };
  }, [buttons]);

  return (
    <ModalWindow title={header} isOpen={isOpen} onClose={onClose}>
      <Box p={4}>
        <Typography>{message}</Typography>
        <Box display='flex' justifyContent='flex-end' gap={1} mt={2}>
          {showCancel && (
            <ButtonBase component='button' onClick={onClose}>
              {cancelLabel}
            </ButtonBase>
          )}
          <ButtonBase component='button' onClick={handleOk}>
            {okLabel}
          </ButtonBase>
        </Box>
      </Box>
    </ModalWindow>
  );
}
