package com.github.nonsugertea7821.iris.src.common.auth.model;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.github.nonsugertea7821.iris.src.common.auth.dto.User;
import com.github.nonsugertea7821.iris.src.common.auth.repository.AuthRepository;
import com.github.nonsugertea7821.iris.src.common.properties.AuthProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

/**
 * 認証/Jwtトークン発行機能
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025/08/16
 */
@Component
@RequiredArgsConstructor
public class JwtProcessor {

    private final AuthRepository authRepository;
    private final AuthProperties authProperties;
    private Key key;
    private long accessTokenExpireMillis;
    private long refreshTokenExpireMillis;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(authProperties.getJwtSecret().getBytes());
        this.accessTokenExpireMillis = authProperties.getAccessTokenExpireSeconds() * 1000;
        this.refreshTokenExpireMillis = authProperties.getRefreshTokenExpireSeconds() * 1000;
    }

    /**
     * ユーザー識別子に対応するアクセストークンを発行する。
     *
     * @param userId ユーザー識別子
     * @return JWTトークン
     */
    public String generateAccessToken(UUID userId) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + accessTokenExpireMillis))
                .signWith(key)
                .compact();
    }

    /**
     * ユーザー識別子に対応するリフレッシュトークンを発行する。
     *
     * @param userId ユーザー識別子
     * @return JWTトークン
     */
    public String generateRefreshToken(UUID userId) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(now + refreshTokenExpireMillis))
                .signWith(key)
                .compact();
    }

    /**
     * リフレッシュトークンを無効化する。
     *
     * @param userId ユーザー識別子
     * @return JWTトークン
     */
    public void revokeRefreshToken(String refreshToken) {
        // TODO: DB or Redis でブラックリスト化
    }

    /**
     * アクセストークンの有効性を検証する。
     *
     * @param userId ユーザー識別子
     * @return 検証結果
     */
    public boolean validateAccessToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    /**
     * リフレッシュトークンの有効性を検証する。
     *
     * @param userId ユーザー識別子
     * @return 検証結果
     */
    public boolean validateRefreshToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    /**
     * アクセストークンからユーザー情報を取得
     */
    public User getUserFromAccessToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        UUID userId = UUID.fromString(claims.getSubject());
        return authRepository.getUserById(userId);
    }

    /**
     * リフレッシュトークンからユーザーを取得する。
     *
     * @param userId ユーザー識別子
     * @return JWTトークン
     */
    public User getUserFromRefreshToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        UUID userId = UUID.fromString(claims.getSubject());
        User user = authRepository.getUserById(userId);
        return user;
    }

}
