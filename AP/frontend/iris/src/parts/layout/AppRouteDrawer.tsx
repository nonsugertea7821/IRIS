import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';
import { IrisRoutes } from '../../store/route/routes';
import { HEADER_HEIGHT } from './AppHeader';

/**
 * アプリケーションのルートドロワーコンポーネント引数
 * @author nonsugertea7821
 * @param open - ドロワーの開閉状態
 * @param onClose - ドロワー閉じる関数
 * @param onSelect - メニュー選択関数
 */
interface AppRouteDrawerProps {
    /** ドロワーの開閉状態 */
    open: boolean;
    /** ドロワー閉じる関数 */
    onClose?: () => void;
    /** メニュー選択関数 */
    onSelect?: (apKey: string) => void;
}

/**
 * ドロワーに表示するルートリスト
 */
const AP_ROUTES_DRAWER_LIST = [
    IrisRoutes.AP_SERVER_MANAGEMENT,
];

/**
 * アプリケーションのルートドロワーコンポーネント
 * @author nonsugertea7821
 * @param param0 - アプリケーションのルートドロワーコンポーネント引数
 * @returns JSX.Element
 */
export default function AppRouteDrawer({ open, onClose, onSelect }: AppRouteDrawerProps) {

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            ModalProps={{
                keepMounted: true, // モバイルでのパフォーマンス向上
            }}
            variant="temporary"
            sx={{
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: 240,
                    top: HEADER_HEIGHT,
                    height: `calc(100 - ${HEADER_HEIGHT})`,  // ヘッダーの高さ分だけ高さを縮める
                },
            }}
        >
            <List sx={{ width: 240 }}>
                {React.useMemo(() => {
                    return AP_ROUTES_DRAWER_LIST.map((menu) => (
                        <ListItemButton key={menu.path} onClick={() => { onSelect?.(menu.path); }}>
                            <ListItemText primary={menu.label} />
                        </ListItemButton>
                    ));
                }, [onSelect])}
            </List>
        </Drawer>
    );
}