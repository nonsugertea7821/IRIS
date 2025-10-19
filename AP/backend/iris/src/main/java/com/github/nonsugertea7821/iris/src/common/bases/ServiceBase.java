package com.github.nonsugertea7821.iris.src.common.bases;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.github.nonsugertea7821.iris.src.common.auth.dto.User;

/**
 * 共通/サービス基底処理群
 */
public abstract class ServiceBase {

    /**
     * 現在の認証済みユーザーを取得
     * @return User オブジェクト、未認証なら null
     */
    protected User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            return null;
        }
        return (User) auth.getPrincipal();
    }

    /**
     * 現在のユーザーIDを取得
     * @return ユーザーID、未認証なら null
     */
    protected UUID getCurrentUserId() {
        User user = getCurrentUser();
        return user != null ? user.getId() : null;
    }

    /**
     * 現在のユーザー名を取得
     * @return ユーザー名、未認証なら null
     */
    protected String getCurrentUserName() {
        User user = getCurrentUser();
        return user != null ? user.getName() : null;
    }
}
