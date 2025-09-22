import { atom, selector } from 'recoil';
import { challenge, getUserId, loginRequest, logoutRequest } from '../../../api/common/auth/authApi';
import { axiosHelper } from '../../../axios/axiosHelper';
import { AtomKeys } from '../../keys/AtomKeys';
import { SelectorKeys } from '../../keys/SelectorKeys';
import { hmacSha256 } from './utils/HashUtil';

/** ログイン状態インターフェース */
interface LoginState {
    /** ユーザー名 */
    userName?: string;
    /** クライアント識別子 */
    userId?: string;
    /** 認証状態 */
    isAuthenticated: boolean;
}

/** 認証機能インターフェース */
interface Auth {
    /** クライアント識別子 */
    userId?: string,
    /** 認証状態 */
    isAuthenticated: boolean,
    /**
     * ログイン処理
     * @param url 接続先
     * @param userName ユーザー名
     * @param password 平文パスワード
     * @returns Promise<void>
     */
    login: (url: string, userName: string, password: string) => Promise<void>;
    /**
     * ログアウト処理
     * @returns Promise<void>
     */
    logout: () => Promise<void>;
}

/** ログイン状態 */
const loginState = atom<LoginState>({
    key: AtomKeys.IRIS_AUTH_LOGIN_STATE,
    default: {
        userName: undefined,
        userId: undefined,
        isAuthenticated: false
    }
});

/** 認証機能セレクター */
export const authSelector = selector<Auth>({
    key: SelectorKeys.IRIS_AUTH_INTERFACE_SELECTOR,
    get: ({ get, getCallback }) => {
        const userId = get(loginState).userId;
        const isAuthenticated = get(loginState).isAuthenticated;

        /** ログイン処理 */
        const login = getCallback(({ set }) => async (url: string, userName: string, password: string) => {
            // API ベースURL設定
            axiosHelper.setBaseURL(url);
            // ユーザーID解決
            const userId = await getUserId(userName);
        
            // 認証フロー: challenge -> HMAC -> loginRequest
            const { salt, nonce } = await challenge(userId);
            const passwordBySalt = await hmacSha256(salt, password);
            const passwordHash = await hmacSha256(nonce, passwordBySalt);

            // LoginResponse { accessToken, refreshToken } を受け取る
            const { accessToken, refreshToken } = await loginRequest(userId, passwordHash);

            // AxiosHelper に保存
            axiosHelper.setAccessToken(accessToken);
            axiosHelper.setRefreshToken(refreshToken);

            // Recoil state 更新（UI表示用のみ）
            set(loginState, {
                userName,
                userId,
                isAuthenticated: true,
            } as LoginState);
        });

        /** ログアウト処理 */
        const logout = getCallback(({ reset }) => async () => {
            const logoutResponse = await logoutRequest();
            if (logoutResponse.resultCode === 0) {
                // AxiosHelper の内部状態をクリア
                axiosHelper.setBaseURL();
                axiosHelper.clearTokensAndPending();

                // Recoil state 初期化
                reset(loginState);
            }
        });

        return { userId, isAuthenticated, login, logout };
    },
});