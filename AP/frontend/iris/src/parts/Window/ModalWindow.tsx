import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, styled, SxProps, Typography } from '@mui/material';
import React, { JSX, useCallback, useMemo } from 'react';

interface ModalWindowProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  closable?: boolean;
  backdropClosable?: boolean;
  sx?: SxProps;
  id?: string;
}

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
    backdropClosable,
    closable,
    sx,
    id,
  } = props;

  /**
   * 画面クローズ処理
   */
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <Modal
      {...props}
      open={isOpen}
      onClose={backdropClosable ? handleClose : undefined}
      aria-labelledby={id ? `${id}-title` : undefined}
      aria-describedby={id ? `${id}-description` : undefined}
    >
      <Frame
        sx={useMemo(
          () => ({
            width,
            height,
            maxWidth,
            maxHeight,
            ...sx,
          }),
          [height, maxHeight, maxWidth, sx, width]
        )}
      >
        {(closable ?? true) && (
          <Header>
            {(title ?? true) && (
              <HeaderTypography id={id ? `${id}-title` : undefined}>{title ?? 'Modal'}</HeaderTypography>
            )}
            {(closable ?? true) && (
              <IconButton onClick={handleClose}>
                <HeaderCloseIcon />
              </IconButton>
            )}
          </Header>
        )}
        <Content id={id ? `${id}-description` : undefined}>{children}</Content>
      </Frame>
    </Modal>
  );
};

const Frame = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: theme.palette.background.paper,
  borderRadius: 2,
  boxShadow: theme.shadows[5],
  width: '75%',
  maxWidth: '90vw',
  maxHeight: '90vh',
  p: 4,
  overflow: 'hidden',
}));

const Header = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.primary.main,
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}));

const HeaderCloseIcon = styled(CloseIcon)(({ theme }) => ({
  position: 'absolute',
  color: theme.palette.primary.contrastText,
}));

const Content = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));
