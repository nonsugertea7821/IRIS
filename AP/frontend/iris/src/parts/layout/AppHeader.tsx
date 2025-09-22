import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, styled, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { authSelector } from '../../store/recoil/common/auth/authRecoil';
import AppRouteDrawer from './AppRouteDrawer';

export const HEADER_HEIGHT = 64;

/**
 * スタイリングされたAppBarコンポーネント
 */
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  height: HEADER_HEIGHT,
  zIndex: theme.zIndex.drawer + 1,
}));

/**
 * スタイリングされたタイトルToolBarコンポーネント
 */
const StyledToolBar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_HEIGHT,
  height: HEADER_HEIGHT,
  px: theme.spacing(2),
}));

/**
 * スタイリングされたタイトルTypographyコンポーネント
 */
const TitleTypography = styled(Typography)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  m: 0,
  p: 0,
});

/**
 * アプリケーションヘッダーコンポーネント
 * @author nonsugertea7821
 * @param param0 - ヘッダーコンポーネント引数
 * @returns JSX.Element
 */
export default function AppHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { isAuthenticated } = useRecoilValue(authSelector);

  const handleMenuToggle = React.useCallback(() => {
    if (isAuthenticated) {
      setMenuOpen(!menuOpen);
    }
  }, [isAuthenticated, menuOpen]);

  return (
    <>
      <StyledAppBar>
        <StyledToolBar disableGutters>
          {isAuthenticated && (
            <IconButton edge='start' color='inherit' onClick={handleMenuToggle}>
              <MenuIcon />
            </IconButton>
          )}
          <TitleTypography variant='h6'>IRIS Ver.0.1.0</TitleTypography>
        </StyledToolBar>
      </StyledAppBar>
      <AppRouteDrawer open={menuOpen} />
    </>
  );
}
