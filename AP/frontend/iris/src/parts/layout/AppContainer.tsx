import { Box, Paper } from '@mui/material';
import React, { JSX } from 'react';
import AppHeader, { HEADER_HEIGHT } from './AppHeader';

/**
 * アプリケーションのコンテナコンポーネント引数
 * @author nonsugertea7821
 * @param children - 子コンポーネント
 */
interface AppContainerProps {
    /** 子コンポーネント */
    children?: React.ReactNode;
}

/**
 * アプリケーションのコンテナコンポーネント
 * @author nonsugertea7821
 * @param children - 子コンポーネント
 * @returns JSX.Element
 */
export default function AppContainer({ children }: AppContainerProps): JSX.Element {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '95vh' }}>
            <AppHeader />
            <Box component="main" sx={{ paddingTop: `${HEADER_HEIGHT}px`, flex: 'auto' }}>
                <Paper sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}>
                    {children}
                </Paper>
            </Box>
        </Box>
    );
}