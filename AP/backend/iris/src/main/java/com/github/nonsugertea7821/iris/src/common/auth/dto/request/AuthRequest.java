package com.github.nonsugertea7821.iris.src.common.auth.dto.request;

import java.util.UUID;

import lombok.Data;

/**
 * 認証/リクエスト
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025/08/16
 */
@Data
public class AuthRequest {

    /**
     * ユーザー識別子
     */
    private final UUID userId;
    /**
     * 非平文パスワード
     */
    private final String passwordHash;
}
