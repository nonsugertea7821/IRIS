import styled from '@emotion/styled';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { authSelector } from '../../store/recoil/common/auth/authRecoil';
import AppRouteDrawer from './AppRouteDrawer';

export const HEADER_HEIGHT = 64;

/**
 * スタイリングされたAppBarコンポーネント
 */
const StyledAppBar = styled(AppBar)({
    position: 'fixed',
    height: HEADER_HEIGHT,
});

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
            <StyledAppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar disableGutters sx={{ minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT, px: 2 }}>
                    {isAuthenticated &&
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleMenuToggle}
                            sx={{ mr: 2, flexShrink: 0 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    }
                    <TitleTypography variant="h6" >
                        IRIS Ver.0.1.0
                    </TitleTypography>
                </Toolbar>
            </StyledAppBar>
            <AppRouteDrawer open={menuOpen} />
        </>
    );
}