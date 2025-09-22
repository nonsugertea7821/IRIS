package com.github.nonsugertea7821.iris.src.common.auth.dto.response;

import lombok.Data;

/**
 * 認証/ログインレスポンス
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025/09/15
 */
@Data
public class LoginResponse {

    /**
     * アクセスJWTトークン
     */
    private final String accessToken;

    /**
     * リフレッシュJWTトークン
     */
    private final String refreshToken;
}
