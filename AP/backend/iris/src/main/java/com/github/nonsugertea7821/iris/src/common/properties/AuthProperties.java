package com.github.nonsugertea7821.iris.src.common.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

/**
 * 共通/認証プロパティ
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025/08/16
 */
@Data
@Component
@ConfigurationProperties(prefix = "security.auth")
public class AuthProperties {

    /**
     * nonce(一時salt)の有効時間
     */
    private long nonceExpireSeconds;
    /**
     * Jwtトークンのシークレットキー
     */
    private String jwtSecret;
    /**
     * アクセストークンの有効時間
     */
    private long accessTokenExpireSeconds;
    /**
     * リフレッシュトークンの有効時間
     */
    private long refreshTokenExpireSeconds;
}
