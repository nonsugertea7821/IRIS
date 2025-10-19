import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, ButtonBase, Typography, styled } from '@mui/material';
import { JSX, useCallback, useMemo } from 'react';
import { ModalWindow } from '../../Window/ModalWindow';

/**
 * メッセージダイアログのヘッダータイプ
 * - 確認: 成功または承認を表す
 * - 情報: 通知や説明を表す
 * - 警告: 注意喚起を表す
 */
export type MessageDialogHeader = '確認' | '情報' | '警告';

/**
 * ボタン構成タイプ
 * - 'ok': OKボタンのみ
 * - 'ok-cancel': OK/キャンセルボタン
 * - オブジェクト形式: ラベルをカスタマイズ可能
 */
export type MessageDialogButtons = 'ok' | 'ok-cancel' | { okLabel?: string; cancelLabel?: string };

/**
 * MessageDialogコンポーネントのプロパティ
 */
interface MessageDialogProps {
  /** ダイアログの開閉状態 */
  isOpen: boolean;
  /** ダイアログを閉じる処理 */
  onClose: () => void;
  /** 本文メッセージ */
  message: string;
  /** OKボタン押下時の処理 */
  onOk?: () => void;
  /** ヘッダーの種類（デフォルト: 確認） */
  header?: MessageDialogHeader;
  /** ボタン構成（デフォルト: ok） */
  buttons?: MessageDialogButtons;
}

/**
 * 汎用メッセージダイアログコンポーネント。
 * `header`に応じてアイコン・カラーリングを動的切り替え。
 * ボタン構成は`buttons`で制御可能。
 */
export default function MessageDialog({
  isOpen,
  onClose,
  message,
  onOk,
  header = '確認',
  buttons = 'ok',
}: MessageDialogProps): JSX.Element {
  /**
   * OKボタン押下時の共通ハンドラ。
   * onOkが存在すれば実行後にonCloseを呼ぶ。
   */
  const handleOk = useCallback(() => {
    if (onOk) onOk();
    onClose();
  }, [onClose, onOk]);

  /**
   * ボタン構成・ラベルを判定。
   * propsの型に応じてshowCancel, okLabel, cancelLabelを決定。
   */
  const { showCancel, okLabel, cancelLabel } = useMemo(() => {
    if (buttons === 'ok') return { showCancel: false, okLabel: 'OK', cancelLabel: '' };
    if (buttons === 'ok-cancel') return { showCancel: true, okLabel: 'OK', cancelLabel: 'キャンセル' };
    return {
      showCancel: true,
      okLabel: buttons.okLabel ?? 'OK',
      cancelLabel: buttons.cancelLabel ?? 'キャンセル',
    };
  }, [buttons]);

  /**
   * ヘッダー種別に応じたアイコンとカラー設定。
   * アイコン色はMUIプリセット、文字色は固定コードで統一。
   */
  const { icon, color } = useMemo(() => {
    switch (header) {
      case '確認':
        return {
          icon: <CheckCircleIcon color='success' />,
          color: '#2e7d32',
        };
      case '情報':
        return {
          icon: <InfoIcon color='info' />,
          color: '#0288d1',
        };
      case '警告':
        return {
          icon: <WarningAmberIcon color='warning' />,
          color: '#ed6c02',
        };
      default:
        return { icon: null, color: 'inherit' };
    }
  }, [header]);

  return (
    <ModalWindow title={header} isOpen={isOpen} onClose={onClose} headerColor={color} maxWidth={850}>
      <MessageContainer>
        <MessageRow>
          {icon}
          <MessageTypography color={color} data-testid='message-text'>
            {message}
          </MessageTypography>
        </MessageRow>
        <ButtonRow>
          {showCancel && <CancelButton onClick={onClose}>{cancelLabel}</CancelButton>}
          <OkButton bgcolor={color} onClick={handleOk}>
            {okLabel}
          </OkButton>
        </ButtonRow>
      </MessageContainer>
    </ModalWindow>
  );
}

// ==========================
// styled components
// ==========================

/** ダイアログ全体のコンテナ */
const MessageContainer = styled(Box)({
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

/** アイコン＋メッセージ行 */
const MessageRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

/** メッセージ本文 */
const MessageTypography = styled(Typography)<{ color: string }>(({ color }) => ({
  color,
  fontWeight: 300,
}));

/** ボタン行 */
const ButtonRow = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 16,
});

/** キャンセルボタン */
const CancelButton = styled(ButtonBase)({
  padding: '8px 16px',
  borderRadius: 8,
  backgroundColor: '#f0f0f0',
  '&:hover': { backgroundColor: '#e0e0e0' },
});

/** OKボタン（背景色を動的指定） */
const OkButton = styled(ButtonBase)<{ bgcolor: string }>(({ bgcolor }) => ({
  padding: '8px 16px',
  borderRadius: 8,
  backgroundColor: bgcolor,
  color: '#fff',
  '&:hover': { opacity: 0.8 },
}));
