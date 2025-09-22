// #region response

/** チャレンジレスポンス */
export interface ChallengeResponse {
  /** ソルト */
  salt: string;
  /** 一時ソルト */
  nonce: string;
}

/** ログインレスポンス */
export interface LoginResponse {
  /** アクセスjwtトークン */
  accessToken: string;
  /** リフレッシュトークン */
  refreshToken: string;
}

/** ログアウトレスポンス */
export interface LogoutResponse {
  /** ログアクト結果 */
  resultCode: number;
  /** メッセージ */
  message: string;
}

// #endregion
