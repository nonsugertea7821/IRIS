import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Typography, styled, useTheme } from '@mui/material';
import React, { JSX, useCallback, useMemo } from 'react';

/**
 * ModalWindowコンポーネントのプロパティ定義
 */
interface ModalWindowProps {
  /** モーダルの開閉状態 */
  isOpen: boolean;
  /** 閉じるイベントハンドラ */
  onClose?: () => void;
  /** モーダルヘッダーのタイトル */
  title?: string;
  /** モーダル内部に表示する子要素 */
  children: React.ReactNode;
  /** 幅（デフォルト: 75%） */
  width?: number | string;
  /** 高さ（デフォルト: auto） */
  height?: number | string;
  /** 最大幅（デフォルト: 90vw） */
  maxWidth?: number | string;
  /** 最大高さ（デフォルト: 90vh） */
  maxHeight?: number | string;
  /** ヘッダー右上に閉じるボタンを表示するか */
  closable?: boolean;
  /** 背景クリックで閉じるか */
  backdropClosable?: boolean;
  /** コンポーネント識別用ID */
  id?: string;
  /** ヘッダー背景色（指定時はテーマを上書き） */
  headerColor?: string;
  /** ヘッダーテキスト色（指定時はテーマを上書き） */
  headerTextColor?: string;
}

/**
 * 汎用モーダルウィンドウコンポーネント
 */
export const ModalWindow = (props: ModalWindowProps): JSX.Element => {
  const {
    isOpen,
    onClose,
    title,
    children,
    width = '75%',
    height = 'auto',
    maxWidth = '90vw',
    maxHeight = '90vh',
    backdropClosable = false,
    closable = true,
    id,
    headerColor,
    headerTextColor,
  } = props;

  const theme = useTheme();

  /**
   * モーダルを閉じる処理。
   * onCloseが未定義の場合は何もしない。
   */
  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  /**
   * フレームサイズのスタイルをメモ化。
   * width, height, maxWidth, maxHeightが変更された場合のみ再計算される。
   */
  const frameStyle = useMemo(
    () => ({
      width,
      height,
      maxWidth,
      maxHeight,
    }),
    [width, height, maxWidth, maxHeight]
  );

  /**
   * ヘッダー背景色とテキスト色をメモ化。
   * headerColor/headerTextColor が指定されない場合はテーマの色を使用。
   */
  const headerStyle = useMemo(
    () => ({
      backgroundColor: headerColor ?? theme.palette.primary.main,
      color: headerTextColor ?? theme.palette.primary.contrastText,
    }),
    [headerColor, headerTextColor, theme.palette.primary.main, theme.palette.primary.contrastText]
  );

  return (
    <Modal
      open={isOpen}
      onClose={backdropClosable ? handleClose : undefined}
      aria-labelledby={id ? `${id}-title` : undefined}
      aria-describedby={id ? `${id}-description` : undefined}
    >
      <Frame style={frameStyle}>
        {closable && (
          <Header style={headerStyle}>
            {title && (
              <HeaderTypography id={id ? `${id}-title` : undefined} style={headerStyle}>
                {title}
              </HeaderTypography>
            )}
            <IconButton onClick={handleClose}>
              <HeaderCloseIcon style={headerStyle} aria-label='close' />
            </IconButton>
          </Header>
        )}
        <Content id={id ? `${id}-description` : undefined}>{children}</Content>
      </Frame>
    </Modal>
  );
};

// ==========================
// styled components
// ==========================

/**
 * モーダル全体のフレーム
 * 中央配置・角丸・影付きで内容を囲む
 */
const Frame = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  overflow: 'hidden',
}));

/**
 * モーダルヘッダー
 * 左にタイトル、右に閉じるボタンを配置
 */
const Header = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '2rem',
  padding: '8px 16px',
  borderBottom: '1px solid rgba(0,0,0,0.12)',
});

/**
 * ヘッダー内タイトルテキスト
 */
const HeaderTypography = styled(Typography)({
  fontWeight: 600,
  fontSize: '1rem',
});

/**
 * ヘッダー右上の閉じるアイコン
 */
const HeaderCloseIcon = styled(CloseIcon)({
  position: 'relative',
});

/**
 * モーダルコンテンツ領域
 * 高さに応じてスクロール可能
 */
const Content = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2.5),
  backgroundColor: theme.palette.background.paper,
}));
