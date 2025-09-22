package com.github.nonsugertea7821.iris.src.common.auth.dto;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.RequiredArgsConstructor;

/**
 * 認証/ユーザ情報
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025-09-14
 */
@Data
@RequiredArgsConstructor
public class User {

    /**
     * ユーザー識別子
     */
    private final UUID id;

    /**
     * ユーザー名
     */
    private final String name;

    /**
     * 権限
     */
    @JsonIgnore
    private final Role Role;

    /**
     * パスワードハッシュ
     */
    @JsonIgnore
    private final String passwordHash;

    /**
     * ソルト
     */
    @JsonIgnore
    private String salt;

}
