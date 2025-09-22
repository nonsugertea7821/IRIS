import { Box, Button, TextField, Typography } from '@mui/material';
import { ChangeEvent, JSX, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authSelector } from '../../store/recoil/common/auth/authRecoil';
import { IrisRoutes } from '../../store/route/routes';
import AppContainer from '../layout/AppContainer';

/**
 * ログインフォームコンポーネント
 * @author nonsugertea7821
 * @returns JSX.Element
 */
export default function LoginForm(): JSX.Element {
    const [loading, setLoading] = useState(false);
    const [host, setHost] = useState('http://localhost');
    const [port, setPort] = useState('8080');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, _setError] = useState<string>('');
    const { login } = useRecoilValue(authSelector);
    const navigate = useNavigate();

    const handleHostChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setHost(e.target.value);
    }, []);

    const handlePortChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPort(e.target.value);
    }, [])

    const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    const handleUserNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    }, []);

    const handleLoginSubmit = useCallback(async () => {
        setLoading(true);
        try {
            let url = host;
            if (port && port.length !== 0) {
                url = host + ':' + port;
            }
            await login(url, userName, password);
        } finally {
            setLoading(false);
            navigate(IrisRoutes.AP_IRIS_HOME.path);
        }
    }, [host, port, login, userName, password, navigate]);


    return (
        <AppContainer>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: 10 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }} >
                    <TextField
                        type="text"
                        label="Host"
                        value={host}
                        onChange={handleHostChange}
                        disabled={loading}
                        sx={{ width: '70%' }}
                    />
                    <TextField
                        type="text"
                        label='port'
                        value={port}
                        onChange={handlePortChange}
                        disabled={loading}
                        sx={{ width: '30%' }}
                    />
                </Box>
                <TextField
                    type="text"
                    label="username"
                    value={userName}
                    onChange={handleUserNameChange}
                    disabled={loading}
                />
                <TextField
                    type="password"
                    label="password"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={loading}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button variant="contained" disabled={loading} onClick={handleLoginSubmit}>
                    {useMemo(() => loading ? 'progress...' : 'Login', [loading])}
                </Button>
            </Box >
        </AppContainer>
    );
}