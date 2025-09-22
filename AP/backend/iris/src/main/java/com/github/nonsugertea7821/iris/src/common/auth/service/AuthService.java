package com.github.nonsugertea7821.iris.src.common.auth.service;

import java.util.UUID;

import com.github.nonsugertea7821.iris.src.common.auth.dto.response.ChallengeResponse;
import com.github.nonsugertea7821.iris.src.common.auth.dto.response.LoginResponse;

import jakarta.security.auth.message.AuthException;

/**
 * 認証/サービス機能
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025/08/16
 */
public interface AuthService {

    /**
     * 認証/ユーザー識別子取得処理
     *
     * @param userName ユーザー名
     * @return ユーザー識別子
     * @throws AuthException 認証時例外
     */
    UUID getUserId(String userName) throws AuthException;

    /**
     * 認証/challenge取得処理
     *
     * @param userId ユーザー識別子
     * @return challenge
     * @throws AuthException 認証時例外
     */
    ChallengeResponse getChallenge(UUID userId) throws AuthException;

    /**
     * 認証/アクセストークン取得処理
     *
     * @param userId ユーザー識別子
     * @param passwordHash 非平文パスワード
     * @return アクセストークン,リフレッシュトークン
     * @throws AuthException 認証時例外
     */
    LoginResponse authenticate(UUID userId, String passwordHash) throws AuthException;

    /**
     * 認証/リフレッシュ処理
     *
     * @param refreshToken リフレッシュトークン
     * @return アクセストークン,リフレッシュトークン
     * @throws AuthException 認証時例外
     */
    LoginResponse refresh(String refreshToken) throws AuthException;

    /**
     * 認証/ログアウト処理
     *
     * @param refreshToken リフレッシュトークン
     */
    void logout(String refreshToken);
}
