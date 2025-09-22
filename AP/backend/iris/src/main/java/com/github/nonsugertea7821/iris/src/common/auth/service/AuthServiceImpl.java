package com.github.nonsugertea7821.iris.src.common.auth.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.github.nonsugertea7821.iris.src.common.auth.dto.User;
import com.github.nonsugertea7821.iris.src.common.auth.dto.response.ChallengeResponse;
import com.github.nonsugertea7821.iris.src.common.auth.dto.response.LoginResponse;
import com.github.nonsugertea7821.iris.src.common.auth.model.JwtProcessor;
import com.github.nonsugertea7821.iris.src.common.auth.model.NonceStore;
import com.github.nonsugertea7821.iris.src.common.auth.repository.AuthRepository;
import com.github.nonsugertea7821.iris.src.common.utils.CipherUtil;

import jakarta.security.auth.message.AuthException;
import lombok.RequiredArgsConstructor;

/**
 * 認証/サービス機能
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025/08/16
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final NonceStore nonceStore;
    private final JwtProcessor jwtProcessor;

    /**
     * 認証/ユーザー識別子取得処理
     *
     * @return ユーザー識別子
     */
    @Override
    public UUID getUserId(String userName) {
        User user = authRepository.getUserByName(userName);
        return user.getId();
    }

    /**
     * 認証/チャレンジ取得処理
     *
     * @param userId ユーザー識別子
     * @return 一時salt
     */
    @Override
    public ChallengeResponse getChallenge(UUID userId) throws AuthException {
        var user = authRepository.getUserById(userId);
        if (user == null) {
            throw new AuthException("不正なユーザーです");
        }
        var salt = user.getSalt();
        var nonce = nonceStore.createNonce(user.getId());
        return new ChallengeResponse(salt, nonce);
    }

    @Override
    public LoginResponse authenticate(UUID userId, String passwordHash) throws AuthException {
        // userを取得
        User user = authRepository.getUserById(userId);
        if (user == null) {
            throw new AuthException("不正なユーザーです");
        }
        // nonceを取得
        String nonce = nonceStore.getNonce(user.getId());
        // DBに保存されているパスワードハッシュを取得
        String passwordHashBySalt = user.getPasswordHash();
        // nonceを使用して二次検証
        String expectedHash = CipherUtil.hmacSha256(nonce, passwordHashBySalt);
        // パスワードハッシュの有効性を検証
        if (!expectedHash.equals(passwordHash)) {
            throw new AuthException("不正なパスワードです");
        }
        // jwtトークンを返却
        var accessToken = jwtProcessor.generateAccessToken(userId);
        String refreshToken = jwtProcessor.generateRefreshToken(userId);
        return new LoginResponse(accessToken, refreshToken);
    }

    @Override
    public LoginResponse refresh(String refreshToken) throws AuthException {
        if (!jwtProcessor.validateRefreshToken(refreshToken)) {
            throw new AuthException("リフレッシュトークン無効");
        }
        UUID userId = jwtProcessor.getUserFromRefreshToken(refreshToken).getId();
        String accessToken = jwtProcessor.generateAccessToken(userId);
        String newRefreshToken = jwtProcessor.generateRefreshToken(userId);
        return new LoginResponse(accessToken, newRefreshToken);
    }

    @Override
    public void logout(String refreshToken) {
        jwtProcessor.revokeRefreshToken(refreshToken);
    }

}
